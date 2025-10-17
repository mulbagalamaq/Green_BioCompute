# Green Bio Compute Wet Lab Platform - Design Guidelines

## Design Approach

**Selected System:** Material Design 3 with enterprise analytics refinements
**Justification:** Information-dense biotech platform requiring data clarity, professional credibility, and functional efficiency. Material Design 3 provides robust component patterns for dashboards, data visualization, and complex forms while maintaining scientific professionalism.

**Design Principles:**
1. **Data Clarity First** - Information hierarchy prioritizes actionable insights over decoration
2. **Scientific Credibility** - Professional aesthetic builds trust with enterprise biotech clients
3. **Efficient Workflows** - Minimize clicks for equipment management and data entry
4. **Integrated Complexity** - Seamlessly blend wet lab + dry lab data without overwhelming users

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Default):**
- Primary: `220 75% 56%` (Professional blue for scientific credibility)
- Primary Variant: `220 65% 48%` (Darker blue for interactive states)
- Background: `220 15% 11%` (Deep charcoal, reduces eye strain for data-heavy screens)
- Surface: `220 12% 16%` (Elevated cards/panels)
- Surface Variant: `220 10% 20%` (Secondary panels, navigation)

**Light Mode:**
- Primary: `220 75% 50%`
- Background: `220 20% 98%` (Soft white)
- Surface: `0 0% 100%` (Pure white for cards)
- Surface Variant: `220 15% 96%`

**Semantic Colors:**
- Success/Low Emissions: `142 70% 45%` (Green for optimization achievements)
- Warning/Medium Emissions: `38 92% 50%` (Amber for efficiency alerts)
- Error/High Emissions: `0 72% 51%` (Red for critical thresholds)
- Info/Neutral: `200 80% 55%` (Cyan for informational states)

**Data Visualization Palette:**
- Equipment Category 1: `220 75% 56%` (Primary blue)
- Equipment Category 2: `280 65% 60%` (Purple for contrast)
- Equipment Category 3: `160 60% 48%` (Teal for variety)
- Equipment Category 4: `38 90% 55%` (Orange for energy-intensive)
- Trend Line: `142 70% 45%` (Green for positive trends)

### B. Typography

**Font Families:**
- Primary: `Inter` (Google Fonts) - Exceptional readability for data tables and metrics
- Monospace: `JetBrains Mono` - For numerical data, API keys, equipment IDs

**Type Scale:**
- Display (Dashboard Titles): 32px/40px, font-weight 600
- Headline (Section Headers): 24px/32px, font-weight 600
- Title (Card Headers): 20px/28px, font-weight 500
- Body Large (Data Labels): 16px/24px, font-weight 400
- Body (Standard Text): 14px/20px, font-weight 400
- Caption (Metadata): 12px/16px, font-weight 400
- Overline (Table Headers): 11px/16px, font-weight 500, uppercase, letter-spacing 0.5px

### C. Layout System

**Spacing Primitives:** Use Tailwind units of `2, 3, 4, 6, 8, 12, 16` for consistent rhythm
- Component padding: `p-4` to `p-6`
- Section spacing: `gap-8` to `gap-12`
- Card margins: `m-4`
- Dashboard grid gaps: `gap-6`

**Grid System:**
- Dashboard: 12-column grid with `gap-6`
- Equipment cards: 3-column on desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Data tables: Full-width with horizontal scroll on mobile
- Forms: 2-column layout for efficiency (`grid-cols-1 md:grid-cols-2`)

**Container Widths:**
- Dashboard content: `max-w-7xl mx-auto`
- Forms/Settings: `max-w-4xl mx-auto`
- Data tables: `w-full` with inner padding

### D. Component Library

**Navigation:**
- Persistent left sidebar (240px wide) with collapsible sub-menus
- Top app bar (64px height) with facility selector, user profile, notification bell
- Breadcrumb navigation for deep hierarchies (Facility → Lab → Equipment)
- Tab navigation for switching between Wet Lab / Dry Lab / Combined views

**Equipment Management:**
- Equipment cards with status indicator (active/idle/offline), real-time power consumption, daily emissions metric
- Advanced search with autocomplete dropdown (200+ equipment types)
- Equipment detail modal with tabbed sections: Overview, Real-Time Data, Historical Trends, Maintenance Alerts
- Quick-add floating action button (FAB) bottom-right for rapid equipment entry

**Data Display:**
- Primary metrics cards (large numerals, trend sparklines, percentage change indicators)
- Time-series line charts for emissions over time (Chart.js or Recharts)
- Horizontal bar charts for equipment comparison (equipment name, consumption bar, emissions number)
- Heat map for facility-level emissions intensity
- Data tables with sortable columns, inline filters, pagination (50 rows/page)

**Forms:**
- Multi-step wizard for equipment onboarding (Equipment Type → Manufacturer/Model → API Connection → Baseline Configuration)
- Inline validation with immediate feedback
- Autocomplete dropdowns for manufacturer/model selection
- API credential fields with masked inputs and test connection button
- File upload for LIMS data import (drag-and-drop zone)

**Alerts & Notifications:**
- Toast notifications (top-right) for real-time events (equipment offline, efficiency degradation)
- In-app notification center with categorized alerts (Maintenance, Optimization, Compliance)
- Banner alerts for critical facility-wide issues (BMS connection failure)

**Reporting:**
- Export dropdown with format options (PDF, CSV, Excel for regulatory reports)
- Report preview modal before generation
- Scheduled reports configuration panel
- Combined wet lab + dry lab report selector with facility aggregation

### E. Dashboard Layout Specifications

**Primary Dashboard Sections:**
1. **Hero Metrics Row** - 4 cards showing Total Emissions (tCO₂e), Active Equipment Count, Efficiency Score (0-100), Monthly Trend (↑/↓%)
2. **Real-Time Equipment Status** - Live feed of equipment operational states with power draw indicators
3. **Emissions Breakdown** - Donut chart by equipment category + horizontal bar chart top 10 emitters
4. **Predictive Alerts Panel** - List of maintenance recommendations and optimization opportunities
5. **Recent Activity Timeline** - Equipment added, API connections updated, reports generated

**Equipment Inventory Page:**
- Filter sidebar (left, 280px): Equipment type, manufacturer, facility, status checkboxes
- Main content: Grid view (default) or list view toggle, sorting options, bulk actions toolbar
- Equipment detail view: Full-screen modal with equipment photo placeholder, specifications table, real-time monitoring chart, maintenance history accordion

**API Integration Page:**
- Connection status cards for BMS, LIMS, and manufacturer APIs
- API configuration forms with credential management
- Connection test results and diagnostic logs
- Integration health dashboard with uptime metrics

**Reporting Page:**
- Report template library (GHG Protocol, ISO 14064, CSRD)
- Unified wet lab + dry lab report generator with date range selector
- Facility-level aggregation controls
- Report history table with download links

---

## Images

**No large hero images** - This is a data-centric enterprise application. Visual assets used sparingly:
- Equipment placeholder images in detail modals (400x300px product photos)
- Company/facility logos in top navigation bar (40x40px)
- Empty state illustrations for zero-data scenarios (400x300px line art)
- Onboarding flow illustrations for API setup wizards (600x400px)

All images should maintain professional, technical aesthetic avoiding overly decorative styles.