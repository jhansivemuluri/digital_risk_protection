
from rapidfuzz import fuzz
from pathlib import Path

from logo_comparator import compare_logos


OFFICIAL_APP = {
    "name": "NovaPay Wallet",
    "developer": "NovaPay Technologies",
    "package_id": "com.example.novapay",
    "description": "Official digital wallet for secure payments",
    "logo_path": Path(__file__).parent / "logos" / "official_logo.png"
}


def scan_app(candidate, official_app=None):
    official_app = official_app or OFFICIAL_APP
    # Check the registered official package identifier
    if candidate.get("package_id") == official_app["package_id"]:
        return {
            "app_name": candidate.get("name", "Unknown"),
            "status": "OFFICIAL_IDENTIFIER_MATCH",
            "risk_score": 0,
            "reasons": [
                "Matches the registered official package ID"
            ],
            "decision": (
                "Identifier match; verify against a trusted registry"
            )
        }

    # Read candidate information safely
    candidate_name = (candidate.get("name") or "").strip()
    candidate_description = (
        candidate.get("description") or ""
    ).strip()
    candidate_developer = (
        candidate.get("developer") or ""
    ).strip()

    # Compare app name and description
    name_score = fuzz.ratio(
        official_app["name"].lower(),
        candidate_name.lower()
    )

    description_score = fuzz.ratio(
        official_app["description"].lower(),
        candidate_description.lower()
    )

    reasons = []
    risk_score = 0

    # Flag missing metadata
    if not candidate_developer:
        reasons.append("Developer information is missing")

    if not candidate_description:
        reasons.append("App description is missing")

    if not candidate.get("package_id"):
        reasons.append("Package ID is missing")

    # App-name similarity: threshold reduced from 70 to 60
    if name_score >= 60:
        risk_score += 40
        reasons.append(
            f"App name is similar to the official app ({name_score:.1f}%)"
        )

    # Description similarity
    if description_score >= 60:
        risk_score += 20
        reasons.append(
            f"Description is similar to the official app "
            f"({description_score:.1f}%)"
        )

    # Developer comparison
    if (
        candidate_developer.lower() != official_app["developer"].lower()
        and name_score >= 60
    ):
        risk_score += 20
        reasons.append(
            "Developer name differs from the official developer"
        )

    # Package-ID comparison
    if (
        candidate.get("package_id") != official_app["package_id"]
        and name_score >= 60
    ):
        risk_score += 15
        reasons.append(
            "Package ID differs from the registered official package"
        )

    # Logo comparison, when a candidate logo is supplied
    logo_path = candidate.get("logo_path")

    if logo_path:
        logo_result = compare_logos(
            official_app["logo_path"],
            logo_path
        )

        if "error" in logo_result:
            reasons.append(
                f"Logo comparison unavailable: {logo_result['error']}"
            )
        else:
            hash_distance = logo_result["hash_distance"]
            color_difference = logo_result["pixel_color_difference"]

            reasons.append(f"Logo hash distance: {hash_distance}")
            reasons.append(
                f"Logo pixel-color difference: {color_difference}"
            )

            # Add risk points only when structure and color
            # comparisons both suggest similarity
            if hash_distance <= 10 and color_difference <= 5:
                risk_score += 10
                reasons.append(
                    "Logo appears similar in structure and color; "
                    "manual review advised"
                )
            elif hash_distance <= 10:
                reasons.append(
                    "Logo structure hash matches, but pixel colors differ; "
                    "visual review required"
                )

    # Keep the score within 0–100
    risk_score = min(risk_score, 100)

    # Assign review priority
    if risk_score >= 65:
        status = "HIGH_PRIORITY_REVIEW"
    elif risk_score >= 35:
        status = "NEEDS_REVIEW"
    else:
        status = "LOW_PRIORITY"

    # Missing information is a warning, not proof of malicious activity
    if not reasons:
        reasons.append("No strong similarity signals detected")

    return {
        "app_name": candidate_name or "Unknown",
        "name_similarity": round(name_score, 2),
        "description_similarity": round(description_score, 2),
        "status": status,
        "risk_score": risk_score,
        "reasons": reasons,
        "decision": (
            "Requires human review; score is heuristic, not proof"
        )
    }


if __name__ == "__main__":
    folder = Path(__file__).parent / "logos"

    sample_apps = [
        # Test 1: Official app
        {
            "name": "NovaPay Wallet",
            "developer": "NovaPay Technologies",
            "package_id": "com.example.novapay",
            "description": "Official digital wallet for secure payments"
        },

        # Test 2: Suspicious similar app
        {
            "name": "Nova Pay Wallet",
            "developer": "Unknown Developer",
            "package_id": "com.other.novapay",
            "description": "Digital wallet for secure payments",
            "logo_path": folder / "candidate_logo.png"
        },

        # Test 3: Unrelated app
        {
            "name": "Sunny Weather",
            "developer": "Weather Apps Ltd",
            "package_id": "com.weather.sunny",
            "description": "Local weather forecasts and temperature updates"
        },

        # Test 4: Shortened official app name
        {
            "name": "NovaPay",
            "developer": "Unknown Developer",
            "package_id": "com.fake.novapay",
            "description": "A payment application"
        },

        # Test 5: App with minimal information
        {
            "name": "Unknown App",
            "developer": "",
            "package_id": "com.example.unknown",
            "description": ""
        }
    ]

    for app in sample_apps:
        print(scan_app(app))
        print("-" * 50)
