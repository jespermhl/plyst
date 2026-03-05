"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export function DashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Editor", href: "/dashboard" },
    { name: "Einstellungen", href: "/dashboard/settings" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="font-display text-xl font-black tracking-tighter text-blue-600"
          >
            PLYST
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <UserButton />
      </div>
    </nav>
  );
}
