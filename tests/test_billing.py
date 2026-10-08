def test_billing_plans_and_checkout(client):
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "billing_user@studio.com",
            "password": "Password123!",
            "full_name": "Billing User",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch plans
    plans_resp = client.get("/api/v1/billing/plans")
    assert plans_resp.status_code == 200
    plans = plans_resp.json()
    assert len(plans) >= 3

    # Fetch current subscription (should be in 7-day trial)
    sub_resp = client.get("/api/v1/billing/subscription", headers=headers)
    assert sub_resp.status_code == 200
    sub = sub_resp.json()
    assert sub["status"] == "trialing"
    assert sub["trial_end"] is not None

    # Create checkout session
    checkout_resp = client.post(
        "/api/v1/billing/checkout",
        headers=headers,
        json={"plan_code": "pro", "billing_period": "yearly"},
    )
    assert checkout_resp.status_code == 200
    checkout = checkout_resp.json()
    assert "checkout_url" in checkout
    assert "session_id" in checkout

    # Test webhook processing
    webhook_payload = {
        "id": "evt_test_12345",
        "type": "customer.subscription.updated",
        "data": {
            "object": {
                "id": "sub_test_12345",
                "status": "active",
            }
        },
    }
    wh_resp = client.post("/api/v1/billing/webhook", json=webhook_payload)
    assert wh_resp.status_code == 200
