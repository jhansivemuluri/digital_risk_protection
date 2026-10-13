
from pathlib import Path

import imagehash
from PIL import Image


def compare_logos(official_logo_path, candidate_logo_path):
    official_path = Path(official_logo_path)
    candidate_path = Path(candidate_logo_path)

    # Check whether both image files exist
    if not official_path.is_file() or not candidate_path.is_file():
        return {
            "similarity_score": None,
            "status": "ERROR - Logo file not found",
        }

    try:
        # Open both images
        with Image.open(official_path) as image:
            official_logo = image.convert("RGB")

        with Image.open(candidate_path) as image:
            candidate_logo = image.convert("RGB")

        # Generate perceptual hashes
        official_hash = imagehash.phash(official_logo)
        candidate_hash = imagehash.phash(candidate_logo)

        # Calculate the difference between hashes
        hash_difference = official_hash - candidate_hash

        # pHash uses 64 bits; smaller difference means more similar
        similarity = (1 - hash_difference / 64) * 100
        similarity = round(max(0, similarity), 2)

        if similarity >= 85:
            status = "REVIEW - High logo similarity"
        elif similarity >= 65:
            status = "REVIEW - Moderate logo similarity"
        else:
            status = "LOW - Low logo similarity"

        return {
            "similarity_score": similarity,
            "status": status,
            "warning": "Similarity is not proof of impersonation.",
        }

    except (OSError, ValueError) as error:
        return {
            "similarity_score": None,
            "status": "ERROR - Could not read logo",
            "warning": str(error),
        }


if __name__ == "__main__":
    result = compare_logos(
        "sample_logos/official_logo.png",
        "sample_logos/candidate_logo.png",
    )

    print("SENTINEL AI - LOGO DETECTION")
    print("-" * 35)

    for key, value in result.items():
        print(f"{key}: {value}")
