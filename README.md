# 🎵 Vybzzz - The Future of Live Music Streaming

**Version 1.0 - MVP**

Vybzzz is a revolutionary platform that transforms every concert into a global experience. Buy your ticket, watch the concert live from anywhere in the world.

## 🌟 Key Features

- **Live Concert Streaming**: HD quality streaming with < 10s latency
- **E-Ticketing System**: Secure digital tickets with QR codes
- **70/30 Revenue Split**: Industry's most artist-friendly revenue model
- **Global Reach**: 8 languages supported from day one
- **Dual Theme**: Beautiful light and dark modes

## 🏗️ Tech Stack

### Mobile App (React Native)
- **Framework**: React Native 0.73+ with Expo 50+
- **Language**: TypeScript 5.3+
- **Navigation**: React Navigation 6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Video Player**: React Native Video + Expo AV
- **Styling**: StyleSheet with custom design system

### Backend (Coming Soon)
- **BaaS**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Streaming**: Mux Live (HLS adaptive bitrate)
- **Payments**: Stripe (70/30 split automation)
- **Notifications**: Expo Push Notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for testing on physical devices)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd vyb
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm start
```

5. **Run on your preferred platform**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## 📁 Project Structure

```
vyb/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common components (buttons, cards, etc.)
│   │   └── navigation/      # CapsuleNavBar and navigation components
│   ├── screens/             # App screens
│   │   ├── home/           # Home feed screen
│   │   ├── search/         # Search screen
│   │   ├── live/           # Live concerts screen
│   │   ├── tickets/        # User tickets screen
│   │   └── profile/        # Profile & settings screen
│   ├── navigation/          # Navigation configuration
│   ├── hooks/              # Custom React hooks (useTheme, etc.)
│   ├── services/           # API and external service integrations
│   ├── utils/              # Utility functions
│   ├── constants/          # Design system (colors, typography, layout)
│   ├── types/              # TypeScript type definitions
│   ├── store/              # Zustand stores
│   └── locales/            # i18n translations
├── assets/                  # Images, fonts, icons
├── App.tsx                 # App entry point
└── app.json                # Expo configuration
```

## 🎨 Design System

### Colors
- **Light Mode**: White background, black text, gold accents
- **Dark Mode**: Black background, white text, Netflix red accents
- **Shared**: Gold (#D4AF37), Red (#E50914)

### Typography
- **Font**: System default (Inter-like)
- **Weights**: Light (300) to Black (900)
- **Sizes**: 12px to 80px scale

### Components
- **Capsule Navigation Bar**: Unique glossy navigation with elevated LIVE button
- **Cards**: Rounded corners, subtle borders, hover effects
- **Buttons**: Bold, gradient, high contrast

## 🌍 Internationalization

Supported languages:
- 🇫🇷 Français (default)
- 🇬🇧 English
- 🇪🇸 Español
- 🇵🇹 Português
- 🇰🇷 한국어
- 🇨🇳 中文
- 🇩🇪 Deutsch
- 🇯🇵 日本語

## 📱 Screens Overview

1. **Home**: Concert feed, featured artists, recommendations
2. **Search**: Find concerts, artists, genres
3. **Live**: Currently streaming concerts
4. **Tickets**: Purchased e-tickets with QR codes
5. **Profile**: User settings, preferences, account

## 🔧 Development

### Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS (Mac only)
npm run web        # Run on web browser
```

### Code Style

- **TypeScript strict mode** enabled
- **Path aliases** configured for clean imports (@/)
- **ESLint** for code quality (coming soon)
- **Prettier** for formatting (coming soon)

## 🗺️ Roadmap

### Phase 1 (J1-J30) - ✅ COMPLETED
- [x] Project setup & configuration
- [x] Design system implementation
- [x] Navigation structure
- [x] Core screens (UI)
- [x] Theme system (Light/Dark mode)

### Phase 2 (J31-J60) - 🚧 IN PROGRESS
- [ ] Supabase integration
- [ ] Mux Live streaming
- [ ] Stripe payments
- [ ] E-ticket generation
- [ ] Artist dashboard

### Phase 3 (J61-J90) - 📅 PLANNED
- [ ] Push notifications
- [ ] i18n translations
- [ ] Performance optimization
- [ ] Beta testing
- [ ] App Store submission

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - © 2026 Vybzzz. All rights reserved.

## 🔗 Links

- **Design Specification**: See internal documentation
- **API Documentation**: Coming soon
- **Dashboard**: Coming soon

---

**Built with ❤️ by the Vybzzz team**

*"Achète ton billet, regarde le concert en direct depuis n'importe où dans le monde"*
