import requests
import os

# Create folders if they don't exist
os.makedirs('Datasets/raw', exist_ok=True)

def download_file(url, filename):
    print(f"Downloading {filename}...")

    try:
        response = requests.get(url, timeout=30)

        if response.status_code == 200:
            with open(f"Datasets/raw/{filename}", "wb") as f:
                f.write(response.content)

            print(f"✅ Success: {filename} saved.")

        else:
            print(f"❌ Failed to download {filename}. Error: {response.status_code}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {e}")


# 1. CISA KEV Dataset
cisa_url = "https://www.cisa.gov/sites/default/files/csv/known_exploited_vulnerabilities.csv"
download_file(cisa_url, "cisa_kev.csv")


# 2. EPSS Dataset
epss_url = "https://epss.cyentia.com/epss_scores-current.csv.gz"
download_file(epss_url, "epss_scores.csv.gz")

print("\n--- Initial Data Collection Complete ---")