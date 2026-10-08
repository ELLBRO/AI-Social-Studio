import json
from typing import Optional
from pydantic import BaseModel
from apps.api.domains.ai.base import AIProvider, AIRequestConfig, AIResult


class MockAIProvider(AIProvider):
    @property
    def provider_name(self) -> str:
        return "mock"

    async def generate_text(self, prompt: str, config: Optional[AIRequestConfig] = None) -> AIResult:
        return AIResult(
            raw_text="Generated response based on: " + prompt[:100],
            prompt_tokens=45,
            completion_tokens=85,
            total_tokens=130,
            model="mock-gpt-4o",
            provider="mock",
        )

    async def generate_structured(
        self, prompt: str, response_schema: type[BaseModel], config: Optional[AIRequestConfig] = None
    ) -> AIResult:
        # Determine schema type from response_schema
        schema_name = response_schema.__name__.lower()

        data = {}
        if "strategy" in schema_name:
            data = {
                "pillars": [
                    {
                        "title": "Industry Authority & Contrarian Insights",
                        "description": "Challenge legacy thinking in the industry with data-backed breakdowns.",
                        "sample_topics": [
                            "Why 90% of current workflows fail in 2026",
                            "The single metric top 1% brands measure daily",
                        ],
                        "target_format": "Short-form video breakdown & Carousel",
                    },
                    {
                        "title": "Tactical Micro-Tutorials",
                        "description": "Step-by-step 30-second playbooks providing instant ROI.",
                        "sample_topics": [
                            "How to double your conversion rate with 1 layout change",
                            "3 free tools that save 10 hours a week",
                        ],
                        "target_format": "Step-by-step screen recording & Reel",
                    },
                    {
                        "title": "Transparent Behind-the-Scenes & Building in Public",
                        "description": "Humanize the brand with raw metrics, lessons, and founder journeys.",
                        "sample_topics": [
                            "How we scaled to $50k MRR without ad spend",
                            "The biggest mistake we made this quarter and how we fixed it",
                        ],
                        "target_format": "Storytelling video & LinkedIn narrative",
                    },
                    {
                        "title": "Viral Hooks & Trend Hijacking",
                        "description": "Capitalize on cultural and market shifts with immediate commentary.",
                        "sample_topics": [
                            "New platform algorithm shift: What changes right now",
                            "Stop doing this on social media if you want organic reach",
                        ],
                        "target_format": "Fast-paced TikTok / Shorts",
                    },
                ],
                "positioning_statement": "The go-to resource for growth-minded creators and founders demanding predictable organic reach.",
                "content_themes": ["Hyper-growth", "Efficiency", "Unfiltered Truth", "Future of Social"],
                "recommended_cadence": "1-2 daily short-form videos + 3 weekly LinkedIn/X thought leadership posts",
                "growth_tips": [
                    "Hook within the first 1.2 seconds using visual pattern interrupts.",
                    "Pin top comment asking a polarizing question to spark debates.",
                    "Repurpose winning hooks into carousels 5 days later.",
                ],
            }
        elif "idea" in schema_name:
            data = {
                "ideas": [
                    {
                        "title": "The $10,000 Mistake Most Creators Make in Their First 90 Days",
                        "description": "Break down the trap of chasing vanity metrics instead of owned audience lists.",
                        "angle": "Contrarian truth",
                        "target_audience": "Founders and emerging creators",
                        "estimated_engagement": "Viral",
                        "tags": ["growth", "strategy", "creator-economy"],
                    },
                    {
                        "title": "How to Build a 30-Day Content Pipeline in Just 2 Hours",
                        "description": "Show the batching system using modular frameworks and AI ideation.",
                        "angle": "Efficiency & systems",
                        "target_audience": "Solopreneurs and busy marketers",
                        "estimated_engagement": "High",
                        "tags": ["productivity", "systems", "automation"],
                    },
                    {
                        "title": "3 AI Tools I Refuse to Work Without in 2026",
                        "description": "Review hidden-gem tools that replace a 5-person agency setup.",
                        "angle": "Curated curation",
                        "target_audience": "Tech enthusiasts and agency owners",
                        "estimated_engagement": "High",
                        "tags": ["ai-tools", "software", "tech"],
                    },
                ]
            }
        elif "hook" in schema_name:
            data = {
                "hooks": [
                    {
                        "hook_text": "If you are still posting without this 3-second rule, stop right now.",
                        "hook_type": "Curiosity & Urgency",
                        "score": 9.4,
                    },
                    {
                        "hook_text": "Everyone told you consistency is king. They lied to you.",
                        "hook_type": "Contrarian Challenge",
                        "score": 9.1,
                    },
                    {
                        "hook_text": "Here is the exact framework that took us from zero to 100k followers in 90 days.",
                        "hook_type": "Credibility & Social Proof",
                        "score": 8.9,
                    },
                    {
                        "hook_text": "I tested 100 short-form hooks so you don't have to — here are the top 3.",
                        "hook_type": "Labor & Value Delivery",
                        "score": 9.6,
                    },
                ]
            }
        elif "script" in schema_name:
            data = {
                "title": "The 30-Day Content Framework Script",
                "full_text": "Stop guessing what to post. Here is the 3-step pipeline top creators use every single day...\n\nStep 1: The Angle Test. Before writing a word, ask: Does this challenge a common belief?\n\nStep 2: The 2-Second Retention Hook. Give the payoff upfront, not at the end.\n\nStep 3: One Clear Call To Value. Don't ask for a follow, give them a resource they'd feel stupid missing.\n\nSave this for your next batch session.",
                "scenes": [
                    {
                        "scene_number": 1,
                        "visual_cue": "Close up to camera, bold gesture holding up phone screen",
                        "spoken_dialogue": "Stop guessing what to post. Here is the 3-step pipeline top creators use.",
                        "overlay_text": "Stop Guessing What to Post 🛑",
                    },
                    {
                        "scene_number": 2,
                        "visual_cue": "Fast cut to whiteboard or digital iPad graphic showing diagram",
                        "spoken_dialogue": "Step 1: The Angle Test. Don't post tips everyone already knows. Challenge a belief.",
                        "overlay_text": "Step 1: The Angle Test ⚡",
                    },
                    {
                        "scene_number": 3,
                        "visual_cue": "Show analytics chart displaying sharp retention curve",
                        "spoken_dialogue": "Step 2: The 2-Second Hook. Deliver the payoff immediately.",
                        "overlay_text": "Step 2: Payoff Upfront 📈",
                    },
                    {
                        "scene_number": 4,
                        "visual_cue": "Direct eye contact, point to save icon",
                        "spoken_dialogue": "Save this reel and try this on your next batch.",
                        "overlay_text": "Save for later 📌",
                    },
                ],
                "duration_estimate": 35,
            }
        elif "caption" in schema_name:
            data = {
                "platform": "instagram",
                "text": "Most creators quit because they think the algorithm hates them.\n\nThe truth? Their hooks are leaking 80% of viewers in the first 2 seconds.\n\nFix these 3 things today:\n1. Cut the introduction. Start right at the meat.\n2. Add high-contrast on-screen text.\n3. Make your payoff unskippable.\n\nDrop a 🔥 below if you want our full hook swipe file!",
                "call_to_action": "Drop a 🔥 below for the full swipe file!",
                "character_count": 348,
            }
        elif "hashtag" in schema_name:
            data = {
                "niche": "Social Media Growth",
                "platform": "instagram",
                "tags": [
                    "#SocialMediaStrategy",
                    "#ContentCreatorTips",
                    "#GrowthHacking",
                    "#ViralHooks",
                    "#ShortFormContent",
                    "#CreatorEconomy",
                    "#SocialStudio",
                ],
                "tiers": [
                    {
                        "tier": "High Reach (>1M posts)",
                        "hashtags": ["#socialmediatips", "#contentcreator", "#marketingdigital"],
                    },
                    {
                        "tier": "Medium Reach (100k-1M posts)",
                        "hashtags": ["#creatorstrategy", "#growthhackers", "#shortformvideo"],
                    },
                    {
                        "tier": "Niche / Low Competition (<100k posts)",
                        "hashtags": ["#socialmediagrowthhacks", "#hookstrategy", "#viralframes"],
                    },
                ],
            }
        elif "analysis" in schema_name or "performance" in schema_name:
            data = {
                "summary": "Short-form video retention improved by 34% when using contrarian question hooks. Audiences engaged 2.4x more with step-by-step systems over generalized motivational content.",
                "top_hooks": [
                    {"hook": "If you are still doing X, stop right now", "avg_retention": "78%", "saves": 312},
                    {"hook": "How I scaled without spending a dollar", "avg_retention": "74%", "saves": 284},
                ],
                "top_formats": [
                    {"format": "Problem -> Framework -> Proof (30s)", "conversion_rate": "4.8%"},
                    {"format": "10-slide carousel deep dive", "engagement_rate": "6.2%"},
                ],
                "weak_patterns": [
                    {"pattern": "Talking head videos with >3 second intro greeting", "drop_off_pct": "62%"},
                    {"pattern": "Posts without clear Call to Action in the caption", "comment_drop_pct": "45%"},
                ],
                "audience_insights": {
                    "peak_activity_times": ["8:00 AM EST", "12:30 PM EST", "6:00 PM EST"],
                    "top_geographies": ["United States (68%)", "United Kingdom (14%)", "Canada (9%)"],
                },
                "key_takeaways": [
                    "Eliminate greeting intros entirely.",
                    "Double down on educational carousels on Tuesdays and Thursdays.",
                    "Include explicit save/bookmark CTAs on all resource breakdowns.",
                ],
            }
        else:
            data = {"message": "Success"}

        return AIResult(
            raw_text=json.dumps(data),
            parsed_json=data,
            prompt_tokens=120,
            completion_tokens=280,
            total_tokens=400,
            model="mock-gpt-4o",
            provider="mock",
        )
