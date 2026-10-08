import os
import sys
from datetime import datetime, timezone, timedelta

# Ensure project root in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from apps.api.core.database import SessionLocal, Base, engine
from apps.api.core.security import hash_password, encrypt_secret
from apps.api.models.user import User, Organization, Membership, RoleEnum
from apps.api.models.billing import (
    Plan,
    Subscription,
    SubscriptionStatus,
    CreditAccount,
    CreditTransaction,
    CreditTransactionType,
)
from apps.api.models.social import SocialAccount, SocialCredential, SocialPlatformEnum, AccountStatus
from apps.api.models.content import Content, ContentStatus, ContentIdea, Hook, Script, Caption, Hashtag
from apps.api.models.publishing import ScheduledPost, PublishedPost, PostStatus
from apps.api.models.calendar import CalendarItem
from apps.api.models.analytics import AnalyticsSnapshot, PostAnalytics
from apps.api.models.optimization import PerformanceAnalysis, OptimizationRecommendation
from apps.api.domains.billing.service import BillingService


def seed_database():
    print("Ensuring database schema...")
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        print("Seeding subscription plans...")
        BillingService.seed_plans_if_empty(db)

        # Check if demo user already exists
        user = db.query(User).filter(User.email == "demo@aisocialstudio.com").first()
        if not user:
            print("Creating demo user: demo@aisocialstudio.com / Password123!")
            user = User(
                email="demo@aisocialstudio.com",
                hashed_password=hash_password("Password123!"),
                full_name="Alex Rivera",
                is_active=True,
                is_verified=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check Organization
        org = db.query(Organization).filter(Organization.slug == "apex-growth-studio").first()
        if not org:
            print("Creating organization: Apex Growth Studio...")
            org = Organization(
                name="Apex Growth Studio",
                slug="apex-growth-studio",
                industry="Creator Economy & SaaS",
                website="https://apexstudio.growth",
            )
            db.add(org)
            db.commit()
            db.refresh(org)

            membership = Membership(user_id=user.id, organization_id=org.id, role=RoleEnum.OWNER)
            db.add(membership)

        # Credit Account
        credit_acc = db.query(CreditAccount).filter(CreditAccount.organization_id == org.id).first()
        if not credit_acc:
            print("Creating credit account...")
            credit_acc = CreditAccount(
                organization_id=org.id,
                balance=750,
                lifetime_granted=800,
                lifetime_used=50,
            )
            db.add(credit_acc)
            db.commit()
            db.refresh(credit_acc)

            tx1 = CreditTransaction(
                credit_account_id=credit_acc.id,
                amount=800,
                type=CreditTransactionType.GRANT,
                description="Pro Trial Welcome Grant",
                reference_type="signup_bonus",
            )
            tx2 = CreditTransaction(
                credit_account_id=credit_acc.id,
                amount=-50,
                type=CreditTransactionType.CONSUMPTION,
                description="Batch Generation: 10 Hooks & 3 Scripts",
                reference_type="ai_generation",
            )
            db.add_all([tx1, tx2])
            db.commit()

        # Subscription
        sub = db.query(Subscription).filter(Subscription.organization_id == org.id).first()
        if not sub:
            pro_plan = db.query(Plan).filter(Plan.code == "pro").first()
            now = datetime.now(timezone.utc)
            sub = Subscription(
                organization_id=org.id,
                plan_id=pro_plan.id if pro_plan else "pro_id",
                status=SubscriptionStatus.TRIALING,
                trial_start=now,
                trial_end=now + timedelta(days=7),
                current_period_start=now,
                current_period_end=now + timedelta(days=7),
            )
            db.add(sub)
            db.commit()

        # Social Accounts
        if db.query(SocialAccount).filter(SocialAccount.organization_id == org.id).count() == 0:
            print("Connecting mock social channels (Instagram, TikTok, YouTube)...")
            ig = SocialAccount(
                organization_id=org.id,
                platform=SocialPlatformEnum.INSTAGRAM,
                platform_user_id="ig_apex_studio",
                account_name="Apex Growth Studio",
                account_handle="@apexgrowth",
                profile_picture_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
                status=AccountStatus.CONNECTED,
            )
            tt = SocialAccount(
                organization_id=org.id,
                platform=SocialPlatformEnum.TIKTOK,
                platform_user_id="tt_apex_studio",
                account_name="Apex Media TikTok",
                account_handle="@apex.media",
                profile_picture_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
                status=AccountStatus.CONNECTED,
            )
            yt = SocialAccount(
                organization_id=org.id,
                platform=SocialPlatformEnum.YOUTUBE,
                platform_user_id="yt_apex_studio",
                account_name="Apex Shorts Channel",
                account_handle="@ApexShorts",
                profile_picture_url="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
                status=AccountStatus.CONNECTED,
            )
            db.add_all([ig, tt, yt])
            db.commit()
            db.refresh(ig)
            db.refresh(tt)
            db.refresh(yt)

            # Add credentials
            for acc in [ig, tt, yt]:
                cred = SocialCredential(
                    account_id=acc.id,
                    encrypted_access_token=encrypt_secret(f"token_{acc.platform.value}_12345"),
                )
                db.add(cred)

            # Schedule sample posts
            now = datetime.now(timezone.utc)
            p1 = ScheduledPost(
                organization_id=org.id,
                user_id=user.id,
                social_account_id=tt.id,
                caption="If you're still posting without testing these 3 hooks, you're losing 80% retention. 🔥 Drop a comment for our template!",
                scheduled_for=now + timedelta(days=1, hours=3),
                status=PostStatus.SCHEDULED,
                idempotency_key="sched_demo_1",
            )
            p2 = ScheduledPost(
                organization_id=org.id,
                user_id=user.id,
                social_account_id=ig.id,
                caption="The $10,000 mistake most creators make in their first 90 days: chasing vanity followers instead of qualified leads.",
                scheduled_for=now + timedelta(days=2, hours=6),
                status=PostStatus.SCHEDULED,
                idempotency_key="sched_demo_2",
            )
            db.add_all([p1, p2])
            db.commit()
            db.refresh(p1)
            db.refresh(p2)

            # Calendar items
            c1 = CalendarItem(
                organization_id=org.id,
                scheduled_post_id=p1.id,
                title="TikTok: 3 Hooks Retention Breakdown",
                scheduled_time=p1.scheduled_for,
            )
            c2 = CalendarItem(
                organization_id=org.id,
                scheduled_post_id=p2.id,
                title="Instagram: $10k Creator Trap Breakdown",
                scheduled_time=p2.scheduled_for,
            )
            db.add_all([c1, c2])

            # Historical Snapshots
            snap1 = AnalyticsSnapshot(
                organization_id=org.id,
                social_account_id=tt.id,
                snapshot_date=now - timedelta(days=7),
                followers_count=118000,
                following_count=180,
                total_posts=230,
                engagement_rate=8.1,
            )
            snap2 = AnalyticsSnapshot(
                organization_id=org.id,
                social_account_id=tt.id,
                snapshot_date=now,
                followers_count=124500,
                following_count=180,
                total_posts=240,
                engagement_rate=8.4,
            )
            db.add_all([snap1, snap2])
            db.commit()

        # Seed Optimization recommendations
        OptimizationRecommendation_count = db.query(OptimizationRecommendation).filter(
            OptimizationRecommendation.organization_id == org.id
        ).count()
        if OptimizationRecommendation_count == 0:
            recs = [
                OptimizationRecommendation(
                    organization_id=org.id,
                    category="hook",
                    title="Adopt Curiosity Gap in Short-Form Videos",
                    recommendation_text="Cut the first 3 seconds of speaker introduction and open immediately with an unresolved dilemma or shocking metric.",
                    rationale="Your videos with immediate pattern interrupts experienced 42% higher 5-second completion rates.",
                    expected_impact="High",
                    status="pending",
                ),
                OptimizationRecommendation(
                    organization_id=org.id,
                    category="posting_time",
                    title="Shift TikTok Posting Window to 11:30 AM EST",
                    recommendation_text="Audience interaction peaks sharply between 11:30 AM and 1:00 PM EST on weekdays.",
                    rationale="Historical engagement was 1.8x higher when published prior to lunchtime consumption spikes.",
                    expected_impact="Medium",
                    status="pending",
                ),
            ]
            db.add_all(recs)
            db.commit()

    print("Seed complete! Demo login: demo@aisocialstudio.com / Password123!")


if __name__ == "__main__":
    seed_database()
