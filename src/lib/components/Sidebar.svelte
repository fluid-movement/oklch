<script lang="ts">
	import { paletteStore } from '$lib/palette.svelte';
	import type { Palette } from '$lib/palette.svelte';
	import { oklchToHex } from '$lib/colors';
	import { Plus, Copy, Trash2, Link } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onToggle: () => void;
	}

	let { open, onToggle }: Props = $props();

	let editingId = $state<string | null>(null);
	let editingName = $state('');
	let editInputEl = $state<HTMLInputElement | null>(null);
	let copiedId = $state<string | null>(null);

	let isEmpty = $derived(paletteStore.palettes.length === 0);

	function startEdit(palette: Palette, e: MouseEvent) {
		e.stopPropagation();
		editingId = palette.id;
		editingName = palette.name;
		setTimeout(() => editInputEl?.select(), 0);
	}

	function commitEdit() {
		if (editingId && editingName.trim()) {
			paletteStore.update(editingId, { name: editingName.trim() });
		}
		editingId = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') commitEdit();
		if (e.key === 'Escape') editingId = null;
	}

	async function sharePalette(palette: Palette, e: MouseEvent) {
		e.stopPropagation();
		const encoded = btoa(JSON.stringify({ id: palette.id, name: palette.name, colors: palette.colors }));
		const url = `${window.location.origin}${window.location.pathname}?palette=${encoded}`;
		await navigator.clipboard.writeText(url);
		copiedId = palette.id;
		setTimeout(() => (copiedId = null), 1500);
	}
</script>

<aside class="sidebar" class:collapsed={!open}>
	{#if open}
		<div class="sidebar-header">
			<span class="sidebar-title">Palettes</span>
		</div>
	{/if}

	{#if open}
		<div class="sidebar-content">
			<button
				class="new-palette-btn"
				class:pulsing={isEmpty}
				onclick={() => paletteStore.create()}
				aria-label="New palette"
			>
				<Plus size={14} />
				<span>New Palette</span>
			</button>

			<div class="palette-list">
				{#each paletteStore.palettes as palette (palette.id)}
					<div
						class="palette-row"
						class:active={palette.id === paletteStore.activeId}
						onclick={() => paletteStore.setActive(palette.id)}
						role="button"
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter') paletteStore.setActive(palette.id);
						}}
						aria-label="Select palette {palette.name}"
					>
						<div class="color-strip">
							{#each palette.colors as color}
								<div
									class="strip-swatch"
									style="background: {oklchToHex(color.l, color.c, color.h)}; flex: {color.w}"
								></div>
							{/each}
						</div>
						<div class="palette-info">
							{#if editingId === palette.id}
								<input
									bind:this={editInputEl}
									class="name-input"
									type="text"
									bind:value={editingName}
									onblur={commitEdit}
									onkeydown={handleKeydown}
									onclick={(e) => e.stopPropagation()}
									aria-label="Palette name"
								/>
							{:else}
								<span
									class="palette-name"
									role="button"
									tabindex="-1"
									ondblclick={(e) => startEdit(palette, e)}
									onkeydown={(e) => {
										if (e.key === 'F2') startEdit(palette, e as unknown as MouseEvent);
									}}
									title="Double-click to rename"
								>
									{palette.name}
								</span>
							{/if}
						</div>
						<div class="row-actions">
							<button
								class="action-btn"
								onclick={(e) => {
									e.stopPropagation();
									paletteStore.duplicate(palette.id);
								}}
								aria-label="Duplicate palette"
								title="Duplicate"
							>
								<Copy size={13} />
							</button>
							<button
								class="action-btn"
								class:link-copied={copiedId === palette.id}
								onclick={(e) => sharePalette(palette, e)}
								aria-label="Copy share link"
								title={copiedId === palette.id ? 'Link copied!' : 'Share link'}
							>
								<Link size={13} />
							</button>
							<button
								class="action-btn danger"
								onclick={(e) => {
									e.stopPropagation();
									paletteStore.remove(palette.id);
								}}
								aria-label="Delete palette"
								title="Delete"
							>
								<Trash2 size={13} />
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</aside>

<style>
	.sidebar {
		width: 240px;
		flex-shrink: 0;
		background: #161616;
		border-right: 1px solid rgba(255, 255, 255, 0.07);
		display: flex;
		flex-direction: column;
		height: 100%;
		transition: width 0.2s ease;
		overflow: hidden;
	}

	.sidebar.collapsed {
		width: 0;
		border-right: none;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		padding: 14px 12px 14px 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
		min-height: 48px;
	}

	.sidebar-title {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.35);
	}

	.sidebar-content {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
		padding: 12px 10px;
		gap: 10px;
	}

	.new-palette-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		width: 100%;
		padding: 8px 10px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 6px;
		color: rgba(255, 255, 255, 0.55);
		font-size: 12px;
		font-family: inherit;
		cursor: pointer;
		transition: color 0.15s, background 0.15s, border-color 0.15s;
		flex-shrink: 0;
	}

	.new-palette-btn:hover {
		color: rgba(255, 255, 255, 0.85);
		background: rgba(255, 255, 255, 0.09);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.new-palette-btn.pulsing {
		color: white;
		border-color: rgba(255, 255, 255, 0.4);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.15);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
		}
	}

	.palette-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
		overflow-y: auto;
		flex: 1;
	}

	.palette-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 8px;
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid transparent;
		transition: background 0.1s, border-color 0.1s;
		min-height: 40px;
	}

	.palette-row:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.palette-row.active {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.color-strip {
		display: flex;
		width: 40px;
		height: 22px;
		border-radius: 3px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.strip-swatch {
		height: 100%;
	}

	.palette-info {
		flex: 1;
		min-width: 0;
	}

	.palette-name {
		display: block;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.65);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: default;
	}

	.palette-row.active .palette-name {
		color: rgba(255, 255, 255, 0.9);
	}

	.name-input {
		width: 100%;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 3px;
		color: white;
		font-size: 12px;
		font-family: inherit;
		padding: 2px 5px;
		outline: none;
	}

	.row-actions {
		display: flex;
		gap: 2px;
		flex-shrink: 0;
		opacity: 0;
		transition: opacity 0.15s;
	}

	.palette-row:hover .row-actions,
	.palette-row.active .row-actions {
		opacity: 1;
	}

	.action-btn {
		background: none;
		border: none;
		color: rgba(255, 255, 255, 0.35);
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s, background 0.15s;
	}

	.action-btn:hover {
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.08);
	}

	.action-btn.danger:hover {
		color: rgba(220, 80, 80, 0.9);
		background: rgba(220, 80, 80, 0.1);
	}

	.action-btn.link-copied {
		color: rgba(100, 210, 120, 0.9);
	}
</style>
