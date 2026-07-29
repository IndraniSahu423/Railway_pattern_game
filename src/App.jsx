import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./home";
import Game from "./components/Game";

export default function App() {
  const [page, setPage] = useState("home");

  const navigate = (target) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar currentPage={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === "home" ? (
          <Home onPlay={() => navigate("game")} />
        ) : (
          <Game onGoHome={() => navigate("home")} />
        )}
      </main>
      <Footer />
    </div>
  );
}
