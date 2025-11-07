Super Treks — Static Site

What I changed
- Extracted inline CSS into `css/styles.css`.
- Moved JS into `js/app.js` and created a data file at `data/data.json`.
- Added GSAP (via CDN) for smooth animations and used IntersectionObserver + GSAP for card entrances.
- Implemented lazy-loading for images (loading="lazy").
- Implemented basic accessibility improvements: keyboard support for cards, focus trap for modals/lightbox, Escape handling.

How to run locally
1. No build tools required. Open `index.html` directly in your browser.
2. For best results (browsers sometimes block fetch() for local files), serve the folder using a simple static server. Example (PowerShell):

```powershell
# from the project root
# Python 3: (if python is installed)
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

What to expect
- Search, filters, packages listing, detail page, booking form (client-side), contact form (client-side), chat widget (simple bot), review modal and lightbox.
- Data comes from `data/data.json` so it's easy to update or extend.

Next steps / improvements
- Add form submission backend or integrate with a service (Formspree, Netlify Forms, or your API).
- Add visual tests / snapshots and unit tests.
- Optimize images into an `assets/` folder and add srcset for responsive images.
- Add Lighthouse/CI checks for accessibility and performance.

If you want, I can now:
- Wire a small backend endpoint for contact/booking (or integrate with Formspree).
- Add srcset and next-gen formats for images.
