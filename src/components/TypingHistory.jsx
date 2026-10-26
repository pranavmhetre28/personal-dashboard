
function TypingHistory({ sessions, onDeleteSession }) {
  const sortedSessions = [...sessions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Typing history</h2>
        <span className="muted">
          {sessions.length}{" "}
          {sessions.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {sortedSessions.length === 0 ? (
        <p className="empty-state">
          No scores yet. Add your first session!
        </p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sortedSessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.date}</td>
                  <td className="wpm-value">{session.wpm}</td>
                  <td>
                    {session.accuracy == null
                      ? "—"
                      : `${session.accuracy}%`}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Delete the typing record for ${session.date}?`
                        );

                        if (confirmed) {
                          onDeleteSession(session.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default TypingHistory;
