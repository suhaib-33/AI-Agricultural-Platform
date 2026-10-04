import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "../components/QRCode";
import { getBatch } from "../lib/db";

function Verify() {
  const { id } = useParams();
  const [batch, setBatch] = useState(null);

  useEffect(() => { getBatch(id).then(setBatch); }, [id]);

  if (!batch) {
    return <div className="verify-page"><div className="verify-container"><div className="verify-card"><h2>Batch not available</h2><p>This QR code points to a batch that is not stored in this browser.</p><Link to="/" className="secondary-button">Back to ChitralDry</Link></div></div></div>;
  }

  const { formData, analysis, photos } = batch;
  const displayDate = new Date(`${formData.dateDried}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="verify-page">
      <div className="verify-header">
        <Link to="/" className="brand"><span className="brand-mark">CD</span><span>ChitralDry</span></Link>
        <span className="verified-badge">✓ VERIFIED BATCH</span>
      </div>

      <div className="verify-container">
        <div className="verify-hero">
          <span className="eyebrow">BATCH #{id}</span>
          <h1>{formData.product}</h1>
          <p>A digital quality record created from AI grading evidence.</p>
          <div className="big-grade"><div className="grade-letter">{analysis.grade}</div><div><span>QUALITY GRADE</span><strong>{analysis.score} / 100</strong></div></div>
        </div>

        <section className="verify-card"><span className="eyebrow">ORIGIN & BATCH DETAILS</span><div className="verify-details">
          <div><span>Origin</span><strong>{formData.village}, Chitral</strong></div>
          <div><span>Quantity</span><strong>{formData.quantity} kg</strong></div>
          <div><span>Drying method</span><strong>{formData.dryingMethod}</strong></div>
          <div><span>Date dried</span><strong>{displayDate}</strong></div>
        </div></section>

        <section className="verify-card"><span className="eyebrow">AI QUALITY ASSESSMENT</span><h2>Visual quality indicators</h2><div className="verify-quality-list">
          <VerifyMetric label="Colour consistency" value={analysis.colour} />
          <VerifyMetric label="Low visible defects" value={analysis.defects} />
          <VerifyMetric label="Mould check" value={analysis.mould} />
          <VerifyMetric label="Foreign matter" value={analysis.foreignMatter} />
          <VerifyMetric label="Size uniformity" value={analysis.uniformity} />
          <VerifyMetric label="Low breakage" value={analysis.breakage} />
        </div></section>

        <section className="verify-card"><span className="eyebrow">GRADING EVIDENCE</span><h2>Photos used for assessment</h2><div className="evidence-grid">{photos.map((photo) => <img key={photo.name} src={photo.dataUrl} alt="Verified batch" />)}</div></section>

        <section className="verify-card origin-card"><div><span className="eyebrow">TRACEABILITY</span><h2>Batch history</h2></div><div className="timeline">
          <TimelineItem title="Batch dried" date={displayDate} />
          <TimelineItem title="Batch photographed" date="Recorded" />
          <TimelineItem title="AI quality grade issued" date={`Grade ${analysis.grade}`} />
          <TimelineItem title="Digital record created" date={`#${id}`} />
        </div></section>

        <section className="verify-qr"><QRCode batchId={id} /><div><span className="eyebrow">VERIFICATION ID</span><h2>Batch #{id}</h2><p>This page shows the information associated with this ChitralDry batch record.</p></div></section>
      </div>
    </div>
  );
}

function VerifyMetric({ label, value }) { return <div className="verify-metric"><div><span>{label}</span><strong>{value}%</strong></div><div className="mini-track"><div className="mini-fill" style={{ width: `${value}%` }} /></div></div>; }
function TimelineItem({ title, date }) { return <div className="timeline-item"><span className="timeline-dot">✓</span><div><strong>{title}</strong><span>{date}</span></div></div>; }

export default Verify;
