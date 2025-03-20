import "../Styles/ResultsComponent.css"; // Import the CSS file

interface ResultsProps {
  results: {
    texts: { [filename: string]: string };
    matches: { 
      [filename: string]: { 
        primary_tag_found: boolean;
        secondary_tag_found: boolean | null;
      }
    };
    primary_tag: string;
    secondary_tag: string | null;
  } | null;
}

export default function ResultsComponent({ results }: ResultsProps) {
  if (!results) return null;

  return (
    <div className="results-container">
      <h2>Extracted Texts:</h2>
      <div className="text-section">
        {Object.entries(results.texts).map(([filename, text]) => (
          <div key={filename} className="file-result">
            <h3>File: {filename}</h3>
            <p className="extracted-text">{text}</p>
          </div>
        ))}
      </div>
      
      <h2>Matches:</h2>
      <div className="matches-section">
        {Object.entries(results.matches).map(([filename, matchData]) => (
          <div key={filename} className="file-match">
            <h3>Match for {filename}:</h3>
            <div className="match-results">
              <p>Primary tag found: {matchData.primary_tag_found ? "Yes" : "No"}</p>
              <p>Secondary tag found: {matchData.secondary_tag_found === null ? "N/A" : matchData.secondary_tag_found ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="tags-section">
        <h3>Primary Gamertag:</h3>
        <p>{results.primary_tag || "N/A"}</p>
      </div>
      
      <div className="tags-section">
        <h3>Secondary Gamertag:</h3>
        <p>{results.secondary_tag || "N/A"}</p>
      </div>
    </div>
  );
}