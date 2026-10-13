
from social_detection_practice import scan_demo_dataset


def test_scanner_returns_all_demo_profiles():
    results = scan_demo_dataset(
        official_name="GlowLeaf Naturals",
        official_logo_path="sample_logos/official_logo.png",
        dataset_path="social_profiles.json",
    )

    assert len(results) == 3
    print("PASS: All demo profiles scanned")


def test_official_profile_is_excluded():
    results = scan_demo_dataset(
        official_name="GlowLeaf Naturals",
        official_logo_path="sample_logos/official_logo.png",
        dataset_path="social_profiles.json",
    )

    official = next(
        item for item in results
        if item["profile_id"] == "demo_001"
    )

    assert official["final_status"] == "OFFICIAL - Excluded from review"
    assert official["name_similarity"] is None
    print("PASS: Official profile excluded")


def test_lookalike_profile_is_sent_for_review():
    results = scan_demo_dataset(
        official_name="GlowLeaf Naturals",
        official_logo_path="sample_logos/official_logo.png",
        dataset_path="social_profiles.json",
    )

    candidate = next(
        item for item in results
        if item["profile_id"] == "demo_002"
    )

    assert candidate["final_status"].startswith("REVIEW REQUIRED")
    print("PASS: Lookalike profile sent for review")


def test_missing_logo_is_handled():
    results = scan_demo_dataset(
        official_name="GlowLeaf Naturals",
        official_logo_path="sample_logos/official_logo.png",
        dataset_path="social_profiles.json",
    )

    profile = next(
        item for item in results
        if item["profile_id"] == "demo_003"
    )

    assert profile["logo_similarity"] is None
    assert profile["logo_status"] == "NOT CHECKED - No logo provided"
    print("PASS: Missing logo handled safely")


if __name__ == "__main__":
    tests = [
        test_scanner_returns_all_demo_profiles,
        test_official_profile_is_excluded,
        test_lookalike_profile_is_sent_for_review,
        test_missing_logo_is_handled,
    ]

    for test in tests:
        test()

    print(f"\nAll {len(tests)} combined scanner tests passed!")
