import React from 'react'

export default function Navbar({ view, setView, hasResults, onExport, status }) {
  return (
    <nav className="navbar">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); setView('home') }}>
        <div className="brand-icon">🛡</div>
        <div className="brand-text">
          <div className="brand-name">Shield<span>AI</span></div>
          <div className="brand-sub">Risk Intelligence</div>
        </div>
      </a>

      {view !== 'home' && (
        <div className="nav-center">
          <button
            className={`nav-tab ${view === 'scan' ? 'active' : ''}`}
            onClick={() => setView('scan')}
          >
            🔍 Scan
          </button>
          <button
            className={`nav-tab ${view === 'upload' ? 'active' : ''}`}
            onClick={() => setView('upload')}
          >
            📁 Upload
          </button>
        </div>
      )}

      <div className="nav-right">
        {hasResults && (
          <button className="btn-export" onClick={onExport}>
            📄 Export PDF
          </button>
        )}
        <div className="status-pill">
          <div className={`status-dot ${status}`}></div>
          <span>
            {status === 'scanning' ? 'Scanning…'
              : status === 'done'    ? 'Scan complete'
              : 'Idle'}
          </span>
        </div>
      </div>
    </nav>
  )
}
