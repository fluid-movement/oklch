import { oklch, formatHex, parse, toGamut, inGamut } from 'culori';

export type OklchColor = { l: number; c: number; h: number };

const mapToSRGB = toGamut('rgb');
const isInSRGB = inGamut('rgb');
const isInP3 = inGamut('p3');

export function oklchToHex(l: number, c: number, h: number): string {
	const color = { mode: 'oklch' as const, l, c, h };
	const mapped = isInSRGB(color) ? color : mapToSRGB(color);
	return formatHex(mapped) ?? '#000000';
}

export function getGamut(l: number, c: number, h: number): 'srgb' | 'p3' | 'wide' {
	const color = { mode: 'oklch' as const, l, c, h };
	if (isInSRGB(color)) return 'srgb';
	if (isInP3(color)) return 'p3';
	return 'wide';
}

export function srgbMaxChroma(l: number, h: number): number {
	let lo = 0,
		hi = 0.37;
	for (let i = 0; i < 16; i++) {
		const mid = (lo + hi) / 2;
		if (isInSRGB({ mode: 'oklch', l, c: mid, h })) lo = mid;
		else hi = mid;
	}
	return lo;
}

export function p3MaxChroma(l: number, h: number): number {
	let lo = 0,
		hi = 0.37;
	for (let i = 0; i < 16; i++) {
		const mid = (lo + hi) / 2;
		if (isInP3({ mode: 'oklch', l, c: mid, h })) lo = mid;
		else hi = mid;
	}
	return lo;
}

export function hexToOklch(hex: string): OklchColor | null {
	const parsed = parse(hex);
	if (!parsed) return null;
	const converted = oklch(parsed);
	if (!converted) return null;
	return {
		l: Math.round((converted.l ?? 0) * 1000) / 1000,
		c: Math.round((converted.c ?? 0) * 1000) / 1000,
		h: Math.round(converted.h ?? 0)
	};
}

export function lightnessGradient(c: number, h: number): string {
	return `linear-gradient(to right, oklch(0 ${c} ${h}), oklch(1 ${c} ${h}))`;
}

export function chromaGradient(l: number, h: number): string {
	return `linear-gradient(to right, oklch(${l} 0 ${h}), oklch(${l} 0.37 ${h}))`;
}

export function hueGradient(l: number, c: number): string {
	const stops = Array.from({ length: 13 }, (_, i) => {
		const deg = i * 30;
		return `oklch(${l} ${c} ${deg})`;
	});
	return `linear-gradient(to right, ${stops.join(', ')})`;
}

// ─── Color theory palette generators ───────────────────────────────────────

function hue(base: number, offset: number): number {
	return (base + offset + 360) % 360;
}

export function complementaryPalette(base: OklchColor): OklchColor[] {
	const { l, c, h } = base;
	return [
		{ l, c, h },
		{ l, c, h: hue(h, 180) }
	];
}

export function analogousPalette(base: OklchColor): OklchColor[] {
	const { l, c, h } = base;
	return [
		{ l, c, h: hue(h, -30) },
		{ l, c, h },
		{ l, c, h: hue(h, 30) }
	];
}

export function splitComplementaryPalette(base: OklchColor): OklchColor[] {
	const { l, c, h } = base;
	return [
		{ l, c, h },
		{ l, c, h: hue(h, 150) },
		{ l, c, h: hue(h, 210) }
	];
}

export function triadicPalette(base: OklchColor): OklchColor[] {
	const { l, c, h } = base;
	return [
		{ l, c, h },
		{ l, c, h: hue(h, 120) },
		{ l, c, h: hue(h, 240) }
	];
}

export function tetradicPalette(base: OklchColor): OklchColor[] {
	const { l, c, h } = base;
	return [
		{ l, c, h },
		{ l, c, h: hue(h, 90) },
		{ l, c, h: hue(h, 180) },
		{ l, c, h: hue(h, 270) }
	];
}

export function monochromaticPalette(base: OklchColor): OklchColor[] {
	const { c, h } = base;
	return [
		{ l: 0.25, c: c * 0.8, h },
		{ l: 0.45, c, h },
		{ l: 0.65, c: c * 0.9, h },
		{ l: 0.85, c: c * 0.6, h }
	];
}

// ─── Semantic color roles (shadcn/ui naming) ────────────────────────────────

export type RoleKey =
	| 'background'
	| 'foreground'
	| 'card'
	| 'card-foreground'
	| 'primary'
	| 'primary-foreground'
	| 'muted'
	| 'muted-foreground'
	| 'accent'
	| 'accent-foreground'
	| 'border';

/** Pick the color index (excluding `exclude`) with the greatest L contrast against `bgIdx`. */
function pickMaxContrast(bgIdx: number, colors: OklchColor[], exclude: Set<number>): number {
	const bgL = bgIdx >= 0 ? (colors[bgIdx]?.l ?? 0.5) : 0.5;
	let best = -1;
	let bestDiff = -1;
	for (let i = 0; i < colors.length; i++) {
		if (exclude.has(i)) continue;
		const diff = Math.abs(colors[i].l - bgL);
		if (diff > bestDiff) {
			bestDiff = diff;
			best = i;
		}
	}
	return best;
}

export function autoAssignRoles(colors: OklchColor[]): Partial<Record<RoleKey, number>> {
	if (colors.length === 0) return {};

	const roles: Partial<Record<RoleKey, number>> = {};
	// `used` tracks which indices have been used for *background* roles (not foreground)
	// so foreground roles can reuse the same index as other foreground roles
	const usedBg = new Set<number>();

	const pickBg = (scoreFn: (c: OklchColor) => number, descending = true): number => {
		let best = -1;
		let bestScore = descending ? -Infinity : Infinity;
		for (let i = 0; i < colors.length; i++) {
			if (usedBg.has(i)) continue;
			const score = scoreFn(colors[i]);
			if (descending ? score > bestScore : score < bestScore) {
				bestScore = score;
				best = i;
			}
		}
		return best;
	};

	const assignBg = (role: RoleKey, idx: number) => {
		if (idx === -1) return;
		roles[role] = idx;
		usedBg.add(idx);
	};

	const assignFg = (role: RoleKey, bgRole: RoleKey) => {
		const bgIdx = roles[bgRole] ?? -1;
		// All colors eligible for foreground (no exclusion — sharing is allowed)
		const idx = pickMaxContrast(bgIdx, colors, new Set());
		if (idx !== -1) roles[role] = idx;
	};

	// Assign backgrounds in order
	assignBg('background', pickBg((c) => c.l));
	assignBg('card', pickBg((c) => c.l)); // 2nd highest L
	assignBg('primary', pickBg((c) => c.c)); // highest C
	assignBg('accent', pickBg((c) => c.c)); // 2nd highest C
	assignBg('muted', pickBg((c) => c.l)); // 3rd highest L (subtle bg)
	assignBg('border', pickBg((c) => c.l, false)); // lower-L for borders

	// Foreground: highest contrast against their paired background (colors may be shared)
	assignFg('foreground', 'background');
	assignFg('card-foreground', 'card');
	assignFg('primary-foreground', 'primary');
	assignFg('muted-foreground', 'muted');
	assignFg('accent-foreground', 'accent');

	return roles;
}

export const PALETTE_SCHEMES = [
	{ label: 'Complementary', fn: complementaryPalette },
	{ label: 'Analogous', fn: analogousPalette },
	{ label: 'Split-Comp', fn: splitComplementaryPalette },
	{ label: 'Triadic', fn: triadicPalette },
	{ label: 'Tetradic', fn: tetradicPalette },
	{ label: 'Monochromatic', fn: monochromaticPalette }
] as const;

// ─── Add-to-palette suggestions ────────────────────────────────────────────

export type Suggestion = { label: string; color: OklchColor };

export function getSuggestions(base: OklchColor): Suggestion[] {
	const { l, c, h } = base;
	return [
		{ label: 'Complement', color: { l, c, h: hue(h, 180) } },
		{ label: 'Split ←', color: { l, c, h: hue(h, 150) } },
		{ label: 'Split →', color: { l, c, h: hue(h, 210) } },
		{ label: 'Analog ←', color: { l, c, h: hue(h, -30) } },
		{ label: 'Analog →', color: { l, c, h: hue(h, 30) } },
		{ label: 'Tint', color: { l: Math.min(1, l + 0.2), c: c * 0.7, h } },
		{ label: 'Shade', color: { l: Math.max(0, l - 0.2), c: c * 0.7, h } },
		{ label: 'Muted', color: { l, c: Math.max(0.01, c * 0.2), h } }
	];
}
