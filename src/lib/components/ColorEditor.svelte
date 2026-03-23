<script lang="ts">
	import type { PaletteColor } from '$lib/palette.svelte';
	import {
		oklchToHex,
		hexToOklch,
		lightnessGradient,
		chromaGradient,
		hueGradient,
		getGamut,
		srgbMaxChroma,
		p3MaxChroma
	} from '$lib/colors';
	import SliderRow from './SliderRow.svelte';
	import ColorWheel from './ColorWheel.svelte';

	interface Props {
		color: PaletteColor;
		onUpdate: (color: PaletteColor) => void;
		onDragStart?: () => void;
	}

	let { color, onUpdate, onDragStart }: Props = $props();

	let containerWidth = $state(0);
	let copied = $state<string | null>(null);

	let hex = $derived(oklchToHex(color.l, color.c, color.h));
	let oklchStr = $derived(
		`oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h})`
	);
	let gradL = $derived(lightnessGradient(color.c, color.h));
	let gradC = $derived(chromaGradient(color.l, color.h));
	let gradH = $derived(hueGradient(color.l, color.c));
	let gamut = $derived(getGamut(color.l, color.c, color.h));
	let srgbBoundary = $derived(srgbMaxChroma(color.l, color.h) / 0.37);
	let p3Boundary = $derived(p3MaxChroma(color.l, color.h) / 0.37);

	// Writable derived: syncs to `hex` when color changes externally,
	// but can be temporarily overridden while the user types.
	let hexInput = $derived(hex);
	let oklchInput = $derived(oklchStr);

	function update(partial: Partial<PaletteColor>) {
		onUpdate({ ...color, ...partial });
	}

	async function copyText(text: string, key: string) {
		await navigator.clipboard.writeText(text);
		copied = key;
		setTimeout(() => {
			copied = null;
		}, 1500);
	}

	function onHexInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		hexInput = val;
		const parsed = hexToOklch(val);
		if (parsed) {
			onUpdate({ ...parsed, w: color.w, name: color.name });
		}
	}

	function onOklchInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		oklchInput = val;
		const match = val.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
		if (match) {
			onUpdate({ l: parseFloat(match[1]), c: parseFloat(match[2]), h: parseFloat(match[3]), w: color.w, name: color.name });
		}
	}
</script>

<div class="editor" bind:clientWidth={containerWidth}>
	<div class="sliders">
		<SliderRow
			label="L"
			value={color.l}
			min={0}
			max={1}
			step={0.001}
			gradient={gradL}
			{onDragStart}
			onChange={(v) => update({ l: v })}
		/>
		<SliderRow
			label="C"
			value={color.c}
			min={0}
			max={0.37}
			step={0.001}
			gradient={gradC}
			boundary={srgbBoundary}
			p3Boundary={p3Boundary}
			{onDragStart}
			onChange={(v) => update({ c: v })}
		/>
		<SliderRow
			label="H"
			value={color.h}
			min={0}
			max={360}
			step={1}
			gradient={gradH}
			{onDragStart}
			onChange={(v) => update({ h: v })}
		/>
	</div>

	<div class="value-rows">
		<div class="value-row">
			<span class="row-label">oklch</span>
			<input
				class="value-input"
				type="text"
				value={oklchInput}
				oninput={onOklchInput}
				aria-label="oklch color value"
				spellcheck="false"
			/>
			<span class="gamut-badge gamut-{gamut}" title={gamut === 'srgb' ? 'In sRGB gamut' : gamut === 'p3' ? 'In P3 gamut (wider than sRGB)' : 'Outside P3 gamut'}>
				{gamut === 'srgb' ? 'sRGB' : gamut === 'p3' ? 'P3' : 'Wide'}
			</span>
			<button
				class="copy-btn"
				onclick={() => copyText(oklchStr, 'oklch')}
				aria-label="Copy oklch value"
			>
				{copied === 'oklch' ? 'Copied!' : 'Copy'}
			</button>
		</div>

		<div class="value-row">
			<span class="row-label">hex</span>
			<input
				class="hex-input"
				type="text"
				value={hexInput}
				oninput={onHexInput}
				aria-label="Hex color value"
				spellcheck="false"
			/>
			<button
				class="copy-btn"
				onclick={() => copyText(hex, 'hex')}
				aria-label="Copy hex value"
			>
				{copied === 'hex' ? 'Copied!' : 'Copy'}
			</button>
		</div>
	</div>

	{#if containerWidth > 0}
		<div class="wheel-wrap">
			<ColorWheel
				currentColors={[color]}
				fixedL={color.l}
				size={containerWidth}
			/>
		</div>
	{/if}
</div>

<style>
	.editor {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.wheel-wrap {
		border-radius: 10px;
		overflow: hidden;
		line-height: 0;
	}

	.sliders {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.value-rows {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.value-row {
		display: flex;
		align-items: center;
		gap: 10px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		padding: 8px 12px;
	}

	.row-label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.35);
		width: 36px;
		flex-shrink: 0;
	}

	.value-input {
		flex: 1;
		font-family: monospace;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
		background: transparent;
		border: none;
		outline: none;
		padding: 0;
		width: 0;
	}

	.hex-input {
		flex: 1;
		font-family: monospace;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
		background: transparent;
		border: none;
		outline: none;
		padding: 0;
		width: 0;
	}

	.gamut-badge {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		border-radius: 3px;
		padding: 2px 6px;
		flex-shrink: 0;
	}

	.gamut-srgb {
		color: rgba(255, 255, 255, 0.25);
		background: rgba(255, 255, 255, 0.06);
	}

	.gamut-p3 {
		color: rgba(130, 180, 255, 0.8);
		background: rgba(100, 160, 255, 0.12);
	}

	.gamut-wide {
		color: rgba(255, 190, 80, 0.85);
		background: rgba(255, 160, 40, 0.12);
	}

	.copy-btn {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.45);
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.12);
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

	.copy-btn:hover {
		color: white;
		border-color: rgba(255, 255, 255, 0.3);
		background: rgba(255, 255, 255, 0.06);
	}
</style>
