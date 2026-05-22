import requests

def scan_web_target(url):
    vulnerabilities = []

    try:
        response = requests.get(url, timeout=15)

        headers = response.headers

        # Missing CSP
        if "Content-Security-Policy" not in headers:
            vulnerabilities.append({
                "cve": "WEB-001",
                "source": "Frontend",
                "description": "Missing Content Security Policy header."
            })

        # Missing X-Frame-Options
        if "X-Frame-Options" not in headers:
            vulnerabilities.append({
                "cve": "WEB-002",
                "source": "Frontend",
                "description": "Missing X-Frame-Options header."
            })

        # Missing HSTS
        if "Strict-Transport-Security" not in headers:
            vulnerabilities.append({
                "cve": "WEB-003",
                "source": "Frontend",
                "description": "Missing Strict-Transport-Security header."
            })

        # Insecure HTTP
        if url.startswith("http://"):
            vulnerabilities.append({
                "cve": "WEB-004",
                "source": "Frontend",
                "description": "Website is using insecure HTTP instead of HTTPS."
            })

        # Server leakage
        if "Server" in headers:
            vulnerabilities.append({
                "cve": "WEB-005",
                "source": "Frontend",
                "description": f"Server technology exposed: {headers['Server']}"
            })

    except Exception as e:
        vulnerabilities.append({
            "cve": "WEB-ERROR",
            "source": "Frontend",
            "description": f"Could not scan target: {str(e)}"
        })

    return vulnerabilities