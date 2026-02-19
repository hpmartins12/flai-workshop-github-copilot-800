import React, { useState, useEffect } from 'react';

const difficultyColor = {
  Easy:     'success',
  Beginner: 'success',
  Medium:   'warning',
  Moderate: 'warning',
  Hard:     'danger',
  Advanced: 'danger',
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Workouts component: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts component: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 loading-container">
        <div className="spinner-border text-danger me-2" role="status" aria-hidden="true"></div>
        <span className="text-muted">Loading workouts…</span>
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
        <div className="card-header bg-danger text-white d-flex align-items-center gap-2">
          <span className="fs-4">💪</span>
          <h2 className="h5 mb-0 page-heading">Workouts</h2>
          <span className="badge bg-dark ms-auto">{workouts.length}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Duration (min)</th>
                  <th>Calories Estimate</th>
                </tr>
              </thead>
              <tbody>
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted empty-state">No workouts found</td>
                  </tr>
                ) : (
                  workouts.map((workout, idx) => (
                    <tr key={workout.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td className="fw-semibold">{workout.name}</td>
                      <td>
                        {workout.category
                          ? <span className="badge bg-info text-dark">{workout.category}</span>
                          : <span className="text-muted">N/A</span>}
                      </td>
                      <td>
                        {workout.difficulty ? (
                          <span className={`badge bg-${difficultyColor[workout.difficulty] || 'secondary'}`}>
                            {workout.difficulty}
                          </span>
                        ) : <span className="text-muted">N/A</span>}
                      </td>
                      <td>{workout.duration} min</td>
                      <td>
                        {workout.calories_estimate != null
                          ? <span className="badge bg-success">🔥 {workout.calories_estimate} kcal</span>
                          : <span className="text-muted">N/A</span>}
                      </td>
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

export default Workouts;
