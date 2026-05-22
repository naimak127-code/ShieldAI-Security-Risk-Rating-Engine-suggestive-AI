import React from 'react'

const C = {
  red: '#e63946', orange: '#f4820d', yellow: '#c89b00',
  green: '#1db87a', navy: '#0b1e38', muted: '#7da0be', border: '#e2ecf5'
}

/* ── GAUGE ── */
export function GaugeChart({ value = 0 }) {
  const r  = 70, cx = 90, cy = 90, max = 10
  const pct   = Math.min(Math.max(value, 0), max) / max
  const sweep = 180 * pct
  const rad   = d => (d * Math.PI) / 180

  const x1 = cx + r * Math.cos(rad(180))
  const y1 = cy + r * Math.sin(rad(180))
  const x2 = cx + r * Math.cos(rad(180 + sweep))
  const y2 = cy + r * Math.sin(rad(180 + sweep))
  const largeArc = sweep > 180 ? 1 : 0
  const color = value >= 8 ? C.red : value >= 5 ? C.orange : C.green
  const label = value >= 8 ? 'Critical' : value >= 5 ? 'High Risk' : 'Low Risk'

  return (
    <div className="inner-card gauge-card">
      <div className="card-label">Overall Risk Score</div>
      <svg viewBox="0 0 180 100" width={180} height={100}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={C.border} strokeWidth={16} strokeLinecap="round" />
        {value > 0 && (
          <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth={16} strokeLinecap="round" />
        )}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.navy}>
          {value.toFixed(1)}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill={C.muted}>Risk Score</text>
        <text x={cx - r + 4} y={cy + 22} textAnchor="middle" fontSize={8} fill={C.green}>Low</text>
        <text x={cx + r - 4} y={cy + 22} textAnchor="middle" fontSize={8} fill={C.red}>Critical</text>
      </svg>
      <div className="gauge-badges">
        <span className="gauge-badge" style={{ background: `${color}20`, color }}>
          Risk: {value.toFixed(1)}
        </span>
        <span className="gauge-badge" style={{ background: '#e0f5ec', color: C.green }}>
          Safe: {Math.max(0, 10 - value).toFixed(1)}
        </span>
      </div>
    </div>
  )
}

/* ── DONUT ── */
export function DonutChart({ exploited = 0, safe = 0 }) {
  const total = exploited + safe
  const r = 42, cx = 55, cy = 55, stroke = 18
  const circ = 2 * Math.PI * r
  const pct  = total > 0 ? exploited / total : 0

  return (
    <div className="inner-card donut-card">
      <div className="card-label">Exploit Status</div>
      <svg viewBox="0 0 110 110" width={120} height={120}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
        {pct > 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.red}
            strokeWidth={stroke}
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
          />
        )}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize={15} fontWeight={800} fill={C.navy}>{exploited}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill={C.muted}>Exploited</text>
      </svg>
      <div className="donut-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: C.red }} />
          Exploited ({exploited})
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: C.border }} />
          Safe ({safe})
        </div>
      </div>
    </div>
  )
}

/* ── BAR CHART ── */
export function BarChart({ counts }) {
  const data = [
    { label: 'Critical', value: counts.critical, color: C.red    },
    { label: 'High',     value: counts.high,     color: C.orange },
    { label: 'Medium',   value: counts.medium,   color: C.yellow },
    { label: 'Low',      value: counts.low,       color: C.green  },
  ]
  const max = Math.max(...data.map(d => d.value), 1)
  const H   = 80

  return (
    <div className="inner-card">
      <div className="card-label">📊 Severity Distribution</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: H + 28, padding: '0 4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}</span>
            <div style={{
              width: '100%', background: d.color,
              borderRadius: '5px 5px 0 0',
              height: `${(d.value / max) * H}px`,
              minHeight: d.value > 0 ? 6 : 2,
              opacity: 0.88,
              transition: 'height 0.5s ease'
            }} />
            <span style={{ fontSize: 10, color: C.muted, textAlign: 'center' }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── HEATMAP ── */
export function HeatMap({ vulns }) {
  const color = s => s >= 9 ? C.red : s >= 7 ? C.orange : s >= 4 ? C.yellow : C.green

  return (
    <div className="inner-card">
      <div className="card-label">🌡 Risk Heatmap — All Vulnerabilities</div>
      <div className="heat-row">
        {vulns.map((v, i) => (
          <div key={i} className="heat-seg"
            style={{ background: color(parseFloat(v.risk_score ?? 0)) }}
            title={`${v.cve}: ${v.risk_score}`}>
            {parseFloat(v.risk_score ?? 0).toFixed(1)}
          </div>
        ))}
      </div>
      <div className="heat-legend">
        {[['Critical ≥9', C.red], ['High ≥7', C.orange], ['Medium ≥4', C.yellow], ['Low <4', C.green]].map(([l, c]) => (
          <div key={l} className="heat-legend-item">
            <div className="heat-dot" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
      <div className="heat-grad" />
      <div className="heat-range">
        <span>0 — Low</span><span>5 — Medium</span><span>10 — Critical</span>
      </div>
    </div>
  )
}
