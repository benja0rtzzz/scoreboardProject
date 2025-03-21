import "../Styles/ResultsComponent.css"; // Import the CSS file

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

interface ResultsComponentProps {
  results: ApiResponse | null;
  images: FileList | null;
}

export default function ResultsComponent({ results, images }: ResultsComponentProps) {
  if (!results || results.length === 0) return <p>No results available.</p>;

  // Calculate total statistics
  const totalStats = results.reduce(
    (acc, item) => {
      if (item.player1) {
        acc.totalKills += item.player1.kills;
        acc.totalDeaths += item.player1.deaths;
        acc.totalScore += item.player1.score;
        acc.KD = acc.totalKills / acc.totalDeaths;
      }
      if (item.player2) {
        acc.totalKills += item.player2.kills;
        acc.totalDeaths += item.player2.deaths;
        acc.totalScore += item.player2.score;
        acc.KD = acc.totalKills / acc.totalDeaths;
      }
      return acc;
    },
    { totalKills: 0, totalDeaths: 0, totalScore: 0, KD: 0 }
    
  );

  return (
    <div className="results-container">
      <h2>Player Results:</h2>
      {results.map((item, index) => (
        <div key={index} className="result-item">
          <h3>Filename: {item.filename}</h3>
          <div className="players-section">
            {item.player1 ? (
              <div className="player-result">
                <h3>Player 1: {item.player1.gamertag}</h3>
                <p>Kills: {item.player1.kills}</p>
                <p>Deaths: {item.player1.deaths}</p>
                <p>Score: {item.player1.score}</p>
              </div>
            ) : (
              <p>No Player 1 data available.</p>
            )}
          </div>

          <img
            src={URL.createObjectURL(images![index])}
            alt={`Screenshot ${index + 1}`}
            className="screenshot"
          />

        </div>
      ))}

      <div className="statistics-section">
        <h3>Overall Statistics</h3>
        <p>Total Kills: {totalStats.totalKills}</p>
        <p>Total Deaths: {totalStats.totalDeaths}</p>
        <p>KD: {totalStats.KD}</p>
        <p>Total Score: {totalStats.totalScore}</p>
      </div>
    </div>
  );
}
