import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <section className="hero page-container">
        <div className="hero-copy">
          <span className="pill">QUALITY · EVIDENCE · ORIGIN</span>
          <h1>Make the quality of Chitral's dried fruit visible.</h1>
          <p>
            ChitralDry turns a simple batch photo into a clear quality grade
            and a digital record that buyers can verify.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" to="/create-batch">
              Grade My Batch →
            </Link>
            <a className="secondary-button" href="#how-it-works">
              How it works
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="mini-label">SAMPLE BATCH</div>
          <div className="sample-product">Dried Apricots</div>

          <div className="sample-grade">
            <span>GRADE</span>
            <strong>A</strong>
          </div>

          <div className="sample-score">
            <span>Quality score</span>
            <strong>87 / 100</strong>
          </div>

          <div className="sample-checks">
            <span>✓ Colour</span>
            <span>✓ Low defects</span>
            <span>✓ No mould detected</span>
          </div>
        </div>
      </section>

      <section className="info-section" id="how-it-works">
        <div className="page-container">
          <div className="center-heading">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Three simple steps.</h2>
            <p>No complicated process for the producer or buyer.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span>01</span>
              <h3>Photograph</h3>
              <p>Upload clear photos of the dried fruit batch.</p>
            </div>

            <div className="step-card">
              <span>02</span>
              <h3>Grade</h3>
              <p>The prototype analyzes visual indicators and gives a grade.</p>
            </div>

            <div className="step-card">
              <span>03</span>
              <h3>Verify</h3>
              <p>A QR code lets a buyer view the batch record and evidence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;