def test_calendar_analytics_and_optimization_lifecycle(client):
    # Register user
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "analytics_tester@studio.com",
            "password": "Password123!",
            "full_name": "Analytics Tester",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Connect mock social account
    conn_resp = client.post(
        "/api/v1/social/connect",
        headers=headers,
        json={"platform": "tiktok", "auth_code": "test_auth_code_123"},
    )
    assert conn_resp.status_code == 201
    account_id = conn_resp.json()["id"]

    # Schedule post (which automatically creates calendar item)
    sched_resp = client.post(
        "/api/v1/publishing/schedule",
        headers=headers,
        json={
            "social_account_id": account_id,
            "caption": "Testing cross-platform scheduled video posting in calendar",
            "scheduled_for": "2026-10-15T15:00:00Z",
        },
    )
    assert sched_resp.status_code == 201
    scheduled_post_id = sched_resp.json()["id"]

    # Verify calendar item created
    cal_resp = client.get("/api/v1/calendar/items", headers=headers)
    assert cal_resp.status_code == 200
    cal_items = cal_resp.json()
    assert len(cal_items) > 0
    assert any(item["scheduled_post_id"] == scheduled_post_id for item in cal_items)

    # Fetch analytics overview
    analytics_resp = client.get("/api/v1/analytics/overview", headers=headers)
    assert analytics_resp.status_code == 200
    overview = analytics_resp.json()
    assert "total_followers" in overview
    assert "total_impressions" in overview
    assert "performance_by_platform" in overview

    # Run AI Performance Audit / Analysis
    analysis_resp = client.post("/api/v1/optimization/analyze", headers=headers)
    assert analysis_resp.status_code == 200
    analysis = analysis_resp.json()
    assert "summary" in analysis
    assert "top_hooks" in analysis
    assert "weak_patterns" in analysis

    # Query Optimization Recommendations
    rec_resp = client.get("/api/v1/optimization/recommendations", headers=headers)
    assert rec_resp.status_code == 200
    recs = rec_resp.json()
    assert len(recs) > 0
    first_rec_id = recs[0]["id"]

    # Update recommendation status to applied
    update_resp = client.put(
        f"/api/v1/optimization/recommendations/{first_rec_id}/status",
        headers=headers,
        json={"status": "applied"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "applied"
