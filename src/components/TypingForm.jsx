
import { useState } from "react";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function TypingForm({ onAddSession }) {
  const [date, setDate] = useState(getLocalDate);
  const [wpm, setWpm] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const numericWpm = Number(wpm);
    const numericAccuracy =
      accuracy === "" ? null : Number(accuracy);

    if (!date) {
      setError("Please select a date.");
      return;
    }

    if (
      wpm.trim() === "" ||
      !Number.isFinite(numericWpm) ||
      numericWpm < 1 ||
      numericWpm > 500
    ) {
      setError("WPM must be between 1 and 500.");
      return;
    }

    if (
      numericAccuracy !== null &&
      (!Number.isFinite(numericAccuracy) ||
        numericAccuracy < 0 ||
        numericAccuracy > 100)
    ) {
      setError("Accuracy must be between 0 and 100.");
      return;
    }

    const result = onAddSession({
      date,
      wpm: numericWpm,
      accuracy: numericAccuracy,
    });

    setMessage(
      result === "updated"
        ? "That day's score has been updated."
        : "Typing score saved successfully."
    );

    setWpm("");
    setAccuracy("");
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Log a typing session</h2>
        <span className="muted">Manual entry</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="session-date">Date</label>
        <input
          id="session-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <div className="form-grid">
          <div>
            <label htmlFor="session-wpm">Typing speed (WPM)</label>
            <input
              id="session-wpm"
              type="number"
              min="1"
              max="500"
              step="1"
              value={wpm}
              onChange={(event) => setWpm(event.target.value)}
              placeholder="e.g. 78"
              required
            />
          </div>

          <div>
            <label htmlFor="session-accuracy">Accuracy (%)</label>
            <input
              id="session-accuracy"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={accuracy}
              onChange={(event) =>
                setAccuracy(event.target.value)
              }
              placeholder="e.g. 96.5"
            />
          </div>
        </div>

        <button type="submit" className="primary-button">
          Save score ↗
        </button>

        <p
          className={error ? "form-message error" : "form-message"}
          role="status"
        >
          {error || message}
        </p>

        <p className="hint">
          One entry per date. Saving again for that date updates
          the existing record.
        </p>
      </form>
    </section>
  );
}

export default TypingForm;
