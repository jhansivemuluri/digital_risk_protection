
from PIL import Image, ImageDraw
from pathlib import Path

# Folder to store the generated images
output_folder = Path("sample_logos")
output_folder.mkdir(exist_ok=True)


def create_logo(filename, brand_name, leaf_variant):
    # Create a white image canvas
    image = Image.new("RGB", (500, 350), "white")
    draw = ImageDraw.Draw(image)

    # Draw a green circle
    draw.ellipse(
        (175, 25, 325, 175),
        outline=(30, 100, 65),
        width=6,
    )

    # Draw the leaf
    if leaf_variant == 1:
        leaf_box = (215, 50, 285, 145)
    else:
        leaf_box = (220, 60, 290, 140)

    draw.ellipse(
        leaf_box,
        fill=(40, 150, 90),
    )

    # Draw the leaf vein
    draw.line(
        (230, 130, 275, 65),
        fill="white",
        width=5,
    )

    # Write the fictional brand name
    draw.text(
        (90, 220),
        brand_name,
        fill=(30, 70, 45),
    )

    # Save the image as PNG
    image.save(output_folder / filename)
    print(f"Created: {output_folder / filename}")


# Original demo logo
create_logo(
    "official_logo.png",
    "GlowLeaf Naturals",
    1,
)

# Similar-looking demo logo with a spelling difference
create_logo(
    "candidate_logo.png",
    "GlowLeef Naturals",
    2,
)

print("\nBoth demo logo images created successfully!")
