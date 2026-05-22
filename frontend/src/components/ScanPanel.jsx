import React, { useState, useRef } from 'react'

export default function ScanPanel({ view, onScan, onUpload, loading }) {
  const [target, setTarget]       = useState('')
  const [drag, setDrag]           = useState(false)
  const [fileChip, setFileChip]   = useState(null)
  const [fileStatus, setFileStatus] = useState('')
  const fileRef = useRef(null)

  const handleScan = e => {
    e.preventDefault()
    if (target.trim()) onScan(target.trim())
  }

  const processFile = async file => {
    setFileChip(file.name)
    setFileStatus('Analyzing with ShieldAI…')
    await onUpload(file, status => setFileStatus(status))
  }

  const clearFile = () => { setFileChip(null); setFileStatus('') }

  return (
    <div className="panel">
      <div className="panel-label">
        {view === 'upload' ? '📁 File Risk Analysis' : '🎯 Target Configuration'}
      </div>

      {view === 'scan' ? (
        <form onSubmit={handleScan}>
          <div className="scan-row">
            <input
              className="scan-input"
              value={target}
              onChange={e => setTarget(e.target.value)}
              placeholder="https://target.com  ·  192.168.1.1  ·  /var/www/html"
              autoComplete="off"
              disabled={loading}
            />
            <button className="btn-scan" type="submit" disabled={loading || !target.trim()}>
              {loading
                ? <><div className="spinner" /> Scanning…</>
                : <>▶ Launch Security Scan</>
              }
            </button>
          </div>
        </form>
      ) : (
        <>
          {fileChip ? (
            <div className="upload-chip">
              <span className="upload-chip-icon">📄</span>
              <div>
                <div className="upload-chip-name">{fileChip}</div>
                <div className="upload-chip-status" style={{ color: fileStatus.startsWith('✅') ? 'var(--green)' : fileStatus.startsWith('❌') ? 'var(--red)' : 'var(--muted)' }}>
                  {fileStatus}
                </div>
              </div>
              <button className="btn-remove" onClick={clearFile}>Remove</button>
            </div>
          ) : (
            <div
              className={`upload-zone ${drag ? 'drag' : ''}`}
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false)
                const f = e.dataTransfer.files[0]
                if (f) processFile(f)
              }}
            >
              <span className="upload-zone-icon">📂</span>
              <div className="upload-zone-title">
                Drop your file here or <u>browse</u>
              </div>
              <div className="upload-zone-sub">
                Supports: .log .txt .json .csv .xml .py .js .env .yaml .conf
              </div>
            </div>
          )}
          <input
            ref={fileRef} type="file" style={{ display: 'none' }}
            accept=".log,.txt,.json,.csv,.xml,.py,.js,.env,.conf,.yaml,.yml"
            onChange={e => { const f = e.target.files[0]; if (f) processFile(f) }}
          />
        </>
      )}
    </div>
  )
}
