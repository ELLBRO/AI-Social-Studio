def test_credit_ledger_and_deductions(client):
    # Register user
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "credit_tester@studio.com",
            "password": "Password123!",
            "full_name": "Credit User",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch initial account balance
    acc_resp = client.get("/api/v1/credits/account", headers=headers)
    assert acc_resp.status_code == 200
    acc_data = acc_resp.json()
    assert acc_data["balance"] >= 100

    initial_balance = acc_data["balance"]

    # Generate Hooks (deducts 5 credits)
    hook_resp = client.post(
        "/api/v1/content/generate-hooks",
        headers=headers,
        json={"topic": "B2B SaaS Onboarding", "count": 3},
    )
    assert hook_resp.status_code == 200
    hooks = hook_resp.json()
    assert len(hooks) > 0

    # Verify balance decreased by 5
    updated_acc = client.get("/api/v1/credits/account", headers=headers).json()
    assert updated_acc["balance"] == initial_balance - 5

    # Check transactions ledger
    tx_resp = client.get("/api/v1/credits/transactions", headers=headers)
    assert tx_resp.status_code == 200
    txs = tx_resp.json()
    assert len(txs) >= 2  # Welcome grant + consumption
