import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// .env dosyasını yükle
dotenv.config();

// ES modules için __dirname oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Stripe API anahtarını al
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY bulunamadı. Lütfen .env dosyasında tanımlayın.");
  process.exit(1);
}

// Stripe istemcisini oluştur
const stripe = new Stripe(stripeSecretKey);

// Express uygulamasını oluştur
const app = express();

// CORS ve JSON middleware'lerini ekle
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "dist")));

// Stripe publishable key'i döndüren endpoint
app.get("/api/config", (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Ödeme niyeti (payment intent) oluşturan endpoint
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "try", paymentMethodType = "card", description } = req.body;

    // Ödeme niyeti oluştur
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe kuruş cinsinden çalışır
      currency,
      payment_method_types: [paymentMethodType],
      description,
    });

    // Client secret'ı döndür
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Ödeme niyeti oluşturulurken hata:", error);
    res.status(500).json({ error: error.message });
  }
});

// Abonelik oluşturan endpoint
app.post("/api/create-subscription", async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    // Müşteri yoksa oluştur
    let customer;
    if (!customerId) {
      customer = await stripe.customers.create();
    } else {
      customer = { id: customerId };
    }

    // Abonelik oluştur
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      customerId: customer.id,
    });
  } catch (error) {
    console.error("Abonelik oluşturulurken hata:", error);
    res.status(500).json({ error: error.message });
  }
});

// Abonelik fiyatlarını getiren endpoint
app.get("/api/subscription-prices", async (req, res) => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      type: "recurring",
      expand: ["data.product"],
    });

    res.json(prices.data);
  } catch (error) {
    console.error("Abonelik fiyatları alınırken hata:", error);
    res.status(500).json({ error: error.message });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5252;
app.listen(PORT, () => {
  console.log(`Stripe ödeme sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});

process.on('uncaughtException', (err) => {
  console.error('Yakalanmayan Hata:', err);
  process.exit(1); // Uygulamayı güvenli bir şekilde kapat
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('İşlenmeyen Promise Reddi:', reason);
});
