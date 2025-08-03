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
