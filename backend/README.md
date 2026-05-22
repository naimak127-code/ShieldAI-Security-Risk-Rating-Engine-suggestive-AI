# ShieldAI Backend

Flask backend for ShieldAI, an AI-assisted multi-layer vulnerability assessment system.

## Features

- Web security header scanning
- Backend code vulnerability scanning
- Network open-port scanning
- File upload risk analysis
- Risk scoring from 1–10
- AI-style remediation suggestions
- JSON API for React frontend

## Project Structure

```text
backend/
│── app.py
│── risk_engine.py
│── requirements.txt
│── scanners/
│   │── web_scanner.py
│   │── backend_scanner.py
│   │── network_scanner.py
│── uploads/
│── Datasets/
