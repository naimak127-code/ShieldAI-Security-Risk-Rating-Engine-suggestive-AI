import React, { useState } from 'react'

const META = {
  Critical: { color: '#e63946', bg: '#fce9ea', icon: '🚨' },
  High:     { color: '#f4820d', bg: '#fef2e0', icon: '⚡' },
  Medium:   { color: '#c89b00', bg: '#fef9e0', icon: '⚠️'  },
  Low:      { color: '#1db87a', bg: '#e0f5ec', icon: '✅' },
}

function getPriority(score) {
  const s = parseFloat(score)
  if (s >= 9) return 'Critical'
  if (s >= 7) return 'High'
  if (s >= 4) return 'Medium'
  return 'Low'
}

export default function AIPanel({ vulns }) {
  const [open, setOpen] = useState(0)

  const sorted = [...vulns]
    .sort((a, b) => parseFloat(b.risk_score ?? 0) - parseFloat(a.risk_score ?? 0))
    .slice(0, 6)

  return (
    <div className="inner-card">
      <div className="card-label">🤖 AI Mitigation Plan</div>
      <div>
        {sorted.map((v, i) => {
          const priority = getPriority(v.risk_score)
          const m        = META[priority]
          const isOpen   = open === i
          const fix      = v.suggestion ?? v.ai_suggestion ?? 'No AI suggestion available.'

          return (
            <div key={i} className="ai-item"
              style={{ border: `1px solid ${m.color}25`, marginBottom: 8 }}>
              <div
                className="ai-header"
                style={{ background: isOpen ? m.bg : 'transparent' }}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="ai-icon">{m.icon}</span>
                <div className="ai-meta">
                  <div className="ai-title">{v.cve ?? 'Vulnerability'}</div>
                  <span className="ai-pill"
                    style={{ color: m.color, background: `${m.color}18` }}>
                    {priority}
                  </span>
                </div>
                <span className={`ai-chevron ${isOpen ? 'open' : ''}`}>▼</span>
              </div>
              <div
                className={`ai-body ${isOpen ? 'open' : ''}`}
                style={{ background: m.bg, borderTopColor: `${m.color}20` }}
              >
                {fix}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
