import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "../contexts/ThemeContext";

// Stripe promise oluştur
let stripePromise;

const getStripePromise = async () => {
  if (!stripePromise) {
    // API'den publishable key'i al
    const response = await fetch("http://localhost:5252/api/config");
    const { publishableKey } = await response.json();
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

//Test Ödeme Bilgileri = Kart numarası: 4242 4242 4242 4242, Tarih: 12/34, CVC: 123

// Ödeme formu bileşeni
const CheckoutForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Ödeme işlemini gerçekleştir
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        onError && onError(error);
      } else {
        // Başarılı ödeme
        onSuccess && onSuccess();
      }
    } catch (error) {
      setErrorMessage("Ödeme işlemi sırasında bir hata oluştu.");
      onError && onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
      <PaymentElement />

      {errorMessage && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errorMessage}</div>}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
          isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
        } 
          transition-colors duration-300 disabled:opacity-50`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            İşleniyor...
          </>
        ) : (
          "Ödemeyi Tamamla"
        )}
      </button>
    </form>
  );
};

// Ana ödeme bileşeni
const PaymentForm = ({ amount, onSuccess, onError, description = "Abonelik ödemesi" }) => {
  const [clientSecret, setClientSecret] = useState("");
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Ödeme niyeti oluştur
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("http://localhost:5252/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency: "try",
            description,
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Ödeme niyeti oluşturulurken hata:", error);
        onError && onError(error);
      }
    };

    if (amount > 0) {
      createPaymentIntent();
    }
  }, [amount, description, onError]);

  return (
    <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Ödeme Bilgileri</h2>

      <div className={`mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        <p>Toplam Tutar: {amount.toLocaleString("tr-TR")} ₺</p>
      </div>

      {clientSecret ? (
        <Elements stripe={getStripePromise()} options={{ clientSecret }}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </Elements>
      ) : (
        <div className="flex justify-center items-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;
