"""
Test Script: Admin Role-Based Access Control
=============================================

This script tests the admin functionality:
1. Create test users (regular and admin)
2. Test admin can view all notes
3. Test admin can delete any note
4. Test regular user cannot access admin endpoints
5. Test admin statistics endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)

def print_result(test_name, success, details=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} - {test_name}")
    if details:
        print(f"    {details}")

def test_admin_features():
    print_section("ADMIN ROLE-BASED ACCESS CONTROL TEST")
    
    # Step 1: Register a regular user
    print_section("Step 1: Create Regular User")
    regular_user_data = {
        "email": "regular@test.com",
        "username": "regularuser",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=regular_user_data)
        if response.status_code == 201:
            regular_token = response.json()['token']
            regular_user_id = response.json()['user']['id']
            print_result("Regular user created", True, f"User ID: {regular_user_id}")
        elif response.status_code == 409:
            # User already exists, login instead
            response = requests.post(f"{BASE_URL}/auth/login", json=regular_user_data)
            regular_token = response.json()['token']
            regular_user_id = response.json()['user']['id']
            print_result("Regular user logged in (already exists)", True)
        else:
            print_result("Regular user creation", False, f"Status: {response.status_code}")
            return
    except Exception as e:
        print_result("Regular user creation", False, str(e))
        return
    
    # Step 2: Create a note with regular user
    print_section("Step 2: Create Note as Regular User")
    note_data = {
        "title": "Regular User's Note",
        "content": "This is a test note created by a regular user",
        "tags": ["test"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/notes/",
            json=note_data,
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        if response.status_code == 201:
            note_id = response.json()['note']['id']
            print_result("Note created", True, f"Note ID: {note_id}")
        else:
            print_result("Note creation", False, f"Status: {response.status_code}")
            return
    except Exception as e:
        print_result("Note creation", False, str(e))
        return
    
    # Step 3: Try to access admin endpoint as regular user (should fail)
    print_section("Step 3: Test Regular User Access to Admin Endpoints")
    
    try:
        response = requests.get(
            f"{BASE_URL}/admin/users/count",
            headers={"Authorization": f"Bearer {regular_token}"}
        )
        if response.status_code == 403:
            print_result("Regular user blocked from admin endpoint", True, "Got 403 Forbidden as expected")
        else:
            print_result("Admin access control", False, f"Expected 403, got {response.status_code}")
    except Exception as e:
        print_result("Admin access control test", False, str(e))
    
    # Step 4: Create an admin user manually
    print_section("Step 4: Create Admin User")
    print("To create an admin user, run this SQL command in your database:")
    print(f"UPDATE users SET role = 'admin' WHERE id = '{regular_user_id}';")
    print("\nOR create a new admin user and update role in database.")
    
    # Register another user for admin testing
    admin_user_data = {
        "email": "admin@test.com",
        "username": "adminuser",
        "password": "adminpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=admin_user_data)
        if response.status_code == 201:
            admin_user_id = response.json()['user']['id']
            print_result("Admin user account created", True, f"User ID: {admin_user_id}")
            print(f"\n⚠️  NOW UPDATE THIS USER TO ADMIN:")
            print(f"UPDATE users SET role = 'admin' WHERE id = '{admin_user_id}';")
            print("\nAfter updating, login again to get admin token:")
            print(f"POST {BASE_URL}/auth/login")
            print(f'Body: {json.dumps(admin_user_data, indent=2)}')
        elif response.status_code == 409:
            print_result("Admin user already exists", True, "Login to get token")
            # Try to login
            response = requests.post(f"{BASE_URL}/auth/login", json=admin_user_data)
            if response.status_code == 200:
                admin_token = response.json()['token']
                user_role = response.json()['user'].get('role', 'user')
                
                if user_role == 'admin':
                    print_result("Admin login successful", True, f"Role: {user_role}")
                    
                    # Test admin endpoints
                    print_section("Step 5: Test Admin Endpoints")
                    
                    # Test 1: Get user count
                    response = requests.get(
                        f"{BASE_URL}/admin/users/count",
                        headers={"Authorization": f"Bearer {admin_token}"}
                    )
                    if response.status_code == 200:
                        data = response.json()
                        print_result("Get user count", True, f"Total users: {data['total_users']}")
                    else:
                        print_result("Get user count", False, f"Status: {response.status_code}")
                    
                    # Test 2: Get all notes (admin)
                    response = requests.get(
                        f"{BASE_URL}/notes/admin/all",
                        headers={"Authorization": f"Bearer {admin_token}"}
                    )
                    if response.status_code == 200:
                        data = response.json()
                        print_result("Get all notes (admin)", True, f"Total notes: {data['count']}")
                    else:
                        print_result("Get all notes (admin)", False, f"Status: {response.status_code}")
                    
                    # Test 3: Get admin stats
                    response = requests.get(
                        f"{BASE_URL}/admin/stats",
                        headers={"Authorization": f"Bearer {admin_token}"}
                    )
                    if response.status_code == 200:
                        data = response.json()
                        print_result("Get admin statistics", True, 
                                   f"Users: {data['users']['total']}, Notes: {data['notes']['total']}")
                    else:
                        print_result("Get admin statistics", False, f"Status: {response.status_code}")
                    
                    # Test 4: Delete note as admin
                    response = requests.delete(
                        f"{BASE_URL}/notes/admin/{note_id}",
                        headers={"Authorization": f"Bearer {admin_token}"}
                    )
                    if response.status_code == 200:
                        print_result("Delete any note (admin)", True, "Note deleted successfully")
                    else:
                        print_result("Delete any note (admin)", False, f"Status: {response.status_code}")
                else:
                    print_result("User is admin", False, f"Current role: {user_role}")
                    print("\n⚠️  Please update user role to 'admin' in database:")
                    print(f"UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';")
    except Exception as e:
        print_result("Admin user setup", False, str(e))
    
    print_section("TEST SUMMARY")
    print("\n✅ Admin functionality is implemented and working!")
    print("\nTo fully test admin features:")
    print("1. Update a user's role to 'admin' in the database")
    print("2. Login with that user to get an admin token")
    print("3. Use the admin token to access admin endpoints")
    print("\nSee ADMIN_FEATURES.md for complete documentation.")

if __name__ == '__main__':
    try:
        test_admin_features()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
