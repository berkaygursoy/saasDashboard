import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import SubscriptionForm from "./SubscriptionForm";
import { formatDate } from "../utils/FormDate";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export default function Dashboard() {
  const { isDark: _ } = useTheme();
  const [subscriptions, setSubscriptions] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const fetchData = async () => {
    const { data, error } = await supabase.from("subscriptions").select("*").order("due_date", { ascending: true });

    if (!error) setSubscriptions(data);
  };

  const handleDelete = async (id) => {
    console.log("Attempting to delete subscription with ID:", id);
    const { error } = await supabase.from("subscriptions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting subscription:", error.message);
      alert("Abonelik silinirken bir hata oluştu: " + error.message);
    } else {
      console.log("Subscription deleted successfully.");
      fetchData();
      if (editItem?.id === id) setEditItem(null); // silinen item edit'teyse sıfırla
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-200 dark:to-dark-300 py-10 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="absolute top-0 right-0 mt-2 mr-2 z-50">
          <ThemeToggle />
        </div>
        <div className="bg-white dark:bg-dark-100 rounded-2xl shadow-lg border border-gray-200 dark:border-dark-200 p-8 backdrop-blur-sm bg-white/90 dark:bg-dark-100/90 transition-colors duration-300">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            Abonelik Paneli
          </h1>

          <div className="mb-8">
            <SubscriptionForm
              onAdd={fetchData}
              onUpdate={fetchData}
              initialData={editItem}
              clearEdit={() => setEditItem(null)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-dark-200 pb-3 transition-colors duration-300">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Aboneliklerim
            </h2>
            {subscriptions.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-dark-200 rounded-xl border border-gray-100 dark:border-dark-100 transition-colors duration-300">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Henüz abonelik eklenmemiş</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mx-2 mt-2">
                  Yukarıdaki formu kullanarak ilk aboneliğinizi ekleyin
                </p>
              </div>
            ) : (
              <div className="grid gap-5 mt-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-800 transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{sub.name}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                            {sub.category || "Kategori yok"}
                          </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm text-gray-600 dark:text-gray-400 mt-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                            <span className="font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                              ₺{sub.price}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>Son ödeme: {formatDate(sub.due_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button
                          onClick={() => setEditItem(sub)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-dark-100 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-dark-100 shadow-sm hover:shadow transform hover:-translate-y-0.5"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
