import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import PaymentForm from "../components/PaymentForm";

export default function SubscriptionForm({ onAdd, onUpdate, initialData, clearEdit }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    due_date: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentDescription, setPaymentDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        category: initialData.category || "",
        due_date: initialData.due_date ? initialData.due_date.slice(0, 10) : "",
      });
    } else {
      setForm({ name: "", price: "", category: "", due_date: "" });
    }
  }, [initialData]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(form.price);

    if (!form.name || isNaN(price)) {
      alert("Lütfen geçerli bir ad ve fiyat girin.");
      return;
    }
    
    // Ödeme formunu göster
    if (!initialData) {
      setPaymentAmount(price);
      setPaymentDescription(`${form.name} aboneliği için ödeme`);
      setShowPayment(true);
      return;
    }

    // Güncelleme işlemi için ödeme gerekmez
    if (initialData) {
      // Güncelleme işlemi
      const { error } = await supabase
        .from("subscriptions")
        .update({ ...form, price })
        .eq("id", initialData.id);

      if (error) {
        alert("Güncelleme hatası: " + error.message);
      } else {
        onUpdate?.();
        clearEdit?.();
      }
    }
  };
  
  // Ödeme başarılı olduğunda çağrılacak fonksiyon
  const handlePaymentSuccess = async () => {
    const price = parseFloat(form.price);
    
    // Yeni kayıt
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      alert("Kullanıcı bilgisi alınamadı");
      return;
    }

    const { error } = await supabase.from("subscriptions").insert([
      {
        ...form,
        price,
        user_id: user.id,
        payment_status: "paid",
      },
    ]);

    if (error) {
      alert("Kayıt hatası: " + error.message);
    } else {
      alert("Ödeme başarılı! Aboneliğiniz eklendi.");
      onAdd?.();
      setForm({ name: "", price: "", category: "", due_date: "" });
      setShowPayment(false);
    }
  };
  
  // Ödeme hatası olduğunda çağrılacak fonksiyon
  const handlePaymentError = (error) => {
    alert(`Ödeme işlemi sırasında bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-200 dark:to-dark-300 rounded-xl p-8 border border-blue-100 dark:border-dark-200 shadow-md hover:shadow-lg transition-all duration-300">
      {showPayment ? (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="flex text-center items-center justify-center gap-3 mb-8">
            <h3 className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Abonelik Ödemesi
            </h3>
          </div>
          
          <PaymentForm 
            amount={paymentAmount} 
            description={paymentDescription}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
          
          <button
            type="button"
            onClick={() => setShowPayment(false)}
            className="w-full mt-4 px-6 py-3 bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-dark-300 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Forma Geri Dön
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="flex text-center items-center justify-center gap-3 mb-8">
            <h3 className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {initialData ? "Aboneliği Düzenle" : "Yeni Abonelik Ekle"}
            </h3>
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="block text-black dark:text-gray-200 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
              Abonelik Adı
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-dark-200 shadow-sm text-gray-900 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500"
              placeholder="Örn: Netflix, Spotify, Adobe Creative Cloud"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Aylık Ücret
            </label>
            <div className="relative">
              <input
                id="price"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 pl-8 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-dark-200 shadow-sm text-gray-900 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500"
                placeholder="0.00"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₺</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-dark-200 shadow-sm text-gray-900 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500"
            >
              <option value="">Kategori seçin</option>
              <option value="Eğlence">🎬 Eğlence</option>
              <option value="Yazılım">💻 Yazılım</option>
              <option value="Müzik">🎵 Müzik</option>
              <option value="Bulut Depolama">☁️ Bulut Depolama</option>
              <option value="Fitness">💪 Fitness</option>
              <option value="Eğitim">📚 Eğitim</option>
              <option value="Haberler">📰 Haberler</option>
              <option value="Oyun">🎮 Oyun</option>
              <option value="Diğer">📦 Diğer</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Sonraki Ödeme Tarihi
            </label>
            <div className="relative">
              <input
                id="due_date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 
                transition-all duration-200 bg-white dark:bg-dark-200 shadow-sm text-gray-900 dark:text-gray-100 hover:border-blue-300 dark:hover:border-blue-500
                cursor-pointer appearance-none placeholder-gray-400 dark:placeholder-gray-500"
                style={{
                  colorScheme: "light",
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tarih seçmek için alana tıklayın
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-dark-300 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={initialData ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
                />
              </svg>
              {initialData ? "Güncelle" : "Abonelik Ekle"}
            </button>

            {initialData && (
              <button
                type="button"
                onClick={clearEdit}
                className="px-6 py-3 bg-gray-100 dark:bg-dark-400 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-dark-300 transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Vazgeç
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
