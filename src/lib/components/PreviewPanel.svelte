<script lang="ts">
  import type { Palette } from '$lib/palette.svelte';
  import type { RoleKey } from '$lib/colors';
  import PreviewSaas from '$lib/components/PreviewSaas.svelte';
  import PreviewBlog from '$lib/components/PreviewBlog.svelte';
  import PreviewDashboard from '$lib/components/PreviewDashboard.svelte';
  type ScreenType = 'saas' | 'blog' | 'dashboard';

  interface Props {
    palette: Palette;
    screenType: ScreenType;
    fontFamily: string;
  }

  let { palette, screenType, fontFamily }: Props = $props();

  function resolveColor(role: RoleKey) {
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
  {#if screenType === 'saas'}
    <PreviewSaas colors={roleColors} {fontFamily} />
  {:else if screenType === 'blog'}
    <PreviewBlog colors={roleColors} {fontFamily} />
  {:else}
    <PreviewDashboard colors={roleColors} {fontFamily} />
  {/if}
</div>

<style>
  .preview-panel {
    height: 100%;
    overflow-y: auto;
    padding: 16px 20px;
  }
</style>
