<script lang="ts">
	interface Props {
		label: string;
		value: number;
		min: number;
		max: number;
		step: number;
		gradient: string;
		boundary?: number;
		p3Boundary?: number;
		onChange: (v: number) => void;
		onDragStart?: () => void;
	}

	let { label, value, min, max, step, gradient, boundary, p3Boundary, onChange, onDragStart }: Props = $props();
</script>

<div class="slider-row">
	<div class="labels">
		<span class="label">{label}</span>
		<span class="value">{value}</span>
	</div>
	<div class="track-wrap">
		<input
			type="range"
			{min}
			{max}
			{step}
			{value}
			style="--track-gradient: {gradient}"
			onpointerdown={() => onDragStart?.()}
			oninput={(e) => onChange(parseFloat((e.target as HTMLInputElement).value))}
		/>
		{#if boundary !== undefined}
			<div class="boundary-mark" style="left: {boundary * 100}%">
				<span class="boundary-label">sRGB</span>
			</div>
		{/if}
		{#if p3Boundary !== undefined}
			<div class="boundary-mark p3-mark" style="left: {p3Boundary * 100}%">
				<span class="boundary-label p3-label">P3</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.slider-row {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.labels {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
	}

	.value {
		font-family: monospace;
		font-size: 13px;
		color: rgba(255, 255, 255, 0.85);
	}

	.track-wrap {
		position: relative;
	}

	.boundary-mark {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: rgba(255, 255, 255, 0.45);
		pointer-events: none;
		transform: translateX(-50%);
	}

	.boundary-label {
		position: absolute;
		top: -17px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
		white-space: nowrap;
	}

	.p3-mark {
		background: rgba(130, 180, 255, 0.5);
	}

	.p3-label {
		color: rgba(130, 180, 255, 0.7);
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 32px;
		background: transparent;
		cursor: pointer;
		outline: none;
	}

	/* Track — WebKit */
	input[type='range']::-webkit-slider-runnable-track {
		height: 32px;
		border-radius: 8px;
		background: var(--track-gradient);
	}

	/* Track — Firefox */
	input[type='range']::-moz-range-track {
		height: 32px;
		border-radius: 8px;
		background: var(--track-gradient);
	}

	/* Thumb — WebKit */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		margin-top: 6px;
		background: rgba(255, 255, 255, 0.25);
		border: 2px solid white;
		border-radius: 2px;
		transform: rotate(45deg);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
	}

	/* Thumb — Firefox */
	input[type='range']::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.25);
		border: 2px solid white;
		border-radius: 2px;
		transform: rotate(45deg);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
		cursor: pointer;
	}
</style>
