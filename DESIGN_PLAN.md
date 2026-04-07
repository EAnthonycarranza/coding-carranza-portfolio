# Design Improvement Plan: Modern & Professional Portfolio

The goal is to transform the current portfolio from a basic, functional site into a premium, modern experience. We will focus on typography, color depth, interactive elements, and layout refinements.

## 1. Visual Identity & Theme (Global)
- **Refined Color Palette:** Move from pure white/black to a more sophisticated dark/light mode friendly palette. Use deep slates and softer whites.
- **Enhanced Accent:** Evolve the green accent (`#16a34a`) with gradients and glows.
- **Typography:** Ensure Geist Sans is properly utilized with better line-heights and letter-spacing for a "tech-forward" feel.
- **Gradients & Blurs:** Introduce subtle background mesh gradients and "glassmorphism" for cards.

## 2. Global Layout Enhancements (`src/app/layout.tsx`, `Navbar.tsx`, `Footer.tsx`)
- **Sticky Glass Navbar:** A blurred, translucent header that stays at the top.
- **Animated Background:** Subtle ambient blobs or a grain texture to add depth.
- **Smooth Scrolling:** Enable smooth scroll behavior.

## 3. Page-Specific Improvements

### Home Page (`src/app/page.tsx`)
- **Hero Overhaul:** 
  - Dynamic text with better hierarchy.
  - The profile image will have a multi-layered glow and subtle hover animation.
  - Background "glow" behind the hero content.
- **Services Grid:**
  - "Glass" cards with subtle border-glows on hover.
  - Refined iconography.
- **Featured Projects:**
  - Modernized grid with staggered entry animations (via CSS).

### Projects & Project Detail (`src/app/projects/page.tsx`, `[slug]/page.tsx`)
- **Project Card:**
  - Hover effects that lift the card and add a soft shadow.
  - Better tag styling for technologies.
- **Detail Page:**
  - Hero header for the project title.
  - Structured "Project Stats" (Client, Date, Tech) in a sidebar-like layout on desktop.

### About & Contact (`src/app/about/page.tsx`, `src/app/contact/page.tsx`)
- **About:** Better use of white space and perhaps a "Timeline" or "Skills" grid.
- **Contact:** A modern, clean form with focus states that glow in the accent color.

## 4. Implementation Strategy (Plan -> Act -> Validate)

1.  **Phase 1: Foundation (Global CSS)**
    - Update `globals.css` with new variables, utility classes, and base styles.
2.  **Phase 2: Layout & Components**
    - Refactor `Navbar` and `Footer`.
    - Update `ProjectCard` for a more premium look.
3.  **Phase 3: Page Overhauls**
    - Home Page first (highest impact).
    - Projects/About/Contact pages.
4.  **Phase 4: Animations & Polish**
    - Add micro-interactions (hover states, transitions).
    - Final responsive check.

---

**Do you approve of this design direction? I will focus on a "Modern Tech" aesthetic (dark-themed hero, clean typography, subtle glows).**
