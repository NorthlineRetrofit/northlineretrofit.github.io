# Northline Retrofit

Mobile-first static service website for wireless CarPlay and Android Auto retrofit installation in compatible BMW vehicles. Ready for GitHub Pages with no build step, framework or paid hosting requirement.

## Preview

Run `python3 -m http.server 8769 --bind 127.0.0.1` from this folder. Open `http://localhost:8769`.

## Edit

- `index.html`: all editable wording, page sections and inline SVG icon symbols.
- `styles.css`: shared BMW-inspired colors, spacing, typography and responsive layouts. This is an independent brand design, with no BMW logo.
- `site-config.js`: phone, price, primary contact method and optional service area. Mobile installation is available; the geographic service area is not specified yet.
- `site.js`: contact links, shared detail bindings and video carousel navigation. It does not submit forms, collect customer details, send messages, or install analytics. The user chooses whether to send the enquiry in their own app.
- `compatibility-data.js`: sourced model/platform screening windows, system categories and cautious enquiry results. This is not a guaranteed-fit database; see `COMPATIBILITY-RESEARCH.md` for sources, conflicts and the missing supplier/SKU confirmation.
- `compatibility.js`: two required native selectors (model and year), an explicit **Check compatibility** button, and a conditional result with prefilled text/WhatsApp enquiries. No optional fields are displayed. Results say “Potentially compatible” or “Needs a manual check”; neither confirms fitment. Change preserves the selections, and editing either selection clears the old result. Data remains in page memory, with no upload, tracking or persistent storage. A dashboard photo and location are supplied by the customer in their messaging app, not on this site. Header and hero actions jump to `#compatibility`; the mobile bottom action becomes a confirmation enquiry after a check.
- `assets/dashboard-original.png`: the supplied original dashboard photograph, copied unchanged. No generated pixels, filtering or retouching.
- `assets/dashboard-lossless.webp`: a pixel-identical, lossless copy served through `<picture>`, with the original PNG as fallback. Approximately 60% smaller; no alteration to the dashboard or screen content.
- `assets/videos/`: mobile-friendly H.264/AAC MP4 copies of the supplied 2013 BMW X5 (E70) and 2015 BMW 328i GT (F34) demos. Full duration, portrait framing and audio are retained. Video dimensions are 720 × 1280 at 30 fps, with fast-start metadata. Videos use native controls, inline mobile playback and `preload="none"`; only one plays at a time.
- `assets/posters/`: JPEG stills extracted from those videos, not generated images.
- At phone widths (760 px and below), demos use a native horizontal scroll-snap carousel: one model at a time, swipe or use the model buttons. Switching models pauses the outgoing video without auto-playing the next. Keyboard users can select a model button or use Left/Right/Home/End on the carousel. Desktop retains the two-column view.
- The two original recordings remain local and are explicitly ignored by Git. The optimized copies are approximately 9.5 MB / 38 seconds (E70) and 1.2 MB / 5 seconds (F34).

## Publish

The repository is `NorthlineRetrofit/northlineretrofit.github.io`. GitHub Pages publishes `main` at `/ (root)` to `https://northlineretrofit.github.io`.

Push the intended changes to `main`, wait for the Pages deployment and check the public page. No secrets or original large recordings belong in this repository.

The site uses the supplied phone `(619) 953-7761`, installation from `$350`, and text as the primary enquiry action. The owner has confirmed mobile installation and a two-hour installation value proposition, presented on the site as about two hours with timing confirmed for each vehicle. No reviews, certifications or warranties have been invented. Customers are asked for their location to confirm mobile availability; no geographic coverage is implied.

This service website is separate from the private card editor. Publishing it does not expose the card editor or its revision history. GitHub Pages is static hosting: changes made to source files need a new commit/push to update the public site.
