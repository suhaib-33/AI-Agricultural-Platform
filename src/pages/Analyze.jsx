import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeBatchImages } from "../lib/ai";
import { saveBatch } from "../lib/db";

function makeBatchId() {
  return `CD-${Date.now().toString().slice(-6)}`;
}

function Analyze() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(8);
  const [currentCheck, setCurrentCheck] = useState("Preparing photos...");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    let progressTimer;

    async function runAnalysis() {
      const rawDraft = sessionStorage.getItem("chitralDryDraft");

      if (!rawDraft) {
        setError("No batch photos were found. Please create the batch again.");
        return;
      }

      const draft = JSON.parse(rawDraft);
      const checks = [
        ["Preparing photos...", 12],
        ["AI is checking colour...", 28],
        ["AI is checking visible defects...", 44],
        ["AI is checking mould...", 60],
        ["AI is checking foreign matter...", 74],
        ["AI is checking size and breakage...", 88],
        ["Preparing quality grade...", 96],
      ];

      let index = 0;
      progressTimer = setInterval(() => {
        if (index < checks.length) {
          setCurrentCheck(checks[index][0]);
          setProgress(checks[index][1]);
          index += 1;
        }
      }, 650);

      try {
        const analysis = await analyzeBatchImages({
          photos: draft.photos,
          product: draft.formData.product,
          village: draft.formData.village,
        });

        if (cancelled) return;

        const batch = {
          id: makeBatchId(),
          createdAt: Date.now(),
          formData: draft.formData,
          photos: draft.photos,
          analysis,
        };

        setCurrentCheck("AI analysis complete. Saving batch record...");
        setProgress(100);
        await saveBatch(batch);
        sessionStorage.removeItem("chitralDryDraft");
        navigate(`/batch/${batch.id}`, { replace: true });
      } catch (analysisError) {
        if (!cancelled) {
          setError(analysisError.message || "The AI analysis failed. Please try again.");
        }
      } finally {
        clearInterval(progressTimer);
      }
    }

    runAnalysis();

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
    };
  }, [navigate]);

  return (
    <div className="page-container narrow-page">
      <div className="analysis-page card">
        <div className="analysis-icon">AI</div>
        <span className="eyebrow">AI QUALITY CHECK</span>
        <h1>{error ? "Analysis could not be completed" : "Analyzing your batch"}</h1>
        <p>
          {error
            ? "The AI service could not complete the analysis. Check the message below and try again."
            : "Gemini is looking at your uploaded photos and assessing the visible quality of the batch."}
        </p>

        {!error && (
          <>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="progress-row">
              <span>{currentCheck}</span>
              <strong>{progress}%</strong>
            </div>

            <div className="analysis-checks">
              <span>✓ Colour</span>
              <span>✓ Defects</span>
              <span>✓ Mould</span>
              <span>✓ Foreign matter</span>
              <span>✓ Uniformity</span>
              <span>✓ Breakage</span>
            </div>
          </>
        )}

        {error && (
          <div className="analysis-error">
            <strong>AI error</strong>
            <p>{error}</p>
            <button className="primary-button" onClick={() => navigate("/analyze")}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyze;
