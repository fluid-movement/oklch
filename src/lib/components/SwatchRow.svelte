<script lang="ts">
	import type { PaletteColor } from '$lib/palette.svelte';
	import type { OklchColor, Suggestion } from '$lib/colors';
	import { oklchToHex } from '$lib/colors';
	import { X, Copy, Move, Plus } from 'lucide-svelte';

	interface Props {
		colors: PaletteColor[];
		selectedIndex: number;
		suggestions: Suggestion[];
		onSelect: (i: number) => void;
		onRemove: (i: number) => void;
		onDuplicate: (i: number) => void;
		onReorder: (from: number, to: number) => void;
		onResizeWidths: (widths: number[]) => void;
		onAddColor: (color: OklchColor) => void;
		onSuggestionHover: (color: OklchColor | null) => void;
	}

	let {
		colors,
		selectedIndex,
		suggestions,
		onSelect,
		onRemove,
		onDuplicate,
		onReorder,
		onResizeWidths,
		onAddColor,
		onSuggestionHover
	}: Props = $props();

	let draggedIdx = $state(-1);
	let popoverOpen = $state(false);
	let rowEl: HTMLDivElement;
	let addBtnEl = $state<HTMLButtonElement | null>(null);
	let popoverEl = $state<HTMLDivElement | null>(null);

	function handleDragEnter(i: number) {
		if (draggedIdx === -1 || draggedIdx === i) return;
		onReorder(draggedIdx, i);
		draggedIdx = i;
	}

	function startResize(e: MouseEvent, handleIdx: number) {
		e.preventDefault();
		e.stopPropagation();
		const startX = e.clientX;
		const totalPx = rowEl.getBoundingClientRect().width;
		const startA = colors[handleIdx].w;
		const startB = colors[handleIdx + 1].w;

		function onMove(ev: MouseEvent) {
			const delta = ((ev.clientX - startX) / totalPx) * 100;
			const minWidth = 10;
			const newA = Math.max(minWidth, Math.min(startA + startB - minWidth, startA + delta));
			const newB = startA + startB - newA;
			const next = colors.map((c) => c.w);
			next[handleIdx] = newA;
			next[handleIdx + 1] = newB;
			onResizeWidths(next);
		}

		function onUp() {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	}

	function togglePopover() {
		popoverOpen = !popoverOpen;
	}

	// Close popover on outside click
	$effect(() => {
		if (!popoverOpen) return;
		function handleOutside(e: MouseEvent) {
			const target = e.target as Node;
			if (!popoverEl?.contains(target) && !addBtnEl?.contains(target)) {
				popoverOpen = false;
				onSuggestionHover(null);
			}
		}
		window.addEventListener('mousedown', handleOutside);
		return () => window.removeEventListener('mousedown', handleOutside);
	});
</script>

<div class="swatch-row">
	<div class="swatch-area" bind:this={rowEl}>
		{#each colors as color, i (i)}
			{@const hex = oklchToHex(color.l, color.c, color.h)}
			<div
				class="swatch-wrapper"
				class:dragging={draggedIdx === i}
				style="width: {color.w}%"
				role="group"
				aria-label="Color {i + 1}"
				draggable={true}
				ondragstart={() => { draggedIdx = i; }}
				ondragenter={() => handleDragEnter(i)}
				ondragover={(e) => { e.preventDefault(); }}
				ondrop={(e) => { e.preventDefault(); }}
				ondragend={() => { draggedIdx = -1; }}
			>
				<button
					class="swatch"
					class:selected={i === selectedIndex}
					style="background: {hex}"
					onclick={() => onSelect(i)}
					aria-label="Select color {i + 1}: {hex}"
				></button>

				<div class="move-hint" aria-hidden="true">
					<Move size={18} />
				</div>

				<div class="swatch-actions">
					<button
						class="swatch-btn"
						onclick={(e) => { e.stopPropagation(); onDuplicate(i); }}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDuplicate(i); } }}
						aria-label="Duplicate color {i + 1}"
						title="Duplicate"
					>
						<Copy size={12} />
					</button>
					{#if colors.length > 1}
						<button
							class="swatch-btn danger"
							onclick={(e) => { e.stopPropagation(); onRemove(i); }}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRemove(i); } }}
							aria-label="Remove color {i + 1}"
							title="Remove"
						>
							<X size={12} />
						</button>
					{/if}
				</div>
			</div>
		{/each}

		{#each colors.slice(0, -1) as _, i (i)}
			{@const leftPct = colors.slice(0, i + 1).reduce((sum, c) => sum + c.w, 0)}
			<button
				class="resize-handle"
				style="left: {leftPct}%"
				draggable={false}
				onmousedown={(e) => startResize(e, i)}
				aria-label="Resize between color {i + 1} and {i + 2}"
			></button>
		{/each}
	</div>

	<!-- Add button + popover -->
	<div class="add-area">
		<button
			bind:this={addBtnEl}
			class="add-btn"
			class:active={popoverOpen}
			onclick={togglePopover}
			aria-label="Add color"
			aria-expanded={popoverOpen}
		>
			<Plus size={20} />
		</button>

		{#if popoverOpen}
			<div class="popover" bind:this={popoverEl} role="dialog" aria-label="Add a color">
				<div class="popover-grid">
					{#each suggestions as s (s.label)}
						{@const hex = oklchToHex(s.color.l, s.color.c, s.color.h)}
						<button
							class="chip"
							style="background: {hex}"
							onmouseenter={() => onSuggestionHover(s.color)}
							onmouseleave={() => onSuggestionHover(null)}
							onclick={() => { onAddColor(s.color); popoverOpen = false; onSuggestionHover(null); }}
							aria-label="Add {s.label}"
							title={s.label}
						>
							<span class="chip-plus" aria-hidden="true">+</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.swatch-row {
		display: flex;
		align-items: stretch;
		position: relative;
	}

	.swatch-area {
		position: relative;
		flex: 1;
		display: flex;
		height: 200px;
	}

	.swatch-wrapper {
		position: relative;
		flex-shrink: 0;
		flex-grow: 0;
		height: 100%;
	}

	.swatch {
		width: 100%;
		height: 100%;
		border-radius: 0;
		border: none;
		cursor: grab;
		padding: 0;
		display: block;
		transition: box-shadow 0.1s;
	}

	.swatch-wrapper.dragging .swatch {
		cursor: grabbing;
		opacity: 0.6;
	}

	.swatch.selected {
		box-shadow: inset 0 -5px 0 white;
	}

	.move-hint {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: rgba(255, 255, 255, 0.6);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.15s;
		filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
	}

	.swatch-wrapper:hover .move-hint {
		opacity: 1;
	}

	.swatch-actions {
		position: absolute;
		top: 7px;
		right: 7px;
		display: flex;
		gap: 4px;
		opacity: 0;
		transition: opacity 0.15s;
		z-index: 10;
	}

	.swatch-wrapper:hover .swatch-actions {
		opacity: 1;
	}

	.swatch-btn {
		width: 22px;
		height: 22px;
		border-radius: 5px;
		background: rgba(0, 0, 0, 0.6);
		color: rgba(255, 255, 255, 0.75);
		border: 1px solid rgba(255, 255, 255, 0.2);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition:
			background 0.12s,
			color 0.12s,
			border-color 0.12s;
		backdrop-filter: blur(4px);
	}

	.swatch-btn:hover {
		background: rgba(0, 0, 0, 0.8);
		color: white;
		border-color: rgba(255, 255, 255, 0.4);
	}

	.swatch-btn.danger:hover {
		background: rgba(200, 40, 40, 0.85);
		border-color: rgba(255, 80, 80, 0.4);
		color: white;
	}

	.resize-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 10px;
		transform: translateX(-50%);
		cursor: col-resize;
		z-index: 20;
		background: transparent;
		border: none;
		padding: 0;
	}

	.resize-handle::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 10%;
		bottom: 10%;
		width: 2px;
		transform: translateX(-50%);
		background: transparent;
		border-radius: 1px;
		transition: background 0.15s;
	}

	.swatch-area:hover .resize-handle::after {
		background: rgba(255, 255, 255, 0.2);
	}

	.swatch-area:hover .resize-handle:hover::after {
		background: rgba(255, 255, 255, 0.7);
	}

	/* Add area + popover */
	.add-area {
		position: relative;
		flex-shrink: 0;
	}

	.add-btn {
		width: 56px;
		height: 200px;
		border-radius: 0;
		border: none;
		border-right: 2px dashed rgba(255, 255, 255, 0.15);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.35);
		cursor: pointer;
		transition:
			color 0.15s,
			background 0.15s,
			border-color 0.15s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.add-btn:hover,
	.add-btn.active {
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.popover {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		background: #1e1e1e;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		padding: 10px;
		z-index: 100;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
	}

	.popover-grid {
		display: grid;
		grid-template-columns: repeat(4, 36px);
		gap: 6px;
	}

	.chip {
		width: 36px;
		height: 36px;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		cursor: pointer;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition:
			transform 0.1s,
			border-color 0.1s;
	}

	.chip:hover {
		transform: scale(1.12);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.chip-plus {
		font-size: 18px;
		font-weight: 300;
		color: white;
		opacity: 0;
		transition: opacity 0.12s;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
		line-height: 1;
	}

	.chip:hover .chip-plus {
		opacity: 1;
	}
</style>
