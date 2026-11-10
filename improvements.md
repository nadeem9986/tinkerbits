# Tinkerbits site - improvements (November 2026)

Redesign branch: `modern-ui-2026-11`. Original site preserved on branch `backup/pre-modernize-2026-11-10`.

## What changed

### Design
- New dark visual system with a warm orange accent, applied consistently across both pages.
- Editorial type pairing (Fraunces for display, Space Grotesk for body) replacing the previous styling.
- Hero rebuilt around a clear headline ("Bring your ideas into the physical world"), two calls to action (Get a quote, Browse models), and a generated hero render labeled as an illustrative render.
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
