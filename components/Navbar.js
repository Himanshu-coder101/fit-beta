import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("ft_theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ft_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-black/30 border-b border-white/20 dark:border-white/10">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ft-blue to-ft-teal flex items-center justify-center text-white font-bold shadow-xl">
          FT
        </div>
        <span className="font-semibold text-xl tracking-wide">FitTrack Pro</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className={`hover:text-ft-blue transition ${
              router.pathname === "/dashboard" ? "text-ft-blue" : ""
            }`}
          >
            Dashboard
          </Link>

          {!session ? (
            <button onClick={() => signIn('google')} className="btn-primary">
              Sign In
            </button>
          ) : (
            <>
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button onClick={() => signOut()} className="small-btn">
                Sign Out
              </button>
            </>
          )}
        </div>

        <button onClick={toggleTheme} className="small-btn">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}