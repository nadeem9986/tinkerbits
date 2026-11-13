# Tinkerbits site - improvements (November 2026)

Redesign branch: `modern-ui-2026-11`. Original site preserved on branch `backup/pre-modernize-2026-11-10`.

## What changed

### Design
- Trust palette: deep navy sections, a clean off-white background and restrained blue accents, applied consistently across both pages (updated 10 Nov from the first warm-orange draft after owner feedback).
- Editorial type pairing (Fraunces for display, Space Grotesk for body) replacing the previous styling.
- Hero rebuilt around a clear headline ("Bring your ideas into the physical world"), two calls to action (Get a quote, Browse models), and a generated hero render (navy studio treatment) labeled as an illustrative render.
- Trust stats (200+ prints, 50+ happy customers, 5 materials) moved to a full-width strip below the hero so they read cleanly on all screen sizes.
- Consistent section system: process (3 steps), materials, models preview, trust/FAQ, contact.

### Quote / upload flow (honesty fix)
- The old form gave a fake success message and discarded submissions. The new flow opens the visitor's email app with a pre-filled message to hello@tinkerbits.in.
- The page says plainly: selecting a file does not upload it; attach it in the email. Large files (over ~25MB) are directed to a Drive or WeTransfer link instead.
- "100MB" is kept only as the maximum model size the shop accepts, separated from email attachment limits.

### Models gallery (models.html)
- 12 models with live search, category + material filters, sorting, grid/list view toggle, and a detail modal (Escape closes).
- "Get this printed" links pre-fill the quote form on the home page.

### Materials
- Five material cards (PLA, PETG, ABS, TPU, Resin) with plain one-line guidance on when to use and when not to, modeled on real 3D-printing service sites (Fracktal's materials page was the reference).

### Mobile
- Hamburger nav, hero shows the image right after the intro text, stats stacked below, floating chips anchored inside the hero image frame.

## What did NOT change
- Contact details, prices, turnaround (2-4 days), UPI payment, and all existing claims are carried over as-is from the original site copy.
- No new backend, accounts, integrations, or hosting changes.

## Dark mode (13 Nov 2026)
- Theme toggle in the header (moon/sun) switches between light and dark themes on both pages.
- Default follows the visitor's system preference (`prefers-color-scheme`); the choice is remembered in `localStorage` (`tb-theme`).
- Dark palette keeps the blue accent (#1555ed family) on deep navy surfaces; the already-dark process section and hero video are unchanged.
- `meta theme-color` updates with the theme; dark mode sets `color-scheme: dark` so native form controls match.

## Change requests from Nadeem (log)

Every change Nadeem asks for is recorded here, in his words, with the date and what was done.

| Date (IST) | Request | Status |
|---|---|---|
| 13 Nov 2026, 15:42 | "Yess deploy it" (approved the redesign preview) | Done, live |
| 13 Nov 2026, 15:43 | "Dont add any contact for now keep it as example now" | Done: no contact details, enquiry form is demo-only |
| 13 Nov 2026, 15:44 | "it would b best if tye image of the 3d printer was live where it shows the working of a 3d printer just working" | Done: looping time-lapse of a real printer (MDXDave, CC BY-SA 4.0), labelled example footage, not a live camera |
| 13 Nov 2026, 15:59 | "Also add dark mode" | Done, live |
| 13 Nov 2026, 16:14 | "Make a improvements md file and whatever i say to u to make changes store it there also" | Done: this log |
| 13 Nov 2026, 16:14 | "The navbar should have the squarerounded corners and navbar should be on the top and vosible" | Done: rounded-rectangle navbar (16px radius, 14px on mobile) that stays fixed at the top while scrolling |
| 13 Nov 2026, 16:15 | "The navbat should have the liquidglass effect" | Done: translucent frosted-glass navbar (backdrop blur, soft highlight edge) in light and dark themes, with a solid fallback where blur is unsupported. Superseded at 16:44 below |
| 13 Nov 2026, 16:44 | "That is frost effect i wanted liquid glass effect" | Done: navbar rebuilt as true liquid glass - real refraction of the content behind the bar, not just blur |
| 13 Nov 2026, 16:47 | "https://freefrontend.com/css-liquid-glass/ From this u see the code and add the liquid glass effect to the top navbar" | Done: adapted the reference's technique (backdrop-filter + SVG feImage displacement map with split-channel feDisplacementMap for chromatic refraction, per Ignacio Correia's "Liquid Glass Distortion Card" demo) |
| 13 Nov 2026, 17:01 | "Also make a prompt for the navbar to look like the one u changed now in the repo itself called as glasseffect md file" | Done: glasseffect.md added - a reusable prompt describing the final liquid-glass navbar implementation |

## Navbar (13 Nov 2026, liquid glass revision)
- Floating rounded-rectangle bar, sticky at the top of both pages, always visible while scrolling.
- True liquid glass: the bar refracts and warps the page content behind it (SVG displacement-map filter referenced from `backdrop-filter: url(#tb-liquid)`), with split RGB channels for a subtle chromatic edge, specular rim highlights and a top sheen. Technique adapted from the FreeFrontend liquid-glass reference Nadeem sent (Ignacio Correia's distortion demo); the displacement map is self-generated and embedded as a data URI, no external assets.
- Browser support: Chrome and Edge render the full refraction. Safari and Firefox do not support SVG filter references in backdrop-filter; there the bar falls back to a very light 4px blur with low tint (clear glass, not frost), and to a solid bar where no backdrop filter exists at all.
- Dark theme uses a darker glass tint so white nav text stays readable over bright refracted content.
- Mobile: smaller bar, menu drops below it with a gap; anchor links offset so headings are not hidden behind the bar.
- Readability refinement (same day): soft text halo on the logo and nav labels, a more solid menu button, and a slightly stronger glass tint on small screens, so the brand and Menu stay crisp over brightly refracted content without losing the lens effect.

