import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeBatchImages } from "../lib/ai";
import { saveBatch } from "../lib/db";

function makeBatchId() {
  return `CD-${Date.now().toString().slice(-6)}`;
}

function Analyze() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(5);
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
        ["Preparing photos...", 10],
        ["Connecting to vision model...", 20],
        ["Inspecting colour and appearance...", 36],
        ["Checking visible defects and damage...", 52],
        ["Checking for mould-like areas...", 68],
        ["Checking foreign matter and cleanliness...", 80],
        ["Assessing size, uniformity and breakage...", 91],
        ["Generating quality grade...", 97],
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

        setCurrentCheck("Analysis complete. Saving batch record...");
        setProgress(100);
        await saveBatch(batch);
        sessionStorage.removeItem("chitralDryDraft");
        navigate(`/batch/${batch.id}`, { replace: true });
      } catch (analysisError) {
        if (!cancelled) {
          setError(analysisError.message || "The analysis failed. Please try again.");
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
            ? "The quality analysis could not be completed. Check the message below and try again."
            : "The vision model is examining your uploaded photos and assessing the visible quality of the batch."}
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
            <strong>Analysis error</strong>
            <p>{error}</p>
            <button className="primary-button" onClick={() => navigate("/create-batch")}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyze;
