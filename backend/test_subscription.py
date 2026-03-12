"""
Test script for subscription features
This script tests the basic subscription functionality
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_subscription_flow():
    print("=" * 60)
    print("SUBSCRIPTION FEATURE TEST")
    print("=" * 60)
    
    # 1. Register a new user
    print("\n1. Registering new user...")
    register_data = {
        "email": f"test_{int(time.time())}@example.com",
        "username": f"testuser_{int(time.time())}",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        data = response.json()
        
        if response.status_code == 201:
            print("✓ User registered successfully")
            token = data['token']
            user = data['user']
            print(f"  User ID: {user['id']}")
            print(f"  Subscription Plan: {user['subscription_plan']}")
            print(f"  Subscription Status: {user['subscription_status']}")
        else:
            print(f"✗ Registration failed: {data.get('error', 'Unknown error')}")
            return
    except Exception as e:
        print(f"✗ Registration error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Check subscription status
    print("\n2. Checking subscription status...")
    try:
        response = requests.get(f"{BASE_URL}/subscription/status", headers=headers)
        data = response.json()
        
        if response.status_code == 200:
            print("✓ Subscription status retrieved")
            print(f"  Plan: {data['subscription_plan']}")
            print(f"  Status: {data['subscription_status']}")
            print(f"  Has Active Premium: {data['has_active_premium']}")
        else:
            print(f"✗ Failed to get status: {data.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"✗ Status check error: {e}")
    
    # 3. Try to access premium AI feature (should fail)
    print("\n3. Trying to access premium AI feature (as free user)...")
    try:
        response = requests.post(
            f"{BASE_URL}/ai/summarize",
            headers=headers,
            json={"text": "This is a test note content for summarization."}
        )
        data = response.json()
        
        if response.status_code == 403:
            print("✓ Premium access correctly blocked")
            print(f"  Error: {data.get('error')}")
            print(f"  Message: {data.get('message')}")
        else:
            print(f"✗ Unexpected response: {data}")
    except Exception as e:
        print(f"✗ AI access error: {e}")
    
    # 4. Upgrade to premium
    print("\n4. Upgrading to premium...")
    try:
        response = requests.post(
            f"{BASE_URL}/subscription/upgrade",
            headers=headers,
            json={"duration_days": 30}
        )
        data = response.json()
        
        if response.status_code == 200:
            print("✓ Successfully upgraded to premium")
            print(f"  Message: {data.get('message')}")
            sub_info = data.get('subscription', {})
            print(f"  Plan: {sub_info.get('subscription_plan')}")
            print(f"  Expires At: {sub_info.get('subscription_expires_at')}")
        else:
            print(f"✗ Upgrade failed: {data.get('error', 'Unknown error')}")
            return
    except Exception as e:
        print(f"✗ Upgrade error: {e}")
        return
    
    # 5. Try to access premium AI feature again (should succeed)
    print("\n5. Trying to access premium AI feature (as premium user)...")
    try:
        response = requests.post(
            f"{BASE_URL}/ai/summarize",
            headers=headers,
            json={"text": "This is a test note content for summarization."}
        )
        data = response.json()
        
        if response.status_code == 200:
            print("✓ Premium AI access successful")
            print(f"  Service: {data.get('service')}")
            print(f"  Summary: {data.get('summary')[:100]}...")
        else:
            print(f"✗ AI access failed: {data.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"✗ AI access error: {e}")
    
    # 6. Check access logs
    print("\n6. Checking access logs...")
    try:
        response = requests.get(f"{BASE_URL}/subscription/access-logs", headers=headers)
        data = response.json()
        
        if response.status_code == 200:
            print("✓ Access logs retrieved")
            print(f"  Total logs: {data.get('count')}")
            if data.get('logs'):
                log = data['logs'][0]
                print(f"  Last access: {log.get('endpoint')} ({log.get('method')})")
                print(f"  IP: {log.get('ip_address')}")
        else:
            print(f"✗ Failed to get logs: {data.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"✗ Logs error: {e}")
    
    # 7. Cancel subscription
    print("\n7. Cancelling subscription...")
    try:
        response = requests.post(f"{BASE_URL}/subscription/cancel", headers=headers)
        data = response.json()
        
        if response.status_code == 200:
            print("✓ Subscription cancelled")
            print(f"  Message: {data.get('message')}")
        else:
            print(f"✗ Cancellation failed: {data.get('error', 'Unknown error')}")
    except Exception as e:
        print(f"✗ Cancellation error: {e}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETED")
    print("=" * 60)

if __name__ == "__main__":
    import time
    test_subscription_flow()
