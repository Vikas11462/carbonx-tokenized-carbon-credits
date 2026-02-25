import requests
import json

url = "http://127.0.0.1:8000/verify"
payload = {
    "location": "New Delhi",
    "areaHectares": 5,
    "co2Kg": 100
}


headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
