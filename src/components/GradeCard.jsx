function GradeCard({ analysis }) {
  return (
    <div className="grade-card">
      <div className="grade-circle">{analysis.grade}</div>

      <div className="grade-copy">
        <span className="eyebrow">Quality grade</span>
        <h2>Grade {analysis.grade}</h2>
        <p>Based on the visual evidence uploaded for this batch.</p>
      </div>

      <div className="score-box">
        <strong>{analysis.score}</strong>
        <span>/100</span>
      </div>
    </div>
  );
}

export default GradeCard;