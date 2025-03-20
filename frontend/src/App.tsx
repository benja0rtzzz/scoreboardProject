import { useEffect, useState } from "react";
import axios from "axios";
import UploadComponent from "./Components/UploadComponent";
import GamertagComponent from "./Components/GamertagComponent";
import ResultsComponent from "./Components/ResultsComponent";

import "./Styles/App.css";

// Define the UploadResponse interface
interface ApiResponse {
  texts: { [filename: string]: string };
  matches: { 
    [filename: string]: { 
      primary_tag_found: boolean;
      secondary_tag_found: boolean | null;
    }
  };
  primary_tag: string;
  secondary_tag: string | null;
}

export function App() {
  // Images
  const [images, setImages] = useState<FileList | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);

  // Gamertags
  const [primaryTag, setPrimaryTag] = useState<string>("");
  const [secondaryTag, setSecondaryTag] = useState<string>("");

  // Handle form submission
  const [atLeastOneImage, setAtLeastOneImage] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!images) return;

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }

    formData.append("primary_tag", primaryTag);
    formData.append("secondary_tag", secondaryTag);

    try {
      const response = await axios.post<ApiResponse>(
        // URL to the backend server
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const { texts, matches, primary_tag, secondary_tag } = response.data;

      // Update states with the response data
      setResults({
        texts,
        matches,
        primary_tag,
        secondary_tag,
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    setAtLeastOneImage(images !== null && images.length > 0);
  }, [images]);

  return (
    <div className="app-container">
      <h1 className="title">Image Upload & Text Extraction</h1>

      <div className="card">
        <UploadComponent images={images} setImages={setImages} />
      </div>

      <div className="card">
        <GamertagComponent
          primaryTag={primaryTag}
          secondaryTag={secondaryTag}
          setPrimaryTag={setPrimaryTag}
          setSecondaryTag={setSecondaryTag}
        />
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={!primaryTag.trim() || !atLeastOneImage}
        onClick={handleUpload}
      >
        Submit Gamertags
      </button>
      <ResultsComponent results={results} />
    </div>
  );
}

export default App;
