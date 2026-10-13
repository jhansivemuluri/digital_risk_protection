
from detection import compare_profile_names


def test_registered_official_is_excluded():
    result = compare_profile_names(
        "GlowSkin Naturals",
        "GlowSkin Naturals",
        is_registered_official=True,
    )
    assert result["similarity_score"] is None
    assert result["status"] == "OFFICIAL - Excluded from review"


def test_typo_lookalike_is_flagged():
    result = compare_profile_names(
        "GlowSkin Naturals",
        "GlowSkln Naturals",
    )
    assert result["similarity_score"] >= 85
    assert result["status"] == "REVIEW - High name similarity"


def test_unrelated_name_is_low_similarity():
    result = compare_profile_names(
        "GlowSkin Naturals",
        "Lovely Beauty Store",
    )
    assert result["status"] == "LOW - Low name similarity"


def test_comparison_is_case_insensitive():
    result = compare_profile_names(
        "GlowSkin Naturals",
        "GLOWSKIN NATURALS",
    )
    assert result["similarity_score"] == 100.0


def test_empty_candidate_name_is_handled():
    result = compare_profile_names("GlowSkin Naturals", "   ")
    assert result["similarity_score"] is None
    assert result["status"] == "REVIEW - Insufficient name data"


def test_missing_candidate_name_is_handled():
    result = compare_profile_names("GlowSkin Naturals", None)
    assert result["similarity_score"] is None
    assert result["status"] == "REVIEW - Insufficient name data"


if __name__ == "__main__":
    tests = [
        test_registered_official_is_excluded,
        test_typo_lookalike_is_flagged,
        test_unrelated_name_is_low_similarity,
        test_comparison_is_case_insensitive,
        test_empty_candidate_name_is_handled,
        test_missing_candidate_name_is_handled,
    ]

    for test in tests:
        test()
        print(f"PASS: {test.__name__}")

    print(f"\n{len(tests)} tests passed.")
