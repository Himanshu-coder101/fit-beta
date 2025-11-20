import Link from "next/link";
import { useRouter } from "next/router";

export default function BottomNav() {
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/day/1", label: "Today", icon: "🔥" },
    { href: "/weekly-plan", label: "Plan", icon: "📅" },
    { href: "/feedback-log", label: "Logs", icon: "📝" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="bottom-nav md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center text-xs ${
            router.pathname === item.href ? "text-ft-blue font-semibold" : "text-slate-600 dark:text-slate-300"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
