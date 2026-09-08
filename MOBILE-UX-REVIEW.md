# Mobile compatibility review

Reviewed and revised September 7, 2026, with an independent UI/UX reviewer and browser automation.

## Customer flow

The previous result and contact action were below several optional fields. At a 390 × 844 viewport, the result began roughly 1,022 px below the viewport top after navigating to the selector; the contact action was roughly 1,228 px down. The fixed bottom action returned the customer to the selector instead of continuing the enquiry.

The revised flow is **model + year → Check compatibility → conditional result → text/WhatsApp confirmation**.

- Removed optional variant, location and infotainment-system fields entirely.
- Added a visible submit button with native required-field validation.
- Kept technical details and source references in a collapsed disclosure.
- Show the selected vehicle, a plain-language result and a primary contact action together.
- State that a dashboard photo is required; no guaranteed fit or booking is implied.
- Change preserves selections; changing either field hides stale results and resets the mobile action.
- The bottom action switches to a prefilled enquiry after a check.
- No enquiry is sent automatically. The customer attaches a photo and sends from their messaging app.

## Verification

The reviewer rechecked 390 × 844 and 320 × 700 layouts and found no blocking mobile UX issues. At 320 px, the submit button and result contact button both fit above the fixed bottom bar in their respective steps.

Automated checks covered empty/incomplete submission, ordinary and manual-review results, unknown model/year, change/reset, keyboard submission, focused results, fresh SMS/WhatsApp links, no horizontal overflow from 320–1440 px, no-JavaScript fallback, no uploads or persistent storage, and video-carousel regressions. Unit tests cover the research catalogue and conservative customer-result rules. Mobile testing used Chromium emulation, not a physical iPhone; native messaging-app handoff should also be checked on the owner's phone.

## Loading performance

The supplied photo remains unchanged. A new lossless WebP decodes to exactly the same RGBA pixels as the original PNG (1,348 × 889). File size falls from 1,759,192 to 709,584 bytes, a 59.7% reduction. The original PNG remains the fallback.

A single before/after local Chromium lab comparison used a 390 × 844 mobile viewport, 150 ms network latency, 200,000 bytes/second download throughput, and 4× CPU slowdown. Largest Contentful Paint decreased from approximately 10.3 to 5.1 seconds. This is a directional lab result, not production Core Web Vitals or a guarantee of phone performance; the throttled result still leaves room for future improvement. No video payload is requested before playback.
