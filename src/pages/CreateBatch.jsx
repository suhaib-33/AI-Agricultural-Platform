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

function CreateBatch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [photos, setPhotos] = useState([]);

  function handleFormSubmit(event) {
    event.preventDefault();

    if (!formData.dateDried) {
      return;
    }

    window.sessionStorage.setItem(
      "chitralDryDraft",
      JSON.stringify({
        formData,
        photoNames: photos.map((photo) => photo.name),
      })
    );

    navigate("/analyze");
  }

  function handleAnalyze() {
    const draft = {
      formData,
      photos: photos.map((photo) => ({
        name: photo.name,
        url: photo.url,
      })),
    };

    window.sessionStorage.setItem("chitralDryDraft", JSON.stringify(draft));
    navigate("/analyze");
  }

  return (
    <div className="page-container narrow-page">
      <div className="page-title">
        <span className="eyebrow">NEW BATCH</span>
        <h1>Grade your batch</h1>
        <p>Enter a few details, then upload photos for the quality check.</p>
      </div>

      <BatchForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
      />

      <PhotoUpload
        photos={photos}
        setPhotos={setPhotos}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
}

export default CreateBatch;