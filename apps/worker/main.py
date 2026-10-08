import asyncio
import os
import sys
import traceback
from datetime import datetime, timezone

# Ensure project root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from apps.api.core.database import SessionLocal
from apps.api.core.logging import logger
from apps.api.models.jobs import Job, JobStatus
from apps.api.models.publishing import ScheduledPost, PostStatus
from apps.api.domains.publishing.service import PublishingService
from apps.api.domains.analytics.service import AnalyticsService


class Worker:
    def __init__(self, poll_interval: int = 5):
        self.poll_interval = poll_interval
        self.is_running = True

    async def run(self):
        logger.info("AI Social Studio Background Worker started. Polling for tasks...")
        while self.is_running:
            try:
                await self.process_due_scheduled_posts()
                await self.process_pending_jobs()
            except Exception as e:
                logger.error(f"Worker iteration error: {str(e)}\n{traceback.format_exc()}")
            await asyncio.sleep(self.poll_interval)

    async def process_due_scheduled_posts(self):
        now = datetime.now(timezone.utc)
        with SessionLocal() as db:
            due_posts = (
                db.query(ScheduledPost)
                .filter(
                    ScheduledPost.status == PostStatus.SCHEDULED,
                    ScheduledPost.scheduled_for <= now,
                )
                .all()
            )
            for post in due_posts:
                logger.info(f"Worker publishing due post {post.id} for account {post.social_account_id}...")
                try:
                    await PublishingService.publish_scheduled_post(db, post.id)
                    logger.info(f"Post {post.id} successfully published.")
                except Exception as e:
                    logger.error(f"Failed to publish post {post.id}: {str(e)}")

    async def process_pending_jobs(self):
        with SessionLocal() as db:
            jobs = (
                db.query(Job)
                .filter(Job.status == JobStatus.PENDING)
                .order_by(Job.created_at.asc())
                .limit(5)
                .all()
            )
            for job in jobs:
                job.status = JobStatus.PROCESSING
                job.attempts += 1
                db.commit()

                try:
                    logger.info(f"Processing job {job.id} (type: {job.job_type})...")
                    if job.job_type == "analytics_sync":
                        await AnalyticsService.sync_account_snapshots(db, job.organization_id)
                    job.status = JobStatus.COMPLETED
                    job.result = {"status": "success", "processed_at": datetime.now(timezone.utc).isoformat()}
                    db.commit()
                except Exception as e:
                    logger.error(f"Job {job.id} failed: {str(e)}")
                    if job.attempts >= job.max_attempts:
                        job.status = JobStatus.FAILED
                    else:
                        job.status = JobStatus.PENDING
                    job.error = str(e)
                    db.commit()


if __name__ == "__main__":
    worker = Worker()
    try:
        asyncio.run(worker.run())
    except KeyboardInterrupt:
        logger.info("Worker stopped by user.")
