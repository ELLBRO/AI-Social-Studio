from datetime import datetime, timezone, timedelta


def test_social_connect_and_publishing_lifecycle(client):
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "publisher@studio.com",
            "password": "Password123!",
            "full_name": "Post Publisher",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Connect mock TikTok account
    conn_resp = client.post(
        "/api/v1/social/connect",
        headers=headers,
        json={"platform": "tiktok", "account_name": "Test TikTok", "account_handle": "@test_tt"},
    )
    assert conn_resp.status_code == 201
    account_id = conn_resp.json()["id"]

    # Schedule post
    scheduled_time = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    sched_resp = client.post(
        "/api/v1/publishing/schedule",
        headers=headers,
        json={
            "social_account_id": account_id,
            "caption": "Testing automatic scheduling and idempotent publishing!",
            "scheduled_for": scheduled_time,
        },
    )
    assert sched_resp.status_code == 201
    post_id = sched_resp.json()["id"]

    # Publish now
    pub_resp = client.post(f"/api/v1/publishing/publish-now/{post_id}", headers=headers)
    assert pub_resp.status_code == 200
    published_data = pub_resp.json()
    assert published_data["platform_post_id"] is not None
    assert "tiktok" in published_data["published_url"]

    # Idempotent re-publish test: calling publish-now again must return the published post without error
    repub_resp = client.post(f"/api/v1/publishing/publish-now/{post_id}", headers=headers)
    assert repub_resp.status_code == 200
    assert repub_resp.json()["id"] == published_data["id"]
