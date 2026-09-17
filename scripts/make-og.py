#!/usr/bin/env python3
"""
make-og.py - the 1200x630 share card.

Link previews were blank before this existed, which meant every cold email,
every text with the site in it, and every LinkedIn post shipped a grey box.

Monochrome editorial, same DNA as the site: warm paper #FAF9F6, soft ink
#141412, a hairline frame, a mono eyebrow, a serif wordmark. Georgia stands
in for Bodoni Moda, which is the declared fallback in the site's font stack.

RUN   python scripts/make-og.py
OUT   img/og-to-the-max.png  (PNG on purpose: OG images stay PNG, not WebP)
"""

import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
PAPER = (250, 249, 246)
INK = (20, 20, 18)
FAINT = (111, 109, 104)
HAIRLINE = (206, 204, 199)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "img", "og-to-the-max.png")

FONTS = "C:/Windows/Fonts"


def font(name, size):
    for candidate in (os.path.join(FONTS, name), name):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


serif = font("georgia.ttf", 104)
serif_it = font("georgiai.ttf", 104)
body = font("segoeui.ttf", 30)
mono = font("consola.ttf", 21)

img = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(img)

# hairline frame, inset, the way the site rules its sections
M = 48
d.rectangle([M, M, W - M, H - M], outline=HAIRLINE, width=1)

x = M + 62
d.text((x, M + 72), "M A R K E T I N G ,   W I T H   R E C E I P T S", font=mono, fill=FAINT)

d.text((x, M + 132), "To The Max", font=serif, fill=INK)
d.text((x, M + 246), "spends its own", font=serif, fill=INK)
d.text((x, M + 360), "money first.", font=serif_it, fill=INK)

# rule above the footer line
d.line([(x, H - M - 108), (W - M - 62, H - M - 108)], fill=HAIRLINE, width=1)

d.text((x, H - M - 82), "Meta ads, landing pages, and lead follow-up for local businesses.", font=body, fill=FAINT)
d.text((x, H - M - 44), "H U N T S V I L L E ,   A L A B A M A", font=mono, fill=FAINT)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT, "PNG", optimize=True)
print(f"  wrote {os.path.relpath(OUT, ROOT)}  {os.path.getsize(OUT) // 1024} KB  {W}x{H}")
