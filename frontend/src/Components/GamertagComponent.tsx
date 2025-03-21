import { useState, ChangeEvent, FormEvent } from "react";
import "../Styles/GamertagComponent.css";

interface Props {
  primaryTag: string;
  setPrimaryTag: (tag: string) => void;
}

const GamertagComponent = ({primaryTag, setPrimaryTag} : Props) => {

  const [error, setError] = useState<string | null>(null);

  const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrimaryTag(event.target.value);
    if (error && event.target.value.trim()) {
      setError(null);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    
    if (!primaryTag.trim()) {
      setError("Primary gamertag is required");
      return;
    }
    
  };

  return (
    <div className="gamertag-container">
      <h1 className="gamertag-title">Enter Gamertags</h1>
      
      <form onSubmit={handleSubmit} className="gamertag-form">
        <div className="form-group">
          <label htmlFor="primary-tag" className="gamertag-label">
            Primary Gamertag <span className="required">*</span>
          </label>
          <input
            id="primary-tag"
            type="text"
            value={primaryTag}
            onChange={handlePrimaryChange}
            placeholder="Enter primary gamertag"
            className="gamertag-input"
            required
          />
        </div>

        {error && <div className="gamertag-error">{error}</div>}
      </form>
    </div>
  );
};

export default GamertagComponent;