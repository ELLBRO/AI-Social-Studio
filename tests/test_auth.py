def test_register_and_login(client):
    register_payload = {
        "email": "tester@growthstudio.com",
        "password": "SecurePassword123!",
        "full_name": "Jordan Lee",
        "organization_name": "Jordan Studio",
    }
    resp = client.post("/api/v1/auth/register", json=register_payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Login
    login_payload = {
        "email": "tester@growthstudio.com",
        "password": "SecurePassword123!",
    }
    login_resp = client.post("/api/v1/auth/login", json=login_payload)
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]

    # Verify /me endpoint
    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "tester@growthstudio.com"
    assert me_data["full_name"] == "Jordan Lee"


def test_invalid_login(client):
    resp = client.post("/api/v1/auth/login", json={"email": "wrong@user.com", "password": "wrong"})
    assert resp.status_code == 401
