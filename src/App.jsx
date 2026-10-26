
import { useEffect, useState } from "react";
import TypingForm from "./components/TypingForm";
import TypingHistory from "./components/TypingHistory";
import "./App.css";

const STORAGE_KEY = "typing-sessions";

function createSessionId() {
  if (typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadSessions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (session) =>
        session &&
        typeof session.id === "string" &&
        typeof session.date === "string" &&
        Number.isFinite(session.wpm) &&
        (session.accuracy === null ||
          Number.isFinite(session.accuracy))
    );
  } catch {
    return [];
  }
}

function App() {
  const [sessions, setSessions] = useState(loadSessions);

  // Persist sessions whenever the state changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error("Could not save typing sessions:", error);
    }
  }, [sessions]);

  function addSession(newSession) {
    const existingSession = sessions.find(
      (session) => session.date === newSession.date
    );

    if (existingSession) {
      setSessions((previousSessions) =>
        previousSessions.map((session) =>
          session.date === newSession.date
            ? {
                ...newSession,
                id: session.id,
              }
            : session
        )
      );

      return "updated";
    }

    setSessions((previousSessions) => [
      ...previousSessions,
      {
        ...newSession,
        id: createSessionId(),
      },
    ]);

    return "added";
  }

  function deleteSession(id) {
    setSessions((previousSessions) =>
      previousSessions.filter((session) => session.id !== id)
    );
  }

  const sortedSessions = [...sessions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const latestSession = sortedSessions.at(-1);

  const bestWpm = sessions.length
    ? Math.max(...sessions.map((session) => session.wpm))
    : 0;

  const averageWpm = sessions.length
    ? Math.round(
        sessions.reduce((total, session) => total + session.wpm, 0) /
          sessions.length
      )
    : 0;

  return (
    <main className="dashboard">
      <header className="hero">
        <div className="brand">
          <span className="brand-icon">⌁</span>
          keystroke<span className="accent">.</span>
        </div>

        <p className="eyebrow">PERSONAL TRACKER · V1.0</p>
        <h1>Your typing, over time.</h1>
        <p className="hero-description">
          Log your daily Monkeytype results, track your progress,
          and build consistency one session at a time.
        </p>
      </header>

      <section className="stats">
        <article className="panel stat-card">
          <p className="stat-label">LATEST SPEED</p>
          <h2>
            {latestSession ? latestSession.wpm : "—"}
            <span> WPM</span>
          </h2>
          <p className="muted">
            {latestSession
              ? latestSession.date
              : "No sessions yet"}
          </p>
        </article>

        <article className="panel stat-card">
          <p className="stat-label">PERSONAL BEST</p>
          <h2>
            {sessions.length ? bestWpm : "—"}
            <span> WPM</span>
          </h2>
          <p className="muted">Highest recorded score</p>
        </article>

        <article className="panel stat-card">
          <p className="stat-label">AVERAGE SPEED</p>
          <h2>
            {sessions.length ? averageWpm : "—"}
            <span> WPM</span>
          </h2>
          <p className="muted">Across all recorded days</p>
        </article>

        <article className="panel stat-card">
          <p className="stat-label">DAYS LOGGED</p>
          <h2>{sessions.length}</h2>
          <p className="muted">Recorded dates</p>
        </article>
      </section>

      <TypingForm onAddSession={addSession} />

      <TypingHistory
        sessions={sessions}
        onDeleteSession={deleteSession}
      />

      <footer className="footer">
        Scores are stored in this browser on this device.
      </footer>
    </main>
  );
}

export default App;
