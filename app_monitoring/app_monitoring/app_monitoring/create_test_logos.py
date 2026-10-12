
from PIL import Image, ImageDraw
from pathlib import Path

LOGO_DIR = Path(__file__).parent / "logos"
LOGO_DIR.mkdir(exist_ok=True)


def create_logo(filename, background, symbol):
    image = Image.new("RGB", (256, 256), background)
    draw = ImageDraw.Draw(image)

    draw.ellipse((48, 48, 208, 208), fill="white")
    draw.text((105, 105), symbol, fill=background)

    image.save(LOGO_DIR / filename)
    print(f"Created: {filename}")


create_logo("official_logo.png", "#2355AA", "N")
create_logo("candidate_logo.png", "#DD8844", "S")