import { useState, ChangeEvent } from "react";
import "../Styles/UploadComponent.css";

interface Props {
  images: FileList | null;
  setImages: (images: FileList | null) => void;
}

export default function UploadComponent({
  images,
  setImages,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const MAX_FILES = 6;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > MAX_FILES) {
      setError(`Please select a maximum of ${MAX_FILES} files.`);
      event.target.value = "";
      return;
    }

    setError(null);
    setImages(files);
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">Image Upload</h1>

      <div className="upload-form-group">
        <label className="upload-label">Select images (max {MAX_FILES})</label>
        <div className="upload-input-wrapper">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="upload-input"
          />
        </div>
        {images && (
          <p className="upload-file-count">
            {images.length} {images.length === 1 ? "file" : "files"} selected
          </p>
        )}
      </div>

      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}
