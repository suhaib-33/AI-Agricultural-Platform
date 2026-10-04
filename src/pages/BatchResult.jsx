import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GradeCard from "../components/GradeCard";
import QRCode from "../components/QRCode";
import { getBatch } from "../lib/db";

function BatchResult() {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    getBatch(id).then(setBatch);
  }, [id]);

  if (!batch) {
    return <div className="page-container"><div className="card empty-state"><h2>Batch not found</h2><p>This batch is not stored in this browser.</p><Link className="primary-button" to="/saved-batches">Saved Batches</Link></div></div>;
  }

  const { formData, analysis, photos } = batch;
  const displayDate = new Date(`${formData.dateDried}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="page-container">
      <div className="page-title result-title">
        <span className="verified-badge">✓ AI GRADED</span>
        <h1>Batch #{id}</h1>
        <p>Your AI quality result and digital batch record are ready.</p>
      </div>

      <GradeCard analysis={analysis} />

      <div className="result-grid">
        <section className="card">
          <div className="section-heading"><div><span className="eyebrow">BATCH RECORD</span><h2>About this batch</h2></div></div>
          <div className="detail-list">
            <div><span>Product</span><strong>{formData.product}</strong></div>
            <div><span>Origin</span><strong>{formData.village}, Chitral</strong></div>
            <div><span>Quantity</span><strong>{formData.quantity} kg</strong></div>
            <div><span>Drying method</span><strong>{formData.dryingMethod}</strong></div>
            <div><span>Date dried</span><strong>{displayDate}</strong></div>
          </div>
        </section>

        <section className="card">
          <span className="eyebrow">VERIFICATION</span>
          <h2>Buyer QR code</h2>
          <p className="muted">A buyer can scan this code to view the batch record on this device.</p>
          <QRCode batchId={id} />
        </section>
      </div>

      <section className="card">
        <span className="eyebrow">AI QUALITY BREAKDOWN</span>
        <h2>What the vision analysis found</h2>
        <div className="quality-grid">
          <QualityItem label="Colour" value={analysis.colour} />
          <QualityItem label="Visible defects" value={analysis.defects} />
          <QualityItem label="Mould" value={analysis.mould} />
          <QualityItem label="Foreign matter" value={analysis.foreignMatter} />
          <QualityItem label="Size uniformity" value={analysis.uniformity} />
          <QualityItem label="Breakage" value={analysis.breakage} />
        </div>

        <div className="findings-box">
          <h3>AI findings</h3>
          <ul>{analysis.findings.map((finding) => <li key={finding}>{finding}</li>)}</ul>
          <p>{analysis.summary}</p>
        </div>
      </section>

      <section className="card">
        <span className="eyebrow">GRADING EVIDENCE</span>
        <h2>Photos used by the AI</h2>
        <div className="evidence-grid">
          {photos.map((photo) => <img key={photo.name} src={photo.dataUrl} alt="Batch evidence" />)}
        </div>
      </section>

      <div className="center-actions">
        <Link className="primary-button" to={`/verify/${id}`}>Open Buyer Verification Page →</Link>
        <Link className="secondary-button" to="/create-batch">Grade Another Batch</Link>
        <Link className="secondary-button" to="/saved-batches">Saved Batches</Link>
      </div>
    </div>
  );
}

function QualityItem({ label, value }) {
  return <div className="quality-item"><div><span>{label}</span><strong>{value}%</strong></div><div className="mini-track"><div className="mini-fill" style={{ width: `${value}%` }} /></div></div>;
}

export default BatchResult;
