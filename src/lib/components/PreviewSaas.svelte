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
  class="saas"
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
      <span class="brand">Brand</span>
    </div>
    <div class="nav-center">
      <span class="nav-link">Product</span>
      <span class="nav-link">Docs</span>
      <span class="nav-link">Pricing</span>
    </div>
    <div class="nav-right">
      <button class="nav-cta">Get started</button>
    </div>
  </nav>

  <!-- Hero -->
  <section class="hero">
    <span class="badge">Now in beta</span>
    <h1>Design with confidence</h1>
    <p class="subtext">Build beautiful interfaces using perceptually uniform color systems that look great everywhere.</p>
    <div class="btn-group">
      <button class="btn-primary">Get started</button>
      <button class="btn-secondary">Learn more</button>
    </div>
  </section>

  <!-- Feature cards -->
  <section class="features">
    <div class="card">
      <div class="card-icon"></div>
      <div class="card-title">Perceptual uniformity</div>
      <div class="card-text">Colors that feel consistent to the human eye across brightness levels.</div>
    </div>
    <div class="card">
      <div class="card-icon"></div>
      <div class="card-title">Harmony tools</div>
      <div class="card-text">Complementary, analogous, and split-complementary palettes built in.</div>
    </div>
    <div class="card">
      <div class="card-icon"></div>
      <div class="card-title">Share & export</div>
      <div class="card-text">Copy oklch() values, hex codes, or share a link instantly.</div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testimonials">
    <div class="testimonial">
      <p class="quote">"Switched our whole design system in an afternoon. The previews made it obvious which palette worked."</p>
      <div class="testimonial-meta">
        <span class="t-avatar"></span>
        <span class="t-name">Jamie L.</span>
        <span class="t-role">Lead Designer, Vercel</span>
      </div>
    </div>
    <div class="testimonial">
      <p class="quote">"Finally a tool that thinks in perceptual color. My dark mode actually looks intentional now."</p>
      <div class="testimonial-meta">
        <span class="t-avatar"></span>
        <span class="t-name">Chris M.</span>
        <span class="t-role">Frontend Eng, Linear</span>
      </div>
    </div>
    <div class="testimonial">
      <p class="quote">"The harmony suggestions saved me hours of tweaking. Complementary palette in one click."</p>
      <div class="testimonial-meta">
        <span class="t-avatar"></span>
        <span class="t-name">Priya S.</span>
        <span class="t-role">Product, Figma</span>
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="pricing">
    <div class="pricing-label">Pricing</div>
    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="plan-name">Free</div>
        <div class="plan-price">$0<span class="plan-per">/mo</span></div>
        <div class="plan-features">
          <div class="plan-feature">3 palettes</div>
          <div class="plan-feature">All color formats</div>
          <div class="plan-feature muted">No sharing</div>
        </div>
        <button class="plan-btn outlined">Get started</button>
      </div>
      <div class="pricing-card featured">
        <div class="plan-badge">Popular</div>
        <div class="plan-name">Pro</div>
        <div class="plan-price">$9<span class="plan-per">/mo</span></div>
        <div class="plan-features">
          <div class="plan-feature">Unlimited palettes</div>
          <div class="plan-feature">Shareable links</div>
          <div class="plan-feature">Export to Tailwind</div>
        </div>
        <button class="plan-btn primary">Start free trial</button>
      </div>
      <div class="pricing-card">
        <div class="plan-name">Team</div>
        <div class="plan-price">$29<span class="plan-per">/mo</span></div>
        <div class="plan-features">
          <div class="plan-feature">Everything in Pro</div>
          <div class="plan-feature">Team workspace</div>
          <div class="plan-feature">Priority support</div>
        </div>
        <button class="plan-btn outlined">Contact us</button>
      </div>
    </div>
  </section>

  <!-- Button showcase -->
  <section class="showcase">
    <div class="showcase-label">Components</div>
    <div class="btn-row">
      <button class="btn-primary">Primary</button>
      <button class="btn-outlined">Secondary</button>
      <button class="btn-ghost">Accent</button>
      <button class="btn-disabled" disabled>Disabled</button>
    </div>
    <div class="input-row">
      <input class="text-input" type="text" placeholder="Input field…" readonly />
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <span class="footer-copy">© 2026 Palette</span>
    <div class="footer-links">
      <span class="footer-link">Twitter</span>
      <span class="footer-link">GitHub</span>
    </div>
  </footer>
</div>

<style>
  .saas {
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

  /* Hero */
  .hero {
    background: var(--bg);
    padding: 56px 32px 48px;
    text-align: center;
  }

  .badge {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent-fg);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 16px;
  }

  .hero h1 {
    color: var(--fg);
    font-size: 34px;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 12px;
  }

  .subtext {
    color: var(--muted-fg);
    font-size: 14px;
    line-height: 1.6;
    max-width: 380px;
    margin: 0 auto 24px;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn-primary {
    background: var(--primary);
    color: var(--primary-fg);
    border-radius: 7px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-secondary {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 9px 20px;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
  }

  /* Features */
  .features {
    background: var(--muted);
    padding: 36px 32px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .card {
    background: var(--card);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--border);
  }

  .card-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    margin-bottom: 12px;
  }

  .card-title {
    color: var(--card-fg);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .card-text {
    color: var(--muted-fg);
    font-size: 12px;
    line-height: 1.5;
  }

  /* Testimonials */
  .testimonials {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    padding: 28px 32px;
    background: var(--bg);
    border-top: 1px solid var(--border);
  }

  .testimonial {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .quote {
    color: var(--card-fg);
    font-size: 12px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.85;
  }

  .testimonial-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .t-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--primary) 25%, transparent);
    border: 1px solid var(--border);
    flex-shrink: 0;
  }

  .t-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--card-fg);
  }

  .t-role {
    font-size: 10px;
    color: var(--muted-fg);
    margin-left: auto;
  }

  /* Pricing */
  .pricing {
    padding: 28px 32px;
    background: var(--muted);
    border-top: 1px solid var(--border);
  }

  .pricing-label {
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--muted-fg);
    opacity: 0.6;
    margin-bottom: 16px;
  }

  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .pricing-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
  }

  .pricing-card.featured {
    border-color: var(--primary);
    box-shadow: 0 0 0 1px var(--primary);
  }

  .plan-badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: var(--primary-fg);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 10px;
    white-space: nowrap;
  }

  .plan-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--muted-fg);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .plan-price {
    font-size: 28px;
    font-weight: 800;
    color: var(--card-fg);
    line-height: 1;
  }

  .plan-per {
    font-size: 13px;
    font-weight: 400;
    color: var(--muted-fg);
  }

  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .plan-feature {
    font-size: 11px;
    color: var(--card-fg);
    padding-left: 12px;
    position: relative;
  }

  .plan-feature::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 10px;
  }

  .plan-feature.muted {
    color: var(--muted-fg);
    opacity: 0.5;
  }

  .plan-feature.muted::before {
    content: '–';
    color: var(--muted-fg);
  }

  .plan-btn {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    text-align: center;
  }

  .plan-btn.primary {
    background: var(--primary);
    color: var(--primary-fg);
    border: none;
  }

  .plan-btn.outlined {
    background: transparent;
    color: var(--card-fg);
    border: 1px solid var(--border);
  }

  /* Showcase */
  .showcase {
    background: var(--bg);
    padding: 24px 32px;
    border-top: 1px solid var(--border);
  }

  .showcase-label {
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--muted-fg);
    opacity: 0.6;
    margin-bottom: 12px;
  }

  .btn-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .btn-outlined {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 14px;
    font-size: 12px;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-ghost {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent-fg);
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-disabled {
    background: color-mix(in srgb, var(--muted-fg) 10%, transparent);
    color: var(--muted-fg);
    border: none;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 12px;
    cursor: not-allowed;
    font-family: inherit;
    opacity: 0.5;
  }

  .input-row {
    margin-top: 10px;
  }

  .text-input {
    background: var(--muted);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 10px;
    font-size: 12px;
    font-family: inherit;
    color: var(--muted-fg);
    width: 200px;
    outline: none;
    cursor: default;
  }

  .text-input::placeholder {
    color: var(--muted-fg);
    opacity: 0.5;
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
