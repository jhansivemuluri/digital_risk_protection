
import json
from pathlib import Path

from detection import compare_profile_names
from logo_detection import compare_logos


def scan_demo_dataset(official_name, official_logo_path, dataset_path):
    path = Path(dataset_path)

    with path.open("r", encoding="utf-8") as file:
        dataset = json.load(file)

    results = []

    for profile in dataset["profiles"]:
        # Registered official accounts must be excluded.
        is_official = profile.get("is_registered_official", False)

        name_result = compare_profile_names(
            official_name=official_name,
            candidate_name=profile.get("display_name"),
            is_registered_official=is_official,
        )

        if is_official:
            logo_result = {
                "similarity_score": None,
                "status": "OFFICIAL - Excluded from review",
            }
            final_status = "OFFICIAL - Excluded from review"

        else:
            candidate_logo_path = profile.get("logo_path")

            if candidate_logo_path:
                logo_result = compare_logos(
                    official_logo_path,
                    candidate_logo_path,
                )
            else:
                logo_result = {
                    "similarity_score": None,
                    "status": "NOT CHECKED - No logo provided",
                }

            # A candidate is sent for review if either available
            # comparison reaches the high-similarity threshold.
            high_name_similarity = (
                name_result.get("similarity_score") is not None
                and name_result["similarity_score"] >= 85
            )

            high_logo_similarity = (
                logo_result.get("similarity_score") is not None
                and logo_result["similarity_score"] >= 85
            )

            moderate_name_similarity = (
                name_result.get("similarity_score") is not None
                and name_result["similarity_score"] >= 60
            )

            moderate_logo_similarity = (
                logo_result.get("similarity_score") is not None
                and logo_result["similarity_score"] >= 65
            )

            if high_name_similarity or high_logo_similarity:
                final_status = "REVIEW REQUIRED - High similarity signal"
            elif moderate_name_similarity or moderate_logo_similarity:
                final_status = "REVIEW REQUIRED - Moderate similarity signal"
            else:
                final_status = "LOW SIMILARITY - No strong signal detected"

        results.append({
            "profile_id": profile.get("profile_id"),
            "display_name": profile.get("display_name"),
            "username": profile.get("username"),
            "name_similarity": name_result.get("similarity_score"),
            "name_status": name_result.get("status"),
            "logo_similarity": logo_result.get("similarity_score"),
            "logo_status": logo_result.get("status"),
            "final_status": final_status,
        })

    return results


if __name__ == "__main__":
    results = scan_demo_dataset(
        official_name="GlowLeaf Naturals",
        official_logo_path="sample_logos/official_logo.png",
        dataset_path="social_profiles.json",
    )

    print("SENTINEL AI - COMBINED SOCIAL PROFILE SCANNER")
    print("=" * 50)
    print("Dataset: Fictional demo data only\n")

    for result in results:
        print(json.dumps(result, indent=2))
        print("-" * 50)

    print("\nScan completed.")
    print("Similarity signals require human review.")
