import socket
from urllib.parse import urlparse

def scan_network_target(target):
    vulnerabilities = []

    parsed = urlparse(target)
    host = parsed.hostname or target.replace("http://", "").replace("https://", "").split("/")[0]

    common_ports = [21, 22, 23, 80, 443, 3306, 8080]

    for port in common_ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((host, port))
            sock.close()

            if result == 0:
                vulnerabilities.append({
                    "cve": f"NET-PORT-{port}",
                    "source": "Network",
                    "description": f"Open network port detected: {port}"
                })

        except Exception:
            pass

    return vulnerabilities