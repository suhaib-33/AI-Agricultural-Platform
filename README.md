# ChitralDry — AI Vision Prototype

ChitralDry is a React + Vite prototype for photo-based quality grading and batch traceability for dried fruits.

## What changed

- Real Gemini vision analysis instead of mock grading data.
- AI analyzes uploaded batch photos for colour, visible defects, mould, foreign matter, size uniformity, and breakage.
- Structured JSON from Gemini is used directly by the result screen.
- IndexedDB stores complete analyzed batch records locally.
- Saved Batches page lists previous analyses and allows deletion.
- Existing design and workflow are kept intentionally simple.

## Install

```bash
npm install
```

## API key

Copy `.env.example` to `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Then restart Vite:

```bash
npm run dev
```

## Important prototype limitation

Because this is a browser-only hackathon prototype, the Gemini key is exposed to the frontend. Do not use a production API key this way. For production, move the Gemini request to a backend/serverless function and keep the key server-side.

The local IndexedDB is also browser-local. A QR opened on a different device cannot retrieve the same local record. A production version needs a shared backend/database and public verification API.
