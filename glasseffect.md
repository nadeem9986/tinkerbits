# Liquid Glass Navbar - Reusable Prompt

Use the prompt below to recreate the Tinkerbits navbar on any site. It describes the implementation shipped in this repo (final version, 13 Nov 2026): clear liquid glass, no frost or fog, text that adapts to what is behind it, and a logo that fills with colour as you scroll.

---

Make the site's top navbar a floating clear-glass bar that bends the content behind it, with a logo that doubles as the scroll-progress indicator.

**Layout**
- Rounded rectangle (16px radius, 14px on mobile), sticky at the top with a small gap (12px desktop, 8px mobile), always visible, high z-index. Add `scroll-padding-top` on html (110px desktop, 96px mobile) so anchor headings never hide behind it.
- No underline, progress line or border strip anywhere on the bar.

**Glass (clear, not frosted)**
- Background is almost clear: about `rgba(255,255,255,.12)` in light theme with a 1px blue-tinted hairline border (`rgba(21,85,237,.16)`), a soft drop shadow and one thin top highlight (`inset 0 1px 0 rgba(255,255,255,.55)`).
- No white sheen overlay, no radial glow, no text-shadow halos on the logo or links. The previous milky haze and glow looked muddy and are intentionally gone.

**Refraction (single pass, cheap)**
- Inline SVG filter `#tb-lens` built in JS from a data-URI displacement map `feImage` (radial lens: neutral gray in the middle, pushing outward at the rim) and ONE `feDisplacementMap` (scale 16, R/G channels). No chromatic split and no extra blur, which keeps text behind the bar clean and scrolling cheap.
- Apply with `backdrop-filter: url(#tb-lens) saturate(1.15)` once the filter exists (html class `tb-lens-ready`).
- Low-power devices (4 or fewer CPU threads, 2GB or less memory) and reduced-motion users get `blur(8px) saturate(1.2)` instead (html class `tb-lite`). Safari and Firefox cannot use SVG filters in backdrop-filter and also fall back to plain clear blur. No backdrop-filter support: a solid bar.

**Text adapts to the background**
- On scroll (only after a 10px change) JS samples three points behind the bar's centre line, finds each point's opaque background colour and, if at least two are dark (luminance below 0.3), sets `data-over="dark"` on the header. Then light theme switches to white text, a deep clear tint (`rgba(8,12,22,.34)`), translucent white control buttons and a white "Start a project" button. Dark theme always uses that dark state.

**Logo as progress**
- Wrap the "tinkerbits" text in a span. Its text colour is transparent and a two-layer background clips to the text: a base colour layer (navy in light, near-white in dark) whose transparent part grows from the left as `--tb-p` (scroll progress 0 to 1, set on the header), over a gradient (blue to violet to pink to orange). At the top the logo is plain; at the bottom of the page it is fully colourful. Only the CSS variable changes while scrolling.

**Theme switch and icons**
- Icon-only 44px round button (moon in light, sun in dark), with `aria-label` and `aria-pressed`.
- One stroke icon set via CSS masks that inherit text colour: arrow-up-right, arrow-right, play, pause, and a two-bar menu icon that turns into an X when open. Text glyphs (arrows, +, play and pause symbols) are replaced.

**Dark theme**
- Graphite, not navy: page #0e1013, cards #171a20, raised #1e222a, text #eceff5, muted #adb5c3, accent #6f9bff, buttons #2f6bff. The dark bar has a transparent border (no grey edge) and only a faint blue top highlight.

**Scroll behaviour**
- Native scrolling only, no hijacking. Below-the-fold blocks fade and rise 26px once as they enter view (off for reduced motion).

Verified in Chrome with real scrolling on desktop and mobile in both themes.

---

Technique reference: Nadeem's link, https://freefrontend.com/css-liquid-glass/ (Ignacio Correia's "Liquid Glass Distortion Card" demo). The code here is an independent implementation of that published technique with a self-generated displacement map.
