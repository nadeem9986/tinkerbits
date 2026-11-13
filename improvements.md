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
| 13 Nov 2026, 18:20 | "Remove the text EXAMPLE FOOTAGE TIME-LAPSE PRINTING IN MOTION" | Done: the two overlay labels on the video (EXAMPLE FOOTAGE / TIME-LAPSE, and PRINTING IN MOTION) are removed from the home page. The credit line under the video (example footage, not a live studio feed, source and CC BY-SA 4.0 licence) stays |
| 13 Nov 2026, 18:33 | "Also the button should vanish within 1.5 secs" | Done: the video play/pause pill fades out after about 1.1s without activity (gone by about 1.4s). It returns on mouse move, a tap on the video, or keyboard focus, and stays while keyboard focus is on it |
| 13 Nov 2026, 18:36 | "Remove the underline below the explore models also remove unnecessary lines" | Done: the underline under Explore models (and the same underline on the other text links) is gone, plus the rule above the hero note and the two rules around the Prototypes / Everyday objects strip. Kept on purpose: card and form borders, filter bar, process step dividers, section bands and the footer rule |
| 13 Nov 2026, 18:47 | "the darkmode inco is shifting slightly when toggled look into it and tell me what's wrong and fix it" | Cause: two motions on the theme button. The new icon spun in from -90 degrees and scaled up from 0.4 with an overshoot (it grew to about 1.1x before settling), and on desktop the whole button tilted 14 degrees and scaled 1.06x on hover and shrank on press, so the sun/moon moved off its resting position and snapped back. Fix: the icon now only fades in place and the button no longer tilts or scales. Icon centre was already exactly the button centre in both themes |
| 13 Nov 2026, 18:57 | "Still the same in the mobile view" (theme icon shift) | Real cause on phones: the whole toggle button sat 6px further left in light than in dark (inline CSS gave it margin-right 18px in light and 12px in dark under 760px wide), so it jumped sideways on every switch. The earlier spin and tilt fix was real but did not touch this. Fixed with one margin in both themes (v19). Measured: button and icon x identical in both themes on / and /models. | Done, checked in browser emulation; not on a physical phone. |
| 13 Nov 2026, 19:20 | "if clicked for explore models add the top models sites links and customers can go there explore download and comeback here for their printing service" | Done: Explore models now opens with a "Find a model first" section linking to Printables, MakerWorld, Thingiverse, Cults and MyMiniFactory (home pages only, each opens in a new tab). Short plain-text descriptions, no copied images, text or feeds, no API or account. A note reminds visitors to check the design's licence before asking for a paid print, plus a link back to the quote form's private-upload concept (demo only). The unused popular-models renderer was removed. Example cards below are unchanged. | Live at v21. Checked in browser emulation, mobile and desktop, dark and light. |
| 13 Nov 2026, 19:27 | "and remove my demo models in that page" | Done: the 12 example model cards, the search box, the category filters, the result count and the "model ideas, not ready stock" note are gone from Explore models. The page now shows the heading, the "Find a model first" directory (Printables, MakerWorld, Thingiverse, Cults, MyMiniFactory, new tab), the licence reminder, the demo-only upload note and the link to the upload preview. The 12 example ideas no longer appear anywhere on the site. | Live at v23. The page intro line above still says "Explore ideas for your desk, your home...", left as is unless you want it reworded. |
| 13 Nov 2026, 19:26 | "include a proper svg for my site i like the 3 slits can u convert it into 7 slits and make a svg and add it" | Done: the slanted mark now has seven slits, drawn as one SVG. Reusable files: /logo.svg and /favicon.svg (also linked as the browser tab icon). The same SVG is used in the header, in the mobile menu button, and morphs into the X when the menu opens. Colours follow the theme (blue in light, lighter blue in dark). The wordmark scroll colour, the toggle position and the navbar are unchanged. | Live at v24. Checked in emulated 390px mobile and desktop Chromium only, not on real devices. |
| 13 Nov 2026, 19:34 | "the slit design is good but not up to the mark in that shape i i would like to add the text tinkerbits" then "no in the shape of sevenslit i want the text in that shape replace the slits with this new text" | Done: the seven bars are replaced by the word tinkerbits set as lettering inside the same slanted shape (three stacked lines: tin / ker / bits, same slant as the old bars, converted to outlines so it needs no font). New /logo.svg is the lettered mark. The previous seven-slit mark is kept as /logo-slits.svg and /favicon.svg is still the slits. The header and mobile menu button use the lettered mark; the open menu shows an X. | Live at v25. The wordmark "tinkerbits." still sits next to the mark, so the name now appears twice in the header. The favicon stays slits because lettering is not readable at 16px. Checked in emulated mobile and desktop Chromium only. |
| 13 Nov 2026, 20:01 | "can u change the font to something boxy and also update the favocon" | Done: the lettering inside the slanted mark is now Orbitron Black, a square-cornered font, instead of Sora. It is still outlined, so the SVG needs no font. The favicon is now a blue rounded square with a slanted "tb" in the same lettering (the full tin / ker / bits is not readable at 16px). The rest of the site's fonts are unchanged. The previous Sora version is kept as /logo-sora.svg and the seven-slit version as /logo-slits.svg. | Live at v26. Checked in emulated mobile and desktop Chromium only. Tab icon may take a refresh to update from cache. |
| 13 Nov 2026, 20:11 | "why is it when clicked explore models it staking soo much time to open the page check it once" | Cause found: each click downloaded the whole Explore models page first (about 188 KB compressed, 431 KB of text, mostly inline fonts) before showing anything, and nothing was cached. Fix: the site now fetches the other page in the background after load and when you hover or touch a link, so the click swaps instantly. Design unchanged. | Live at v27. In my test browser the swap went from about 190-270 ms to about 20-30 ms. Real phones on slow data were not tested. |
| 13 Nov 2026, 20:18 | "i want u to remove these dots allover the site this is what makes it look like ai slop site" | Done: removed the decorative dots. That is the small blue marker before the section label on both pages (e.g. before "3D PRINTING STUDIO / BENGALURU" and "THE MODEL COLLECTION") and the blue full stop after the wordmark in the header, the mobile menu bar and the footer. Punctuation in the actual text (headlines, sentences) is unchanged. | Live at v28. I read "dots" as those decorative ones; the headline full stops were kept. To bring the wordmark dot back, remove .brand-dot from the v28 rule in polish.css. |
| 13 Nov 2026, 20:25 | "same for materials taking long time check for all and optimise them" | Checked every internal link on both pages. Cross-page links (Explore models, logo, Materials from /models) already swap in about 20-150ms from the v27 prefetch. The slow one was the in-page links (Materials, Studio, Quote): they ran a long animated scroll, measured 470-880ms in emulated Chromium. They now jump at once, measured about 18ms. | Live at v29 (polish.js toHash plus html scroll-behavior:auto in polish.css). Measured in emulated Chromium only, not on a physical phone. |

Notes: the /#materials URL with the hero at the top in the screenshot is normal when the page is scrolled back up (the address bar keeps the hash). A direct load of /#materials lands on the section (checked).
