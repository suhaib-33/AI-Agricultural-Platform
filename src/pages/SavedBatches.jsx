import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBatch, getAllBatches } from "../lib/db";

function SavedBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadBatches() {
    setLoading(true);
    const records = await getAllBatches();
    setBatches(records);
    setLoading(false);
  }

  useEffect(() => {
    loadBatches();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this saved batch?")) return;
    await deleteBatch(id);
    loadBatches();
  }

  return (
    <div className="page-container">
      <div className="page-title">
        <span className="eyebrow">LOCAL DATABASE</span>
        <h1>Saved batches</h1>
        <p>Your analyzed batches are stored locally in this browser.</p>
      </div>

      {loading ? (
        <div className="card empty-state">Loading saved batches...</div>
      ) : batches.length === 0 ? (
        <div className="card empty-state">
          <h2>No saved batches yet</h2>
          <p>Analyze your first batch and it will appear here.</p>
          <Link className="primary-button" to="/create-batch">Grade a Batch</Link>
        </div>
      ) : (
        <div className="saved-grid">
          {batches.map((batch) => (
            <article className="saved-card" key={batch.id}>
              <div className="saved-card-top">
                <div className="saved-grade">{batch.analysis.grade}</div>
                <div>
                  <span className="eyebrow">{batch.id}</span>
                  <h2>{batch.formData.product}</h2>
                </div>
              </div>

              <div className="saved-details">
                <span>{batch.formData.village}, Chitral</span>
                <strong>{batch.analysis.score}/100</strong>
              </div>

              <div className="saved-actions">
                <Link className="primary-button" to={`/batch/${batch.id}`}>View Batch</Link>
                <button className="secondary-button" onClick={() => handleDelete(batch.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedBatches;
