import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BatchForm from "../components/BatchForm";
import PhotoUpload from "../components/PhotoUpload";

const initialForm = {
  product: "Dried Apricots",
  village: "",
  quantity: "",
  dryingMethod: "Raised Rack",
  dateDried: "",
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => reject(new Error("Image could not be read."));
      image.src = reader.result;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function CreateBatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleFormSubmit(event) {
    event.preventDefault();
    if (!formData.village || !formData.quantity || !formData.dateDried) {
      setError("Please complete the batch details before continuing.");
      return;
    }
    setError("");
    document.getElementById("photos-for-grading")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleAnalyze() {
    setError("");

    if (!formData.village || !formData.quantity || !formData.dateDried) {
      setError("Please complete the batch details before analyzing.");
      return;
    }

    if (photos.length === 0) {
      setError("Please upload at least one clear batch photo.");
      return;
    }

    try {
      setSaving(true);
      const photoData = await Promise.all(
        photos.map(async (photo) => ({
          name: photo.name,
          dataUrl: await fileToDataUrl(photo.file),
        }))
      );

      sessionStorage.setItem(
        "chitralDryDraft",
        JSON.stringify({ formData, photos: photoData })
      );

      navigate("/analyze");
    } catch {
      setError("The photos could not be prepared. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container narrow-page">
      <div className="page-title">
        <span className="eyebrow">NEW BATCH</span>
        <h1>Grade your batch</h1>
        <p>Enter a few details, then upload photos for the AI quality check.</p>
      </div>

      <BatchForm formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />
      <div id="photos-for-grading"><PhotoUpload photos={photos} setPhotos={setPhotos} onAnalyze={handleAnalyze} />
      </div>

      {error && <div className="error-message">{error}</div>}
      {saving && <p className="muted analysis-note">Preparing your photos...</p>}
    </div>
  );
}

export default CreateBatch;
