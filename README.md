# ChitralDry

A simple React prototype for photo-based quality grading and batch traceability for dried apricots and walnuts.

## What the prototype demonstrates

1. Producer enters basic batch information.
2. Producer uploads up to three photos.
3. The app simulates a computer-vision quality analysis.
4. The app produces a Grade A / 87 score.
5. The app creates a batch record.
6. A QR code opens a buyer verification page.
7. The buyer sees the grade, batch details, quality indicators, photos, and a simple history.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Important

The quality analysis is MOCK DATA for the prototype. It does not actually use a computer-vision model.

The batch data is kept in `sessionStorage` only, so this is a frontend prototype rather than a production application.

## Next production steps

- Backend API
- Database
- Permanent image storage
- Authentication
- Real computer-vision model/API
- Persistent batch IDs
- Real verification URLs
