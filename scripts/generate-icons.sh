#!/bin/bash
# Generate PWA icon PNGs from SVGs
# Requires: rsvg-convert (librsvg) or Inkscape or ImageMagick
# On macOS: brew install librsvg

ICONS_DIR="$(dirname "$0")/../public/icons"

if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 192 -h 192 "$ICONS_DIR/icon-192.svg" -o "$ICONS_DIR/icon-192.png"
  rsvg-convert -w 512 -h 512 "$ICONS_DIR/icon-512.svg" -o "$ICONS_DIR/icon-512.png"
  echo "Icons generated with rsvg-convert."
elif command -v convert &> /dev/null; then
  convert -background none -resize 192x192 "$ICONS_DIR/icon-192.svg" "$ICONS_DIR/icon-192.png"
  convert -background none -resize 512x512 "$ICONS_DIR/icon-512.svg" "$ICONS_DIR/icon-512.png"
  echo "Icons generated with ImageMagick."
elif command -v sips &> /dev/null; then
  # macOS built-in — limited SVG support, but try
  sips -s format png -z 192 192 "$ICONS_DIR/icon-192.svg" --out "$ICONS_DIR/icon-192.png" 2>/dev/null
  sips -s format png -z 512 512 "$ICONS_DIR/icon-512.svg" --out "$ICONS_DIR/icon-512.png" 2>/dev/null
  echo "Icons generated with sips (macOS)."
else
  echo "No image converter found. Install librsvg: brew install librsvg"
  exit 1
fi
