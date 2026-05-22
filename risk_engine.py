class RiskEngine:
    def enrich_vulnerabilities(self, vulnerabilities):
        final = []

        for vuln in vulnerabilities:
            desc = vuln.get("description", "").lower()
            source = vuln.get("source", "Unknown")

            score = 5.0
            exploited = "NO"

            if "could not scan target" in desc:
                score = 2.0
            elif "sql injection" in desc or "authentication bypass" in desc:
                score = 9.2
                exploited = "YES"
            elif "xss" in desc or "cross-site scripting" in desc:
                score = 7.5
            elif "insecure http" in desc:
                score = 7.0
            elif "missing content security policy" in desc:
                score = 6.5
            elif "strict-transport-security" in desc:
                score = 6.0
            elif "x-frame-options" in desc:
                score = 5.5
            elif "server technology exposed" in desc:
                score = 4.5
            elif "openssl" in desc or "ssh" in desc:
                score = 7.0
            elif "vulnerable package" in desc:
                score = 8.0

            suggestion = self.generate_suggestion(desc, source)

            final.append({
                "cve": vuln.get("cve", "N/A"),
                "source": source,
                "description": vuln.get("description", "No description"),
                "epss_prob": vuln.get("epss_prob", "0.50"),
                "risk_score": str(score),
                "is_exploited": exploited,
                "suggestion": suggestion
            })

        return final

    def generate_suggestion(self, desc, source):
        if "could not scan target" in desc:
            return "The target could not be reached. Check the URL, internet connection, firewall, or increase request timeout."
        if "sql injection" in desc:
            return "Use parameterized queries or ORM filters. Never concatenate user input into SQL queries."
        if "xss" in desc or "cross-site scripting" in desc:
            return "Sanitize user input, escape output, and use a strict Content Security Policy."
        if "authentication bypass" in desc:
            return "Protect admin routes, enforce authentication middleware, and add role-based access control."
        if "insecure http" in desc:
            return "Use HTTPS with a valid SSL certificate and redirect all HTTP traffic to HTTPS."
        if "missing content security policy" in desc:
            return "Add a Content-Security-Policy header to reduce XSS and script injection risks."
        if "x-frame-options" in desc:
            return "Add X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking."
        if "strict-transport-security" in desc:
            return "Enable HSTS using the Strict-Transport-Security header."
        if "server technology exposed" in desc:
            return "Hide or minimize the Server header to reduce information disclosure."
        if "vulnerable package" in desc:
            return "Update the vulnerable dependency to a secure version and re-run the dependency scan."
        if "openssl" in desc or "ssh" in desc:
            return "Update SSL/SSH configuration, disable weak protocols, and use modern cipher suites."

        return "Review this issue manually and apply secure coding practices based on OWASP guidelines."