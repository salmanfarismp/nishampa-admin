import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-md transition duration-150 active:scale-[0.98] inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-strong";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "h-8 px-2.5 text-xs",
    md: "h-9 px-3.5 text-sm", // 36px on desktop, optimal control height
    lg: "h-[42px] px-4.5 text-sm font-semibold", // 42px mobile touch target
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-text-primary text-text-inverted hover:bg-[#27272a] border border-transparent shadow-xs",
    secondary:
      "bg-canvas text-text-primary border border-border-default hover:bg-surface-hover",
    outline:
      "bg-canvas text-text-primary border border-border-default hover:bg-surface-hover",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover",
    destructive:
      "bg-canvas text-[#dc2626] border border-[#fecaca] hover:bg-[#fef2f2]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
