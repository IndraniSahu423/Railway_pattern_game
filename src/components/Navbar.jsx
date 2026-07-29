import { useState, useEffect } from "react";
import { Train, Home, Gamepad2 } from "lucide-react";

export default function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (page) =>
    `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
      currentPage === page
        ? "bg-amber-500 text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "px-4 sm:px-6 pt-3 pb-0 bg-transparent" : "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-in-out ${
          scrolled
            ? "max-w-5xl h-14 px-5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg"
            : "max-w-6xl h-16 px-4 sm:px-6 rounded-none"
        }`}
      >
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 group"
        >
          <div
            className={`rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300 ${
              scrolled ? "w-8 h-8" : "w-9 h-9"
            }`}
          >
            <Train className={`text-white transition-all duration-300 ${scrolled ? "w-4 h-4" : "w-5 h-5"}`} />
          </div>
          <span
            className={`font-bold text-slate-800 hidden sm:block transition-all duration-300 ${
              scrolled ? "text-base" : "text-lg"
            }`}
          >
            Pattern Railway
          </span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => onNavigate("home")} className={linkClass("home")}>
            <Home size={16} />
            <span className={scrolled ? "hidden sm:inline" : ""}>Home</span>
          </button>
          <button onClick={() => onNavigate("game")} className={linkClass("game")}>
            <Gamepad2 size={16} />
            <span className={scrolled ? "hidden sm:inline" : ""}>Play Game</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
