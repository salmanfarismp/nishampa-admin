import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-[#141720]/90 border border-[#222836] p-4 shadow-lg backdrop-blur-sm transition-all duration-200 ${
        glow ? "shadow-blue-500/5 border-blue-500/30" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
