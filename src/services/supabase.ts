/**
 * Supabase Client Configuration
 * Database, Auth, Storage, and Realtime
 */

import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types (will be auto-generated from Supabase later)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'fan' | 'artist' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      artists: {
        Row: {
          id: string;
          user_id: string;
          artist_name: string;
          bio: string | null;
          genre: string | null;
          avatar_url: string | null;
          banner_url: string | null;
          followers_count: number;
          is_verified: boolean;
          is_founder: boolean;
          stripe_account_id: string | null;
          revenue_split: number; // 70 for artists
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artists']['Row'], 'id' | 'created_at' | 'updated_at' | 'followers_count'>;
        Update: Partial<Database['public']['Tables']['artists']['Insert']>;
      };
      concerts: {
        Row: {
          id: string;
          artist_id: string;
          title: string;
          description: string | null;
          genre: string;
          scheduled_at: string;
          duration_minutes: number | null;
          price: number;
          currency: string;
          is_live: boolean;
          status: 'scheduled' | 'live' | 'ended' | 'cancelled';
          mux_playback_id: string | null;
          mux_stream_key: string | null;
          thumbnail_url: string | null;
          viewers_count: number;
          total_revenue: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['concerts']['Row'], 'id' | 'created_at' | 'updated_at' | 'viewers_count' | 'total_revenue'>;
        Update: Partial<Database['public']['Tables']['concerts']['Insert']>;
      };
      tickets: {
        Row: {
          id: string;
          concert_id: string;
          user_id: string;
          stripe_payment_intent_id: string;
          price_paid: number;
          currency: string;
          status: 'pending' | 'paid' | 'refunded';
          qr_code: string | null;
          purchased_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at' | 'qr_code'>;
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>;
      };
      artist_payouts: {
        Row: {
          id: string;
          artist_id: string;
          concert_id: string | null;
          amount: number;
          currency: string;
          revenue_split_percentage: number;
          stripe_payout_id: string | null;
          status: 'pending' | 'processing' | 'paid' | 'failed';
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artist_payouts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['artist_payouts']['Insert']>;
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Artist = Database['public']['Tables']['artists']['Row'];
export type Concert = Database['public']['Tables']['concerts']['Row'];
export type Ticket = Database['public']['Tables']['tickets']['Row'];
export type ArtistPayout = Database['public']['Tables']['artist_payouts']['Row'];
