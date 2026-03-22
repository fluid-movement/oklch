import type { OklchColor } from '$lib/colors';
import { randomName } from '$lib/nameGenerator';

export type PaletteColor = OklchColor & { w: number };

export type Palette = {
	id: string;
	name: string;
	colors: PaletteColor[];
	createdAt: number;
};

const STORAGE_KEY = 'oklch_palettes';
const ACTIVE_KEY = 'oklch_active';

function randomColor(): PaletteColor {
	return {
		l: Math.round((0.45 + Math.random() * 0.35) * 1000) / 1000,
		c: Math.round((0.08 + Math.random() * 0.18) * 1000) / 1000,
		h: Math.floor(Math.random() * 360),
		w: 100
	};
}

function load(): { palettes: Palette[]; activeId: string | null } {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const palettes: Palette[] = raw ? JSON.parse(raw) : [];
		const activeId = localStorage.getItem(ACTIVE_KEY);
		return { palettes, activeId };
	} catch {
		return { palettes: [], activeId: null };
	}
}

function createStore() {
	const { palettes: initial, activeId: initialActive } = load();

	let palettes = $state<Palette[]>(initial);
	let activeId = $state<string | null>(
		initial.find((p) => p.id === initialActive) ? initialActive : (initial[0]?.id ?? null)
	);

	let active = $derived(palettes.find((p) => p.id === activeId) ?? null);

	function persist() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
		if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
		else localStorage.removeItem(ACTIVE_KEY);
	}

	function create() {
		const palette: Palette = {
			id: crypto.randomUUID(),
			name: randomName(),
			colors: [randomColor()],
			createdAt: Date.now()
		};
		palettes = [...palettes, palette];
		activeId = palette.id;
		persist();
	}

	function duplicate(id: string) {
		const src = palettes.find((p) => p.id === id);
		if (!src) return;
		const copy: Palette = {
			id: crypto.randomUUID(),
			name: `${src.name} copy`,
			colors: src.colors.map((c) => ({ ...c })),
			createdAt: Date.now()
		};
		palettes = [...palettes, copy];
		activeId = copy.id;
		persist();
	}

	function remove(id: string) {
		palettes = palettes.filter((p) => p.id !== id);
		if (activeId === id) {
			activeId = palettes.at(-1)?.id ?? null;
		}
		persist();
	}

	function setActive(id: string) {
		if (palettes.find((p) => p.id === id)) {
			activeId = id;
			persist();
		}
	}

	function updateActive(patch: Partial<Omit<Palette, 'id' | 'createdAt'>>) {
		if (!activeId) return;
		palettes = palettes.map((p) => (p.id === activeId ? { ...p, ...patch } : p));
		persist();
	}

	function update(id: string, patch: Partial<Omit<Palette, 'id' | 'createdAt'>>) {
		palettes = palettes.map((p) => (p.id === id ? { ...p, ...patch } : p));
		persist();
	}

	return {
		get palettes() {
			return palettes;
		},
		get activeId() {
			return activeId;
		},
		get active(): Palette | null {
			return active;
		},
		create,
		duplicate,
		remove,
		setActive,
		updateActive,
		update
	};
}

export const paletteStore = createStore();
