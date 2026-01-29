-- ============================================
-- VYBZZZ DATABASE SCHEMA
-- Complete migration for production deployment
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'fan' CHECK (role IN ('fan', 'artist', 'admin')),
  stripe_customer_id TEXT UNIQUE,
  preferred_language TEXT DEFAULT 'fr',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- ============================================
-- ARTISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  bio TEXT,
  genre TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  followers_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_founder BOOLEAN DEFAULT false,
  stripe_account_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  revenue_split INTEGER DEFAULT 70 CHECK (revenue_split >= 0 AND revenue_split <= 100),
  total_earnings INTEGER DEFAULT 0, -- In cents
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_user ON artists(user_id);
CREATE INDEX IF NOT EXISTS idx_artists_verified ON artists(is_verified);

-- ============================================
-- CONCERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS concerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 120,
  price INTEGER NOT NULL, -- In cents
  currency TEXT DEFAULT 'eur',
  is_live BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled')),

  -- Mux Live Stream
  mux_live_stream_id TEXT,
  mux_playback_id TEXT,
  mux_stream_key TEXT, -- SENSITIVE: protected by RLS

  -- Mux VOD (Replay)
  mux_vod_asset_id TEXT,
  mux_vod_playback_id TEXT,
  vod_available BOOLEAN DEFAULT false,
  vod_expires_at TIMESTAMPTZ, -- 7 days after stream ends

  thumbnail_url TEXT,
  viewers_count INTEGER DEFAULT 0,
  peak_viewers INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- In cents

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_concerts_artist ON concerts(artist_id);
CREATE INDEX IF NOT EXISTS idx_concerts_status ON concerts(status);
CREATE INDEX IF NOT EXISTS idx_concerts_scheduled ON concerts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_concerts_live ON concerts(is_live) WHERE is_live = true;

-- ============================================
-- TICKETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  price_paid INTEGER NOT NULL, -- In cents
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded', 'expired')),
  qr_code TEXT,
  scanned_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(concert_id, user_id) -- One ticket per user per concert
);

CREATE INDEX IF NOT EXISTS idx_tickets_concert ON tickets(concert_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);

-- ============================================
-- ARTIST PAYOUTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS artist_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  concert_id UUID REFERENCES concerts(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- In cents
  currency TEXT DEFAULT 'eur',
  revenue_split_percentage INTEGER NOT NULL,
  stripe_payout_id TEXT,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_artist ON artist_payouts(artist_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON artist_payouts(status);

-- ============================================
-- FOLLOWERS TABLE (Artist follows)
-- ============================================
CREATE TABLE IF NOT EXISTS followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_followers_user ON followers(user_id);
CREATE INDEX IF NOT EXISTS idx_followers_artist ON followers(artist_id);

-- ============================================
-- CONCERT CHAT MESSAGES (for live chat)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  concert_id UUID NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  is_pinned BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_concert ON chat_messages(concert_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment concert revenue (called from webhook)
CREATE OR REPLACE FUNCTION increment_concert_revenue(concert_id_param UUID, amount_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE concerts
  SET total_revenue = total_revenue + amount_param
  WHERE id = concert_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update follower count
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE artists SET followers_count = followers_count + 1 WHERE id = NEW.artist_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE artists SET followers_count = followers_count - 1 WHERE id = OLD.artist_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for follower count
DROP TRIGGER IF EXISTS trigger_update_follower_count ON followers;
CREATE TRIGGER trigger_update_follower_count
AFTER INSERT OR DELETE ON followers
FOR EACH ROW EXECUTE FUNCTION update_follower_count();

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables
           WHERE table_schema = 'public'
           AND table_type = 'BASE TABLE'
           AND table_name IN ('profiles', 'artists', 'concerts', 'tickets', 'artist_payouts')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trigger_updated_at ON %I', t);
    EXECUTE format('CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON %I
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t);
  END LOOP;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE artist_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ARTISTS POLICIES
CREATE POLICY "Public can view verified artists"
  ON artists FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Users can view own artist profile"
  ON artists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Artists can update own profile"
  ON artists FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System inserts artists"
  ON artists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- CONCERTS POLICIES
CREATE POLICY "Public can view active concerts"
  ON concerts FOR SELECT
  USING (status != 'cancelled');

-- IMPORTANT: Hide stream_key from everyone except owner
CREATE POLICY "Only artist sees stream key"
  ON concerts FOR SELECT
  USING (
    mux_stream_key IS NULL
    OR artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
  );

CREATE POLICY "Artists can create concerts"
  ON concerts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM artists
      WHERE user_id = auth.uid()
      AND is_verified = true
      AND id = artist_id
    )
  );

CREATE POLICY "Artists can update own concerts"
  ON concerts FOR UPDATE
  USING (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()))
  WITH CHECK (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()));

-- TICKETS POLICIES
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System inserts tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ARTIST PAYOUTS POLICIES
CREATE POLICY "Artists can view own payouts"
  ON artist_payouts FOR SELECT
  USING (artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()));

-- FOLLOWERS POLICIES
CREATE POLICY "Anyone can view followers"
  ON followers FOR SELECT
  USING (true);

CREATE POLICY "Users can follow"
  ON followers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow"
  ON followers FOR DELETE
  USING (auth.uid() = user_id);

-- CHAT MESSAGES POLICIES
CREATE POLICY "Users can view concert chat"
  ON chat_messages FOR SELECT
  USING (
    NOT is_deleted
    AND EXISTS (
      SELECT 1 FROM tickets
      WHERE concert_id = chat_messages.concert_id
      AND user_id = auth.uid()
      AND status = 'paid'
    )
  );

CREATE POLICY "Ticket holders can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM tickets
      WHERE concert_id = chat_messages.concert_id
      AND user_id = auth.uid()
      AND status = 'paid'
    )
  );

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create concert-thumbnails bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'concert-thumbnails',
  'concert-thumbnails',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for concert thumbnails
CREATE POLICY "Concert thumbnails are public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'concert-thumbnails');

CREATE POLICY "Artists can upload thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'concert-thumbnails'
    AND EXISTS (SELECT 1 FROM artists WHERE user_id = auth.uid() AND is_verified = true)
  );

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for concerts (for live status updates)
ALTER PUBLICATION supabase_realtime ADD TABLE concerts;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
