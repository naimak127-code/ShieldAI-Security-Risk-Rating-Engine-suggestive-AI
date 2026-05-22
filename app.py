
from flask import Flask, jsonify, request
from flask_cors import CORS

from scanners.backend_scanner import scan_dependencies
from scanners.web_scanner import scan_web_target
from scanners.network_scanner import scan_network_target
from risk_engine import RiskEngine
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

engine = RiskEngine()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "Backend running"})

@app.route('/api/scan', methods=['POST'])
def trigger_scan():
    data = request.get_json() or {}
    target = data.get("target", "http://localhost:5000")

    raw_vulnerabilities = []

    raw_vulnerabilities.extend(scan_web_target(target))
    raw_vulnerabilities.extend(scan_dependencies("requirements.txt"))
    raw_vulnerabilities.extend(scan_network_target(target))

    final_report = engine.enrich_vulnerabilities(raw_vulnerabilities)

    return jsonify(final_report)

@app.route('/api/upload', methods=['POST'])
def upload_scan():

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    os.makedirs("uploads", exist_ok=True)

    filepath = os.path.join("uploads", secure_filename(file.filename))
    file.save(filepath)

    raw_vulnerabilities = []

    raw_vulnerabilities.extend(scan_dependencies(filepath))

    final_report = engine.enrich_vulnerabilities(raw_vulnerabilities)

    return jsonify(final_report)

if __name__ == '__main__':
    app.run(debug=True, port=5000)