# Dashboard Design System (Reusable Layout)

This design system defines a reusable dashboard layout and component standards for building consistent, dense, executive-friendly dashboards. It is written to be implementation-ready for a Next.js + Tailwind + shadcn-style component library.

---

## 1) Principles

### Clarity over decoration
- Prefer strong hierarchy (type scale, spacing, alignment) instead of extra borders and gradients.
- Every view must communicate: “what changed?”, “what matters most?”, “where to drill down?”.

### Density with breathing room
- Dashboards are information-dense, but never cramped.
- Use compact spacing by default; reserve larger spacing for section breaks and headers.

### Predictable layout
- Filters and navigation stay in consistent places.
- Cards align to a grid; charts and tables share consistent paddings and header styles.

### Data-first interactions
- Every chart/table supports: hover tooltips, legends, and “view details” actions when relevant.
- Loading and empty states are designed, not ad-hoc.

---

## 2) Foundations

### 2.1 Layout grid

**Desktop baseline**
- Container: full width with internal padding
- App structure: Header (fixed height) + Content (fills remaining space)
- Content: 12-column mental model, implemented via responsive grid

**Recommended dashboard layout**
- Row 1: KPI cards (4–6 cards)
- Rows 2–3: charts (2–4 chart cards) + one table card
- Optional: right rail (filters/notes) only if it does not reduce chart readability

**Spacing rules**
- Outer page padding: `px-4` on mobile, `lg:px-6` on desktop
- Vertical rhythm: use `gap-3` for dense rows, `gap-4` for section breaks
- Card padding: `p-4` default; `p-3` for tight filter bars

### 2.2 Breakpoints (Tailwind-aligned)
- `sm` (≥ 640px): small tablets
- `md` (≥ 768px): tablets / small laptops
- `lg` (≥ 1024px): primary desktop dashboard target
- `xl` (≥ 1280px): wide dashboards

**Behavior standards**
- Mobile (`< lg`): stack cards and charts vertically; allow natural scroll
- Desktop (`≥ lg`): keep content within a single viewport when feasible; avoid nested scrolls unless it’s a table body

### 2.3 Radius
- Surface radius: `rounded-2xl` for primary containers (filter pills, panels)
- Card radius: `rounded-xl` (or component default) for modular sections
- Small controls: `rounded-full` for pills, `rounded-md` for inputs

### 2.4 Elevation & borders
- Base approach: subtle border + minimal shadow
- Card border: 1px neutral border
- Shadow: small and consistent (avoid heavy shadows on data grids)

**Rule of thumb**
- Use shadow to separate layers (modal, floating menus), not to decorate every card.

---

## 3) Color System

### 3.1 Brand
- Brand primary: `#0066CC`
- Brand primary (hover/darker): `#005BB8`
- Brand tint (background wash): `#F7FBFF`

### 3.2 Neutrals
- Text strong: `#0B1E33`
- Text muted: `#5B6B7F`
- Border: `#E1ECF7`
- Border strong: `#C9D7E8`
- Surface: `#FFFFFF`

### 3.3 Semantic colors
Use semantic colors for meaning, never as decoration.

- Success
  - Text/icon: emerald-600
  - Background: emerald-50 (subtle)
- Warning
  - Text/icon: amber-600
  - Background: amber-50
- Danger
  - Text/icon: red-600
  - Background: red-50
- Info
  - Text/icon: brand primary
  - Background: brand tint

### 3.4 Charts palette
Use a fixed palette to keep dashboards consistent across views.

**Primary series palette (ordered)**
1. Brand blue
2. Teal
3. Violet
4. Amber
5. Rose
6. Slate

**Chart rules**
- Gridlines: very light neutral
- Axes: muted text color
- Data labels: only on hover or only for top-N (avoid clutter)
- Highlight state: single stronger color + slightly thicker stroke

---

## 4) Typography

### 4.1 Type scale
- Page title: 18–20px, semibold
- Section title (card header): 13–14px, semibold
- KPI value: 20–28px, bold (depends on density)
- KPI label: 11–12px, medium, uppercase optional
- Body: 12–14px
- Helper text: 11–12px muted

### 4.2 Text rules
- Use sentence case for labels, except small meta labels (uppercase tracking)
- Numbers: tabular alignment preferred where available
- Avoid multi-line KPI titles; prefer short labels + tooltip if needed

---

## 5) Iconography

### 5.1 Icon set
- Use a single icon family (e.g., lucide)
- Stroke-based icons only; avoid mixing filled and stroked styles

### 5.2 Sizes
- Button icons: 16px
- KPI/Badge icons: 12–14px
- Header brand mark icon: 16–18px

### 5.3 Color
- Default: inherit text color
- Semantic: match semantic text/icon colors

---

## 6) Component Standards

This section defines canonical dashboard components. Names are conceptual; implement via existing UI primitives.

### 6.1 App Shell

**Structure**
- `Header`: brand + context + global actions
- `Content`: view tabs + filters + dashboard canvas

**Header rules**
- Height: compact (around 44–56px)
- Left: brand mark + org name + product name
- Right: status badges (optional), last updated, environment tag (optional)

### 6.2 Navigation Tabs

**Purpose**
- Switch between dashboard views with consistent placement.

**Rules**
- Tabs show icon + label (label can hide on small screens)
- Active tab: clear background + strong text
- Keyboard navigation must work (left/right + focus)

### 6.3 Filter Bar

**Structure**
- Filter group container (rounded, bordered, white surface)
- Presets as pills (Today / 7D / 30D / Custom)
- Date range controls for custom

**Rules**
- Prefer presets; custom is secondary
- Always show active period clearly
- Changing filter updates all charts and tables consistently

### 6.4 KPI Card

**Anatomy**
- Header: label + optional icon
- Value: large numeric
- Subtext: delta / context / caption (optional)
- Optional action: “detail” icon button or click-to-drill

**Rules**
- KPI value line is always single-line (truncate with tooltip if needed)
- Provide consistent number formatting (currency/percent)
- Avoid mixed units within the same KPI row

### 6.5 Chart Card

**Anatomy**
- Header: title + controls (legend toggle, download, detail)
- Body: chart area with fixed minimum height
- Footer (optional): summary stats or explanation

**Rules**
- Use consistent chart margins and typography
- Tooltip: compact, high-contrast, shows series name + value + unit
- Legend: only if more than one series

### 6.6 Table Card

**Anatomy**
- Header: title + right-aligned actions (search, export, filter)
- Body: scrollable table body when needed (desktop)
- Sticky header row for long tables

**Rules**
- Row height: compact (32–40px)
- Numeric columns: right-aligned
- Status columns: use badges
- Provide empty state for no rows

### 6.7 Badges

**Variants**
- Neutral: meta labels
- Soft success/warn/danger: statuses
- Brand: selected scope (“All Units”, “Realtime”)

**Rules**
- Badges should never be the only way to communicate status; include text.

### 6.8 Buttons

**Primary**
- Brand background, white text
- Used for main actions (Apply, Export primary)

**Secondary**
- Neutral border, white background
- Used for non-destructive actions (Reset, View details)

**Ghost**
- For icon-only controls inside dense toolbars and card headers

### 6.9 Inputs

**Date**
- Use native date input when possible for reliability
- Ensure format display is consistent and validated

**Search**
- Debounced search in tables
- Clear button appears when active

### 6.10 Modal / Detail Drawer

**Use cases**
- Drill-down from chart/table without losing dashboard context

**Rules**
- Title + short summary at top
- Body contains table and small controls (download CSV, filters)
- Close button always visible
- Focus trap and ESC-to-close

### 6.11 Loading States

**Skeletons**
- KPI: 1–2 lines skeleton
- Charts: large rectangle skeleton
- Table: 6–10 skeleton rows

**Rules**
- Skeletons match real layout (avoid layout shift)
- Loading should not block navigation (tabs still clickable)

### 6.12 Empty States

**When data is empty**
- Explain why: “No data in selected period”
- Provide next action: “Change period” or “Reset filters”

**When data is unavailable**
- Explain: “Data source unreachable”
- Provide action: “Retry”

---

## 7) Data Formatting Rules

### Currency (IDR)
- Use compact formatting for large values: `Rp 1.2B`, `Rp 850M` on KPIs
- In tables, show full value with separators: `Rp 1,234,567,890`
- Always keep currency symbol consistent: `Rp`

### Percentages
- Use 0–1 decimals for KPIs
- Use 1–2 decimals in tooltips if needed

### Dates
- For dashboard UI: `DD MMM YYYY` (human-readable)
- For inputs: ISO `YYYY-MM-DD`
- For charts: month abbreviations when aggregated

### “Top-N” behavior
- Default: Top 5 or Top 10
- Always show sorting criteria in header label (e.g., “Top 5 by Budget”)

---

## 8) Interaction & Accessibility

### Keyboard support
- All interactive elements are reachable via Tab
- Tabs: arrow key navigation
- Modal: focus trap + ESC closes

### Focus styles
- Always visible focus ring on keyboard navigation
- Focus ring color: brand primary (or neutral ring with brand offset)

### Contrast
- Body text meets WCAG AA contrast on white background
- Muted text used only for secondary metadata, not essential values

### Tooltips
- Must be hover + focus accessible
- Do not hide critical info exclusively in tooltips

---

## 9) Motion

Keep motion subtle and functional.
- Hover transitions: 150–200ms
- Modal open/close: 200–250ms
- Disable or reduce motion when user prefers reduced motion

---

## 10) Dashboard Templates

### Template A: Executive Overview

**Header**
- Brand + “Realtime Monitoring” badge + last refresh

**Canvas**
1. KPI row (4 cards)
2. Row: Trend chart (2 columns) + Composition donut (1 column)
3. Row: Breakdown bar chart (2 columns) + Top-N table (1 column)

**Drill-down**
- Clicking a KPI opens a detail modal with a table + CSV export

### Template B: Operational List

**Canvas**
1. Filter bar (period + unit + status)
2. Table card (search + export)
3. Optional right column: quick stats (counts by status)

---

## 11) Implementation Notes (Tailwind + UI Primitives)

### Class conventions (recommended)
- Page container: `flex min-h-screen flex-col bg-[brand-tint] text-[text-strong]`
- Header: `border-b bg-white px-4 py-2.5 lg:px-6`
- Content: `flex flex-1 flex-col px-4 pb-4 pt-3 lg:px-6 lg:pb-5 lg:pt-4`
- Dense grid: `grid gap-3`
- Section spacing: `gap-4`

### Component sourcing
- Prefer existing UI primitives under `components/ui/*`
- If a primitive is missing (e.g., dropdown menu, input), implement it once as a reusable primitive and use everywhere.

---

## 12) Libraries Used (and what they do for this design)

This project’s dashboard UI is built from a small set of libraries that map directly to the design system rules above:

### Framework & rendering
- **Next.js (App Router)**: Page layout, routing, metadata (`app/layout.tsx`), and server/client boundaries. This design system assumes reusable “views” rendered inside a consistent app shell.
- **React**: Component composition and state (filters, tabs, modals, drill-downs).

### Styling & UI composition
- **Tailwind CSS v4**: The layout grid, spacing, typography utilities, and responsive behavior described in this file are implemented through Tailwind classes.
- **shadcn-style UI primitives (local components)**: Reusable UI building blocks live under `components/ui/*` (Button, Card, Tabs, Badge, Input, DropdownMenu, Switch, etc.). The design system’s “Component Standards” section is intended to map to these primitives.
- **Radix UI**: Accessibility-first primitives behind components like Tabs, DropdownMenu, and Switch (keyboard nav, focus management, ARIA patterns).
- **class-variance-authority + clsx + tailwind-merge**: Utility trio for variant-based styling, conditional class names, and safe Tailwind class merging. This helps enforce consistent “variants” (primary/secondary badges, button styles, etc.).

### Data visualization
- **Recharts**: Charts (bar/line/pie/composed) used to implement “Chart Card” patterns, tooltips, and legends. This design system’s chart rules (palette, gridlines, axes styling) are applied through Recharts props + Tailwind wrappers.

### Icons
- **lucide-react**: Single consistent icon set (stroke-based) for headers, KPIs, tabs, and action buttons—aligned with the iconography rules.

### Data ingestion
- **PapaParse**: CSV parsing for the dashboard dataset. Even if a view uses “dummy data”, the system is designed to swap in parsed data without changing layout rules.

### Type safety & quality
- **TypeScript**: Strong typing for view props, data shapes, and chart payloads. Helps keep the dashboard consistent as it grows.
- **ESLint (eslint-config-next)**: Enforces code quality and Next.js best practices.

### PWA basics
- **Web Manifest + Service Worker**: Enables installable behavior and simple caching (offline-friendly shell). This complements the “predictable layout” principle by keeping navigation and shell responsive even when data is slow.
