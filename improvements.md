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


## Requests (13 Nov 2026, polish round)

| When | Request | Outcome |
|---|---|---|
| 13 Nov 2026, 17:07 | "improve the scroll effect make it premium and in dark mode the navbar i shaving the grey effectin the border fix that dark  mode button should be change to an icon the dark mode colour combo is not looking good change it to some different colour" | Done: see "Polish round" below |
| 13 Nov 2026, 17:08 | "check the colour contrast in both modes and balance it overall" | Done: contrast audited on both pages in both themes, fixes in polish.css |

## Polish round (13 Nov 2026)
- New files `polish.css` and `polish.js`, loaded after the inline styles on `index.html` and `models.html`. Backup branch: `backup/pre-polish-2026-11-13`.
- Scroll: the navbar condenses slightly after a short scroll (scale with a soft spring easing, deeper shadow) and shows a thin blue reading-progress line. Below-the-fold sections, cards and footer columns ease in once as they enter view. No scroll hijacking, native scrolling and smooth anchors unchanged. Turned off with `prefers-reduced-motion`.
- Dark navbar: the grey border and grey inner rim are gone. The glass now has a transparent border and only a faint blue highlight on its top edge.
- Theme switch: icon-only round button (moon in light mode, sun in dark mode, with a short spin on change). Its accessible name and pressed state still update.
- Dark palette: changed from navy to graphite (#0e1013 page, #171a20 cards, #1e222a raised) with electric blue accents (#6f9bff text accent, #2f6bff buttons). Text #eceff5, muted #adb5c3, faint #939cac. The browser theme-color follows it.
- Contrast: audited every visible text element on both pages in both themes. Failures found (muted grey labels, footer text, form notes, "(optional)", model index labels, filter button on blue, small arrows) were fixed so normal text meets 4.5:1. Focus outlines added for keyboard users in both themes. Light mode muted text is now #4e5a72.

## Requests (13 Nov 2026, navbar finish)

| When | Request | Outcome |
|---|---|---|
| 13 Nov 2026, 17:21 | "i dont like the onderlne on the navbar how about thus whil im scrolling the tinkerbitd logo will become colourful like soem colour as a progress of teh site all the icons should b modern" | Done: underline removed, logo fills with colour as scroll progress, icons replaced with one modern stroke set |
| 13 Nov 2026, 17:21 | "where r u in the smoothing process it sstill laggy" | Done: lens filter reduced from three displacement passes to one, bar scale/transition animation removed, lighter blur on low-power devices |
| 13 Nov 2026, 17:23 | "look how bad the navbar is loking here i want the whit efog like shade to b removed and the overall look should b perfect" | Done: white sheen, glow and text halos removed. Bar is clear glass with a subtle edge, and nav text switches to light over dark sections |

## Navbar finish (13 Nov 2026)
- Clear glass: background about 12% white, thin blue hairline, no white sheen or glow, no text halos. Text colour adapts: light text and a deep clear tint over dark sections (polish.js samples what is behind the bar), dark text over light ones.
- Logo progress: the "tinkerbits" wordmark fills left to right with a blue, violet, pink, orange gradient as you scroll. The old underline progress line is removed.
- Smoothness: single-pass displacement lens (was three passes plus blur and a scale animation). Devices with 4 or fewer CPU threads, 2GB or less memory, or reduced motion get a plain light blur instead of the lens.
- Icons: arrows, play/pause and the menu button use one consistent stroke icon set; the menu icon turns into an X when open.
- Cache: HTML links `polish.css?v=4` and `polish.js?v=4`, bump the number whenever those files change.

## Menu control (13 Nov 2026)

| When | Request | Outcome |
|---|---|---|
| 13 Nov 2026, 17:32 | "the 3 lines lines beside the tinkerbits is now become the burgermenu" / "make it" | Done on mobile: the three-bar logo mark opens and closes the menu and turns into an X; the separate Menu button is hidden. Desktop keeps inline links and the mark as part of the home link |


## Round: navigation, lens and legibility (Nov 13, 5:41-5:46 PM IST)

| Request (user, verbatim) | What changed |
|---|---|
| "why is it rendering the page again if i click explore models and the other options is should just navigate there not reload the page there" | polish.js now routes clicks between / and /models client-side: fetches the target page, swaps main and footer, keeps header, theme, menu and scroll listeners, updates title and history (back/forward and direct links work, scroll restored). Same-page links (index.html#materials) scroll in place. Any failure falls back to a normal page load. |
| "why did u remove the navbar liquidglass effect it became the frost glass effect" | Removed the blur from the lens path (it had been added back for legibility and made it frosted). Lens refraction strength 16 to 30. The core/memory/reduced-motion heuristic is gone: every Chromium browser gets the lens. Non-Chromium browsers (Safari, iOS, Firefox) cannot render SVG backdrop filters and get the clear blur fallback. |
| Mobile menu review | Escape, link tap, brand-mark tap and outside tap all close the menu; the label follows aria-expanded. |


## Round: clean URLs (Nov 13, 6:07 PM IST)

| Request (user, verbatim) | What changed |
|---|---|
| "For all  options here" / "For explore models also" | Router intercepts every internal link on both pages (nav, hero, CTAs, logo, footer, model cards), tested with real clicks on desktop and mobile menu, from direct landing and routed states. |
| "Also the url should look clean" | Internal links are now /, /#studio, /#materials, /#quote, /models and /?model=NAME#quote. The router pushes canonical paths (no .html), fetches canonical paths, and cleans an old /index.html or /models.html in the address bar on load. The host already 308-redirects /index.html to / and /models.html to /models, so old inbound links keep working with their hash and query. |


## Requests (13 Nov 2026, theme ring and video controls)

| When | Request | Outcome |
|---|---|---|
| 13 Nov 2026, 18:17 | "There is a blue circle in the dark mode icon that should not b there after cicking it" | Done: theme icon ring. Cause was the hover style (blue border, tilt) staying on after a tap on touch screens, not keyboard focus. Hover styling now only applies to real pointers. Keyboard focus-visible outline unchanged |
| 13 Nov 2026, 18:19 | "I would like the media control from this video here to b added go search the site and get the code understand and implement it in tinkerbits" (famease.in landing page video, screenshot) | Done: a rounded translucent pill with a round white play/pause button at the bottom centre of the hero video, stroke icons, written from scratch (famease.in is "All rights reserved", no licence, so nothing was copied). No mute button: the printer MP4 has no audio track (checked with ffprobe), so a sound button would be misleading. Old text Play/Pause button is hidden. Footage credit and demo-only note untouched |

Notes: the /#materials URL with the hero at the top in the screenshot is normal when the page is scrolled back up (the address bar keeps the hash). A direct load of /#materials lands on the section (checked).
