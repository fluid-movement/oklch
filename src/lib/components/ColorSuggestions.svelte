<script lang="ts">
	import type { OklchColor } from '$lib/colors';
	import { oklchToHex, PALETTE_SCHEMES } from '$lib/colors';
	import ColorWheel from './ColorWheel.svelte';

	interface Props {
		baseColor: OklchColor;
		currentColors: OklchColor[];
		externalPreview: OklchColor[] | null;
		onReplacePalette: (colors: OklchColor[]) => void;
	}

	let { baseColor, currentColors, externalPreview, onReplacePalette }: Props = $props();

	let schemes = $derived(PALETTE_SCHEMES.map((s) => ({ label: s.label, colors: s.fn(baseColor) })));
	let hoveredScheme = $state<OklchColor[] | null>(null);
	let previewColors = $derived(hoveredScheme ?? externalPreview);
</script>

<div class="suggestions">
	<div class="content">
		<ColorWheel {currentColors} {previewColors} dimCurrentColors={hoveredScheme !== null} fixedL={baseColor.l} />

		<div class="scheme-panel">
			<div class="panel-header">
				<span class="panel-title">Replace Palette</span>
				<span class="panel-subtitle">replaces current palette</span>
			</div>
			<div class="scheme-list">
				{#each schemes as scheme (scheme.label)}
					<div
						class="scheme-row"
						role="button"
						tabindex="0"
						onmouseenter={() => (hoveredScheme = scheme.colors)}
						onmouseleave={() => (hoveredScheme = null)}
						onclick={() => onReplacePalette(scheme.colors)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onReplacePalette(scheme.colors);
							}
						}}
						aria-label="Apply {scheme.label} palette"
					>
						<div class="mini-palette">
							{#each scheme.colors as color, i (i)}
								<div
									class="mini-swatch"
									style="background: {oklchToHex(color.l, color.c, color.h)}; flex: 1"
								></div>
							{/each}
						</div>
						<span class="scheme-name">{scheme.label}</span>
						<button
							class="apply-btn"
							onclick={(e) => {
								e.stopPropagation();
								onReplacePalette(scheme.colors);
							}}
							tabindex="-1"
							aria-label="Apply {scheme.label}"
						>
							Apply
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.suggestions {
		padding-top: 32px;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		margin-top: 8px;
	}

	.content {
		display: flex;
		gap: 24px;
		align-items: flex-start;
	}

	/* Scheme panel */
	.scheme-panel {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.panel-header {
		display: flex;
		align-items: baseline;
		gap: 10px;
	}

	.panel-title {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.35);
	}

	.panel-subtitle {
		font-size: 10px;
		color: rgba(255, 255, 255, 0.2);
		letter-spacing: 0.02em;
	}

	.scheme-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.scheme-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid transparent;
		border-radius: 6px;
		padding: 7px 8px 7px 10px;
		cursor: pointer;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.scheme-row:hover {
		background: rgba(255, 255, 255, 0.07);
		border-color: rgba(255, 255, 255, 0.13);
	}

	.mini-palette {
		display: flex;
		width: 52px;
		height: 22px;
		overflow: hidden;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.mini-swatch {
		height: 100%;
	}

	.scheme-name {
		flex: 1;
		font-size: 12px;
		color: rgba(255, 255, 255, 0.55);
		letter-spacing: 0.02em;
	}

	.scheme-row:hover .scheme-name {
		color: rgba(255, 255, 255, 0.8);
	}

	.apply-btn {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.35);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		padding: 3px 8px;
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s,
			background 0.15s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.scheme-row:hover .apply-btn {
		color: rgba(255, 255, 255, 0.75);
		border-color: rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.06);
	}
</style>
