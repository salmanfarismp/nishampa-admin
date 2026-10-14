"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "DASHBOARD",
    href: "/",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke={active ? "none" : "currentColor"}
        strokeWidth="2"
        className="w-5 h-5"
      >
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    name: "MODULES",
    href: "/modules",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke={active ? "none" : "currentColor"}
        strokeWidth="2"
        className="w-5 h-5"
      >
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "SYSTEM",
    href: "/system",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke={active ? "none" : "currentColor"}
        strokeWidth="2"
        className="w-5 h-5"
      >
        <path
          d="M12 2v4m0 12v4M2 12h4m12 0h4m-3.17-6.83l-2.83 2.83m-8 8l-2.83 2.83m0-13.66l2.83 2.83m8 8l2.83 2.83"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: "SETTINGS",
    href: "/settings",
    icon: (active) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke={active ? "none" : "currentColor"}
        strokeWidth="2"
        className="w-5 h-5"
      >
        <path
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 w-full bg-[#111317]/95 backdrop-blur-xl border-t border-[#1e232d] z-40 select-none pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-14 active:scale-[0.96] transition-all outline-none relative ${
                isActive ? "text-blue-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {isActive && (
                <span className="absolute top-1 w-6 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm shadow-blue-500/50" />
              )}
              <div className="mb-1 transition-transform">{item.icon(isActive)}</div>
              <span className="text-[10px] tracking-wider uppercase font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
