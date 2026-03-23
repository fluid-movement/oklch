<script lang="ts">
  import type { Palette } from '$lib/palette.svelte';
  import type { RoleKey } from '$lib/colors';
  import RoleAssignment from '$lib/components/RoleAssignment.svelte';
  import PreviewSaas from '$lib/components/PreviewSaas.svelte';
  import PreviewBlog from '$lib/components/PreviewBlog.svelte';
  import PreviewDashboard from '$lib/components/PreviewDashboard.svelte';

  type ScreenType = 'saas' | 'blog' | 'dashboard';

  interface Props {
    palette: Palette;
    onRoleChange: (role: RoleKey, colorIndex: number | undefined) => void;
    screenType: ScreenType;
    fontFamily: string;
  }

  let { palette, onRoleChange, screenType, fontFamily }: Props = $props();

  function resolveColor(role: RoleKey): string | undefined {
    const idx = palette.roles[role];
    if (idx === undefined) return undefined;
    const color = palette.colors[idx];
    if (!color) return undefined;
    return `oklch(${color.l} ${color.c} ${color.h})`;
  }

  const roleColors = $derived({
    background: resolveColor('background'),
    foreground: resolveColor('foreground'),
    card: resolveColor('card'),
    'card-foreground': resolveColor('card-foreground'),
    primary: resolveColor('primary'),
    'primary-foreground': resolveColor('primary-foreground'),
    muted: resolveColor('muted'),
    'muted-foreground': resolveColor('muted-foreground'),
    accent: resolveColor('accent'),
    'accent-foreground': resolveColor('accent-foreground'),
    border: resolveColor('border'),
  });
</script>

<div class="preview-panel">
  <!-- Preview — fills available space -->
  <div class="preview-area">
    {#if screenType === 'saas'}
      <PreviewSaas colors={roleColors} {fontFamily} />
    {:else if screenType === 'blog'}
      <PreviewBlog colors={roleColors} {fontFamily} />
    {:else}
      <PreviewDashboard colors={roleColors} {fontFamily} />
    {/if}
  </div>

  <!-- Role chips -->
  <div class="role-section">
    <RoleAssignment {palette} {onRoleChange} />
  </div>
</div>

<style>
  .preview-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .preview-area {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    min-height: 0;
  }

  .role-section {
    flex-shrink: 0;
    padding: 12px 20px 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
</style>
