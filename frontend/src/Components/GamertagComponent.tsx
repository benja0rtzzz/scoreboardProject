import { useState, ChangeEvent, FormEvent } from "react";
import "../Styles/GamertagComponent.css";

interface Props {
  primaryTag: string;
  secondaryTag: string;
  setPrimaryTag: (tag: string) => void;
  setSecondaryTag: (tag: string) => void;
}

const GamertagComponent = ({primaryTag, secondaryTag, setPrimaryTag, setSecondaryTag} : Props) => {

  const [error, setError] = useState<string | null>(null);

  const handlePrimaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPrimaryTag(event.target.value);
    if (error && event.target.value.trim()) {
      setError(null);
    }
  };

  const handleSecondaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecondaryTag(event.target.value);
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

        <div className="form-group">
          <label htmlFor="secondary-tag" className="gamertag-label">
            Secondary Gamertag <span className="optional">(optional)</span>
          </label>
          <input
            id="secondary-tag"
            type="text"
            value={secondaryTag}
            onChange={handleSecondaryChange}
            placeholder="Enter secondary gamertag (optional)"
            className="gamertag-input"
          />
        </div>

        {error && <div className="gamertag-error">{error}</div>}
      </form>
    </div>
  );
};

export default GamertagComponent;