<script lang="ts">
  interface Colors {
    background?: string;
    foreground?: string;
    card?: string;
    'card-foreground'?: string;
    primary?: string;
    'primary-foreground'?: string;
    muted?: string;
    'muted-foreground'?: string;
    accent?: string;
    'accent-foreground'?: string;
    border?: string;
  }

  interface Props {
    colors: Colors;
    fontFamily: string;
  }

  let { colors, fontFamily }: Props = $props();
</script>

<div
  class="blog"
  style="
    font-family: {fontFamily};
    --bg: {colors.background ?? '#fff'};
    --fg: {colors.foreground ?? '#111'};
    --card: {colors.card ?? '#f5f5f5'};
    --card-fg: {colors['card-foreground'] ?? colors.foreground ?? '#111'};
    --primary: {colors.primary ?? '#333'};
    --primary-fg: {colors['primary-foreground'] ?? 'white'};
    --muted: {colors.muted ?? '#efefef'};
    --muted-fg: {colors['muted-foreground'] ?? '#888'};
    --accent: {colors.accent ?? '#555'};
    --accent-fg: {colors['accent-foreground'] ?? colors.foreground ?? '#111'};
    --border: {colors.border ?? 'rgba(0,0,0,0.1)'}
  "
>
  <!-- Nav -->
  <nav class="nav">
    <div class="nav-left">
      <span class="logo-block"></span>
      <span class="brand">The Weekly</span>
    </div>
    <div class="nav-center">
      <span class="nav-link">Design</span>
      <span class="nav-link">Code</span>
      <span class="nav-link">Culture</span>
    </div>
    <div class="nav-right">
      <button class="nav-cta">Subscribe</button>
    </div>
  </nav>

  <!-- Featured post -->
  <section class="featured">
    <div class="featured-card">
      <span class="category-badge">Design Systems</span>
      <h2 class="featured-title">Why OKLCH is the future of color in UI design</h2>
      <p class="featured-excerpt">Perceptual uniformity changes everything. Here's how switching to OKLCH will make your color decisions more intuitive and your designs more consistent across screens.</p>
      <div class="featured-meta">
        <span class="avatar"></span>
        <span class="author">Maya Chen</span>
        <span class="sep">·</span>
        <span class="read-time">6 min read</span>
        <button class="read-more">Read more →</button>
      </div>
    </div>
  </section>

  <!-- Post grid -->
  <section class="posts">
    <div class="post-card">
      <div class="post-date">Mar 18, 2026</div>
      <div class="post-title">Building accessible color palettes from scratch</div>
      <div class="post-excerpt">Contrast ratios, luminance, and the tools that actually work in the real world.</div>
    </div>
    <div class="post-card">
      <div class="post-date">Mar 12, 2026</div>
      <div class="post-title">Tokens, themes, and the dark mode problem</div>
      <div class="post-excerpt">Semantic color tokens are the only way to do dark mode right. Here's the pattern.</div>
    </div>
  </section>

  <!-- Tags -->
  <section class="tags-section">
    <div class="tags-label">Topics</div>
    <div class="tags">
      <span class="tag">Color Theory</span>
      <span class="tag">Accessibility</span>
      <span class="tag">Design Tokens</span>
      <span class="tag">Typography</span>
      <span class="tag">CSS</span>
      <span class="tag">Figma</span>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <span class="footer-copy">© 2026 The Weekly</span>
    <div class="footer-links">
      <span class="footer-link">RSS</span>
      <span class="footer-link">Twitter</span>
    </div>
  </footer>
</div>

<style>
  .blog {
    background: var(--bg);
    border-radius: 10px;
    overflow: hidden;
  }

  /* Nav */
  .nav {
    height: 52px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-block {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    background: var(--primary);
    display: inline-block;
    flex-shrink: 0;
  }

  .brand {
    color: var(--fg);
    font-weight: 700;
    font-size: 14px;
  }

  .nav-center {
    display: flex;
    gap: 24px;
  }

  .nav-link {
    color: var(--fg);
    opacity: 0.55;
    font-size: 13px;
  }

  .nav-cta {
    background: var(--primary);
    color: var(--primary-fg);
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }

  /* Featured */
  .featured {
    padding: 32px 32px 24px;
    background: var(--bg);
  }

  .featured-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px 32px;
  }

  .category-badge {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent-fg);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 20px;
    display: inline-block;
    margin-bottom: 14px;
  }

  .featured-title {
    color: var(--card-fg);
    font-size: 22px;
    font-weight: 800;
    line-height: 1.25;
    margin: 0 0 12px;
    max-width: 480px;
  }

  .featured-excerpt {
    color: var(--muted-fg);
    font-size: 13px;
    line-height: 1.65;
    margin: 0 0 20px;
    max-width: 520px;
  }

  .featured-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--primary) 20%, transparent);
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .author {
    color: var(--card-fg);
    font-size: 12px;
    font-weight: 500;
  }

  .sep {
    color: var(--muted-fg);
    opacity: 0.4;
    font-size: 12px;
  }

  .read-time {
    color: var(--muted-fg);
    font-size: 12px;
  }

  .read-more {
    background: var(--primary);
    color: var(--primary-fg);
    border: none;
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    margin-left: auto;
  }

  /* Post grid */
  .posts {
    padding: 0 32px 24px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .post-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px 20px;
  }

  .post-date {
    color: var(--muted-fg);
    font-size: 11px;
    margin-bottom: 7px;
  }

  .post-title {
    color: var(--card-fg);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
    margin-bottom: 7px;
  }

  .post-excerpt {
    color: var(--muted-fg);
    font-size: 12px;
    line-height: 1.5;
  }

  /* Tags */
  .tags-section {
    padding: 0 32px 24px;
  }

  .tags-label {
    color: var(--muted-fg);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 10px;
    opacity: 0.6;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    background: var(--muted);
    color: var(--muted-fg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
  }

  /* Footer */
  .footer {
    background: var(--bg);
    padding: 16px 32px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-copy {
    color: var(--muted-fg);
    font-size: 12px;
  }

  .footer-links {
    display: flex;
    gap: 14px;
    opacity: 0.5;
  }

  .footer-link {
    color: var(--muted-fg);
    font-size: 12px;
  }
</style>
