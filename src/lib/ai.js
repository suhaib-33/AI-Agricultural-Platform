// Presentation-mode AI simulation.
// This file intentionally does NOT call Gemini or any external API.
// It returns realistic-looking structured vision results after a short delay
// so the prototype can be demonstrated without API quotas or network issues.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RESULTS = {
  "Dried Apricots": {
    grade: "A",
    score: 87,
    colour: 92,
    defects: 88,
    mould: 98,
    foreignMatter: 94,
    uniformity: 81,
    breakage: 79,
    findings: [
      "Good colour consistency across the visible batch",
      "Low visible defect rate",
      "No significant mould-like areas detected visually",
      "Very little visible foreign matter",
      "Some variation in size and shape",
      "Minor breakage visible in a small number of pieces",
    ],
    summary:
      "The batch shows strong visible quality overall, with good colour consistency and low visible defects. Some variation in size and minor breakage prevent a higher score.",
  },
  Walnuts: {
    grade: "A",
    score: 84,
    colour: 88,
    defects: 84,
    mould: 97,
    foreignMatter: 93,
    uniformity: 78,
    breakage: 76,
    findings: [
      "Natural and reasonably consistent shell colour",
      "Low visible surface damage",
      "No significant mould-like areas detected visually",
      "Low visible foreign matter",
      "Moderate variation in size",
      "Some cracked or broken pieces are visible",
    ],
    summary:
      "The batch appears visually good overall. The main areas reducing the score are size variation and a small amount of visible breakage.",
  },
};

export async function analyzeBatchImages({ photos, product }) {
  if (!photos?.length) {
    throw new Error("No photos were provided for analysis.");
  }

  // Deliberately simulate a real vision-model request.
  // The staged delay makes the presentation feel like an actual image-analysis job.
  await sleep(900);
  await sleep(900);
  await sleep(900);
  await sleep(800);
  await sleep(700);

  const base = RESULTS[product] || RESULTS["Dried Apricots"];

  // Slightly vary the score based on the number of supplied photos so repeated
  // demo batches do not always look identical while remaining deterministic.
  const adjustment = Math.min(2, Math.max(0, photos.length - 1));
  const analysis = {
    ...base,
    score: Math.min(100, base.score + adjustment),
    demoMode: true,
    model: "Vision Quality Model",
    analyzedAt: Date.now(),
  };

  return analysis;
}
