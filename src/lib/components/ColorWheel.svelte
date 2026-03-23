<script lang="ts">
	import type { OklchColor } from '$lib/colors';
	import { oklchToHex } from '$lib/colors';
	import { formatHex } from 'culori';

	interface Props {
		currentColors: OklchColor[];
		previewColors?: OklchColor[] | null;
		dimCurrentColors?: boolean;
		fixedL: number;
		size?: number;
	}

	let { currentColors, previewColors = null, dimCurrentColors = false, fixedL, size = 180 }: Props = $props();

	const CENTER = $derived(size / 2);
	// Chroma 0 → r≈4.4% of size (near center), chroma 0.37 → r≈46% of size (near outer edge)
	const DOT_R_MIN = $derived(size * 0.044);
	const DOT_R_MAX = $derived(size * 0.461);

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	function dotPos(h: number, c: number) {
		const r = DOT_R_MIN + (Math.min(c, 0.37) / 0.37) * (DOT_R_MAX - DOT_R_MIN);
		const angle = ((h - 90) * Math.PI) / 180;
		return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
	}

	$effect(() => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const l = fixedL;
		const imageData = ctx.createImageData(size, size);
		const { data } = imageData;

		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const dx = x - CENTER;
				const dy = y - CENTER;
				const dist = Math.hypot(dx, dy);
				if (dist > CENTER) continue; // outside circle → transparent

				const h = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
				const c = (dist / DOT_R_MAX) * 0.37;
				const hex = formatHex({ mode: 'oklch', l, c, h });
				if (!hex) continue;

				const idx = (y * size + x) * 4;
				data[idx] = parseInt(hex.slice(1, 3), 16);
				data[idx + 1] = parseInt(hex.slice(3, 5), 16);
				data[idx + 2] = parseInt(hex.slice(5, 7), 16);
				data[idx + 3] = 255;
			}
		}

		ctx.putImageData(imageData, 0, 0);

		// Clip to circle
		ctx.globalCompositeOperation = 'destination-in';
		ctx.beginPath();
		ctx.arc(CENTER, CENTER, CENTER, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
	});
</script>

<div class="wheel-wrap" style="width: {size}px; height: {size}px;">
	<canvas bind:this={canvasEl} width={size} height={size} class="wheel-canvas"></canvas>
	<svg
		class="wheel-svg"
		viewBox="0 0 {size} {size}"
		width={size}
		height={size}
		aria-label="Color wheel"
		role="img"
	>
		<!-- Preview dots (ghost, shown on hover) -->
		{#if previewColors}
			{#each previewColors as color, i (i)}
				{@const pos = dotPos(color.h, color.c)}
				{@const hex = oklchToHex(color.l, color.c, color.h)}
				<circle
					class="dot dot-preview"
					cx={pos.x}
					cy={pos.y}
					r="7"
					fill={hex}
					stroke="rgba(255,255,255,0.9)"
					stroke-width="1.5"
					stroke-dasharray="3 2"
				/>
			{/each}
		{/if}
		<!-- Current palette dots (solid, or dimmed when a replace scheme is hovered) -->
		{#each currentColors as color, i (i)}
			{@const pos = dotPos(color.h, color.c)}
			{@const hex = oklchToHex(color.l, color.c, color.h)}
			<circle
				class="dot dot-current"
				class:dot-dim={dimCurrentColors}
				cx={pos.x}
				cy={pos.y}
				r="7"
				fill={hex}
				stroke="rgba(255,255,255,0.9)"
				stroke-width="1.5"
				stroke-dasharray={dimCurrentColors ? '3 2' : undefined}
			/>
		{/each}
	</svg>
</div>

<style>
	.wheel-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.wheel-canvas {
		display: block;
		border-radius: 50%;
	}

	.wheel-svg {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
	}

	.dot {
		transition:
			opacity 0.2s ease,
			stroke-dasharray 0.2s ease;
	}

	.dot-preview {
		opacity: 0.65;
	}

	.dot-dim {
		opacity: 0.2;
	}
</style>
