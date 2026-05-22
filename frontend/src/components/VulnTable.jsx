import React, { useState } from 'react'

const FILTERS = ['all', 'web', 'backend', 'network']

function riskMeta(score) {
  const s = parseFloat(score)
  if (s >= 9) return { label: 'Critical', cls: 'r-critical' }
  if (s >= 7) return { label: 'High',     cls: 'r-high'     }
  if (s >= 4) return { label: 'Medium',   cls: 'r-medium'   }
  return             { label: 'Low',      cls: 'r-low'      }
}

function isExploited(v) {
  const val = v.is_exploited ?? v.exploited ?? ''
  if (typeof val === 'boolean') return val
  return String(val).toLowerCase().includes('yes')
}

export default function VulnTable({ vulns }) {
  const [filter, setFilter] = useState('all')

  const list = filter === 'all'
    ? vulns
    : vulns.filter(v => (v.source ?? '').toLowerCase().includes(filter))

  return (
    <div className="inner-card">
      <div className="filter-row">
        <div className="filter-label">📋 Vulnerability Intelligence</div>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="vuln-table">
          <thead>
            <tr>
              <th>CVE / ID</th>
              <th>Source</th>
              <th>Description</th>
              <th>EPSS</th>
              <th>Risk</th>
              <th>Exploited</th>
              <th>AI Fix</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-cell">
                  🔍 No vulnerabilities in this category.
                </td>
              </tr>
            ) : list.map((v, i) => {
              const score  = parseFloat(v.risk_score ?? 0)
              const r      = riskMeta(score)
              const exp    = isExploited(v)
              return (
                <tr key={i}>
                  <td><span className="cve-badge">{v.cve ?? 'N/A'}</span></td>
                  <td style={{ fontWeight: 600, color: '#3a5a7a', fontSize: 11, whiteSpace: 'nowrap' }}>
                    {v.source ?? '—'}
                  </td>
                  <td style={{ maxWidth: 190, color: '#2a3f55' }}>{v.description ?? '—'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--blue)', whiteSpace: 'nowrap' }}>
                    {v.epss_prob ?? v.epss ?? '—'}
                  </td>
                  <td>
                    <span className={`risk-badge ${r.cls}`}>
                      {r.label} {score.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className={exp ? 'exploit-y' : 'exploit-n'}>
                      {exp ? '⚠ YES' : '✓ NO'}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: '#3b5a7a', maxWidth: 190, lineHeight: 1.5 }}>
                    {v.suggestion ?? v.ai_suggestion ?? '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
