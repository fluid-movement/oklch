<script lang="ts">
	import type { Palette } from '$lib/palette.svelte';
	import type { RoleKey } from '$lib/colors';

	interface Props {
		palette: Palette;
		onRoleChange: (role: RoleKey, colorIndex: number | undefined) => void;
	}

	let { palette, onRoleChange }: Props = $props();

	let openRole = $state<RoleKey | null>(null);

	const ROLE_GROUPS: { label: string; roles: { key: RoleKey; label: string; isFg: boolean }[] }[] = [
		{
			label: 'Page',
			roles: [
				{ key: 'background', label: 'Background', isFg: false },
				{ key: 'foreground', label: 'Foreground', isFg: true },
			]
		},
		{
			label: 'Card',
			roles: [
				{ key: 'card', label: 'Card', isFg: false },
				{ key: 'card-foreground', label: 'Card FG', isFg: true },
			]
		},
		{
			label: 'Primary',
			roles: [
				{ key: 'primary', label: 'Primary', isFg: false },
				{ key: 'primary-foreground', label: 'Primary FG', isFg: true },
			]
		},
		{
			label: 'Muted',
			roles: [
				{ key: 'muted', label: 'Muted', isFg: false },
				{ key: 'muted-foreground', label: 'Muted FG', isFg: true },
			]
		},
		{
			label: 'Accent',
			roles: [
				{ key: 'accent', label: 'Accent', isFg: false },
				{ key: 'accent-foreground', label: 'Accent FG', isFg: true },
			]
		},
		{
			label: 'Border',
			roles: [
				{ key: 'border', label: 'Border', isFg: false },
			]
		},
	];

	function assignedColor(role: RoleKey) {
		const idx = palette.roles[role];
		if (idx === undefined) return undefined;
		return palette.colors[idx];
	}

	function cssColor(role: RoleKey): string | undefined {
		const c = assignedColor(role);
		if (!c) return undefined;
		return `oklch(${c.l} ${c.c} ${c.h})`;
	}

	// Close dropdown on outside click
	$effect(() => {
		if (!openRole) return;
		function handleOutside(e: MouseEvent) {
			const target = e.target as Element;
			if (!target.closest('.chip-wrapper')) {
				openRole = null;
			}
		}
		document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	});
</script>

<div class="role-assignment">
	<div class="groups">
		{#each ROLE_GROUPS as group (group.label)}
			<div class="group">
				{#each group.roles as role (role.key)}
					<div class="chip-wrapper">
						<button
							class="chip"
							class:is-fg={role.isFg}
							class:has-color={assignedColor(role.key)}
							onclick={() => openRole = openRole === role.key ? null : role.key}
						>
							<span
								class="swatch"
								style="background: {cssColor(role.key) ?? 'transparent'}; {!assignedColor(role.key) ? 'border: 1px dashed rgba(255,255,255,0.2)' : ''}"
							></span>
							<span class="label">{role.label}</span>
						</button>
						{#if openRole === role.key}
							<div class="dropdown">
								<button
									class="option unassign"
									onclick={() => { onRoleChange(role.key, undefined); openRole = null; }}
								>— unassign</button>
								{#each palette.colors as color, i (i)}
									<button
										class="option"
										onclick={() => { onRoleChange(role.key, i); openRole = null; }}
									>
										<span class="opt-swatch" style="background: oklch({color.l} {color.c} {color.h})"></span>
										<span class="opt-name">{color.name}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.role-assignment {
		display: block;
	}

	.groups {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.group {
		display: flex;
		gap: 3px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 8px;
		padding: 4px;
	}

	.chip-wrapper {
		position: relative;
	}

	.chip {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 8px;
		border-radius: 5px;
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		font-family: system-ui, sans-serif;
		font-size: 10px;
		letter-spacing: 0.04em;
		color: rgba(255, 255, 255, 0.4);
		transition: background 0.1s, color 0.1s;
		white-space: nowrap;
	}

	.chip:hover {
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.7);
	}

	.chip.has-color {
		color: rgba(255, 255, 255, 0.65);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.chip.is-fg {
		opacity: 0.75;
	}

	.chip.is-fg.has-color {
		opacity: 1;
	}

	.swatch {
		width: 10px;
		height: 10px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		background: #1c1c1c;
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 8px;
		padding: 4px;
		min-width: 130px;
		z-index: 100;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
	}

	.option {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		font-family: system-ui, sans-serif;
		color: rgba(255, 255, 255, 0.75);
		background: transparent;
		border: none;
		width: 100%;
		text-align: left;
	}

	.option:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.unassign {
		color: rgba(255, 255, 255, 0.3);
		font-size: 11px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0;
		margin-bottom: 2px;
		padding-bottom: 8px;
	}

	.opt-swatch {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.opt-name {
		font-size: 12px;
	}

</style>
