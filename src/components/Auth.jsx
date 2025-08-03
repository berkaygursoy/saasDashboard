import { useState } from "react";
import { supabase } from "../services/supabase";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";

export default function Auth({ onAuthSuccess }) {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let result;
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      onAuthSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-dark-200 dark:to-dark-300 py-10 transition-colors duration-300">
      <div className="relative max-w-sm mx-auto">
        <div className="absolute top-0 right-0 mt-2 mr-2 z-50">
          <ThemeToggle />
        </div>
        <div className="mt-10 p-6 border border-gray-200 dark:border-dark-200 rounded-xl shadow-lg bg-white dark:bg-dark-100 transition-colors duration-300">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              type="email"
              placeholder="E-Posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-200 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
              type="submit"
            >
              {isLogin ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {isLogin ? "Hesabınız yok mu? " : "Hesabınız var mı? "}{" "}
            <button
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mx-1 transition-colors duration-200"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Kayıt Ol" : "Giriş Yap"}
            </button>
          </p>
          {error && (
            <p className="mt-2 text-red-600 dark:text-red-400 text-sm transition-colors duration-300">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
