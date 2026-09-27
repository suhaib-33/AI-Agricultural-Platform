import { Link, useParams } from "react-router-dom";
import GradeCard from "../components/GradeCard";
import QRCode from "../components/QRCode";

const defaultAnalysis = {
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

function BatchResult() {
  const { id } = useParams();

  const draft = JSON.parse(
    window.sessionStorage.getItem("chitralDryDraft") || "null"
  );

  const analysis = JSON.parse(
    window.sessionStorage.getItem("chitralDryAnalysis") || "null"
  ) || defaultAnalysis;

  const formData = draft?.formData || {
    product: "Dried Apricots",
    village: "Bumburet",
    quantity: "20",
    dryingMethod: "Raised Rack",
    dateDried: "2026-09-20",
  };

  const photos = draft?.photos || [];

  const displayDate = formData.dateDried
    ? new Date(`${formData.dateDried}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "20 Sep 2026";

  return (
    <div className="page-container">
      <div className="page-title result-title">
        <span className="verified-badge">✓ BATCH GRADED</span>
        <h1>Batch #{id}</h1>
        <p>Your quality result and digital batch record are ready.</p>
      </div>

      <GradeCard analysis={analysis} />

      <div className="result-grid">
        <section className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">BATCH RECORD</span>
              <h2>About this batch</h2>
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>Product</span>
              <strong>{formData.product}</strong>
            </div>
            <div>
              <span>Origin</span>
              <strong>{formData.village}, Chitral</strong>
            </div>
            <div>
              <span>Quantity</span>
              <strong>{formData.quantity} kg</strong>
            </div>
            <div>
              <span>Drying method</span>
              <strong>{formData.dryingMethod}</strong>
            </div>
            <div>
              <span>Date dried</span>
              <strong>{displayDate}</strong>
            </div>
          </div>
        </section>

        <section className="card">
          <span className="eyebrow">VERIFICATION</span>
          <h2>Buyer QR code</h2>
          <p className="muted">
            A buyer can scan this code to view the public batch record.
          </p>
          <QRCode batchId={id} />
        </section>
      </div>

      <section className="card">
        <span className="eyebrow">QUALITY BREAKDOWN</span>
        <h2>What the analysis found</h2>

        <div className="quality-grid">
          <QualityItem label="Colour" value={analysis.colour} />
          <QualityItem label="Visible defects" value={analysis.defects} />
          <QualityItem label="Mould" value={analysis.mould} />
          <QualityItem
            label="Foreign matter"
            value={analysis.foreignMatter}
          />
          <QualityItem label="Size uniformity" value={analysis.uniformity} />
          <QualityItem label="Breakage" value={analysis.breakage} />
        </div>

        <div className="findings">
          <h3>Summary</h3>
          {analysis.findings.map((finding) => (
            <p key={finding}>✓ {finding}</p>
          ))}
        </div>
      </section>

      <section className="card">
        <span className="eyebrow">GRADING EVIDENCE</span>
        <h2>Photos used for this grade</h2>

        {photos.length > 0 ? (
          <div className="evidence-grid">
            {photos.map((photo) => (
              <img key={photo.url} src={photo.url} alt="Batch evidence" />
            ))}
          </div>
        ) : (
          <div className="placeholder-evidence">
            <span>PHOTO</span>
            <p>Demo mode: upload photos to show them here.</p>
          </div>
        )}
      </section>

      <div className="center-actions">
        <Link className="primary-button" to={`/verify/${id}`}>
          Open Buyer Verification Page →
        </Link>
        <Link className="secondary-button" to="/create-batch">
          Grade Another Batch
        </Link>
      </div>
    </div>
  );
}

function QualityItem({ label, value }) {
  return (
    <div className="quality-item">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="mini-track">
        <div className="mini-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default BatchResult;