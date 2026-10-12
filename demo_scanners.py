from pathlib import Path
import sys
import re

ROOT = Path(__file__).resolve().parent.parent
SOCIAL_DIR = ROOT / "social_monitoring" / "social_monitoring"
APP_DIR = ROOT / "app_monitoring" / "app_monitoring" / "app_monitoring"

for folder in (str(SOCIAL_DIR), str(APP_DIR)):
    if folder not in sys.path:
        sys.path.insert(0, folder)

from detection import compare_profile_names
from app_scanner import scan_app


def run_social_demo(brand):
    official_name = (brand.get("official_name") or "").strip()
    if not official_name:
        raise ValueError("Save a valid brand name before scanning.")

    # Fictional candidates only; no live platform data is fetched.
    candidates = [
        {
            "username": "demo_support_account",
            "display_name": f"{official_name} Support",
        },
        {
            "username": "demo_help_account",
            "display_name": f"{official_name} Help Center",
        },
        {
            "username": "unrelated_demo_account",
            "display_name": "Sunny Garden Store",
        },
    ]
    official_urls = {
        url.strip().rstrip("/").casefold()
        for url in (brand.get("official_social_urls") or [])
        if isinstance(url, str) and url.strip()
    }
    results = []
    for candidate in candidates:
        candidate_url = (
            "https://example.invalid/" + candidate["username"]
        ).rstrip("/").casefold()

        is_official = candidate_url in official_urls
        result = compare_profile_names(
            official_name=official_name,
            candidate_name=candidate["display_name"],
            is_registered_official=is_official,
        )
        score = result.get("similarity_score") or 0

        results.append({
            "platform": "Social Demo",
            "profile_url": (
                "https://example.invalid/" + candidate["username"]
            ),
            "detected_name": candidate["display_name"],
            "finding_type": "Social profile name similarity",
            "reason": result.get("status", "Needs review"),
            "description": result.get(
                "warning", "Similarity is not proof of impersonation."
            ),
            "risk_score": score,
            "detection_status": result.get("status"),
            "source": "fictional_demo_data",
            "status": "Under Review",
        })

    return results


def run_apps_demo(brand):
    official_name = (brand.get("official_name") or "").strip()
    if not official_name:
        raise ValueError("Save a valid brand name before scanning.")

    identifiers = brand.get("official_app_identifiers") or []
    official_package = identifiers[0].strip() if identifiers else (
        "__NO_REGISTERED_PACKAGE_ID__"
    )
    official_developer = (
        brand.get("official_developer") or "Unspecified official developer"
    )

    official_app = {
        "name": official_name,
        "developer": official_developer,
        "package_id": official_package,
        "description": f"Official application for {official_name}",
        "logo_path": APP_DIR / "logos" / "official_logo.png",
    }

    candidates = [
        {
            "name": f"{official_name} Support",
            "developer": "Unverified Demo Developer",
            "package_id": "com.demo.unverified.support",
            "description": f"Support services and account access for {official_name}",
        },
        {
            "name": f"{official_name} Official",
            "developer": "Demo Publisher",
            "package_id": "com.demo.publisher.official",
            "description": f"Official services and information for {official_name}",
        },
        {
            "name": "Sunny Weather",
            "developer": "Weather Demo Publisher",
            "package_id": "com.demo.weather.sunny",
            "description": "Local weather forecasts and temperature updates",
        },
    ]

    results = []
    for candidate in candidates:
        result = scan_app(candidate, official_app=official_app)
        if result.get("status") == "OFFICIAL_IDENTIFIER_MATCH":
            continue

        results.append({
            "platform": "App Demo",
            "app_name": result.get("app_name", "Unknown"),
            "detected_name": result.get("app_name", "Unknown"),
            "package_id": candidate.get("package_id"),
            "finding_type": "App similarity heuristic",
            "reason": "; ".join(result.get("reasons", [])),
            "description": result.get(
                "decision", "Human review is required."
            ),
            "risk_score": result.get("risk_score", 0),
            "detection_status": result.get("status"),
            "source": "fictional_demo_data",
            "status": "Under Review",
        })

    return results
