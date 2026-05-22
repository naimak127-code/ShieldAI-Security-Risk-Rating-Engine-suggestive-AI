import React from 'react'

const CARDS = [
  { id: 'total',    icon: '🐛', label: 'Total Flaws',     note: 'All categories',        color: 'var(--accent)' },
  { id: 'critical', icon: '⛔', label: 'Critical Risks',  note: 'Score ≥ 9.0',           color: 'var(--red)'    },
  { id: 'exploits', icon: '⚡', label: 'Active Exploits', note: 'Exploited in the wild', color: 'var(--orange)' },
  { id: 'score',    icon: '🛡', label: 'Security Score',  note: '10 = fully secure',     color: 'var(--green)'  },
]

export default function MetricCards({ metrics }) {
  return (
    <div className="metrics-grid">
      {CARDS.map(c => (
        <div key={c.id} className="metric-card">
          <div className="metric-top" style={{ background: c.color }} />
          <div className="metric-emoji">{c.icon}</div>
          <div className="metric-lbl">{c.label}</div>
          <div className="metric-val">{metrics[c.id] ?? '—'}</div>
          <div className="metric-note">{c.note}</div>
        </div>
      ))}
    </div>
  )
}
