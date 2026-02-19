import React, { useState, useEffect } from 'react';

const activityTypeColor = {
  Running: 'success',
  Cycling: 'info',
  Swimming: 'primary',
  Yoga: 'warning',
  Strength: 'danger',
};

function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  useEffect(() => {
    console.log('Activities component: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log('Activities component: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities component: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="container mt-4 loading-container">
        <div className="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
        <span className="text-muted">Loading activities…</span>
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
        <div className="card-header bg-dark text-white d-flex align-items-center gap-2">
          <span className="fs-4">🏃</span>
          <h2 className="h5 mb-0 page-heading">Activities</h2>
          <span className="badge bg-secondary ms-auto">{activities.length}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Type</th>
                  <th>Duration (min)</th>
                  <th>Calories</th>
                  <th>Distance (km)</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted empty-state">No activities found</td>
                  </tr>
                ) : (
                  activities.map((activity, idx) => (
                    <tr key={activity.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td>{activity.user_id}</td>
                      <td>
                        <span className={`badge bg-${activityTypeColor[activity.activity_type] || 'secondary'}`}>
                          {activity.activity_type}
                        </span>
                      </td>
                      <td>{activity.duration}</td>
                      <td>{activity.calories}</td>
                      <td>{activity.distance != null ? activity.distance : <span className="text-muted">N/A</span>}</td>
                      <td className="small">{activity.notes || <span className="text-muted">N/A</span>}</td>
                      <td className="small">{activity.created_at ? new Date(activity.created_at).toLocaleDateString() : 'N/A'}</td>
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

export default Activities;
