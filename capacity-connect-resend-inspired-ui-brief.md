# Capacity Connect — Resend-Inspired UI/UX Redesign Brief

## Objective

Redesign the existing **Capacity Connect** web application so it feels like a premium, editorial, highly-crafted SaaS product inspired by the visual language of **Resend**.

The goal is **not to clone Resend**. Reinterpret the design principles visible in the provided reference:

- near-black cinematic backgrounds
- large editorial typography
- restrained color usage
- premium monochrome visual hierarchy
- subtle gradients and atmospheric lighting
- generous whitespace
- minimal navigation
- sophisticated motion
- realistic product visuals instead of generic AI-generated illustrations
- strong typography and composition
- quiet, confident UI rather than "dashboard template" aesthetics

The result should look like a real startup/product designed by a strong product-design team, not a generic AI-generated SaaS website.

---

# 1. NON-NEGOTIABLE DESIGN DIRECTION

## Overall aesthetic

Use this mental model:

> **Resend × Linear × premium developer-tool landing page × modern enterprise capability platform**

The website should feel:

- premium
- technical
- intelligent
- calm
- cinematic
- mature
- minimal
- trustworthy
- slightly futuristic

Avoid making it feel:

- playful
- bubbly
- overly colorful
- corporate PowerPoint-like
- template-like
- "AI SaaS landing page"
- generic purple-gradient startup
- over-carded
- filled with floating icons

The UI should have **visual confidence**. Fewer things should be on screen, but every visible element should feel intentional.

---

# 2. MOST IMPORTANT CHANGE FROM THE CURRENT UI

The current interface has the typical generated-SaaS structure:

- split-screen white layout
- large marketing copy on the left
- feature list with icon boxes
- three role cards
- purple borders
- purple glow around CTA
- generic icons
- lots of rounded rectangles

DO NOT preserve that visual language.

Move toward:

- dark immersive canvas
- typography-led hierarchy
- restrained surfaces
- fewer cards
- stronger composition
- cinematic background visual
- high-quality motion
- tiny details
- subtle borders instead of thick colorful outlines

The interface should have **less UI chrome** and more visual atmosphere.

---

# 3. COLOR SYSTEM

## Primary background

Use a nearly-black background.

Recommended base:

```css
--background: #050505;
--background-elevated: #0a0a0a;
--surface: #0f0f10;
--surface-hover: #151516;
```

Do not use pure black everywhere. Create extremely subtle tonal variation.

## Text

Primary:

```css
--foreground: #f5f5f5;
```

Secondary:

```css
--muted: #9a9a9a;
```

Tertiary:

```css
--subtle: #666666;
```

## Borders

Keep borders extremely subtle:

```css
--border: rgba(255,255,255,0.10);
--border-strong: rgba(255,255,255,0.16);
```

No bright purple borders around every selected component.

## Brand accent

Capacity Connect can retain a recognizable accent, but it should become much more sophisticated.

Use purple/violet sparingly:

```css
--accent: #8b5cf6;
```

Potential secondary accent:

```css
--accent-soft: #a78bfa;
```

Accent usage should primarily appear in:

- tiny highlights
- active states
- data visualization
- subtle gradients
- hover states
- key interactive moments

Do NOT make the whole page purple.

---

# 4. TYPOGRAPHY

Typography is one of the most important changes.

The reference design works because the hero typography feels editorial rather than like a typical SaaS dashboard.

## Recommended font strategy

Use a high-quality sans-serif for interface/body text.

Good choices:

- Inter
- Geist
- Manrope
- IBM Plex Sans

For major hero headlines, consider a refined serif/editorial font if the project permits it.

Possible choices:

- Instrument Serif
- DM Serif Display
- Playfair Display

A serif headline can make the product feel substantially more premium.

Example:

```text
Build stronger
capabilities.
```

or

```text
Make your
workforce
more capable.
```

The headline should be large, confident and carefully spaced.

## Typography rules

Hero headline:

- very large
- tight line-height
- slightly negative letter-spacing
- 64–96px desktop where appropriate
- 42–56px tablet
- 36–44px mobile

Body:

- 16–20px
- generous line-height
- muted white/gray

Navigation:

- 14–15px
- medium weight
- low contrast until hover

Do not use excessive bold text everywhere.

---

# 5. GLOBAL PAGE STRUCTURE

The website should feel like one continuous visual composition.

Suggested structure:

```text
┌──────────────────────────────────────────────┐
│ CAPACITY CONNECT        Product  Resources   │
│                         Enterprise   Log in  │
│                                   [Get started]│
│                                              │
│                                              │
│      Small announcement / eyebrow            │
│                                              │
│      Build stronger                           │
│      capabilities.                            │
│                                              │
│      AI-powered workforce intelligence       │
│      for modern teams.                       │
│                                              │
│      [Get started]   [Explore platform]       │
│                                              │
│                    CINEMATIC VISUAL           │
│                   / PRODUCT OBJECT            │
│                                              │
└──────────────────────────────────────────────┘
```

Do not make every section look like a separate white card.

The page should feel like a single art-directed experience.

---

# 6. NAVIGATION

Take inspiration from the restrained navigation of Resend.

## Desktop

Navigation should be horizontally centered or cleanly distributed.

Example:

```text
CAPACITY CONNECT

Platform     Solutions     Enterprise     Resources
                                                Log in
                                      [Get started]
```

Keep navigation height approximately:

```text
64–76px
```

Use a subtle translucent/blurred background only when appropriate.

### Navigation behavior

At the top:

- transparent
- blends into the hero

After scrolling:

- very subtle background opacity
- `backdrop-filter: blur(...)`
- thin bottom border
- smooth transition

Do not use giant colorful nav buttons.

---

# 7. HERO SECTION

The hero is the most important part.

The screenshot reference uses:

- tiny announcement pill
- huge typography
- restrained description
- simple CTA
- cinematic 3D/product visual

Recreate the **composition**, not the exact artwork.

## Capacity Connect hero example

Eyebrow:

```text
AI-POWERED WORKFORCE INTELLIGENCE →
```

Headline:

```text
Build stronger
capabilities.
```

Alternative:

```text
Turn workforce data
into better teams.
```

Supporting text:

```text
Understand skills, identify capability gaps,
and build smarter growth paths across your organization.
```

CTA:

```text
Get started
```

Secondary CTA:

```text
Explore platform →
```

---

# 8. HERO VISUAL

This is extremely important.

Do NOT use:

- generic blob
- glowing orb
- floating purple spheres
- random AI illustration
- stock photo
- generic dashboard screenshot pasted into a card

Instead create a bespoke visual representing **capability intelligence**.

Possible concepts:

### Concept A — Capability lattice

A dark 3D structure made of interconnected nodes representing:

```text
People
  ↓
Skills
  ↓
Capabilities
  ↓
Teams
  ↓
Readiness
```

The object can gently rotate or move.

### Concept B — Capability graph

A dense network/graph with:

- tiny luminous points
- thin connecting lines
- clusters
- skill labels
- subtle motion

### Concept C — Abstract 3D capability core

A sculptural monochrome object made from:

- metallic blocks
- glass
- dark chrome
- translucent material
- tiny violet highlights

The reference screenshot succeeds because the hero visual looks like a designed object. Capacity Connect needs the same level of visual intentionality.

---

# 9. BACKGROUND ATMOSPHERE

The reference uses a very subtle cinematic environment.

Implement:

- radial lighting
- soft gradients
- subtle grain/noise
- faint shadow
- deep black-to-charcoal transitions

Example:

```css
background:
  radial-gradient(
    circle at 70% 40%,
    rgba(120, 80, 180, 0.10),
    transparent 35%
  ),
  #050505;
```

Keep this extremely subtle.

The user should notice the atmosphere before noticing the gradient.

---

# 10. GRAIN / FILM TEXTURE

Consider adding a barely visible grain overlay.

Use:

- CSS noise
- SVG noise
- tiny procedural texture

Opacity should be extremely low:

```text
0.025–0.05
```

The purpose is to prevent the black background from looking like a flat CSS rectangle.

---

# 11. BUTTON DESIGN

Replace the current giant glowing purple button.

Buttons should feel tactile and understated.

Primary:

```text
┌──────────────────┐
│   Get started →  │
└──────────────────┘
```

Use:

- dark/light neutral surface
- subtle border
- tiny hover elevation
- smooth background transition

Example:

```css
background: rgba(255,255,255,0.08);
border: 1px solid rgba(255,255,255,0.14);
```

Hover:

- slightly brighter
- 1–2px translation
- subtle shadow

Avoid:

```css
box-shadow: 0 0 40px purple;
```

That creates the generic AI-SaaS appearance.

---

# 12. ROLE SELECTION UI

This is the biggest area that needs redesign.

Current:

```text
Learner
Trainer
Manager
```

inside large conventional cards.

Instead make it feel more like a premium onboarding interaction.

## Option A — Editorial role selector

Screen:

```text
How will you use
Capacity Connect?

Choose the path that fits your work.

01   LEARNER
     Build the skills that move your career forward.

02   TRAINER
     Design learning experiences that actually work.

03   MANAGER
     Understand team capability and readiness.
```

Each row can expand/activate.

Selected row gets:

- brighter text
- subtle accent line
- understated violet indicator
- slight motion

Example:

```text
01  LEARNER                         →
────────────────────────────────────────
    Build skills and grow your career.
```

This is preferable to three large pastel cards.

## Option B — Large asymmetric choices

Use three large text-based choices rather than identical cards.

Example:

```text
             CHOOSE YOUR ROLE

      LEARNER
      Build your capability.
      →

                 TRAINER
                 Develop others.
                 →

      MANAGER
      Build stronger teams.
      →
```

Layout can be slightly asymmetric to create visual personality.

---

# 13. AUTHENTICATION / LOGIN FLOW

Since Capacity Connect has multiple user roles, do NOT make login screens visually disconnected from the rest of the product.

All authentication pages should share the same design system.

## Login screen

Dark canvas.

Centered content:

```text
CAPACITY CONNECT

Welcome back.

Continue to your workspace.

[ Continue with Google ]

or

Email
[________________________]

Password
[________________________]

              Sign in →
```

Subtle links:

```text
Forgot password?
Don't have an account? Create one
```

Do not put the form inside a giant white rounded rectangle.

Instead, use:

- dark background
- compact form column
- subtle separators
- premium typography

---

# 14. SIGN-UP FLOW

The signup experience should be multi-step.

### Step 1

```text
Let's get you set up.
```

### Step 2

```text
What best describes your work?
```

### Step 3

```text
What are you trying to improve?
```

### Step 4

```text
Your workspace is ready.
```

Use a tiny progress indicator:

```text
01 — 02 — 03 — 04
```

Keep the UI highly focused.

Only one decision per screen.

---

# 15. LEARNER / TRAINER / MANAGER DASHBOARDS

The premium landing page should transition into a similarly polished application.

Do not create a standard:

```text
Sidebar
Dashboard
10 cards
Purple buttons
Pie charts everywhere
```

Instead build a **data-dense but calm interface**.

## Learner

Hero metric:

```text
Your capability trajectory

↑ 14% this quarter
```

Then:

```text
Capability
██████████████████░░

Communication
████████████████░░░░

Leadership
██████████████░░░░░░

Data Fluency
███████████████████░
```

## Manager

Focus on:

- team readiness
- capability gaps
- skill clusters
- workforce trends
- recommended interventions

## Trainer

Focus on:

- learner cohorts
- training effectiveness
- skill outcomes
- curriculum gaps
- completion and growth

Use visual hierarchy instead of dozens of cards.

---

# 16. DATA VISUALIZATION STYLE

Charts should feel premium.

Avoid:

- rainbow charts
- thick chart fills
- huge circular pie charts
- excessive gradients

Use:

- thin lines
- subtle grid
- monochrome base
- one accent color
- smooth motion

Think:

```text
            ╭───────╮
        ╭───╯       ╰────
   ─────╯
```

Charts should animate gently when entering viewport.

---

# 17. CARDS

Cards are allowed, but use fewer of them.

Rules:

- dark surface
- 1px subtle border
- small radius
- no giant shadows
- no colorful backgrounds
- no icon inside a pastel square unless absolutely necessary

Instead of:

```text
┌────────────────────┐
│ [purple icon box]  │
│                    │
│ AI Skill Analysis  │
│                    │
│ description...     │
└────────────────────┘
```

Prefer:

```text
AI SKILL ANALYSIS                         →

Discover hidden capability gaps
across your organization.
```

with a thin separator.

---

# 18. ICONOGRAPHY

The current icon boxes look generic.

Replace them with a consistent icon system.

Preferred:

- Lucide
- Phosphor
- custom minimal line icons

Icons should:

- be small
- have consistent stroke width
- have low visual priority
- appear when they actually improve comprehension

Do not put an icon in every section merely to decorate it.

---

# 19. ANIMATION SYSTEM

Motion is a major part of the visual quality.

Animations should feel intentional, not flashy.

## Page entrance

Hero elements can rise/fade in:

```text
opacity: 0 → 1
transform: translateY(20px) → 0
```

Stagger:

```text
eyebrow
headline
description
buttons
visual
```

with ~60–120ms intervals.

## Hover

Buttons:

- 150–250ms

Navigation:

- subtle opacity change

Role selection:

- underline/indicator animation
- slight translation

## Scroll

Use subtle:

- parallax
- reveal
- scale
- opacity transitions

Do not over-animate everything.

---

# 20. HERO 3D / CANVAS INTERACTION

If feasible, use:

- Three.js
- React Three Fiber
- CSS 3D
- WebGL

for the hero visual.

The object should:

- slowly rotate
- respond slightly to mouse movement
- have soft lighting
- remain primarily monochrome
- have tiny accent highlights

Interaction should be subtle:

```text
mouse movement
      ↓
tiny object rotation
      ↓
soft lighting shift
```

Never turn the hero into a gimmicky game.

---

# 21. RESPONSIVE DESIGN

Desktop is the visual priority, but the design must collapse elegantly.

## Desktop

Wide cinematic composition.

Hero:

```text
55% typography
45% visual
```

## Tablet

Stack the visual below the text.

## Mobile

Do NOT simply shrink the desktop.

Use:

```text
CAPACITY CONNECT

Build stronger
capabilities.

Supporting copy...

[Get started]

[Explore platform]

        ↓

[Hero visual]
```

Role selection should become a vertically spaced editorial list.

---

# 22. SPACING SYSTEM

Use a deliberate spacing system.

Suggested:

```text
4
8
12
16
24
32
48
64
80
96
128
160
```

Hero should have large vertical breathing room.

Avoid squeezing components together.

The screenshot feels premium partly because there is **space around everything**.

---

# 23. BORDER RADIUS

Do not over-round everything.

Use approximately:

```text
Buttons: 10–12px
Inputs: 10–12px
Small cards: 12–16px
Large surfaces: 16–20px
```

Avoid:

```text
border-radius: 9999px
```

on everything.

Pills should only be used for:

- tags
- announcements
- small status indicators

---

# 24. AVOID THESE UI PATTERNS

Absolutely avoid:

❌ giant purple gradients

❌ glowing purple CTA buttons

❌ white background + purple cards

❌ three identical rounded feature cards

❌ random floating blobs

❌ excessive glassmorphism

❌ generic AI-generated illustrations

❌ giant icon boxes

❌ excessive drop shadows

❌ every element inside a rounded rectangle

❌ rainbow charts

❌ unnecessary badges

❌ "Trusted by 10,000+ companies" fake-looking marketing sections

❌ meaningless metrics

❌ overly rounded typography

❌ excessive use of Inter Bold everywhere

---

# 25. WHAT TO KEEP FROM THE EXISTING PRODUCT

Do NOT redesign the actual product concept.

Preserve:

- Capacity Connect branding
- Learner role
- Trainer role
- Manager role
- capability/skill intelligence concept
- personalized growth
- workforce insights
- existing backend/API functionality
- existing data models
- existing authentication functionality
- existing routing where practical

The redesign should primarily improve:

- visual hierarchy
- interaction design
- typography
- layout
- motion
- branding
- onboarding
- perceived quality

---

# 26. DESIGN TOKENS

Create a reusable design-token system.

Example:

```css
:root {
  --cc-bg: #050505;
  --cc-bg-elevated: #0a0a0a;

  --cc-surface: rgba(255,255,255,0.045);
  --cc-surface-hover: rgba(255,255,255,0.075);

  --cc-text: #f5f5f5;
  --cc-text-muted: #999999;
  --cc-text-subtle: #626262;

  --cc-border: rgba(255,255,255,0.10);
  --cc-border-hover: rgba(255,255,255,0.16);

  --cc-accent: #8b5cf6;
  --cc-accent-soft: #a78bfa;

  --cc-radius-sm: 8px;
  --cc-radius-md: 12px;
  --cc-radius-lg: 16px;

  --cc-max-width: 1280px;
}
```

Centralize these values.

Do not hard-code random values throughout components.

---

# 27. COMPONENT ARCHITECTURE

Create reusable components such as:

```text
Navbar
AnnouncementPill
Hero
HeroVisual
PrimaryButton
SecondaryButton
RoleSelector
RoleOption
SectionHeading
CapabilityGraph
CapabilityMetric
TrendChart
FeatureRow
Footer
AuthLayout
LoginForm
SignupFlow
```

The visual system must be shared between:

- marketing pages
- role selection
- authentication
- dashboards

This prevents the application from feeling like several unrelated designs.

---

# 28. LANDING PAGE CONTENT DIRECTION

Suggested sections:

## Hero

```text
Build stronger capabilities.

AI-powered intelligence for understanding
skills, people, and workforce readiness.
```

## Capability Intelligence

```text
See what your workforce can do.
And where it needs to grow.
```

Use an animated capability graph.

## Personalized Growth

```text
Turn skill gaps into
clear growth paths.
```

Show a sophisticated learning/capability trajectory.

## Workforce Intelligence

```text
From individual skills
to organizational readiness.
```

Show a team capability visualization.

## Role-specific CTA

```text
One platform.
Different paths.
```

Then:

```text
Learner     Trainer     Manager
```

---

# 29. MICROCOPY

Keep copy short and confident.

Avoid:

> Unlock powerful AI-powered solutions that empower your organization to optimize workforce capability and drive meaningful growth.

Prefer:

> Understand skills.
> Find gaps.
> Build stronger teams.

Short copy looks substantially more premium.

---

# 30. PERFORMANCE

The visual quality should not come at the expense of performance.

Requirements:

- lazy-load 3D assets
- optimize images
- use compressed WebP/AVIF where appropriate
- avoid huge background videos unless essential
- respect `prefers-reduced-motion`
- keep animations GPU-friendly
- avoid unnecessary JavaScript animation libraries
- preserve fast initial page load

---

# 31. ACCESSIBILITY

Maintain:

- keyboard navigation
- visible focus states
- semantic HTML
- sufficient text contrast
- accessible labels
- reduced-motion support

The dark design must remain readable.

---

# 32. IMPLEMENTATION WORKFLOW

Before changing code:

1. Inspect the existing repository.
2. Identify the framework and styling system.
3. Identify existing routes/components.
4. Identify current authentication flow.
5. Identify reusable logic that must not be broken.
6. Identify the role-selection component.
7. Identify current assets.

Then:

1. Build the design token system.
2. Create the global typography/background system.
3. Redesign navigation.
4. Redesign hero.
5. Build the visual/3D hero asset.
6. Redesign role selection.
7. Redesign authentication pages.
8. Update dashboard surfaces.
9. Add motion.
10. Test mobile responsiveness.
11. Check accessibility.
12. Remove old visual patterns.

Do not rewrite functional backend logic merely to achieve the redesign.

---

# 33. CRITICAL INSTRUCTION FOR AI CODING AGENTS

You are working from a **visual reference**, not a request to copy the reference literally.

Use the reference as inspiration for:

- composition
- visual hierarchy
- typography
- darkness
- restraint
- atmosphere
- spacing
- motion
- quality level

DO NOT reproduce:

- Resend's logo
- Resend's exact copy
- Resend's exact navigation labels
- Resend's exact hero object
- Resend's exact layout pixel-for-pixel
- Resend's brand identity

Capacity Connect must have its **own identity**.

---

# 34. VISUAL QUALITY BAR

Before considering the redesign complete, compare every major screen against this checklist:

### Does it look like a premium product?

### Does it look intentionally designed?

### Does it avoid generic AI SaaS patterns?

### Is the typography doing most of the visual work?

### Are there enough large areas of whitespace?

### Are colors restrained?

### Are accents used sparingly?

### Do animations feel expensive and subtle?

### Does the product have an identifiable visual identity?

### Would the screenshot look believable on a modern startup's website?

If the answer is no, iterate.

---

# 35. FINAL CREATIVE DIRECTION

The intended feeling is:

> **"A serious workforce intelligence company built for the future."**

Not:

> "An AI-generated HR dashboard."

Make Capacity Connect feel like a product someone would confidently put on a laptop in a boardroom, while still being modern enough to feel like a next-generation software company.

The design should communicate:

**Intelligence. Capability. Precision. Growth. Trust.**

Use darkness, typography, space, subtle motion and bespoke visualizations to communicate those qualities.

---

# 36. PRIORITY ORDER

When tradeoffs are necessary, prioritize:

1. Typography
2. Hero composition
3. Overall spacing
4. Background atmosphere
5. Navigation
6. Role selection experience
7. Product visualization
8. Motion
9. Component styling
10. Decorative details

Do not spend time polishing tiny icons while the hero still looks generic.

---

# 37. DEFINITION OF DONE

The redesign is complete only when:

- the first screen immediately looks premium
- the old white/purple onboarding appearance is gone
- the hero is visually memorable
- role selection feels intentional
- login/signup feels like part of the same product
- dashboards share the same design language
- the UI is responsive
- animations are smooth
- there are no obvious generic AI-SaaS patterns
- all existing functionality continues to work

## One-line design brief

> **Redesign Capacity Connect as a cinematic, typography-led, dark premium workforce-intelligence platform inspired by the restraint and craft of Resend, while preserving Capacity Connect's own brand, roles, functionality and product identity.**
