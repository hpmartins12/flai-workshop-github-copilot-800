import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Teams component: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams component: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 loading-container">
        <div className="spinner-border text-success me-2" role="status" aria-hidden="true"></div>
        <span className="text-muted">Loading teams…</span>
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
        <div className="card-header bg-success text-white d-flex align-items-center gap-2">
          <span className="fs-4">🤝</span>
          <h2 className="h5 mb-0 page-heading">Teams</h2>
          <span className="badge bg-dark ms-auto">{teams.length}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Team Name</th>
                  <th>Description</th>
                  <th>Members</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted empty-state">No teams found</td>
                  </tr>
                ) : (
                  teams.map((team, idx) => (
                    <tr key={team.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td className="fw-semibold">
                        <span className="badge bg-success me-2">🤝</span>{team.name}
                      </td>
                      <td className="small text-muted">{team.description || 'No description provided'}</td>
                      <td className="text-center"><span className="badge bg-secondary">{team.members_count ?? 0}</span></td>
                      <td className="small">{team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}</td>
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

export default Teams;
