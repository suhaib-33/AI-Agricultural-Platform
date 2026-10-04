const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

const responseSchema = {
  type: "object",
  properties: {
    grade: { type: "string", enum: ["A", "B", "C", "D"] },
    score: { type: "integer", minimum: 0, maximum: 100 },
    colour: { type: "integer", minimum: 0, maximum: 100 },
    defects: { type: "integer", minimum: 0, maximum: 100 },
    mould: { type: "integer", minimum: 0, maximum: 100 },
    foreignMatter: { type: "integer", minimum: 0, maximum: 100 },
    uniformity: { type: "integer", minimum: 0, maximum: 100 },
    breakage: { type: "integer", minimum: 0, maximum: 100 },
    findings: { type: "array", items: { type: "string" } },
    summary: { type: "string" },
  },
  required: [
    "grade",
    "score",
    "colour",
    "defects",
    "mould",
    "foreignMatter",
    "uniformity",
    "breakage",
    "findings",
    "summary",
  ],
};

function dataUrlToPart(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mimeType = header.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
  return { inline_data: { mime_type: mimeType, data: base64 } };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTemporaryError(status) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

async function requestModel({ model, apiKey, body }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${url}?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return await response.json();
      }

      let message = `Gemini request failed (${response.status}).`;
      try {
        const error = await response.json();
        message = error?.error?.message || message;
      } catch {
        // Keep the HTTP status message when the API does not return JSON.
      }

      lastError = new Error(message);
      lastError.status = response.status;

      if (!isTemporaryError(response.status)) throw lastError;

      // Gemini can temporarily return 429/503 during demand spikes.
      if (attempt < 2) await sleep(1200 * 2 ** attempt);
    } catch (error) {
      if (error?.status && !isTemporaryError(error.status)) throw error;
      lastError = error;
      if (attempt < 2) await sleep(1200 * 2 ** attempt);
    }
  }

  throw lastError || new Error("Gemini request failed.");
}

export async function analyzeBatchImages({ photos, product, village }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file and restart Vite.");
  }

  const prompt = `You are the visual quality assessment assistant for ChitralDry, a prototype for grading dried fruits from Chitral, Pakistan.

Analyze the supplied photo(s) of a batch of ${product}. The stated origin is ${village || "Chitral"}.

IMPORTANT:
- Base your assessment ONLY on what is visibly supported by the photos.
- Do not invent details that cannot be seen.
- This is a visual prototype assessment, not a laboratory food-safety test.
- Higher scores mean better visible quality.
- Assess: colour consistency, visible defects/damage, visible mould, visible foreign matter, size/uniformity, and breakage.
- Consider all supplied photos together.
- Give conservative scores when images are unclear or evidence is insufficient.
- Grade: A = 85-100, B = 70-84, C = 50-69, D = 0-49.
- The overall score should reflect the six indicators.
- Findings must be short observations grounded in the images.
- Never claim the product is microbiologically safe or laboratory-certified.

Return only the requested JSON object.`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          ...photos.map((photo) => dataUrlToPart(photo.dataUrl)),
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema,
    },
  };

  let lastError = null;

  for (const model of MODELS) {
    try {
      const data = await requestModel({ model, apiKey, body });
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("Gemini returned no analysis. Try clearer photos and analyze again.");
      }

      const analysis = JSON.parse(text);
      return analysis;
    } catch (error) {
      lastError = error;

      // Try the next model for temporary capacity/model availability errors.
      if (!isTemporaryError(error?.status) && error?.status !== 404) {
        throw error;
      }
    }
  }

  if (lastError?.status === 429 || lastError?.status === 503) {
    throw new Error(
      "Gemini is temporarily busy or rate-limited. The app tried multiple Gemini models. Please wait 20–30 seconds and try again."
    );
  }

  throw new Error(lastError?.message || "Gemini analysis failed. Please try again.");
}
