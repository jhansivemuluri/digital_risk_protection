
from pathlib import Path

import imagehash
from PIL import Image, ImageChops, ImageStat


def compare_logos(official_path, candidate_path):
    official_path = Path(official_path)
    candidate_path = Path(candidate_path)

    # Check whether both logo files exist
    if not official_path.is_file():
        return {"error": "Official logo file not found"}

    if not candidate_path.is_file():
        return {"error": "Candidate logo file not found"}

    try:
        # Open and standardize both images
        with Image.open(official_path) as image:
            official = image.convert("RGB").resize((256, 256))

        with Image.open(candidate_path) as image:
            candidate = image.convert("RGB").resize((256, 256))

        # Compare perceptual hashes
        official_hash = imagehash.phash(official)
        candidate_hash = imagehash.phash(candidate)

        hash_distance = int(official_hash - candidate_hash)

        # Compare pixel-level differences
        difference = ImageChops.difference(official, candidate)

        pixel_identical = difference.getbbox() is None

        color_difference = round(
            sum(ImageStat.Stat(difference).mean) / 3, 2
        )

        # Calculate hash similarity (not a probability)
        hash_bits = official_hash.hash.size

        similarity_score = round(
            100 * (1 - hash_distance / hash_bits), 2
        )

        # Interpret the comparison results
        if pixel_identical:
            interpretation = (
                "Pixel-identical logos; manual review may still be needed"
            )
        elif hash_distance <= 10:
            interpretation = (
                "Similar perceptual structure but pixel differences exist; "
                "manual review required"
            )
        else:
            interpretation = (
                "No strong perceptual-hash match; "
                "other checks may still be needed"
            )

        return {
            "official_logo": str(official_path),
            "candidate_logo": str(candidate_path),
            "hash_distance": hash_distance,
            "similarity_score": similarity_score,
            "pixel_color_difference": color_difference,
            "pixel_identical": pixel_identical,
            "interpretation": interpretation,
            "color_status": (
                "Pixel-identical images"
                if pixel_identical
                else "Pixel colors or image content differ"
            ),
            "decision": (
                "Logo similarity is one risk signal, "
                "not proof of impersonation"
            )
        }

    except (OSError, ValueError) as error:
        return {
            "error": f"Unable to compare logo images: {error}"
        }


if __name__ == "__main__":
    # Locate the logos folder
    folder = Path(__file__).parent / "logos"

    # Compare official and candidate logos
    result = compare_logos(
        folder / "official_logo.png",
        folder / "candidate_logo.png"
    )

    print(result)
