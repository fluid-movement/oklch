<script lang="ts">
	import { onMount } from 'svelte';
	import type { OklchColor } from '$lib/colors';
	import type { PaletteColor } from '$lib/palette.svelte';
	import { getSuggestions } from '$lib/colors';
	import { paletteStore } from '$lib/palette.svelte';
	import SwatchRow from '$lib/components/SwatchRow.svelte';
	import ColorEditor from '$lib/components/ColorEditor.svelte';
	import ColorSuggestions from '$lib/components/ColorSuggestions.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	type PendingImport = { id: string; name: string; colors: PaletteColor[] };

	let selectedIndex = $state(0);
	let sidebarOpen = $state(true);
	let suggestionHoverColor = $state<OklchColor | null>(null);
	let pendingImport = $state<PendingImport | null>(null);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const encoded = params.get('palette');
		if (encoded) {
			try {
				const data: PendingImport = JSON.parse(atob(encoded));
				if (data?.id && data?.name && Array.isArray(data?.colors)) {
					const existing = paletteStore.palettes.find((p) => p.id === data.id);
					if (!existing) {
						paletteStore.importShared(data);
					} else if (
						existing.name === data.name &&
						JSON.stringify(existing.colors) === JSON.stringify(data.colors)
					) {
						paletteStore.setActive(data.id);
					} else {
						pendingImport = data;
					}
				}
			} catch {
				// ignore invalid links
			}
			const url = new URL(window.location.href);
			url.searchParams.delete('palette');
			history.replaceState({}, '', url);
		}
	});

	// Reset selection when active palette switches
	$effect(() => {
		paletteStore.activeId;
		selectedIndex = 0;
	});

	let colors = $derived(paletteStore.active?.colors ?? []);
	let suggestions = $derived(colors.length > 0 ? getSuggestions(colors[selectedIndex]) : []);

	function removeColor(i: number) {
		if (!paletteStore.active) return;
		const removed = colors[i].w;
		const remaining = colors.filter((_, idx) => idx !== i);
		const share = removed / remaining.length;
		const newColors = remaining.map((c) => ({ ...c, w: c.w + share }));
		paletteStore.updateActive({ colors: newColors });
		if (selectedIndex >= newColors.length) {
			selectedIndex = newColors.length - 1;
		} else if (selectedIndex === i && selectedIndex > 0) {
			selectedIndex = selectedIndex - 1;
		}
	}

	function updateColor(updated: PaletteColor) {
		if (!paletteStore.active) return;
		const newColors = colors.map((c, i) => (i === selectedIndex ? updated : c));
		paletteStore.updateActive({ colors: newColors });
	}

	function reorderColors(from: number, to: number) {
		if (!paletteStore.active) return;
		const next = [...colors];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		paletteStore.updateActive({ colors: next });
		if (selectedIndex === from) {
			selectedIndex = to;
		} else if (from < to && selectedIndex > from && selectedIndex <= to) {
			selectedIndex--;
		} else if (from > to && selectedIndex >= to && selectedIndex < from) {
			selectedIndex++;
		}
	}

	function resizeWidths(newWidths: number[]) {
		if (!paletteStore.active) return;
		const newColors = colors.map((c, i) => ({ ...c, w: newWidths[i] }));
		paletteStore.updateActive({ colors: newColors });
	}

	function replacePalette(newColors: OklchColor[]) {
		const w = 100 / newColors.length;
		const withWidths: PaletteColor[] = newColors.map((c) => ({ ...c, w }));
		paletteStore.updateActive({ colors: withWidths });
		selectedIndex = 0;
	}

	function duplicateColor(i: number) {
		if (!paletteStore.active) return;
		const newCount = colors.length + 1;
		const w = 100 / newCount;
		const dupe: PaletteColor = { ...colors[i], w };
		const newColors = colors.map((c) => ({ ...c, w }));
		newColors.splice(i + 1, 0, dupe);
		paletteStore.updateActive({ colors: newColors });
		selectedIndex = i + 1;
	}

	function addSuggestedColor(color: OklchColor) {
		if (!paletteStore.active) return;
		const newCount = colors.length + 1;
		const w = 100 / newCount;
		const newColors = colors.map((c) => ({ ...c, w }));
		newColors.push({ ...color, w });
		paletteStore.updateActive({ colors: newColors });
		selectedIndex = newColors.length - 1;
	}

	function toggleSidebar() {
		if (paletteStore.palettes.length > 0) {
			sidebarOpen = !sidebarOpen;
		}
	}

	// Force sidebar open when empty
	$effect(() => {
		if (paletteStore.palettes.length === 0) {
			sidebarOpen = true;
		}
	});
</script>

{#if pendingImport}
	<div class="modal-backdrop" onclick={() => (pendingImport = null)} role="presentation">
		<div class="modal" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => e.stopPropagation()}>
			<p class="modal-title">Palette already exists</p>
			<p class="modal-body">
				"{pendingImport.name}" is in your collection but has different colors. What would you like
				to do?
			</p>
			<div class="modal-actions">
				<button
					class="modal-btn"
					onclick={() => {
						paletteStore.updateShared(pendingImport!.id, pendingImport!);
						pendingImport = null;
					}}
				>
					Update existing
				</button>
				<button
					class="modal-btn"
					onclick={() => {
						paletteStore.importSharedAsNew(pendingImport!);
						pendingImport = null;
					}}
				>
					Import as new copy
				</button>
				<button class="modal-btn cancel" onclick={() => (pendingImport = null)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

<div class="app-layout">
	<Sidebar open={sidebarOpen} onToggle={toggleSidebar} />

	<main>
		{#if paletteStore.active}
			<div class="swatch-section">
				<SwatchRow
					{colors}
					{selectedIndex}
					{suggestions}
					onSelect={(i) => (selectedIndex = i)}
					onRemove={removeColor}
					onDuplicate={duplicateColor}
					onReorder={reorderColors}
					onResizeWidths={resizeWidths}
					onAddColor={addSuggestedColor}
					onSuggestionHover={(c) => (suggestionHoverColor = c)}
				/>
			</div>
			<div class="editor-section">
				<ColorEditor color={colors[selectedIndex]} onUpdate={updateColor} />
				<ColorSuggestions
					baseColor={colors[selectedIndex]}
					currentColors={colors}
					externalPreview={suggestionHoverColor ? [suggestionHoverColor] : null}
					onReplacePalette={replacePalette}
				/>
			</div>
		{:else}
			<div class="empty-state">
				<p>Create a palette to get started.</p>
			</div>
		{/if}
	</main>
</div>

<style>
	:global(body) {
		background: #111;
		color: white;
		font-family: system-ui, sans-serif;
		margin: 0;
		padding: 0;
		height: 100vh;
		overflow: hidden;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app-layout {
		display: flex;
		height: 100vh;
		overflow: hidden;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		min-width: 0;
	}

	.swatch-section {
		width: 100%;
	}

	.editor-section {
		max-width: 720px;
		width: 100%;
		margin: 0 auto;
		padding: 40px 32px;
	}

	.empty-state {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.2);
		font-size: 14px;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background: #1e1e1e;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 12px;
		padding: 24px;
		width: 340px;
		display: flex;
		flex-direction: column;
		gap: 12px;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
	}

	.modal-title {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
	}

	.modal-body {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
		margin: 0;
	}

	.modal-actions {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 4px;
	}

	.modal-btn {
		width: 100%;
		padding: 9px 14px;
		border-radius: 6px;
		font-size: 13px;
		font-family: inherit;
		cursor: pointer;
		text-align: left;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.75);
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.modal-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.modal-btn.cancel {
		color: rgba(255, 255, 255, 0.3);
		background: transparent;
		border-color: transparent;
	}

	.modal-btn.cancel:hover {
		color: rgba(255, 255, 255, 0.5);
		background: transparent;
		border-color: transparent;
	}
</style>
