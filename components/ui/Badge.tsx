import React from "react";

export type BadgeVariant =
  | "default"
  | "neutral"
  | "success"
  | "warning"
  | "critical"
  | "danger"
  | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  withDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  withDot = true,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    default: {
      container: "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]",
      dot: "bg-[#71717a]",
    },
    neutral: {
      container: "bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7]",
      dot: "bg-[#71717a]",
    },
    success: {
      container: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
      dot: "bg-[#16a34a]",
    },
    warning: {
      container: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
      dot: "bg-[#d97706]",
    },
    critical: {
      container: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
      dot: "bg-[#dc2626]",
    },
    danger: {
      container: "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]",
      dot: "bg-[#dc2626]",
    },
    info: {
      container: "bg-[#eff6ff] text-[#2563eb] border-[#bfdbfe]",
      dot: "bg-[#2563eb]",
    },
  };

  const current = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[4px] text-[11px] font-semibold tracking-[0.04em] border tabular-nums select-none ${current.container} ${className}`}
    >
      {withDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
