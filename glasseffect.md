# Liquid Glass Navbar - Reusable Prompt

Use the prompt below to recreate the Tinkerbits liquid-glass navbar on any site. It describes the actual implementation shipped in this repo (13 Nov 2026), not generic frosted glass.

---

Make the site's top navbar a floating liquid-glass bar with real lens refraction of the content behind it, not a frosted blur.

**Layout**
- A rounded-rectangle bar (16px radius, 14px on mobile), sticky at the top with a small gap (12px desktop, 8px mobile), always visible while scrolling, high z-index.
- Add `scroll-padding-top` on the html element (110px desktop, 96px mobile) so anchor headings never hide behind the bar.

**Refraction (the liquid part)**
- Add an inline SVG filter to the page (e.g. `<filter id="liquid-glass">`) containing a displacement map: an `feImage` whose `href` is a data-URI PNG encoding a radial lens field - neutral gray (128,128) in the center so the middle stays sharp, with red/green channels pushing outward toward the edges so the rim bends like curved glass. Generate the map programmatically; no external assets.
- Displace the backdrop once per RGB channel with slightly different scales (R 18, G 22, B 26), isolate each channel with `feColorMatrix`, recombine with two `feBlend mode="screen"` operations for a subtle chromatic fringe, and finish with a small `feGaussianBlur` (about 0.7px).
- Apply it to the bar with `backdrop-filter: url(#liquid-glass) saturate(1.35)`, gated behind `@supports ((backdrop-filter: url(#liquid-glass)) or (-webkit-backdrop-filter: url(#liquid-glass)))`.

**Glass body**
- Nearly clear tint: light theme uses a soft white gradient at low alpha; dark theme uses a deep navy gradient. Add a specular top sheen (`::before` vertical gradient), a bright inset rim light plus soft outer drop shadow (`::after` inset box-shadows), and keep the bar's children above those layers (`position: relative; z-index: 1`).

**Readability over refracted content**
- Soft `text-shadow` halo on the logo and nav labels (white halo in light theme, dark halo in dark theme) so foreground text stays crisp while the background warps.
- Give small controls (menu/theme buttons) a more solid translucent background, and slightly raise the glass tint on screens under 760px.

**Fallbacks**
- Safari and Firefox (no SVG filter reference in `backdrop-filter`): a very light `blur(4px)` with a low tint - clear glass, never heavy frost.
- No `backdrop-filter` at all: a solid bar.

**Dark mode**
- Same structure with graphite tints (about rgba(24,27,34,.46) to rgba(14,16,20,.34)), a stronger fill on mobile so white nav text stays readable over bright refracted content, and inverted halo colors (near-black).
- No grey border: the dark bar has a transparent border and only a faint blue highlight (`inset 0 1px 0 rgba(143,178,255,.3)`) on its top edge, with a deeper black drop shadow.
- Dark page palette is graphite with electric blue accents: page #0e1013, cards #171a20, raised #1e222a, text #eceff5, muted #adb5c3, accent #6f9bff.

**Theme switch**
- Icon-only 44px round glass button (moon in light, sun in dark) with a short spin when it changes. Keep an `aria-label` and `aria-pressed`.

**Scroll behaviour (polish.js + polish.css)**
- After about 24px of scroll the bar scales to 0.975 (0.985 on mobile) with a spring-like ease and a deeper shadow, and a 2px blue progress line along its bottom edge shows how far down the page you are. No layout shift, no scroll hijacking, off under `prefers-reduced-motion`.
- Below-the-fold blocks fade and rise 26px once as they enter the viewport, staggered in small groups.

Verified rendering in Chrome and Edge (full refraction with chromatic edge); Safari/Firefox get the clear-glass fallback.

---

Technique reference: Nadeem's link, https://freefrontend.com/css-liquid-glass/ (Ignacio Correia's "Liquid Glass Distortion Card" demo). The code here is an independent implementation of that published technique with a self-generated displacement map.
