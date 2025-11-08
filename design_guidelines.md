# EcoGuardian — Design Guidelines

## Design Approach

**Hybrid Approach**: Drawing inspiration from modern sustainability platforms (Ecosia, Tomorrow Bank) + productivity dashboards (Linear, Notion) with Material Design principles for data-rich interfaces. The design should feel both professional and environmentally conscious, balancing utility with emotional connection to environmental impact.

## Core Design Elements

### Typography
- **Primary Font**: Inter or DM Sans (Google Fonts) - clean, modern, readable
- **Headings**: Bold weights (600-700), sizes: text-4xl (hero), text-3xl (page titles), text-2xl (section headers), text-xl (card headers)
- **Body**: Regular weight (400), text-base for primary content, text-sm for secondary info
- **Data/Numbers**: Tabular nums, semibold (600) for emphasis on carbon metrics

### Layout System
**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** (p-2, gap-4, mt-6, mb-8, py-12, space-y-16)
- **Container**: max-w-7xl for main content areas
- **Dashboard grid**: 12-column grid system with gap-6
- **Card padding**: p-6 for standard cards, p-8 for feature cards
- **Section spacing**: py-12 (mobile), py-16 (desktop)

## Page-Specific Layouts

### Landing Page
**Hero Section** (60vh):
- Large hero image: Vibrant aerial shot of green forest meeting blue ocean or wind turbines in lush landscape
- Semi-transparent overlay with centered content
- Large headline (text-5xl) emphasizing AI-powered carbon tracking
- Subheading explaining the value proposition
- Two CTAs: Primary "Start Tracking" (glass-morphism button with blur), Secondary "Learn More" (outlined)
- Live carbon counter or global impact stats floating card (bottom-right corner)

**Sections** (5-7 total):
1. **How It Works** (3-column grid): Icons + title + description for Track → Analyze → Reduce flow
2. **Features Showcase** (asymmetric 2-column): Alternating image-left/text-right showcasing dashboard, chatbot, map
3. **Impact Stats** (4-column grid): Bold numbers with descriptions (Users, CO2 Saved, Trees Planted, etc.)
4. **AI Chatbot Preview**: Embedded chat interface demo with sample conversation
5. **Sustainable Products** (horizontal scrolling cards): Product images with eco-badges
6. **Testimonials** (3-column cards): User photos, quotes, carbon reduction stats
7. **CTA Section**: Bold centered call-to-action with background pattern

### Dashboard (Post-Login)
**Layout Structure**:
- **Sidebar** (fixed, w-64): Navigation with icons, profile section, carbon score widget
- **Main Content** (flex-1): Top bar with search/notifications + dynamic content area

**Dashboard Home**:
- **Top Row**: 4 KPI cards (gap-6) showing Total Carbon, This Month, Goal Progress, Rank with icons and trend indicators
- **Main Grid** (2-column on desktop):
  - Left: Carbon footprint chart (full-width card with tabs for Daily/Weekly/Monthly)
  - Right: Activity breakdown (pie chart), Recent actions list
- **Bottom Row**: 3-column layout for Category breakdown cards (Transportation, Energy, Food)

### Carbon Calculator
- **Multi-step form** with progress indicator at top
- **Category cards** (2-column grid): Large icons, category name, "Calculate" button
- **Input forms**: Clean, spacious with labels above inputs, helper text below
- **Live preview sidebar**: Shows running total as user inputs data

### Map Module
- **Full-width map** (h-96 on desktop) with custom green/blue theme
- **Floating search bar** (top-center, glass-morphism)
- **Location cards** (overlay, left sidebar): Scrollable list with images, ratings, distance
- **Filter chips** (top-left): Charging Stations, Recycling Centers, Green Businesses, Farmers Markets

### Chatbot Interface
- **Split layout** (60/40): Chat on left, suggested tips/actions on right
- **Chat bubbles**: User (right-aligned), AI (left-aligned with avatar)
- **Input bar** (bottom, sticky): Large text area, send button, quick actions
- **Suggested prompts**: Chips above input for common questions

### Product Recommendations
- **Masonry grid layout** (3 columns desktop, 2 tablet, 1 mobile)
- **Product cards**: Image (aspect-video), eco-score badge, title, price, carbon savings, CTA
- **Filter sidebar** (left): Category, price range, carbon impact sliders
- **Sort controls** (top-right): Dropdown for relevance/savings/price

## Component Library

### Navigation
- **Top Nav**: Logo left, nav links center, user avatar/notifications right
- **Sidebar**: Icon + label (collapsed on mobile), active state indicator, section dividers

### Cards
- **Standard**: Rounded-xl, subtle shadow, p-6, hover:shadow-lg transition
- **Stat Cards**: Large number (text-3xl), label, trend icon, mini chart
- **Interactive Cards**: Hover lift effect, clickable with arrow/chevron

### Forms (Critical - Login/Signup)
- **Input Fields**: Border-2, rounded-lg, p-3, focus:ring-2 transition, labels (text-sm, mb-2)
- **Ensure**: No overlays blocking inputs, z-index properly managed, inputs fully interactive
- **Buttons**: Full-width for primary actions, rounded-lg, py-3, semibold text

### Data Visualization
- Use Chart.js or Recharts for line/bar/pie charts
- **Chart cards**: White background, title + time selector in header, chart in body
- **Mini charts**: Sparklines in stat cards

### Buttons
- **Primary**: Solid with hover:brightness effect
- **Secondary**: Outlined with hover:background
- **Glass-morphism** (on images): backdrop-blur-md, bg-white/10, border-white/20

## Images

### Hero Image
- **Type**: Wide landscape (16:9 aspect ratio)
- **Content**: Vibrant environmental scene - pristine forest with morning mist, solar panels in golden hour, or coastal wind farm
- **Treatment**: Slight darkening overlay (bg-black/30) for text contrast

### Feature Sections
- **Dashboard mockup**: Screenshot of actual dashboard showing charts and data
- **Map interface**: Preview of interactive map with markers
- **Chatbot interaction**: Clean screenshot of chat conversation
- **Product grid**: Actual sustainable product images (reusable bottles, solar chargers, eco-bags)

### Icons
- **Library**: Heroicons (outline for nav, solid for emphasis)
- **Custom eco-icons**: Use icon placeholders for leaf, recycling, solar, wind, tree, bike, etc.

## Accessibility
- Form labels always visible and associated with inputs
- Sufficient color contrast for all text (WCAG AA minimum)
- Focus indicators on all interactive elements
- Keyboard navigation fully supported throughout

## Animations
**Minimal and purposeful**:
- Smooth transitions on hover/focus (150-300ms)
- Chart data entrance animations (stagger)
- Page transitions: Fade or slide (200ms)
- **No**: Distracting parallax, excessive scroll animations, or auto-playing elements