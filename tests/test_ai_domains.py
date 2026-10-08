def test_ai_content_strategy_and_script(client):
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "ai_tester@studio.com",
            "password": "Password123!",
            "full_name": "AI Tester",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Generate Content Strategy
    strat_resp = client.post(
        "/api/v1/content/generate-strategy",
        headers=headers,
        json={
            "brand_name": "SuperNova AI",
            "niche": "AI Productivity Tools",
            "target_audience": "Founders and Engineers",
            "goals": ["Acquire early adopters", "Establish thought leadership"],
            "platforms": ["tiktok", "linkedin", "x"],
            "tone": "Bold and data-driven",
            "posting_cadence": "daily",
        },
    )
    assert strat_resp.status_code == 200
    strat = strat_resp.json()
    assert "pillars" in strat
    assert len(strat["pillars"]) > 0
    assert "positioning_statement" in strat

    # Generate Script
    script_resp = client.post(
        "/api/v1/content/generate-script",
        headers=headers,
        json={
            "topic": "How to scale content without burning out",
            "platform": "tiktok",
            "target_duration_seconds": 35,
        },
    )
    assert script_resp.status_code == 200
    script = script_resp.json()
    assert "full_text" in script
    assert "scenes" in script
    assert len(script["scenes"]) > 0
