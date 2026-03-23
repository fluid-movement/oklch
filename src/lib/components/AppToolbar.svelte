<script lang="ts">
  import type { OklchColor } from '$lib/colors';
  import { PALETTE_SCHEMES, oklchToHex } from '$lib/colors';
  import { PanelLeftClose, PanelLeftOpen, Undo2, Redo2, ChevronDown } from 'lucide-svelte';

  type ScreenType = 'saas' | 'blog' | 'dashboard';
  type FontKey = 'business' | 'modern' | 'playful' | 'mono';

  interface Props {
    sidebarOpen: boolean;
    canToggleSidebar: boolean;
    onToggleSidebar: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    selectedColor: OklchColor | null;
    onReplace: (colors: OklchColor[]) => void;
    screenType: ScreenType;
    fontKey: FontKey;
    onScreenChange: (s: ScreenType) => void;
    onFontChange: (f: FontKey) => void;
    onCopyCss: () => void;
    cssCopied: boolean;
  }

  let {
    sidebarOpen,
    canToggleSidebar,
    onToggleSidebar,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    selectedColor,
    onReplace,
    screenType,
    fontKey,
    onScreenChange,
    onFontChange,
    onCopyCss,
    cssCopied,
  }: Props = $props();

  const SCREENS: { key: ScreenType; label: string }[] = [
    { key: 'saas', label: 'SaaS' },
    { key: 'blog', label: 'Blog' },
    { key: 'dashboard', label: 'Dash' },
  ];

  const FONTS: { key: FontKey; label: string }[] = [
    { key: 'business', label: 'Biz' },
    { key: 'modern', label: 'Modern' },
    { key: 'playful', label: 'Playful' },
    { key: 'mono', label: 'Mono' },
  ];

  let replaceOpen = $state(false);
  let replaceBtnEl = $state<HTMLButtonElement | null>(null);
  let replacePopoverEl = $state<HTMLDivElement | null>(null);

  const schemePreviews = $derived(
    selectedColor
      ? PALETTE_SCHEMES.map((s) => ({
          label: s.label,
          colors: s.fn(selectedColor),
        }))
      : []
  );

  $effect(() => {
    if (!replaceOpen) return;
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (!replacePopoverEl?.contains(target) && !replaceBtnEl?.contains(target)) {
        replaceOpen = false;
      }
    }
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  });
</script>

<div class="toolbar">
  <!-- Left: app controls -->
  <div class="toolbar-left">
    <button
      class="tool-btn"
      class:active={sidebarOpen}
      onclick={onToggleSidebar}
      disabled={!canToggleSidebar}
      aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {#if sidebarOpen}
        <PanelLeftClose size={15} />
      {:else}
        <PanelLeftOpen size={15} />
      {/if}
    </button>

    <div class="divider"></div>

    <button
      class="tool-btn"
      onclick={onUndo}
      disabled={!canUndo}
      aria-label="Undo"
      title="Undo (⌘Z)"
    >
      <Undo2 size={15} />
    </button>
    <button
      class="tool-btn"
      onclick={onRedo}
      disabled={!canRedo}
      aria-label="Redo"
      title="Redo (⌘⇧Z)"
    >
      <Redo2 size={15} />
    </button>

    <div class="divider"></div>

    <div class="replace-wrap">
      <button
        bind:this={replaceBtnEl}
        class="replace-btn"
        class:active={replaceOpen}
        onclick={() => (replaceOpen = !replaceOpen)}
        disabled={!selectedColor}
        aria-label="Replace palette"
        aria-expanded={replaceOpen}
      >
        Replace <ChevronDown size={12} />
      </button>

      {#if replaceOpen}
        <div class="replace-popover" bind:this={replacePopoverEl} role="dialog" aria-label="Replace palette">
          {#each schemePreviews as scheme (scheme.label)}
            <button
              class="scheme-row"
              onclick={() => {
                onReplace(scheme.colors);
                replaceOpen = false;
              }}
              aria-label="Replace with {scheme.label}"
            >
              <span class="scheme-label">{scheme.label}</span>
              <span class="scheme-swatches">
                {#each scheme.colors as c}
                  <span
                    class="scheme-swatch"
                    style="background: {oklchToHex(c.l, c.c, c.h)}"
                  ></span>
                {/each}
              </span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Right: preview controls -->
  <div class="toolbar-right">
    <div class="labeled-seg">
      <span class="seg-label">Screen</span>
      <div class="seg-group">
        {#each SCREENS as s (s.key)}
          <button
            class="seg-btn"
            class:active={screenType === s.key}
            onclick={() => onScreenChange(s.key)}
          >{s.label}</button>
        {/each}
      </div>
    </div>

    <div class="labeled-seg">
      <span class="seg-label">Font</span>
      <div class="seg-group">
        {#each FONTS as f (f.key)}
          <button
            class="seg-btn"
            class:active={fontKey === f.key}
            onclick={() => onFontChange(f.key)}
          >{f.label}</button>
        {/each}
      </div>
    </div>

    <button class="copy-css-btn" onclick={onCopyCss}>
      {cssCopied ? 'Copied!' : 'Copy CSS'}
    </button>
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 40px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: #141414;
    gap: 12px;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .divider {
    width: 1px;
    height: 18px;
    background: rgba(255, 255, 255, 0.08);
    margin: 0 4px;
    flex-shrink: 0;
  }

  .tool-btn {
    width: 30px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
  }

  .tool-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.85);
  }

  .tool-btn.active {
    color: rgba(255, 255, 255, 0.75);
  }

  .tool-btn:disabled {
    opacity: 0.25;
    cursor: default;
  }

  /* Replace button */
  .replace-wrap {
    position: relative;
  }

  .replace-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 11px;
    font-family: system-ui, sans-serif;
    cursor: pointer;
    transition: background 0.1s, color 0.1s, border-color 0.1s;
    white-space: nowrap;
    height: 28px;
  }

  .replace-btn:hover:not(:disabled),
  .replace-btn.active {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.85);
    border-color: rgba(255, 255, 255, 0.18);
  }

  .replace-btn:disabled {
    opacity: 0.25;
    cursor: default;
  }

  .replace-popover {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    background: #1e1e1e;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    padding: 6px;
    z-index: 200;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    min-width: 200px;
  }

  .scheme-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding: 7px 10px;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.1s;
  }

  .scheme-row:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  .scheme-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-family: system-ui, sans-serif;
    white-space: nowrap;
  }

  .scheme-swatches {
    display: flex;
    gap: 2px;
  }

  .scheme-swatch {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }

  /* Segmented controls */
  .labeled-seg {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .seg-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.25);
    white-space: nowrap;
  }

  .seg-group {
    display: flex;
    gap: 2px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 6px;
    padding: 2px;
  }

  .seg-btn {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: background 0.1s, color 0.1s;
    white-space: nowrap;
  }

  .seg-btn:hover {
    color: rgba(255, 255, 255, 0.7);
  }

  .seg-btn.active {
    background: rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
  }

  /* Copy CSS */
  .copy-css-btn {
    font-family: system-ui, sans-serif;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.45);
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    padding: 4px 10px;
    cursor: pointer;
    white-space: nowrap;
    height: 28px;
    transition: color 0.15s, border-color 0.15s;
  }

  .copy-css-btn:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.2);
  }
</style>
