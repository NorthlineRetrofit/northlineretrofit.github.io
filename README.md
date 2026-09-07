# Northline Retrofit

Mobile-first static service website for wireless CarPlay and Android Auto retrofit installation in compatible BMW vehicles. Ready for GitHub Pages with no build step, framework or paid hosting requirement.

## Preview

Run `python3 -m http.server 8769 --bind 127.0.0.1` from this folder. Open `http://localhost:8769`.

## Edit

- `index.html`: all editable wording, page sections and inline SVG icon symbols.
- `styles.css`: shared BMW-inspired colors, spacing, typography and responsive layouts. This is an independent brand design, with no BMW logo.
- `site-config.js`: phone, price, primary contact method and optional service area. Unconfirmed location and service-mode details remain empty.
- `site.js`: contact links and shared detail bindings. It does not submit forms, collect customer details, send messages, or install analytics. The user chooses whether to send the enquiry in their own app.
- `assets/dashboard-original.png`: the supplied original dashboard photograph, copied unchanged. No generated pixels, filtering or retouching.

## Publish

The intended repository is `NorthlineRetrofit/northlineretrofit.github.io`. Publishing still needs write access to that account/repository. The workspace was authenticated as `YiShao-AI` at preparation time.

After access is provided, push these files to `main` and configure GitHub Pages to deploy from `main` at `/ (root)`. The expected URL is `https://northlineretrofit.github.io`. No secrets belong in this repository.

Before publishing, confirm the service area and installation arrangement, and the preferred primary contact method. The current draft uses the saved phone `(619) 953-7761`, installation from `$350`, and text as the primary enquiry action. No reviews, certifications, installation times or warranties have been invented.

This service website is separate from the private card editor. Publishing it does not expose the card editor or its revision history. GitHub Pages is static hosting: changes made to source files need a new commit/push to update the public site.
