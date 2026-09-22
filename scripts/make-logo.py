#!/usr/bin/env python3
"""
make-logo.py - the square brand mark.

WHY IT EXISTS: the Organization schema had no `logo`, which is one of the things
Google looks for before it will build a knowledge panel for a business. It is
also the image Google Business Profile, LinkedIn and Instagram all want, and all
three want it SQUARE. Same DNA as the site: warm paper, soft ink, hairline
frame, Bodoni-ish serif wordmark over a mono kicker.

RUN   python scripts/make-logo.py
OUT   img/logo-to-the-max.png       1024x1024, for schema, GBP, LinkedIn, IG
      img/logo-to-the-max-dark.png  same mark inverted, for dark backgrounds
"""

import os
from PIL import Image, ImageDraw, ImageFont

S = 1024
PAPER = (250, 249, 246)
INK = (20, 20, 18)
FAINT = (111, 109, 104)
HAIRLINE = (206, 204, 199)

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONTS = "C:/Windows/Fonts"


def font(name, size):
    for candidate in (os.path.join(FONTS, name), name):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def centered(d, y, text, f, fill):
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    d.text(((S - (r - l)) / 2 - l, y), text, font=f, fill=fill)


def build(bg, ink, faint, hair, out):
    img = Image.new("RGB", (S, S), bg)
    d = ImageDraw.Draw(img)

    m = 64
    d.rectangle([m, m, S - m, S - m], outline=hair, width=2)

    serif = font("georgia.ttf", 150)
    serif_it = font("georgiai.ttf", 150)
    mono = font("consola.ttf", 38)

    centered(d, 300, "TO THE", serif, ink)
    centered(d, 452, "MAX", serif_it, ink)

    d.line([(S * 0.28, 648), (S * 0.72, 648)], fill=hair, width=2)
    centered(d, 682, "M A R K E T I N G", mono, faint)

    path = os.path.join(ROOT, "img", out)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print(f"  wrote img/{out}  {os.path.getsize(path) // 1024} KB  {S}x{S}")


build(PAPER, INK, FAINT, HAIRLINE, "logo-to-the-max.png")
build(INK, PAPER, (165, 162, 155), (58, 57, 54), "logo-to-the-max-dark.png")
