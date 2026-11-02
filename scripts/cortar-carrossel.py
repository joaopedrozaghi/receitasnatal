"""Corta cada criativos/**/carrossel-*-inteiro.png em 3 slides (-1, -2, -3)."""
import glob
import os

from PIL import Image

for path in glob.glob("criativos/**/*-inteiro.png", recursive=True):
    im = Image.open(path)
    w = im.size[0] // 3
    base = path.replace("-inteiro.png", "")
    for i in range(3):
        im.crop((i * w, 0, (i + 1) * w, im.size[1])).save(f"{base}-{i + 1}.png")
    im.close()
    os.remove(path)
    print("ok", base)
