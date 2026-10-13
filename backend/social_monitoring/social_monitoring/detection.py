import re
from rapidfuzz import fuzz


def _normalize_name(value):
    """Normalize case, spaces, and punctuation for comparison."""
    return re.sub(r"[^a-z0-9]", "", value.casefold())


def compare_profile_names(
    official_name,
    candidate_name,
    is_registered_official=False,
):
    """Compare profile names and return a review-priority signal."""

    # Never flag a registered official account.
    if is_registered_official:
        return {
            "similarity_score": None,
            "status": "OFFICIAL - Excluded from review",
            "warning": "Registered official account.",
        }

    if not isinstance(official_name, str) or not isinstance(
        candidate_name, str
    ):
        return {
            "similarity_score": None,
            "status": "REVIEW - Insufficient name data",
            "warning": "Both names must be provided as text.",
        }

    official = official_name.strip()
    candidate = candidate_name.strip()

    if not official or not candidate:
        return {
            "similarity_score": None,
            "status": "REVIEW - Insufficient name data",
            "warning": "Both names must be non-empty.",
        }

    official_normalized = _normalize_name(official)
    candidate_normalized = _normalize_name(candidate)

    if not official_normalized or not candidate_normalized:
        return {
            "similarity_score": None,
            "status": "REVIEW - Insufficient name data",
            "warning": "Names must contain letters or numbers.",
        }

    # Compare both original formatting and normalized names.
    # Normalization catches spacing/punctuation variations.
    original_score = fuzz.ratio(
        official.casefold(), candidate.casefold()
    )
    normalized_score = fuzz.ratio(
        official_normalized, candidate_normalized
    )
    token_score = fuzz.token_sort_ratio(
        official.casefold(), candidate.casefold()
    )

    score = round(max(original_score, normalized_score, token_score), 2)

    if score >= 85:
        status = "REVIEW - High name similarity"
    elif score >= 60:
        status = "REVIEW - Moderate name similarity"
    else:
        status = "LOW - Low name similarity"

    return {
        "similarity_score": score,
        "status": status,
        "warning": (
            "Similarity is not proof of impersonation. "
            "Verify account ownership and branding manually."
        ),
    }
