# Design Guidelines: Nordson Pump Rotation Logger

## Design Approach

**Selected Approach:** Design System-Based (Coss UI)

This industrial data collection application prioritizes efficiency, clarity, and data accuracy. The design follows Coss UI's component patterns to create a consistent, professional interface optimized for rapid data entry and clear visualization of production metrics.

**Core Principles:**
- Efficiency First: Minimize clicks and cognitive load for frequent data entry
- Data Clarity: Clear visual hierarchy for numeric inputs and tabular data
- Industrial Professionalism: Clean, focused interface without decorative elements
- Portuguese Language: All labels, placeholders, and messages in Portuguese

---

## Typography System

### Font Families
- **Primary Font:** System UI stack (via Coss UI defaults)
- **Monospace:** For numeric inputs and data display

### Type Scale
- **Page Titles:** text-2xl font-semibold (Dashboard, main headers)
- **Section Headers:** text-xl font-medium (Form sections, tab labels)
- **Field Labels:** text-sm font-medium (Input labels, table headers)
- **Input Text:** text-base (Form inputs, data cells)
- **Helper Text:** text-xs (Validation messages, timestamps)

### Typography Usage
- Form labels: Consistent capitalization (Title Case for main labels)
- Numeric fields: Align right for easier scanning
- Table headers: Medium weight for clear distinction from data
- Error messages: Regular weight to avoid alarm

---

## Layout System

### Spacing Primitives
**Core Units:** p-2, p-4, p-6, p-8, m-2, m-4, m-6
- Form field spacing: space-y-4 between fields
- Section padding: p-6 for cards/containers
- Page margins: p-8 for main content areas
- Compact spacing: gap-2 for related elements (label + input)

### Layout Structure

**Main Application Container:**
- max-w-7xl mx-auto for content centering
- px-4 sm:px-6 lg:px-8 for responsive horizontal padding
- py-8 for vertical breathing room

**Form Layouts:**
- Single column on mobile (w-full)
- Two-column grid on tablet/desktop for efficiency (grid grid-cols-1 md:grid-cols-2 gap-4)
- Full-width for selection controls (Data, Linha de Produção)
- Group related fields visually with subtle containers

**Dashboard Layout:**
- Full-width tables with horizontal scroll on mobile
- Tabs component spanning full container width
- Sticky table headers for long data sets

---

## Component Library & Patterns

### Navigation & Page Structure
- **No traditional navigation:** Single-page application with tab-based switching
- **Main View Toggle:** Tabs component for "Entrada de Dados" and "Dashboard"
- **Minimal header:** Application title + context indicator (optional user/shift info)

### Forms (Primary Interface)

**FormularioDeEntrada Pattern:**
- **Step 1 - Selection Controls (Always Visible):**
  - DatePicker: Full width, prominent placement
  - Select (Linha de Produção): Full width, below date
  - Both with clear labels above inputs

- **Step 2 - Dynamic Form (Conditional):**
  - Rendered after line selection
  - Clear visual separation from selection controls (mt-6 border-t pt-6)
  - Form title showing selected line number

**FormularioGrupo1 & FormularioGrupo2:**
- Grid layout: grid grid-cols-1 md:grid-cols-2 gap-4
- Numeric inputs with:
  - Label above input (text-sm font-medium mb-1)
  - Placeholder showing unit or example value
  - Right-aligned text for numeric consistency
  - Step="0.01" for decimal precision
- Submit button: Full width on mobile, auto-width on desktop
- Position at bottom-right: justify-end

**Input Field Pattern:**
```
[Label Text]
[Input Field (number type)]
[Helper/Error Text]
```

### Data Display (Dashboard)

**Tabs Component:**
- Two tabs: "Coletas Grupo 1" | "Coletas Grupo 2"
- Tab labels include record count: "Coletas Grupo 1 (24)"
- Full-width tab bar with centered content

**Table Component:**
- Striped rows for easier scanning
- Sticky header row
- Responsive: horizontal scroll on mobile with sticky first column (Linha)
- Compact cell padding: px-3 py-2
- Numeric columns: Right-aligned
- Date/Time columns: Left-aligned, monospace
- Action column (if needed): Right-aligned, minimal width

**Table Column Priority (Mobile):**
1. Data Coleta (sticky)
2. Linha de Produção (sticky)
3. Velocidade da Linha
4. Other columns scroll horizontally

### Buttons & Actions

**Primary Action (Salvar Coleta):**
- Coss UI Button component (primary variant)
- Size: Medium (default)
- Full width on mobile, auto-width (px-8) on desktop
- Position: Bottom of form, right-aligned on desktop

**Secondary Actions (if needed):**
- Ghost or outline variants
- Paired with primary for cancel/reset options

### Feedback & Validation

**Success States:**
- Toast notification: "Coleta salva com sucesso!"
- Brief highlight of saved row in dashboard (if visible)

**Error States:**
- Inline validation below inputs
- Summary at top of form for multiple errors
- Clear, specific Portuguese messages

**Loading States:**
- Button spinner during submission
- Skeleton rows in tables during data fetch
- Minimal animation (opacity transitions only)

---

## Responsive Behavior

### Breakpoints (Tailwind Standards)
- Mobile: < 640px (base)
- Tablet: 640px - 1024px (sm/md)
- Desktop: > 1024px (lg+)

### Mobile Optimization
- Single-column forms always
- Full-width buttons
- Sticky headers in tables
- Horizontal scroll for wide tables
- Larger tap targets (min-h-12 for form controls)

### Desktop Optimization
- Two-column form layout for faster completion
- Side-by-side tab content and filter options
- More table columns visible without scroll
- Right-aligned action buttons

---

## Accessibility Standards

- **Form Inputs:** All with explicit labels (not just placeholders)
- **Focus States:** Clear focus indicators on all interactive elements (Coss UI defaults)
- **Keyboard Navigation:** Tab order follows visual hierarchy
- **ARIA Labels:** Descriptive labels for screen readers on icon-only buttons
- **Error Announcements:** aria-live regions for validation messages
- **Minimum Touch Targets:** 44px minimum for mobile interactions

---

## Images

**No images required.** This is a pure data-entry and visualization application. All visual communication is achieved through typography, layout, and Coss UI components. The industrial context does not benefit from decorative imagery.

---

## Animation & Motion

**Minimal Animation Policy:**
- Tab transitions: Simple opacity fade (200ms)
- Form validation: Slide-in error messages (150ms)
- Toast notifications: Slide from top (300ms)
- NO hover effects beyond Coss UI defaults
- NO scroll-triggered animations
- NO loading spinners except during async operations

---

## Distinctive Design Choices

1. **Efficiency Grid:** Two-column form layout on desktop reduces scroll and speeds data entry
2. **Numeric Right-Align:** All numeric inputs and data cells right-aligned for natural comparison
3. **Inline Form Context:** Selected line number shown prominently in dynamic form header
4. **Smart Defaults:** Date picker defaults to today, encouraging real-time logging
5. **Monospace Data:** Tabular numeric data uses monospace for column alignment integrity