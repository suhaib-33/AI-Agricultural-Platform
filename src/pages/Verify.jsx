import { Link, useParams } from "react-router-dom";
import QRCode from "../components/QRCode";

const analysis = {
  grade: "A",
  score: 87,
  colour: 92,
  defects: 88,
  mould: 98,
  foreignMatter: 94,
  uniformity: 81,
  breakage: 79,
};

function Verify() {
  const { id } = useParams();

  const draft = JSON.parse(
    window.sessionStorage.getItem("chitralDryDraft") || "null"
  );

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
    <div className="verify-page">
      <div className="verify-header">
        <Link to="/" className="brand">
          <span className="brand-mark">CD</span>
          <span>ChitralDry</span>
        </Link>

        <span className="verified-badge">✓ VERIFIED BATCH</span>
      </div>

      <div className="verify-container">
        <div className="verify-hero">
          <span className="eyebrow">BATCH #{id}</span>
          <h1>{formData.product}</h1>
          <p>
            A digital quality record created from the batch's grading evidence.
          </p>

          <div className="big-grade">
            <div className="grade-letter">{analysis.grade}</div>
            <div>
              <span>QUALITY GRADE</span>
              <strong>{analysis.score} / 100</strong>
            </div>
          </div>
        </div>

        <section className="verify-card">
          <span className="eyebrow">ORIGIN & BATCH DETAILS</span>

          <div className="verify-details">
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

        <section className="verify-card">
          <span className="eyebrow">QUALITY ASSESSMENT</span>
          <h2>Visual quality indicators</h2>

          <div className="verify-quality-list">
            <VerifyMetric label="Colour consistency" value={analysis.colour} />
            <VerifyMetric label="Low visible defects" value={analysis.defects} />
            <VerifyMetric label="Mould check" value={analysis.mould} />
            <VerifyMetric
              label="Foreign matter"
              value={analysis.foreignMatter}
            />
            <VerifyMetric
              label="Size uniformity"
              value={analysis.uniformity}
            />
            <VerifyMetric label="Low breakage" value={analysis.breakage} />
          </div>
        </section>

        <section className="verify-card">
          <span className="eyebrow">GRADING EVIDENCE</span>
          <h2>Photos used for assessment</h2>

          {photos.length > 0 ? (
            <div className="evidence-grid">
              {photos.map((photo) => (
                <img key={photo.url} src={photo.url} alt="Verified batch" />
              ))}
            </div>
          ) : (
            <div className="placeholder-evidence">
              <span>PHOTO EVIDENCE</span>
              <p>Demo batch evidence would appear here.</p>
            </div>
          )}
        </section>

        <section className="verify-card origin-card">
          <div>
            <span className="eyebrow">TRACEABILITY</span>
            <h2>Batch history</h2>
          </div>

          <div className="timeline">
            <TimelineItem title="Batch dried" date={displayDate} />
            <TimelineItem title="Batch photographed" date="Recorded" />
            <TimelineItem title="Quality grade issued" date="Grade A" />
            <TimelineItem title="Digital record created" date={`#${id}`} />
          </div>
        </section>

        <section className="verify-qr">
          <QRCode batchId={id} />
          <div>
            <span className="eyebrow">VERIFICATION ID</span>
            <h2>Batch #{id}</h2>
            <p>
              This page shows the information associated with this ChitralDry
              batch record.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function VerifyMetric({ label, value }) {
  return (
    <div className="verify-metric">
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

function TimelineItem({ title, date }) {
  return (
    <div className="timeline-item">
      <span className="timeline-dot">✓</span>
      <div>
        <strong>{title}</strong>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default Verify;