import { useEffect, useState } from "react";
import axios from "axios";
import UploadComponent from "./Components/UploadComponent";
import GamertagComponent from "./Components/GamertagComponent";
import ResultsComponent from "./Components/ResultsComponent";

import "./Styles/App.css";

// Define the API Response interface
interface Player {
  gamertag: string;
  kills: number;
  deaths: number;
  score: number;
}

interface ApiResponseItem {
  filename: string;
  player1: Player | null;
  player2: Player | null;
}

type ApiResponse = ApiResponseItem[];

export function App() {
  // Images
  const [images, setImages] = useState<FileList | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);

  // Gamertags
  const [primaryTag, setPrimaryTag] = useState<string>("");

  // Handle form submission
  const [atLeastOneImage, setAtLeastOneImage] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!images) return;

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("files", images[i]);
    }

    formData.append("primary_tag", primaryTag);

    try {
      const response = await axios.post<ApiResponse>(
        // URL to the backend server
        "http://127.0.0.1:8000/upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  useEffect(() => {
    setAtLeastOneImage(images !== null && images.length > 0);
  }, [images]);

  return (
    <div className="app-container">
      <h1 className="title">ScoreBoard Analyzer</h1>
      <div className="component-container">
        
        <div className="card-2x">
          <UploadComponent images={images} setImages={setImages} />
          <GamertagComponent
            primaryTag={primaryTag}
            setPrimaryTag={setPrimaryTag}
          />
        </div>

        <button
            type="submit"
            className="submit-button"
            disabled={!primaryTag.trim() || !atLeastOneImage}
            onClick={handleUpload}
          >
            Analyze Scoreboards
          </button>

        <div className="results-card">
          <h1 className="subtitle">Your results will show up here: </h1>
          <ResultsComponent results={results ?? null} images={images} />
        </div>
      </div>
    </div>
  );
}

export default App;
