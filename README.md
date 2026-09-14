# Northline Retrofit public website

Live: https://northlineretrofit.github.io/

## Current release

The approved European owner experience is `index.html`; the Turo/fleet page is `hosts.html`. Shared runtime files: `photo-design.css`, `desktop-signature.css`, `app.js`, `vehicle-catalog.js`. The signature layer restores the preferred desktop typography and photo framing above 1100px while keeping the compact mobile presentation. Static GitHub Pages, no runtime build dependency. Legacy scripts/assets remain available but are no longer loaded by the new pages.

- Public pages have descriptive metadata, canonical URLs and a sitemap; preview bars and proposal links are removed.
- Existing printed-card `/#demos` links open the installation gallery. Legacy `#compatibility`, `#contact`, `#upgrade`, `#how-it-works` and `#questions` anchors remain usable.
- Media files are real supplied photographs/video; no generated imagery. Mercedes hero caption is neutral and does not claim a verified Northline installation.
- The shared catalog supplies inquiry choices and qualified CarPlay model/year results. Unmatched selections need a manual check, not a rejection. No browser calls are sent to the supplier.
- Contact links open Text or WhatsApp; selecting/submitting a vehicle sends nothing automatically. No analytics added.
- Host sample-guide links open `guides/northline-2009-bmw-x5-guest-guide.pdf` directly: one US Letter page with selectable text. `guest-guide.html` provides a proportionally scaled Letter preview; its print action opens the PDF instead of printing a mobile web layout. The old `2009-x5-guest-guide-DRAFT.pdf` URL remains a copy of the same document.
- The guide is a clearly labeled iPhone sample: installer-confirmed MENU/pairing/AUX/CarPlay steps, but host identity and tutorial QR remain pending. `guest-guide.html` is noindex and excluded from the sitemap. Customize the sample for the actual vehicle before guest use.
- Internal proposals, original camera recordings and local screenshot artifacts were not published.

## Verification

Run `node tests/verify-public.cjs` with Playwright available at the configured local path. It checks local production pages, responsive layout, links/assets, forms, gallery, legacy anchors and guide PDF. The verification file does not send messages or submit customer data externally.

Run `node tests/build-guest-guide.cjs` against the local server to rebuild the canonical and legacy guide PDFs. Run `node tests/verify-guest-guide.cjs` to check Letter proportions, mobile controls and one-page printing from desktop, iPhone 15-emulated and small-phone contexts. PDF geometry is 612 × 792 points. Native iPhone/AirPrint behavior has not been physically tested; the direct PDF link avoids web-page repagination. `NORTHLINE_TEST_URL` can override the local server URL.

Search Console ownership verification/indexing submission has not been performed; it requires the site's Google account. No Google Ads campaign changes were made.

Prior BMW-only production is preserved in git history at `3be2514`.

Vehicle logo assets: [Car Logos Dataset](https://github.com/filippofilip95/car-logos-dataset), which credits Carlogos.org. Manufacturer trademarks remain their owners’ property; no affiliation is implied. The vehicle dropdown snapshot was compared with [GTA Car Kits](https://www.gtacarkits.com/) and its CarPlay category on September 13, 2026; original labels and separate catalog/CarPlay year sets are retained in `vehicle-catalog.js`.
