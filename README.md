# SaaSDashboard

# SaaS Dashboard Projesi

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-blueviolet)
![Supabase](https://img.shields.io/badge/Supabase-2.53.0-3ECF8E)
![Stripe](https://img.shields.io/badge/Stripe-7.14.0-008CDD)

Modern bir SaaS uygulaması için abonelik yönetim paneli ve kullanıcı dashboard'u.

## Özellikler

- ✅ Kullanıcı kimlik doğrulama (Supabase Auth)
- 💳 Stripe entegrasyonu ile abonelik yönetimi
- 🌙 Açık/Koyu tema desteği
- 📱 Responsive tasarım
- 📊 Kullanıcı dostu dashboard arayüzü

## Kurulum

1. Depoyu klonlayın:
```bash
git clone https://github.com/kullanici_adiniz/saas_dashboard.git
cd saas_dashboard
```

2. Gerekli bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## Kullanım

Geliştirme modunda çalıştırma:
```bash
npm run dev
```

Production build:
```bash
npm run build
```

## Teknoloji Stack'i

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Supabase (Auth, Database)
- **Ödeme Sistemi**: Stripe API
- **State Management**: React Context API

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# SaaS Dashboard

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.3-blueviolet)
![Stripe API](https://img.shields.io/badge/Stripe_API-7.14.0-008CDD)

A modern SaaS dashboard built with React, featuring user authentication, subscription management, and Stripe integration.

## Features
- 🔐 User authentication system
- 💳 Subscription management dashboard
- 💰 Stripe API integration for payments
- 🌓 Theme support (Light/Dark mode)
- 📱 Responsive design for all devices

## Tech Stack
- **Frontend**: React 18.2.0, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Payments**: Stripe API
- **Authentication**: Supabase Auth
- **Development Tools**: ESLint, PostCSS

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/saas_dashboard.git
cd saas_dashboard
```

2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

2. Replace the placeholder values with your actual credentials:
   - **Supabase**: Create a new project and get your URL and anon key
   - **Stripe**: Create an account and get your publishable and secret keys

## Usage

### Development
To run the application in development mode with both frontend and backend:
```bash
npm run dev:all
```

This will start:
- Frontend development server at `http://localhost:5173`
- Backend server at `http://localhost:3001`

### Production
1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm run server
```

## Project Structure
```
saas_dashboard/
├── src/                 # React source code
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   └── utils/          # Utility functions
├── public/             # Static assets
├── supabase/           # Database migrations
├── server.js           # Express server
└── package.json        # Project dependencies
```

## Key Components
- **Authentication**: Login, registration, and password reset
- **Dashboard**: User profile and subscription overview
- **Billing**: Payment methods and subscription management
- **Settings**: Account preferences and theme customization

## Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_KEY` | Your Supabase anon key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
