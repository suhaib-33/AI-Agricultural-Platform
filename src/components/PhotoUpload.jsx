import { useEffect, useRef } from "react";

function PhotoUpload({ photos, setPhotos, onAnalyze }) {
  const inputRef = useRef(null);

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);

    const newPhotos = files
      .slice(0, 3)
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));

    setPhotos(newPhotos);

    event.target.value = "";
  }

  function removePhoto(id) {
    setPhotos((current) => current.filter((photo) => photo.id !== id));
  }

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  return (
    <div className="card">
      <div className="section-heading">
        <span className="step-number">2</span>
        <div>
          <h2>Photos for grading</h2>
          <p>Upload up to 3 clear photos of the batch.</p>
        </div>
      </div>

      <button
        className="upload-box"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <span className="camera-icon">+</span>
        <strong>Add batch photos</strong>
        <span>JPG, PNG or HEIC · Up to 3 photos</span>
      </button>

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFiles}
      />

      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div className="photo-preview" key={photo.id}>
              <img src={photo.url} alt="Uploaded batch" />
              <button
                type="button"
                className="remove-photo"
                onClick={() => removePhoto(photo.id)}
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="primary-button full-button"
        type="button"
        disabled={photos.length === 0}
        onClick={onAnalyze}
      >
        Analyze Batch
      </button>
    </div>
  );
}

export default PhotoUpload;