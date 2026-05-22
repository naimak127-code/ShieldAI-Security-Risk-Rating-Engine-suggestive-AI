import React, { useState } from 'react'
import Navbar      from './components/Navbar'
import ScanPanel   from './components/ScanPanel'
import MetricCards from './components/MetricCards'
import { GaugeChart, DonutChart, BarChart, HeatMap } from './components/Charts'
import AIPanel     from './components/AIPanel'
import VulnTable   from './components/VulnTable'

/* ─── SAMPLE DATA — Remove once Flask is connected ─── */
const DEMO = [
  { cve:'CVE-2024-1234', source:'Web',     description:'SQL Injection in login endpoint',              epss_prob:'0.97', risk_score:'9.8', is_exploited:'YES', suggestion:'Use parameterized queries. Never concatenate user input into SQL strings. Run sqlmap to audit all endpoints.' },
  { cve:'CVE-2024-5678', source:'Backend', description:'Remote Code Execution via deserialization',    epss_prob:'0.88', risk_score:'9.1', is_exploited:'YES', suggestion:'Disable Java deserialization. Upgrade Apache Commons Collections. Apply ysoserial PoC patch.' },
  { cve:'CVE-2023-9999', source:'Network', description:'Unpatched OpenSSL Heartbleed variant',        epss_prob:'0.61', risk_score:'8.5', is_exploited:'NO',  suggestion:'Update OpenSSL to ≥3.0.8. Regenerate all TLS certificates and revoke old private keys.' },
  { cve:'CVE-2024-2202', source:'Web',     description:'Cross-Site Scripting in search form',         epss_prob:'0.45', risk_score:'7.2', is_exploited:'NO',  suggestion:'Implement strict Content-Security-Policy. Sanitize all user inputs with DOMPurify.' },
  { cve:'CVE-2023-4711', source:'Backend', description:'Directory traversal — arbitrary file read',   epss_prob:'0.39', risk_score:'6.9', is_exploited:'NO',  suggestion:'Validate and restrict file paths. Use Path.resolve() and compare against allowlist.' },
  { cve:'CVE-2024-0811', source:'Network', description:'Weak SSH cipher suite — RC4 allowed',        epss_prob:'0.21', risk_score:'5.5', is_exploited:'NO',  suggestion:'Enforce modern ciphers in sshd_config. Disable RC4, DES. Audit with ssh-audit tool.' },
]

function deriveMetrics(vulns) {
  if (!vulns.length) return { total: 0, critical: 0, exploits: 0, score: '—', avgRisk: 0, counts: { critical:0, high:0, medium:0, low:0 } }
  const scores   = vulns.map(v => parseFloat(v.risk_score ?? 0))
  const avgRisk  = scores.reduce((a, b) => a + b, 0) / scores.length
  const isExp    = v => { const x = v.is_exploited ?? v.exploited ?? ''; if (typeof x === 'boolean') return x; return String(x).toLowerCase().includes('yes') }
  return {
    total:   vulns.length,
    critical: vulns.filter(v => parseFloat(v.risk_score ?? 0) >= 9).length,
    exploits: vulns.filter(v => isExp(v)).length,
    score:    Math.max(0, 10 - avgRisk).toFixed(1),
    avgRisk,
    counts: {
      critical: vulns.filter(v => parseFloat(v.risk_score ?? 0) >= 9).length,
      high:     vulns.filter(v => { const s = parseFloat(v.risk_score ?? 0); return s >= 7 && s < 9 }).length,
      medium:   vulns.filter(v => { const s = parseFloat(v.risk_score ?? 0); return s >= 4 && s < 7 }).length,
      low:      vulns.filter(v => parseFloat(v.risk_score ?? 0) < 4).length,
    }
  }
}

function HomePage({ onStart }) {
  return (
    <div className="home-page">
      <nav className="home-nav">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, background:'linear-gradient(135deg,#2e9cdc,#1d6fa4)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow:'0 4px 12px rgba(46,156,220,0.35)' }}>🛡</div>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.3px' }}>Shield<span style={{ color:'#2e9cdc' }}>AI</span></div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', letterSpacing:'1.2px', textTransform:'uppercase' }}>Risk Intelligence Platform</div>
          </div>
        </div>
        <button className="btn-primary" onClick={() => onStart('scan')} style={{ padding:'8px 20px', fontSize:13 }}>
          Launch Dashboard →
        </button>
      </nav>

      <div className="home-hero">
        <div>
          <div className="hero-badge">🛡 AI-Powered Cybersecurity</div>
          <h1 className="hero-title">
            Detect Threats.<br /><span>Neutralize Risks.</span><br />Stay Secure.
          </h1>
          <p className="hero-desc">
            ShieldAI scans URLs, IPs, directories, and files — delivering instant vulnerability reports with AI-generated mitigation plans.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => onStart('scan')}>🔍 Start Scanning →</button>
            <button className="btn-secondary" onClick={() => onStart('upload')}>📁 Upload File</button>
          </div>
          <div className="hero-stats">
            <div><div className="stat-val">10K+</div><div className="stat-lbl">CVEs Indexed</div></div>
            <div><div className="stat-val">Real-time</div><div className="stat-lbl">Risk Scoring</div></div>
            <div><div className="stat-val">AI</div><div className="stat-lbl">Mitigation Plans</div></div>
          </div>
        </div>

        <div className="feature-grid">
          {[
            { icon:'🔍', t:'URL & IP Scanning',        d:'Deep-scan any public URL, private IP, or directory for known CVEs.' },
            { icon:'📁', t:'File Risk Analysis',        d:'Upload config, log, or source files — ShieldAI parses for secrets and flaws.' },
            { icon:'📊', t:'Visual Risk Charts',        d:'Gauge, donut, heatmap, and bar charts give instant threat clarity.' },
            { icon:'🤖', t:'AI Mitigation Plans',       d:'GPT-powered fix suggestions ranked by severity and exploitability.' },
            { icon:'📄', t:'PDF Report Export',         d:'One-click professional PDF report for your security team.' },
          ].map((f, i) => (
            <div key={i} className={`feature-card ${i === 4 ? 'wide' : ''}`}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.t}</div>
              <div className="feature-desc">{f.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="resilience-section">
        <div className="resilience-inner">
          <div className="resilience-title">Cyber Resilience Framework</div>
          <div className="resilience-grid">
            {[
              { icon:'🌐', l:'Web Layer',     d:'Scans for SQLi, XSS, SSRF, CSRF, IDOR, open redirects and OWASP Top 10.' },
              { icon:'⚙️',  l:'Backend',      d:'Detects insecure deserialization, hardcoded secrets, RCE and SSTI flaws.' },
              { icon:'🌍', l:'Network',       d:'Audits TLS certs, SSH ciphers, open ports and CVE-linked services.' },
              { icon:'📋', l:'Compliance',    d:'Maps findings to CWE, CVSS 3.1 and EPSS probability scores.' },
            ].map((c, i) => (
              <div key={i} className="resilience-card">
                <div className="resilience-icon">{c.icon}</div>
                <div className="resilience-label">{c.l}</div>
                <div className="resilience-desc">{c.d}</div>
                <button className="btn-ghost" onClick={() => onStart('scan')}>Scan Now</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [view,    setView]    = useState('home')
  const [vulns,   setVulns]   = useState([])
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState('idle')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const handleStart = mode => { setView(mode); setVulns([]); setError(''); setSuccess('') }

  /* ── SCAN ── */
  const handleScan = async target => {
    setLoading(true); setStatus('scanning'); setError(''); setSuccess('');
    try {
      const res  = await fetch('/api/scan', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target }),
      })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.results ?? data.data ?? DEMO)
      setVulns(list)
      setSuccess(`✅ Scan complete — ${list.length} vulnerabilities found · AI mitigation plan generated`)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setError("Backend failed")
    } finally { setLoading(false) }
    }

  /* ── UPLOAD ── */
  const handleUpload = async (file, setFileStatus) => {
    setLoading(true); setStatus('scanning'); setError(''); setSuccess('')
    setFileStatus('⏳ Uploading to ShieldAI…')
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : (data.results ?? data.data ?? DEMO)
      setVulns(list)
      setFileStatus(`✅ Analyzed — ${list.length} risks identified`)
      setSuccess(`✅ Upload analyzed — ${list.length} vulnerabilities found`)
      setStatus('done')
    } catch {
      setVulns(DEMO)
      setFileStatus(`✅ Demo mode — ${DEMO.length} sample risks loaded`)
      setSuccess(`✅ Demo mode — ${DEMO.length} sample vulnerabilities loaded`)
      setStatus('done')
    } finally { setLoading(false) }
  }

  /* ── PDF EXPORT ── */
  const handleExport = () => {
    if (!vulns.length || !window.jspdf) return
    const { jsPDF } = window.jspdf
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
    const PW = doc.internal.pageSize.getWidth()
    const PH = doc.internal.pageSize.getHeight()
    const m  = 36
    let y    = 0

    const checkPage = (n = 20) => { if (y + n > PH - m) { doc.addPage(); y = m + 10 } }

    /* Header */
    doc.setFillColor(11, 30, 56); doc.rect(0, 0, PW, 52, 'F')
    doc.setTextColor(255,255,255); doc.setFontSize(19); doc.setFont('helvetica','bold')
    doc.text('ShieldAI — Security Scan Report', m, 34)
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(125,160,190)
    doc.text(`Generated: ${new Date().toLocaleString()}`, PW - m, 34, { align:'right' })
    y = 72

    /* Metrics */
    const M = deriveMetrics(vulns)
    const mData = [
      { l:'Total Flaws',    v:M.total,    c:[29,111,164]  },
      { l:'Critical Risks', v:M.critical,  c:[230,57,70]   },
      { l:'Active Exploits',v:M.exploits,  c:[244,130,13]  },
      { l:'Security Score', v:M.score,     c:[29,184,122]  },
    ]
    const cW = (PW - m * 2 - 24) / 4
    mData.forEach((d, i) => {
      const x = m + i * (cW + 8)
      doc.setFillColor(243,248,253); doc.roundedRect(x, y, cW, 52, 4, 4, 'F')
      doc.setFillColor(...d.c); doc.roundedRect(x, y, cW, 3, 1, 1, 'F')
      doc.setTextColor(...d.c); doc.setFontSize(22); doc.setFont('helvetica','bold')
      doc.text(String(d.v), x + cW / 2, y + 30, { align:'center' })
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(125,160,190)
      doc.text(d.l.toUpperCase(), x + cW / 2, y + 44, { align:'center' })
    })
    y += 68

    /* AI section header */
    doc.setFillColor(230,244,251); doc.roundedRect(m, y, PW - m*2, 16, 3, 3, 'F')
    doc.setTextColor(11,30,56); doc.setFontSize(10); doc.setFont('helvetica','bold')
    doc.text('AI MITIGATION PLAN', m + 8, y + 11); y += 24

    const rColor = s => s >= 9 ? [230,57,70] : s >= 7 ? [244,130,13] : s >= 4 ? [200,155,0] : [29,184,122]
    ;[...vulns].sort((a,b) => parseFloat(b.risk_score ?? 0) - parseFloat(a.risk_score ?? 0)).slice(0,5).forEach(v => {
      checkPage(30)
      const c = rColor(parseFloat(v.risk_score ?? 0))
      doc.setFillColor(...c); doc.roundedRect(m, y, 4, 20, 1, 1, 'F')
      doc.setTextColor(11,30,56); doc.setFontSize(9); doc.setFont('helvetica','bold')
      doc.text(`${v.cve ?? 'N/A'}  [${parseFloat(v.risk_score ?? 0) >= 9 ? 'Critical' : parseFloat(v.risk_score ?? 0) >= 7 ? 'High' : 'Medium'}]`, m + 12, y + 8)
      doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(59,90,122)
      const lines = doc.splitTextToSize(v.suggestion ?? v.ai_suggestion ?? '—', PW - m*2 - 16)
      doc.text(lines[0], m + 12, y + 17); y += 26
    })
    y += 8

    /* Table */
    checkPage(40)
    doc.setFillColor(230,244,251); doc.roundedRect(m, y, PW - m*2, 16, 3, 3, 'F')
    doc.setTextColor(11,30,56); doc.setFontSize(10); doc.setFont('helvetica','bold')
    doc.text('VULNERABILITY INTELLIGENCE', m + 8, y + 11); y += 22

    const cols = ['CVE / ID','Source','Description','EPSS','Risk','Exploited','AI Fix']
    const colW = [90,60,145,42,65,52,145]
    const rowH = 18

    doc.setFillColor(243,248,253); doc.rect(m, y, PW - m*2, rowH, 'F')
    doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(125,160,190)
    let cx = m + 4
    cols.forEach((c, i) => { doc.text(c, cx, y + 12); cx += colW[i] }); y += rowH

    vulns.forEach((v, idx) => {
      checkPage(rowH + 4)
      if (idx % 2 === 1) { doc.setFillColor(248,251,255); doc.rect(m, y, PW - m*2, rowH, 'F') }
      doc.setDrawColor(238,244,251); doc.line(m, y + rowH, m + PW - m*2, y + rowH)
      const score = parseFloat(v.risk_score ?? 0)
      const rc    = rColor(score)
      const rl    = score >= 9 ? 'Critical' : score >= 7 ? 'High' : score >= 4 ? 'Medium' : 'Low'
      const exp   = (() => { const x = v.is_exploited ?? v.exploited ?? ''; if (typeof x === 'boolean') return x; return String(x).toLowerCase().includes('yes') })()
      cx = m + 4
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(29,111,164)
      doc.text(String(v.cve ?? 'N/A'), cx, y + 12); cx += colW[0]
      doc.setFont('helvetica','normal'); doc.setTextColor(58,90,122)
      doc.text(String(v.source ?? '—').slice(0,10), cx, y + 12); cx += colW[1]
      doc.setTextColor(42,63,85)
      doc.text(doc.splitTextToSize(String(v.description ?? '—'), colW[2]-4)[0], cx, y + 12); cx += colW[2]
      doc.setTextColor(29,111,164)
      doc.text(String(v.epss_prob ?? v.epss ?? '—'), cx, y + 12); cx += colW[3]
      doc.setTextColor(...rc); doc.text(`${rl} (${score.toFixed(1)})`, cx, y + 12); cx += colW[4]
      doc.setTextColor(...(exp ? [230,57,70] : [29,184,122])); doc.text(exp ? '⚠ YES' : '✓ NO', cx, y + 12); cx += colW[5]
      doc.setTextColor(59,90,122); doc.setFont('helvetica','normal')
      doc.text(doc.splitTextToSize(String(v.suggestion ?? v.ai_suggestion ?? '—'), colW[6]-4)[0], cx, y + 12)
      y += rowH
    })

    /* Footer */
    const pages = doc.internal.getNumberOfPages()
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p); doc.setFillColor(11,30,56); doc.rect(0, PH - 22, PW, 22, 'F')
      doc.setTextColor(125,160,190); doc.setFontSize(7.5); doc.setFont('helvetica','normal')
      doc.text('ShieldAI — Risk Intelligence Platform  |  Confidential', m, PH - 8)
      doc.text(`Page ${p} of ${pages}`, PW - m, PH - 8, { align:'right' })
    }

    doc.save(`ShieldAI_Report_${new Date().toISOString().slice(0,10)}.pdf`)
  }

  const M = deriveMetrics(vulns)
  const hasResults = vulns.length > 0

  if (view === 'home') return <HomePage onStart={handleStart} />

  return (
    <>
      <Navbar
        view={view} setView={v => { setView(v); setVulns([]); setError(''); setSuccess('') }}
        hasResults={hasResults} onExport={handleExport} status={status}
      />

      <div className="main">
        <ScanPanel view={view} onScan={handleScan} onUpload={handleUpload} loading={loading} />

        {error   && <div className="error-banner">❌ {error}</div>}
        {success && <div className="success-banner">{success}</div>}

        {hasResults && (
          <>
            {/* TOP ROW */}
            <div className="top-row">
              <GaugeChart value={M.avgRisk} />
              <MetricCards metrics={M} />
              <DonutChart exploited={M.exploits} safe={M.total - M.exploits} />
            </div>

            {/* CHART ROW */}
            <div className="chart-row">
              <BarChart counts={M.counts} />
              <HeatMap vulns={vulns} />
            </div>

            {/* BOTTOM ROW */}
            <div className="bottom-row">
              <AIPanel vulns={vulns} />
              <VulnTable vulns={vulns} />
            </div>
          </>
        )}
      </div>
    </>
  )
}
