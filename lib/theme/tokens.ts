/**
 * Monochrome Commerce Studio - Design System Tokens
 * Source of truth: design/DESIGN.md
 */

export const TOKENS = {
  name: "Monochrome Commerce Studio",

  // Raw Design Tokens from Frontmatter
  palette: {
    surface: "#fbf8fc",
    surfaceDim: "#dcd9dd",
    surfaceBright: "#fbf8fc",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f6f2f7",
    surfaceContainer: "#f0edf1",
    surfaceContainerHigh: "#eae7eb",
    surfaceContainerHighest: "#e4e1e6",
    onSurface: "#1b1b1e",
    onSurfaceVariant: "#47464a",
    inverseSurface: "#303033",
    inverseOnSurface: "#f3f0f4",
    outline: "#78767b",
    outlineVariant: "#c8c5ca",
    surfaceTint: "#5f5e60",
    primary: "#000000",
    onPrimary: "#ffffff",
    primaryContainer: "#1c1b1d",
    onPrimaryContainer: "#858386",
    inversePrimary: "#c8c6c8",
    secondary: "#5d5e66",
    onSecondary: "#ffffff",
    secondaryContainer: "#e3e1ec",
    onSecondaryContainer: "#63646c",
    tertiary: "#000000",
    onTertiary: "#ffffff",
    tertiaryContainer: "#1f1a1a",
    onTertiaryContainer: "#8a8282",
    error: "#ba1a1a",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#93000a",
    primaryFixed: "#e5e1e4",
    primaryFixedDim: "#c8c6c8",
    onPrimaryFixed: "#1c1b1d",
    onPrimaryFixedVariant: "#474649",
    secondaryFixed: "#e3e1ec",
    secondaryFixedDim: "#c6c5cf",
    onSecondaryFixed: "#1a1b22",
    onSecondaryFixedVariant: "#46464e",
    tertiaryFixed: "#ebe0df",
    tertiaryFixedDim: "#cec4c4",
    onTertiaryFixed: "#1f1a1a",
    onTertiaryFixedVariant: "#4c4545",
    background: "#fbf8fc",
    onBackground: "#1b1b1e",
    surfaceVariant: "#e4e1e6",
  },

  // Monochromatic Commerce Structural Colors
  structural: {
    canvasBase: "#ffffff",
    surfaceLayer1: "#ffffff",
    surfaceSubtle: "#fafafa",
    surfaceHover: "#f4f4f5",
    borderDefault: "#e4e4e7",
    borderSubtle: "#f4f4f5",
    borderStrong: "#09090b",
    textPrimary: "#09090b",
    textSecondary: "#71717a",
    textSubtle: "#a1a1aa",
    textInverted: "#ffffff",
  },

  // Semantic Telemetry Accents (strictly for status dots, badges, alerts)
  telemetry: {
    success: {
      text: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
    },
    warning: {
      text: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
    },
    critical: {
      text: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
    },
    neutral: {
      text: "#71717a",
      bg: "#f4f4f5",
      border: "#e4e4e7",
    },
  },

  // Typography scale definitions
  typography: {
    headlineXl: {
      fontFamily: "var(--font-inter)",
      fontSize: "32px",
      fontWeight: "600",
      lineHeight: "40px",
      letterSpacing: "-0.025em",
    },
    headlineXlMobile: {
      fontFamily: "var(--font-inter)",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
      letterSpacing: "-0.02em",
    },
    headlineLg: {
      fontFamily: "var(--font-inter)",
      fontSize: "24px",
      fontWeight: "600",
      lineHeight: "32px",
      letterSpacing: "-0.02em",
    },
    headlineMd: {
      fontFamily: "var(--font-inter)",
      fontSize: "20px",
      fontWeight: "600",
      lineHeight: "28px",
      letterSpacing: "-0.015em",
    },
    headlineSm: {
      fontFamily: "var(--font-inter)",
      fontSize: "16px",
      fontWeight: "600",
      lineHeight: "24px",
      letterSpacing: "-0.01em",
    },
    bodyLg: {
      fontFamily: "var(--font-inter)",
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "24px",
      letterSpacing: "-0.005em",
    },
    bodyMd: {
      fontFamily: "var(--font-inter)",
      fontSize: "14px",
      fontWeight: "400",
      lineHeight: "20px",
      letterSpacing: "0em",
    },
    bodySm: {
      fontFamily: "var(--font-inter)",
      fontSize: "13px",
      fontWeight: "400",
      lineHeight: "18px",
      letterSpacing: "0.005em",
    },
    labelMd: {
      fontFamily: "var(--font-inter)",
      fontSize: "13px",
      fontWeight: "500",
      lineHeight: "18px",
      letterSpacing: "0em",
    },
    labelSm: {
      fontFamily: "var(--font-inter)",
      fontSize: "12px",
      fontWeight: "500",
      lineHeight: "16px",
      letterSpacing: "0.01em",
    },
    labelXs: {
      fontFamily: "var(--font-inter)",
      fontSize: "11px",
      fontWeight: "600",
      lineHeight: "14px",
      letterSpacing: "0.04em",
    },
    monoData: {
      fontFamily: "var(--font-jetbrains-mono)",
      fontSize: "12px",
      fontWeight: "400",
      lineHeight: "16px",
      letterSpacing: "0em",
    },
  },

  // Geometric Radii
  radii: {
    sm: "0.125rem", // 2px
    default: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },

  // Layout Spacing Matrix (4px/8px coordinate baseline)
  spacing: {
    gutter: "1.5rem", // 24px
    gutterMobile: "0.75rem", // 12px
    margin: "2rem", // 32px
    marginMobile: "1rem", // 16px
    spaceXs: "0.25rem", // 4px
    spaceSm: "0.5rem", // 8px
    spaceMd: "0.75rem", // 12px
    spaceLg: "1.25rem", // 20px
    spaceXl: "2rem", // 32px
  },

  // Elevation and Structural Depth
  elevation: {
    level0: {
      background: "#ffffff",
      border: "none",
      boxShadow: "none",
    },
    level1: {
      background: "#ffffff",
      border: "1px solid #e4e4e7",
      boxShadow: "none",
    },
    level2: {
      background: "#ffffff",
      border: "1px solid #e4e4e7",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    },
    level3: {
      backdrop: "rgba(9, 9, 11, 0.40)",
      filter: "blur(2px)",
      border: "1px solid #e4e4e7",
    },
  },
} as const;

export type ThemeTokens = typeof TOKENS;
export type TelemetryStatus = keyof typeof TOKENS.telemetry;
export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";
