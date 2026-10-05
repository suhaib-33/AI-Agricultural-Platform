# ChitralDry — AI Quality Grading Prototype

A React prototype for photo-based grading and batch traceability of dried apricots and walnuts from Chitral.

## Presentation mode

This version uses a **local AI analysis simulation** instead of calling Gemini. It is intentional: the demo should work reliably without API-key limits, image-upload quotas, or internet failures.

When the user clicks **Analyze Batch**, the app:

1. Prepares the uploaded photos.
2. Shows staged vision-analysis progress.
3. Checks colour, defects, mould, foreign matter, uniformity and breakage.
4. Produces a realistic structured grade and score.
5. Saves the complete batch to IndexedDB.
6. Opens the batch result and QR verification page.

The delay is intentional so the interaction feels like a real AI vision request rather than an instant hardcoded result.

## Data storage

The prototype uses the browser's **IndexedDB** as a local database. Saved batches survive refreshes and browser restarts on the same browser/device.

## Main flow

Home → Create Batch → Upload Photos → AI Analysis → Grade Result → QR Verification

The **Saved Batches** tab lets the user reopen or delete previous batches.

## Install

```bash
npm install
npm run dev
```

No API key is required for this presentation version.

## Production version

For a production system, replace `src/lib/ai.js` with a server-side vision-model integration and move IndexedDB data to a shared backend database/storage system so QR verification works across different devices.
