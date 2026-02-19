import React, { useState, useEffect } from 'react';

const RANK_LABELS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard component: fetched data', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard component: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 loading-container">
        <div className="spinner-border text-warning me-2" role="status" aria-hidden="true"></div>
        <span className="text-muted">Loading leaderboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <strong className="me-2">⚠️ Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-4">
      <div className="card octofit-card">
        <div className="card-header bg-warning text-dark d-flex align-items-center gap-2">
          <span className="fs-4">🏆</span>
          <h2 className="h5 mb-0 page-heading">Leaderboard</h2>
          <span className="badge bg-dark ms-auto">{entries.length} teams</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Total Calories</th>
                  <th>Total Activities</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted empty-state">No leaderboard entries found</td>
                  </tr>
                ) : (
                  entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <span className={`badge rank-${entry.rank} px-2 py-1`}>
                          {RANK_LABELS[entry.rank] || `#${entry.rank}`}
                        </span>
                      </td>
                      <td className="fw-semibold">{entry.team_name || entry.team_id}</td>
                      <td>
                        <span className="badge bg-success">🔥 {entry.total_calories} kcal</span>
                      </td>
                      <td>{entry.total_activities}</td>
                      <td className="small">{entry.updated_at ? new Date(entry.updated_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
