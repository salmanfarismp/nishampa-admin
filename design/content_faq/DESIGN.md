---
name: Monochrome Commerce Studio
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#47464a'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#78767b'
  outline-variant: '#c8c5ca'
  surface-tint: '#5f5e60'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1d'
  on-primary-container: '#858386'
  inverse-primary: '#c8c6c8'
  secondary: '#5d5e66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#63646c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f1a1a'
  on-tertiary-container: '#8a8282'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e1e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1c1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#ebe0df'
  tertiary-fixed-dim: '#cec4c4'
  on-tertiary-fixed: '#1f1a1a'
  on-tertiary-fixed-variant: '#4c4545'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an architectural, utilitarian, and high-precision visual standard tailored for high-volume eCommerce administration and progressive web application management. Designed specifically for merchants, catalog managers, and store operators, the system prioritizes instantaneous information scanning, extreme legibility, and distraction-free operational control across products, real-time orders, customer reviews, and merchandising CMS tooling.

### Aesthetic Paradigm
The design direction synthesizes **Modern Swiss Minimalism** with **Functional Developer Tooling Ergonomics**:
- **Monochromatic Purity:** Color is treated as operational telemetry rather than decorative styling. A strict black-and-white foundation reduces visual fatigue during prolonged usage.
- **Micro-Structured Hierarchy:** Depth and separation are achieved through hair-thin structural borders and strict typographic contrast rather than layered dropshadows or decorative fill fields.
- **Industrial Precision:** Clean lines, rigid tabular spacing, and subtle edge treatments create a fast, native-feeling desktop and mobile administrative workspace.

## Colors

The palette operates on a strict monochromatic foundation, augmented by subtle cool-neutral grays and functionally restrained semantic accents reserved solely for statuses and alerts.

### Surface & Canvas Tokens
- **Canvas Base:** `#ffffff` — The root viewport background for pages, sidebars, and parent canvas shells.
- **Surface Layer 1:** `#ffffff` — Default card containers, sheet dialogs, and table cell surfaces.
- **Surface Subtle (Muted):** `#fafafa` — Table headers, secondary toolbars, disabled item fills, and preview canvases.
- **Surface Hover / Active:** `#f4f4f5` — Interactive row hover states, segmented switch backgrounds, and dropdown item hover zones.

### Stroke & Structural Tokens
- **Border Default:** `#e4e4e7` — Main hairline divider, table grid outlines, and interactive control perimeters.
- **Border Subtle:** `#f4f4f5` — Inner card dividers, soft group boundaries, and sub-metric splitters.
- **Border Strong / Focus:** `#09090b` — Keyboard focus rings, active tab indicators, and drag-and-drop landing boundaries.

### Typography & Content Tokens
- **Text Primary:** `#09090b` — Page titles, numeric data, table cell copy, and high-priority headers.
- **Text Secondary:** `#71717a` — Metadata, breadcrumbs, table column identifiers, and input placeholder strings.
- **Text Subtle:** `#a1a1aa` — Timestamps, disabled control labels, and auxiliary iconography.
- **Text Inverted:** `#ffffff` — Primary button labels, inverted tooltips, and badge text.

### Semantic Telemetry (Functional Badges & Metrics)
Semantic accents must never be used as structural background fills; they are restricted to micro-badges, state indicator dots, and validation alerts:
- **Success (Fulfillments, Published, High Stock):** `#16a34a` (text/border), `#f0fdf4` (background).
- **Warning (Low Stock, Pending Reviews, Uncaptured Orders):** `#d97706` (text/border), `#fffbeb` (background).
- **Critical (Cancelled Orders, Out of Stock, Error):** `#dc2626` (text/border), `#fef2f2` (background).
- **Neutral (Draft, Archived, Inactive Banner):** `#71717a` (text/border), `#f4f4f5` (background).

## Typography

The type hierarchy is engineered around extreme structural clarity and scan-speed. Driven entirely by **Inter** with tabular figure alignment enabled (`font-variant-numeric: tabular-nums;`), the system keeps line heights compact and letter-spacing tightened on headings to maintain an authoritative, technical atmosphere.

### Type Application Rules
- **Numerical & Financial Data:** All inventory units, order totals, transaction IDs, SKUs, and tracking numbers must employ `mono-data` or `tabular-nums` formatting to ensure perfect vertical column alignment in dense tables.
- **Section & Header Scaling:** Desktop page headings utilize `headline-xl`, collapsing systematically to `headline-xl-mobile` on mobile screens to preserve viewport real estate.
- **Table Data Cells:** Cell records are rendered in `body-md` for standard density or `body-sm` in compact utility modes.
- **Field Labels & Headers:** Form labels and table column headers utilize uppercase or title-case `label-xs` or `label-sm` with slight positive tracking to differentiate structural framing from mutable user content.

## Layout & Spacing

The layout philosophy follows a **Modular Fixed-Fluid Shell System**. The administrative portal relies on a rigid vertical and horizontal baseline built on an unambiguous 4px/8px coordinate matrix.

### Canvas Structure
- **Persistent App Shell:** Desktop views feature a collapsed (64px) or expanded (240px) fixed left-hand navigation sidebar, a 56px utility header, and a fluid content workspace bounded by maximum width boundaries for specific tasks:
  - **Data Grids & Product Catalogs:** 100% fluid with rigid outer padding (`margin`: `2rem`).
  - **Form Editors & CMS Banners:** Centered max-width boundary (`1200px`) flanked by sticky contextual action side-rails.
- **Grid Architecture:** 12-column dynamic layout using `gutter`: `1.5rem` on desktop, switching to an uninterrupted vertical stack with a 4-column structure and `gutter-mobile`: `0.75rem` on mobile viewports.

### Responsive Breakpoints & Adapters
- **Desktop (>= 1280px):** Multi-column product layouts, persistent sidebars, parallel table action toolbars, and slide-over side inspection sheets.
- **Tablet (768px – 1279px):** Auto-collapsing sidebar to icon-only rail; table data collapses non-critical columns via responsive visibility rules.
- **Mobile PWA (< 768px):** Bottom application bar with quick-switch modes; sticky top context header for search and filtering; side sheets convert to native-style bottom drawered sheets; data tables reflow into dense card stacks.

## Elevation & Depth

Visual depth is produced strictly through **Low-Contrast Outlines and Structural Surfaces**, completely eschewing atmospheric blur dropshadows, saturated glows, or physical skeumorphism.

### Tier Architecture
- **Level 0 (Base Canvas):** Background tone `#ffffff`. Serves as the master bedrock for tables, canvas areas, and view controllers.
- **Level 1 (Structural Containers & Cards):** Background `#ffffff` framed by an exact 1px solid border (`#e4e4e7`). No drop shadows are permitted; separation is enforced entirely by boundary lines and subtle `#fafafa` sub-headers.
- **Level 2 (Dropdowns, Menus & Select Overlays):** Background `#ffffff`, bounded by a 1px border (`#e4e4e7`), accompanied by an ultra-subtle, ambient grounding offset: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);`.
- **Level 3 (Modals & Slide-Over Inspector Drawers):** Bounded by a 1px border (`#e4e4e7`), floating over a semi-translucent, flat modal backdrop: `rgba(9, 9, 11, 0.40)` with `backdrop-filter: blur(2px);`.

## Shapes

The design system adopts a **Subtle & Architectural** geometric treatment (`roundedness: 1`), balancing technical efficiency with modern refinement.

### Geometry Specifications
- **Controls & Input Fields:** Uniform `0.375rem` (6px) or `0.5rem` (8px / `rounded-lg`) corner radii for inputs, buttons, segmented controls, and dropdown triggers.
- **Cards, Panels & Data Containers:** Bounded cleanly with `0.5rem` (8px / `rounded-lg`). Inner header separations retain flat bottom joins.
- **Status Badges & Chips:** Compact `0.25rem` (4px) or full circular pills solely for status dots and numeric count bubbles.
- **Hero CMS Preview Components:** Sharp 4px outlines to simulate the actual customer-facing storefront viewport within the administration portal.

## Components

### Buttons
- **Primary:** Background `#09090b`, text `#ffffff`, border `none`, hover state `#27272a`. Focused via a 2px offset solid black ring. Height: 36px (desktop), 42px (mobile touch targets).
- **Secondary / Outline:** Background `#ffffff`, text `#09090b`, border `1px solid #e4e4e7`, hover background `#f4f4f5`.
- **Ghost / Tertiary:** Background transparent, text `#71717a`, hover text `#09090b`, hover background `#f4f4f5`.
- **Destructive:** Background `#ffffff`, text `#dc2626`, border `1px solid #fecaca`, hover background `#fef2f2`.

### Inputs, Search & Select Controls
- **Text Inputs:** Height 36px, border `1px solid #e4e4e7`, background `#ffffff`, padding `0 12px`, text `body-md`. Focus state transitions crisply to `1px solid #09090b` with no fuzzy glow.
- **Search Bar:** Integrated leading magnifying icon in `#a1a1aa`, trailing keyboard shortcut badge (e.g., `⌘K`) rendered in `#f4f4f5` container with `label-xs` text.

### Data Tables (Orders, Products, Reviews)
- **Container:** Wrapped in a 1px border (`#e4e4e7`) with `0.5rem` outer radius.
- **Header Row:** Background `#fafafa`, height 40px, text `label-xs` in `#71717a`, upper-cased with `border-bottom: 1px solid #e4e4e7`.
- **Data Rows:** Height 48px to 56px, background `#ffffff`, transitioning to `#fafafa` on hover. Row borders use `1px solid #f4f4f5`.
- **Inline Editing:** Inputs embedded in cells feature borderless states that reveal an active 1px border on click or focus.

### Status Chips & Badges
- **Structure:** Height 22px, padding `0 8px`, corner radius `4px`, font `label-xs` with a 6px circular indicator dot.
- **Fulfillment / Active:** Light green `#f0fdf4`, text `#16a34a`, border `#bbf7d0`.
- **Pending / In Review:** Light amber `#fffbeb`, text `#b45309`, border `#fde68a`.
- **Draft / Inactive:** Light gray `#f4f4f5`, text `#71717a`, border `#e4e4e7`.

### Checkboxes & Selection Controls
- **Unchecked:** 16px × 16px square, radius 4px, border `1px solid #e4e4e7`, background `#ffffff`.
- **Checked:** Background `#09090b`, border `1px solid #09090b`, white centered checkmark glyph.

### Cards & Grouping Containers
- Surface is `#ffffff` with a uniform `1px solid #e4e4e7` border and 8px radius.
- Card headers feature an explicit 48px height with bottom border `#f4f4f5` dividing header actions from card body content.

### Hero Banner CMS Previewer & Reorder Component
- **Draggable Handle:** Multi-dot gripper rendered in `#a1a1aa` that deepens to `#09090b` on drag.
- **Live Frame Canvas:** Bounded preview container simulating mobile, tablet, and desktop aspect ratios with a `#09090b` device frame and 1px rulers showing active banner coordinate dimensions.