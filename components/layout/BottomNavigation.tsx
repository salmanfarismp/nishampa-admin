"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  matchHrefs?: string[];
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Products",
    href: "/products",
    matchHrefs: ["/products", "/"],
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? "2.2" : "1.8"}
        className="w-5 h-5"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    name: "Orders",
    href: "/orders",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? "2.2" : "1.8"}
        className="w-5 h-5"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "Reviews",
    href: "/reviews",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? "2.2" : "1.8"}
        className="w-5 h-5"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8" />
        <path d="M8 13h6" />
      </svg>
    ),
  },
  {
    name: "Content",
    href: "/content",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? "2.2" : "1.8"}
        className="w-5 h-5"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 w-full bg-surface/95 backdrop-blur-md border-t border-surface-container z-40 select-none pb-safe shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            Boolean(item.matchHrefs && item.matchHrefs.includes(pathname));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-12 active:scale-[0.96] transition-all outline-none ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
            >
              <div className="mb-1 transition-transform">{item.icon(isActive)}</div>
              <span className="text-[11px] font-medium tracking-tight">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
