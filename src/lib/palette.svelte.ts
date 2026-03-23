import type { OklchColor } from '$lib/colors';
import { autoAssignRoles } from '$lib/colors';
import type { RoleKey } from '$lib/colors';
import { randomName, randomColorName } from '$lib/nameGenerator';

export type { RoleKey };

export type PaletteColor = OklchColor & { w: number; name: string };

export type Palette = {
	id: string;
	name: string;
	colors: PaletteColor[];
	roles: Partial<Record<RoleKey, number>>;
	createdAt: number;
};

const STORAGE_KEY = 'oklch_palettes';
const ACTIVE_KEY = 'oklch_active';

// Session-only undo/redo history, keyed by palette id
const undoStacks = new Map<string, Palette[]>();
const redoStacks = new Map<string, Palette[]>();
const MAX_HISTORY = 30;

function randomColor(usedNames: Set<string> = new Set()): PaletteColor {
	return {
		l: Math.round((0.45 + Math.random() * 0.35) * 1000) / 1000,
		c: Math.round((0.08 + Math.random() * 0.18) * 1000) / 1000,
		h: Math.floor(Math.random() * 360),
		w: 100,
		name: randomColorName(usedNames)
	};
}

function migratePalette(p: Palette & { roles?: Partial<Record<RoleKey, number>> }): Palette {
	// Backfill color names
	const usedNames = new Set(p.colors.filter((c) => c.name).map((c) => c.name));
	const colors: PaletteColor[] = p.colors.map((c) => {
		if (c.name) return c as PaletteColor;
		const name = randomColorName(usedNames);
		usedNames.add(name);
		return { ...c, name } as PaletteColor;
	});

	// Rename old role keys to new shadcn naming
	let roles: Partial<Record<RoleKey, number>> = { ...(p.roles ?? {}) } as Partial<Record<RoleKey, number>>;
	const oldRoles = roles as Record<string, number | undefined>;
	if (oldRoles['text'] !== undefined && roles['foreground'] === undefined) {
		roles['foreground'] = oldRoles['text'] as number;
	}
	if (oldRoles['surface'] !== undefined && roles['card'] === undefined) {
		roles['card'] = oldRoles['surface'] as number;
	}
	// Remove old keys
	delete oldRoles['text'];
	delete oldRoles['surface'];

	// Auto-assign any new roles that are missing
	const auto = autoAssignRoles(colors);
	for (const [role, idx] of Object.entries(auto) as [RoleKey, number][]) {
		if (roles[role] === undefined) roles[role] = idx;
	}

	return { ...p, colors, roles };
}

function load(): { palettes: Palette[]; activeId: string | null; didMigrate: boolean } {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const rawPalettes: Palette[] = raw ? JSON.parse(raw) : [];
		const palettes = rawPalettes.map(migratePalette);
		const didMigrate = rawPalettes.some((p, i) => JSON.stringify(p) !== JSON.stringify(palettes[i]));
		const activeId = localStorage.getItem(ACTIVE_KEY);
		return { palettes, activeId, didMigrate };
	} catch {
		return { palettes: [], activeId: null, didMigrate: false };
	}
}

function createStore() {
	const { palettes: initial, activeId: initialActive, didMigrate } = load();

	let palettes = $state<Palette[]>(initial);
	let activeId = $state<string | null>(
		initial.find((p) => p.id === initialActive) ? initialActive : (initial[0]?.id ?? null)
	);

	let active = $derived(palettes.find((p) => p.id === activeId) ?? null);

	let canUndo = $state(false);
	let canRedo = $state(false);

	function updateHistoryState() {
		canUndo = activeId !== null && (undoStacks.get(activeId)?.length ?? 0) > 0;
		canRedo = activeId !== null && (redoStacks.get(activeId)?.length ?? 0) > 0;
	}

	function snapshot() {
		if (!activeId || !active) return;
		const stack = undoStacks.get(activeId) ?? [];
		stack.push(JSON.parse(JSON.stringify(active)));
		if (stack.length > MAX_HISTORY) stack.shift();
		undoStacks.set(activeId, stack);
		redoStacks.set(activeId, []);
		updateHistoryState();
	}

	function undo() {
		if (!activeId || !active) return;
		const stack = undoStacks.get(activeId);
		if (!stack || stack.length === 0) return;
		const redoStack = redoStacks.get(activeId) ?? [];
		redoStack.push(JSON.parse(JSON.stringify(active)));
		redoStacks.set(activeId, redoStack);
		const prev = stack.pop()!;
		undoStacks.set(activeId, stack);
		palettes = palettes.map((p) => (p.id === activeId ? prev : p));
		persist();
		updateHistoryState();
	}

	function redo() {
		if (!activeId || !active) return;
		const stack = redoStacks.get(activeId);
		if (!stack || stack.length === 0) return;
		const undoStack = undoStacks.get(activeId) ?? [];
		undoStack.push(JSON.parse(JSON.stringify(active)));
		undoStacks.set(activeId, undoStack);
		const next = stack.pop()!;
		redoStacks.set(activeId, stack);
		palettes = palettes.map((p) => (p.id === activeId ? next : p));
		persist();
		updateHistoryState();
	}

	function persist() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
		if (activeId) localStorage.setItem(ACTIVE_KEY, activeId);
		else localStorage.removeItem(ACTIVE_KEY);
	}

	// Persist immediately if migration added names/roles to existing palettes
	if (didMigrate) persist();

	function create() {
		const firstColor = randomColor();
		const colors = [firstColor];
		const palette: Palette = {
			id: crypto.randomUUID(),
			name: randomName(),
			colors,
			roles: autoAssignRoles(colors),
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
			roles: { ...src.roles },
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
			updateHistoryState();
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

	function importShared(data: { id: string; name: string; colors: PaletteColor[]; roles?: Partial<Record<RoleKey, number>> }) {
		const palette: Palette = migratePalette({ id: data.id, name: data.name, colors: data.colors, roles: data.roles ?? {}, createdAt: Date.now() });
		palettes = [...palettes, palette];
		activeId = palette.id;
		persist();
	}

	function importSharedAsNew(data: { name: string; colors: PaletteColor[]; roles?: Partial<Record<RoleKey, number>> }) {
		const palette: Palette = migratePalette({ id: crypto.randomUUID(), name: data.name, colors: data.colors, roles: data.roles ?? {}, createdAt: Date.now() });
		palettes = [...palettes, palette];
		activeId = palette.id;
		persist();
	}

	function updateShared(id: string, patch: { name: string; colors: PaletteColor[] }) {
		palettes = palettes.map((p) => (p.id === id ? { ...p, ...patch } : p));
		activeId = id;
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
		get canUndo() {
			return canUndo;
		},
		get canRedo() {
			return canRedo;
		},
		snapshot,
		undo,
		redo,
		create,
		duplicate,
		remove,
		setActive,
		updateActive,
		update,
		importShared,
		importSharedAsNew,
		updateShared
	};
}

export const paletteStore = createStore();
