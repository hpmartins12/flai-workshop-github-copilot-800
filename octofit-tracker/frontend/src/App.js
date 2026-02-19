import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import octoFitLogo from './octofitapp-small.svg';
import Users from './components/Users';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Workouts from './components/Workouts';

const features = [
  { to: '/users',       icon: '👤', title: 'Users',       desc: 'Manage athlete profiles and accounts.' },
  { to: '/activities',  icon: '🏃', title: 'Activities',   desc: 'Log and review fitness activities.' },
  { to: '/leaderboard', icon: '🏆', title: 'Leaderboard',  desc: 'See who is leading the pack.' },
  { to: '/teams',       icon: '🤝', title: 'Teams',        desc: 'Create and manage your fitness teams.' },
  { to: '/workouts',    icon: '💪', title: 'Workouts',     desc: 'Browse personalized workout suggestions.' },
];

function Home() {
  return (
    <>
      <div className="home-hero text-center">
        <img src={octoFitLogo} alt="OctoFit Tracker" style={{ height: 64, marginBottom: '1rem' }} />
        <h1 className="display-5 fw-bold">Welcome to OctoFit Tracker</h1>
        <p className="lead mb-0">
          Track your fitness activities, compete with teams, and stay motivated!
        </p>
      </div>
      <div className="container mb-5">
        <div className="row g-4 justify-content-center">
          {features.map((f) => (
            <div className="col-12 col-sm-6 col-lg-4" key={f.to}>
              <Link to={f.to} className="text-decoration-none">
                <div className="card feature-card h-100 text-center p-3">
                  <div className="card-body">
                    <span className="feature-icon">{f.icon}</span>
                    <h5 className="card-title fw-bold">{f.title}</h5>
                    <p className="card-text text-muted small">{f.desc}</p>
                  </div>
                  <div className="card-footer bg-transparent border-0">
                    <span className="btn btn-outline-primary btn-sm">View {f.title}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={octoFitLogo} alt="OctoFit Tracker" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {features.map((f) => (
                <li className="nav-item" key={f.to}>
                  <NavLink
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    to={f.to}
                  >
                    {f.icon} {f.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      <footer className="bg-dark text-secondary text-center py-3 mt-auto">
        <small>© {new Date().getFullYear()} OctoFit Tracker &mdash; Built with 💙 on GitHub Codespaces</small>
      </footer>
    </div>
  );
}

export default App;
