import io

def test_media_and_video_lifecycle(client):
    # Register user
    reg_resp = client.post(
        "/api/v1/auth/register",
        json={
            "email": "media_tester@studio.com",
            "password": "Password123!",
            "full_name": "Media Tester",
        },
    )
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload mock image asset
    file_content = b"fake image byte data for testing"
    files = {"file": ("test_thumbnail.png", io.BytesIO(file_content), "image/png")}
    upload_resp = client.post("/api/v1/media/upload", headers=headers, files=files)
    assert upload_resp.status_code == 201
    media_data = upload_resp.json()
    assert media_data["filename"] == "test_thumbnail.png"
    assert media_data["mime_type"] == "image/png"
    media_id = media_data["id"]

    # List media
    list_resp = client.get("/api/v1/media", headers=headers)
    assert list_resp.status_code == 200
    media_list = list_resp.json()
    assert any(m["id"] == media_id for m in media_list)

    # Queue an AI video generation job
    video_resp = client.post(
        "/api/v1/video/generate",
        headers=headers,
        json={
            "prompt": "Futuristic cyberpunk neon social studio dashboard",
            "media_asset_id": media_id,
            "aspect_ratio": "9:16",
            "duration_seconds": 10,
            "provider": "mock",
        },
    )
    assert video_resp.status_code == 202
    job_data = video_resp.json()
    assert job_data["status"] in ["completed", "processing"]
    assert job_data["aspect_ratio"] == "9:16"
    assert job_data["prompt"].startswith("Futuristic")
    job_id = job_data["id"]

    # Check video generations list via /video
    gen_list_resp = client.get("/api/v1/video", headers=headers)
    assert gen_list_resp.status_code == 200
    generations = gen_list_resp.json()
    assert any(g["id"] == job_id for g in generations)

    # Check single video status via /video/{job_id}
    status_resp = client.get(f"/api/v1/video/{job_id}", headers=headers)
    assert status_resp.status_code == 200
    assert status_resp.json()["id"] == job_id

    # Delete media asset
    del_resp = client.delete(f"/api/v1/media/{media_id}", headers=headers)
    assert del_resp.status_code in [200, 204]
