import os
import re

def scan_dependencies(target_file="requirements.txt"):
    vulnerabilities = []

    # 1. Check outdated dependencies
    if os.path.exists(target_file):
        with open(target_file, "r", encoding="utf-8") as f:
            content = f.read().lower()

        if "flask==1.1.1" in content:
            vulnerabilities.append({
                "cve": "BACKEND-001",
                "source": "Backend",
                "description": "Outdated Flask version detected."
            })

        if "jinja2==2.10.1" in content:
            vulnerabilities.append({
                "cve": "BACKEND-002",
                "source": "Backend",
                "description": "Outdated Jinja2 version detected."
            })

    # 2. Direct uploaded file scan
    if os.path.isfile(target_file):
        try:
            with open(target_file, "r", encoding="utf-8") as f:
                code = f.read()

            if "password =" in code.lower():
                vulnerabilities.append({
                    "cve": "UPLOAD-001",
                    "source": "Backend",
                    "description": "Possible hardcoded password detected."
                })

            if "debug=true" in code.lower():
                vulnerabilities.append({
                    "cve": "UPLOAD-002",
                    "source": "Backend",
                    "description": "Debug mode enabled."
                })

            if "select * from" in code.lower():
                vulnerabilities.append({
                    "cve": "UPLOAD-003",
                    "source": "Backend",
                    "description": "Possible SQL query detected. Review for SQL Injection risk."
                })

        except Exception:
            pass

    # 3. Scan Python source files
    # 3. Scan project files only when target is requirements.txt
    if target_file == "requirements.txt":
      for root, dirs, files in os.walk("."):
        if "venv" in root or "__pycache__" in root:
            continue

        for file in files:
            if file.endswith(".py"):
                filepath = os.path.join(root, file)

                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        code = f.read()

                    if re.search(r"SELECT\s+.*\+.*", code, re.IGNORECASE):
                        vulnerabilities.append({
                            "cve": "BACKEND-SQLI",
                            "source": "Backend",
                            "description": f"Possible SQL Injection pattern found in {file}."
                        })

                    if re.search(r"(SECRET_KEY|API_KEY|PASSWORD)\s*=\s*[\"'].*[\"']", code):
                        vulnerabilities.append({
                            "cve": "BACKEND-SECRET",
                            "source": "Backend",
                            "description": f"Hardcoded secret detected in {file}."
                        })

                    if "debug=True" in code:
                        vulnerabilities.append({
                            "cve": "BACKEND-DEBUG",
                            "source": "Backend",
                            "description": f"Debug mode enabled in {file}."
                        })

                    if "CORS(app)" in code or 'allow_origins=["*"]' in code:
                        vulnerabilities.append({
                            "cve": "BACKEND-CORS",
                            "source": "Backend",
                            "description": f"Potentially insecure CORS configuration in {file}."
                        })

                except Exception:
                    pass

    return vulnerabilities