"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "./AdminHeader";
import BottomNavigation from "./BottomNavigation";
import InstallBanner from "@/components/pwa/InstallBanner";

interface MobileShellProps {
  children: React.ReactNode;
}

export default function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/unauthorized");

  if (isAuthPage) {
    return (
      <div className="w-full max-w-md h-full bg-canvas text-on-surface flex flex-col relative sm:border-x sm:border-border-default shadow-xs overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md h-full bg-surface text-on-surface flex flex-col relative sm:border-x sm:border-border-default shadow-xs overflow-hidden">
      {/* Top Mobile Admin Header */}
      <AdminHeader />

      {/* PWA Install Promotion Banner */}
      <InstallBanner />

      {/* Main Scrollable Viewport with Bottom Padding for Navigation Bar */}
      <main className="flex-1 px-4 py-3 overflow-y-auto overflow-x-hidden flex flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
