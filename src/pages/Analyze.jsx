import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockAnalysis = {
  grade: "A",
  score: 87,
  colour: 92,
  defects: 88,
  mould: 98,
  foreignMatter: 94,
  uniformity: 81,
  breakage: 79,
  findings: [
    "Good colour consistency",
    "Low visible defect rate",
    "No significant mould detected",
    "Low foreign matter",
    "Some size variation",
  ],
};

function Analyze() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentCheck, setCurrentCheck] = useState("Preparing photos...");

  useEffect(() => {
    const checks = [
      "Preparing photos...",
      "Checking colour...",
      "Checking visible defects...",
      "Checking mould...",
      "Checking foreign matter...",
      "Checking breakage...",
      "Preparing quality grade...",
    ];

    let value = 0;

    const interval = setInterval(() => {
      value += 10;
      setProgress(value);

      const index = Math.min(
        Math.floor(value / 15),
        checks.length - 1
      );
      setCurrentCheck(checks[index]);

      if (value >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          window.sessionStorage.setItem(
            "chitralDryAnalysis",
            JSON.stringify(mockAnalysis)
          );
          navigate("/batch/CD-001");
        }, 500);
      }
    }, 220);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="page-container narrow-page">
      <div className="analysis-page card">
        <div className="analysis-icon">CD</div>
        <span className="eyebrow">QUALITY CHECK</span>
        <h1>Analyzing your batch</h1>
        <p>
          This prototype is simulating the computer-vision grading process.
        </p>

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
          <span>✓ Breakage</span>
        </div>
      </div>
    </div>
  );
}

export default Analyze;