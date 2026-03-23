<script lang="ts">
  import type { Palette } from '$lib/palette.svelte';
  import type { RoleKey } from '$lib/colors';
  import RoleAssignment from '$lib/components/RoleAssignment.svelte';
  import PreviewSaas from '$lib/components/PreviewSaas.svelte';
  import PreviewBlog from '$lib/components/PreviewBlog.svelte';
  import PreviewDashboard from '$lib/components/PreviewDashboard.svelte';

  interface Props {
    palette: Palette;
    onRoleChange: (role: RoleKey, colorIndex: number | undefined) => void;
  }

  let { palette, onRoleChange }: Props = $props();

  type ScreenType = 'saas' | 'blog' | 'dashboard';
  type FontKey = 'business' | 'modern' | 'playful' | 'mono';

  let screenType = $state<ScreenType>('saas');
  let fontKey = $state<FontKey>('business');
  let cssCopied = $state(false);

  const SCREENS: { key: ScreenType; label: string }[] = [
    { key: 'saas', label: 'SaaS' },
    { key: 'blog', label: 'Blog' },
    { key: 'dashboard', label: 'Dashboard' },
  ];

  const FONTS: { key: FontKey; label: string; family: string }[] = [
    { key: 'business', label: 'Business', family: "'Inter', system-ui, sans-serif" },
    { key: 'modern', label: 'Modern', family: "'Plus Jakarta Sans', system-ui, sans-serif" },
    { key: 'playful', label: 'Playful', family: "'Nunito', system-ui, sans-serif" },
    { key: 'mono', label: 'Mono', family: "'JetBrains Mono', monospace" },
  ];

  const fontFamily = $derived(FONTS.find((f) => f.key === fontKey)!.family);

  const ROLE_ORDER: RoleKey[] = [
    'background', 'foreground',
    'card', 'card-foreground',
    'primary', 'primary-foreground',
    'muted', 'muted-foreground',
    'accent', 'accent-foreground',
    'border',
  ];

  function copyCss() {
    const lines = ROLE_ORDER
      .map((role) => {
        const idx = palette.roles[role];
        if (idx === undefined) return null;
        const c = palette.colors[idx];
        if (!c) return null;
        return `  --${role}: oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(1)});`;
      })
      .filter(Boolean);
    navigator.clipboard.writeText(`:root {\n${lines.join('\n')}\n}`);
    cssCopied = true;
    setTimeout(() => { cssCopied = false; }, 1500);
  }

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
  <!-- Role assignment -->
  <div class="role-section">
    <RoleAssignment {palette} {onRoleChange} />
  </div>

  <!-- Controls bar -->
  <div class="controls-bar">
    <div class="seg-group">
      {#each SCREENS as s (s.key)}
        <button
          class="seg-btn"
          class:active={screenType === s.key}
          onclick={() => screenType = s.key}
        >{s.label}</button>
      {/each}
    </div>
    <div class="seg-group">
      {#each FONTS as f (f.key)}
        <button
          class="seg-btn"
          class:active={fontKey === f.key}
          onclick={() => fontKey = f.key}
        >{f.label}</button>
      {/each}
    </div>
  </div>

  <!-- Preview -->
  <div class="preview-area">
    {#if screenType === 'saas'}
      <PreviewSaas colors={roleColors} {fontFamily} />
    {:else if screenType === 'blog'}
      <PreviewBlog colors={roleColors} {fontFamily} />
    {:else}
      <PreviewDashboard colors={roleColors} {fontFamily} />
    {/if}
  </div>

  <!-- Footer bar -->
  <div class="footer-bar">
    <button class="footer-btn" onclick={copyCss}>
      {cssCopied ? 'Copied!' : 'Copy CSS'}
    </button>
  </div>
</div>

<style>
  .preview-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .role-section {
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }

  /* Controls */
  .controls-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
    gap: 12px;
  }

  .seg-group {
    display: flex;
    gap: 2px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 7px;
    padding: 3px;
  }

  .seg-btn {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .seg-btn:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .seg-btn.active {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
  }

  /* Preview area */
  .preview-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
  }

  /* Footer */
  .footer-bar {
    padding: 12px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    flex-shrink: 0;
  }

  .footer-btn {
    font-family: system-ui, sans-serif;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 7px 14px;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: color 0.15s, border-color 0.15s;
  }

  .footer-btn:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
  }
</style>
