import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./services/supabase";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      {session ? <Dashboard /> : <Auth onAuthSuccess={() => {
        // Kimlik doğrulama başarılı olduğunda oturum bilgisini güncelle
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
        });
      }} />}
    </ThemeProvider>
  );
}
export default App;
