# Tinkerbits redesign - review

Scope: branch `modern-ui-2026-11` vs `main`. Reviewed 10 Nov 2026 by rendering the branch and exercising the page functions.

## Tested and passing

### Forms (honest mailto behavior)
- Upload form blocks empty submissions: "Please add your name and phone number so we can reply."
- Completed upload form composes `mailto:hello@tinkerbits.in` with subject "Custom print request - <name>" and a body containing phone, material, and "<filename> (attached to this email)". Toast reads "Opening your email app - attach your file there and press send."
- Contact form composes a mailto with subject "Question from <name>" and the message body.
- Neither form claims a file was uploaded or a message "sent".

### Gallery (models.html)
- All 12 models render.
- Search "dragon" -> 1 result (Mini Articulated Dragon).
- Filters: Toys & Gifts -> 2; adding PLA -> 1; reset -> 12.
- Sort A-Z -> "Cable Organiser" first.
- List-view toggle works; detail modal opens with title + 4 specs and closes with Escape.

### Mobile
- Hamburger menu opens (screenshot-verified).
- Hero image appears before the stats strip (measured in the rendered page: image at ~770px, stats at ~1151px).
- Floating chips anchored inside the image frame, no overlap with the caption.

### Desktop
- Hero layout: copy left, image right, stats full-width below; chips inside the frame.

## Known limitations (by design)
- No real file upload: the site is static, so the mailto flow is the honest mechanism. Visitors with no configured email app should email hello@tinkerbits.in directly; the page says so.
- The hero image is a generated illustrative render, not a photo of real Tinkerbits work. Swapping in real photos is a one-file change (replace assets/hero-print.png) whenever real photos are available.
- Site claims (200+ prints, 50+ customers, 5 materials, 2-4 day turnaround, UPI) are carried over from the original copy and are unverified.

## Pending at time of writing
- Verification of what serves tinkerbits.in after merging to main (auto-deploy mapping unconfirmed).
