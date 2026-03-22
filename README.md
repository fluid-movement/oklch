# OKLCH Palette Editor

A browser-based color palette tool built around the OKLCH color space. Create, edit, save, and share palettes — all stored locally in your browser, no account required.

## What is OKLCH?

OKLCH is a perceptually uniform color space with three axes:

- **L** — lightness (0–1), consistent across all hues
- **C** — chroma, i.e. colorfulness (0–~0.37)
- **H** — hue angle (0–360°)

Unlike HSL or RGB, equal steps in OKLCH produce equal perceived differences. This makes it predictable for generating harmonious palettes: shift the hue by 120° and you get a triadic scheme where all three colors feel equally vivid. It also maps cleanly to modern CSS — `oklch()` is natively supported in all major browsers.

OKLCH spans beyond what standard displays can show. The sRGB gamut (web standard) covers only a portion of it; Display P3 (modern Macs, iPhones) covers more. The editor shows gamut boundaries on the chroma slider so you always know where you stand.

## Features

- L, C, H sliders with live gradients
- sRGB and P3 gamut boundary markers on the chroma slider
- Gamut badge (sRGB / P3 / Wide) per color
- OKLCH color wheel tied to the selected color's lightness
- Palette schemes: complementary, analogous, triadic, tetradic, split-complementary, monochromatic
- Add colors from harmony suggestions
- Drag to reorder, resize widths, duplicate, or remove swatches
- Multiple palettes with auto-save to localStorage
- Shareable links (Base64-encoded palette in the URL)

## Stack

SvelteKit · Svelte 5 (runes) · TypeScript · [culori](https://github.com/Evercoder/culori) · [lucide-svelte](https://lucide.dev)

## Development

```sh
npm install
npm run dev
```

```sh
npm run build
npm run preview
```
