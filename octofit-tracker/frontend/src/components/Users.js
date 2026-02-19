import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const apiUrl = `${baseUrl}/api/users/`;
  const teamsUrl = `${baseUrl}/api/teams/`;

  const fetchUsers = () => {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    fetch(teamsUrl)
      .then((r) => r.json())
      .then((data) => setTeams(Array.isArray(data) ? data : data.results || []))
      .catch(() => setTeams([]));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      team_id: user.team_id || '',
    });
    setSaveError(null);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setFormData({});
    setSaveError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveError(null);
    fetch(`${apiUrl}${editingUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return r.json();
      })
      .then(() => {
        setSaving(false);
        closeEdit();
        fetchUsers();
      })
      .catch((err) => {
        setSaveError(err.message);
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="container mt-4 loading-container">
        <div className="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
        <span className="text-muted">Loading users…</span>
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

  const teamName = (id) => {
    const t = teams.find((t) => String(t.id) === String(id));
    return t ? t.name : id;
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="card octofit-card">
        <div className="card-header bg-dark text-white d-flex align-items-center gap-2">
          <span className="fs-4">👤</span>
          <h2 className="h5 mb-0 page-heading">Users</h2>
          <span className="badge bg-secondary ms-auto">{users.length}</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped table-bordered mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted empty-state">No users found</td>
                  </tr>
                ) : (
                  users.map((user, idx) => (
                    <tr key={user.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td className="fw-semibold">{user.name}</td>
                      <td><span className="text-monospace">@{user.username}</span></td>
                      <td>
                        <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                      </td>
                      <td>
                        {user.team_id
                          ? <span className="badge bg-primary">{teamName(user.team_id)}</span>
                          : <span className="text-muted">N/A</span>}
                      </td>
                      <td className="small">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => openEdit(user)}
                          title="Edit user"
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Edit User — {editingUser.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEdit}></button>
              </div>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger small">{saveError}</div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team_id"
                    value={formData.team_id}
                    onChange={handleChange}
                  >
                    <option value="">— No team —</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
