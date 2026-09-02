---
name: Luminous Tech
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dadf'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f9'
  surface-container: '#ebeef3'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#e0e3e8'
  on-surface: '#181c20'
  on-surface-variant: '#464554'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f6'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#4c4ad6'
  primary: '#4341cd'
  on-primary: '#ffffff'
  primary-container: '#5d5ce7'
  on-primary-container: '#f4f1ff'
  inverse-primary: '#c1c1ff'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fedb4a'
  on-secondary-container: '#735f00'
  tertiary: '#8b4200'
  on-tertiary: '#ffffff'
  tertiary-container: '#b05500'
  on-tertiary-container: '#fff0e8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c1c1ff'
  on-primary-fixed: '#0a006b'
  on-primary-fixed-variant: '#322dbe'
  secondary-fixed: '#ffe172'
  secondary-fixed-dim: '#e6c434'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#554600'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733500'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#e0e3e8'
  electric-indigo: '#5D5CE7'
  vivid-yellow: '#FFDB4A'
  deep-onyx: '#212529'
  soft-gray: '#F8F9FA'
typography:
  display-lg:
    fontFamily: DM Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: DM Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: DM Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: DM Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: DM Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system is built for a modern, creative technology aesthetic that balances high-energy innovation with professional clarity. It targets a creative, tech-savvy audience—startups, digital agencies, and software platforms—who value forward-thinking tools. 

The design style is **Corporate Modern with a Creative Edge**. It utilizes clean, expansive layouts typical of premium SaaS products but injects personality through vibrant "electric" color accents and subtle glassmorphism. The emotional response should be one of confidence, speed, and creative inspiration. It avoids the heaviness of traditional enterprise software by using generous whitespace, crisp geometry, and high-contrast focal points.

## Colors

The palette is driven by a high-contrast relationship between **Electric Indigo** and **Deep Onyx**. 

- **Primary (Electric Indigo):** Used for primary actions, active states, and brand-identifying motifs. It represents intelligence and modern technology.
- **Secondary (Vivid Yellow):** A high-visibility accent color used sparingly for attention-grabbing elements, notifications, or "spark" moments in graphics.
- **Neutral (Deep Onyx):** Provides the structural foundation. It is used for primary text and high-contrast surfaces to ensure maximum legibility.
- **Background:** Primarily white to maintain a clean, airy feel, with a "Soft Gray" variant used to define content zones and containers.

## Typography

The typography relies exclusively on **DM Sans** to achieve a sleek, geometric, and low-contrast look that feels inherently digital. 

- **Headlines:** Use tight letter-spacing and heavy weights (600-700) to create a strong visual hierarchy. Large display sizes are reserved for hero sections and impact statements.
- **Body Text:** Standardized on 16px and 18px for readability. The line height is intentionally open (1.6) to prevent density and maintain the "airy" feel of the system.
- **Labels:** Uppercase styling is recommended for `label-md` to differentiate functional text (like tags or section headers) from narrative body copy.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop and a **Fluid Grid** for mobile devices. 

- **Grid:** A 12-column grid is used for desktop (1280px max-width), providing flexibility for complex dashboard layouts or simple marketing stacks.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Responsive Behavior:** 
    - **Desktop (>1024px):** 48px outer margins, 24px gutters.
    - **Tablet (768px - 1023px):** 32px outer margins, 20px gutters.
    - **Mobile (<767px):** 16px outer margins, 16px gutters. Stack all multi-column content into a single column unless using horizontally scrolling cards.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** supplemented by **Ambient Shadows**.

- **Surfaces:** Use white as the base surface. Secondary "container" surfaces use a subtle `soft-gray` (#F8F9FA) to separate content sections without using harsh borders.
- **Shadows:** Shadows are highly diffused and soft. Use a multi-layered approach with a small blur for proximity and a large, low-opacity (8-10%) spread to create a sense of floating.
- **Interactive Depth:** When an element is hovered, the shadow should expand slightly and the element should translate -4px vertically to simulate physical elevation.
- **Glassmorphism:** Use sparingly for navigation bars or floating modals. Apply a 20px backdrop blur with a semi-transparent white (opacity 80%) to maintain context of the background content.

## Shapes

The shape language is consistently **Rounded**, reflecting a friendly yet precise technological feel. 

- **Base Radius (0.5rem):** Applied to standard buttons, input fields, and small cards.
- **Large Radius (1rem):** Applied to large containers, featured cards, and modals.
- **Pill Radius:** Specifically reserved for tags, chips, and "badge" style indicators to provide a distinct visual contrast against rectangular UI elements.
- **Interactive elements:** Maintain consistent corner radii across all states (default, hover, focus) to ensure stability.

## Components

- **Buttons:** 
    - **Primary:** Solid `electric-indigo` with white text. No border.
    - **Secondary:** Transparent background with `electric-indigo` border and text. 
    - **Ghost:** No background or border; `deep-onyx` text that shifts to `electric-indigo` on hover.
- **Input Fields:** Use a 1px border of `soft-gray`. On focus, transition the border to `electric-indigo` and add a subtle glow using the primary color at 15% opacity.
- **Cards:** White background, 1rem border-radius, and a soft ambient shadow. Cards should have generous internal padding (min 24px).
- **Chips/Tags:** Pill-shaped. Use `soft-gray` background with `deep-onyx` text for neutral categories, and light-tinted `electric-indigo` for active or highlighted categories.
- **Navigation:** Top-mounted, fixed, using the glassmorphism blur effect. Link items use `label-md` styling and animate a small indigo underline on hover.
- **Lists:** Clean, borderless rows separated by 1px `soft-gray` dividers. Use icons in `electric-indigo` to denote list items or bullet points.