import requests
from requests.auth import HTTPBasicAuth

def get_user_info():
    url = "https://localhost/api/users"  # Update if needed
    username = "John Doe"
    password = "securepassword"

    headers = {
        "Authorization": f"Basic {requests.auth._basic_auth_str(username, password)}"
    }

    for i in range(15):
        try:
            # Sending GET request with the Basic Auth header and ignoring SSL cert
            response = requests.get(url, headers=headers, verify=False)
            print(f"\nRequest {i+1} - Status Code: {response.status_code}")
            print("Response Body:")
            print(response.text)
        except requests.exceptions.RequestException as e:
            print(f"Request {i+1} failed: {e}")

# Example usage
get_user_info()
