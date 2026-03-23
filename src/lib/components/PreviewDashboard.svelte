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
  class="dashboard"
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
  <!-- Top bar -->
  <div class="topbar">
    <div class="topbar-left">
      <span class="logo-block"></span>
      <span class="brand">Metrics</span>
    </div>
    <div class="topbar-right">
      <span class="topbar-label">Dashboard</span>
      <span class="avatar-circle"></span>
    </div>
  </div>

  <!-- Body: sidebar + main -->
  <div class="body">
    <!-- Sidebar -->
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <div class="nav-item active">
          <span class="nav-dot"></span>
          Overview
        </div>
        <div class="nav-item">
          <span class="nav-dot"></span>
          Analytics
        </div>
        <div class="nav-item">
          <span class="nav-dot"></span>
          Users
        </div>
        <div class="nav-item">
          <span class="nav-dot"></span>
          Settings
        </div>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="main">
      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-label">Total Users</div>
          <div class="stat-number">24,891</div>
          <div class="stat-delta positive">
            <span class="delta-badge">+12%</span>
            vs last month
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Revenue</div>
          <div class="stat-number">$48.2k</div>
          <div class="stat-delta positive">
            <span class="delta-badge">+8%</span>
            vs last month
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Conversions</div>
          <div class="stat-number">3.4%</div>
          <div class="stat-delta neutral">
            <span class="delta-badge muted">—</span>
            no change
          </div>
        </div>
      </div>

      <!-- Chart + table row -->
      <div class="mid-row">
        <!-- Bar chart -->
        <div class="chart-section">
          <div class="chart-header">
            <span class="chart-title">Revenue</span>
            <span class="chart-period">Last 7 months</span>
          </div>
          <div class="bar-chart">
            <div class="bar-col"><div class="bar" style="height:42%"></div><span class="bar-label">Sep</span></div>
            <div class="bar-col"><div class="bar" style="height:58%"></div><span class="bar-label">Oct</span></div>
            <div class="bar-col"><div class="bar" style="height:51%"></div><span class="bar-label">Nov</span></div>
            <div class="bar-col"><div class="bar" style="height:73%"></div><span class="bar-label">Dec</span></div>
            <div class="bar-col"><div class="bar" style="height:65%"></div><span class="bar-label">Jan</span></div>
            <div class="bar-col"><div class="bar" style="height:80%"></div><span class="bar-label">Feb</span></div>
            <div class="bar-col"><div class="bar bar-current" style="height:91%"></div><span class="bar-label">Mar</span></div>
          </div>
        </div>

        <!-- Top pages -->
        <div class="pages-section">
          <div class="chart-header">
            <span class="chart-title">Top pages</span>
          </div>
          <div class="pages-list">
            <div class="page-row">
              <span class="page-path">/dashboard</span>
              <div class="page-bar-wrap"><div class="page-bar" style="width:88%"></div></div>
              <span class="page-count">2,841</span>
            </div>
            <div class="page-row">
              <span class="page-path">/pricing</span>
              <div class="page-bar-wrap"><div class="page-bar" style="width:62%"></div></div>
              <span class="page-count">1,992</span>
            </div>
            <div class="page-row">
              <span class="page-path">/signup</span>
              <div class="page-bar-wrap"><div class="page-bar" style="width:48%"></div></div>
              <span class="page-count">1,543</span>
            </div>
            <div class="page-row">
              <span class="page-path">/docs</span>
              <div class="page-bar-wrap"><div class="page-bar" style="width:31%"></div></div>
              <span class="page-count">987</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-section">
        <div class="table-header">Recent activity</div>
        <div class="table">
          <div class="table-head">
            <span>User</span>
            <span>Event</span>
            <span>Status</span>
          </div>
          <div class="table-row">
            <span class="row-user">alex@example.com</span>
            <span class="row-event">Signed up</span>
            <span class="badge-primary">Active</span>
          </div>
          <div class="table-row">
            <span class="row-user">sam@example.com</span>
            <span class="row-event">Upgraded plan</span>
            <span class="badge-accent">New</span>
          </div>
          <div class="table-row">
            <span class="row-user">jordan@example.com</span>
            <span class="row-event">Exported data</span>
            <span class="badge-muted">Idle</span>
          </div>
          <div class="table-row">
            <span class="row-user">riley@example.com</span>
            <span class="row-event">Invited team</span>
            <span class="badge-primary">Active</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  .dashboard {
    background: var(--bg);
    border-radius: 10px;
    overflow: hidden;
  }

  /* Top bar */
  .topbar {
    height: 48px;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .logo-block {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: var(--primary);
    flex-shrink: 0;
  }

  .brand {
    color: var(--card-fg);
    font-weight: 700;
    font-size: 13px;
  }

  .topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .topbar-label {
    color: var(--muted-fg);
    font-size: 12px;
  }

  .avatar-circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--primary) 20%, transparent);
    border: 1px solid var(--border);
  }

  /* Body layout */
  .body {
    display: flex;
    min-height: 0;
  }

  /* Sidebar */
  .sidebar {
    width: 140px;
    flex-shrink: 0;
    background: var(--card);
    border-right: 1px solid var(--border);
    padding: 16px 8px;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 12px;
    color: var(--fg);
    opacity: 0.5;
    cursor: pointer;
  }

  .nav-item.active {
    background: var(--primary);
    color: var(--primary-fg);
    opacity: 1;
    font-weight: 500;
  }

  .nav-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.5;
    flex-shrink: 0;
  }

  .nav-item.active .nav-dot {
    opacity: 0.7;
  }

  /* Main */
  .main {
    flex: 1;
    padding: 20px 24px;
    background: var(--bg);
    min-width: 0;
  }

  /* Stats */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
  }

  .stat-label {
    color: var(--muted-fg);
    font-size: 11px;
    margin-bottom: 6px;
  }

  .stat-number {
    color: var(--card-fg);
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
    line-height: 1;
  }

  .stat-delta {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--muted-fg);
  }

  .delta-badge {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent-fg);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 5px;
    border-radius: 4px;
  }

  .delta-badge.muted {
    background: color-mix(in srgb, var(--muted-fg) 12%, transparent);
    color: var(--muted-fg);
  }

  /* Mid row: chart + pages */
  .mid-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }

  .chart-section,
  .pages-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
  }

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .chart-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--card-fg);
  }

  .chart-period {
    font-size: 10px;
    color: var(--muted-fg);
  }

  /* Bar chart */
  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 6px;
    height: 80px;
  }

  .bar-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    height: 100%;
    justify-content: flex-end;
  }

  .bar {
    width: 100%;
    background: color-mix(in srgb, var(--primary) 30%, transparent);
    border-radius: 3px 3px 0 0;
    min-height: 4px;
  }

  .bar.bar-current {
    background: var(--primary);
  }

  .bar-label {
    font-size: 9px;
    color: var(--muted-fg);
    white-space: nowrap;
  }

  /* Top pages */
  .pages-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .page-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .page-path {
    font-size: 11px;
    color: var(--card-fg);
    width: 68px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .page-bar-wrap {
    flex: 1;
    height: 5px;
    background: var(--muted);
    border-radius: 3px;
    overflow: hidden;
  }

  .page-bar {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
  }

  .page-count {
    font-size: 10px;
    color: var(--muted-fg);
    width: 32px;
    text-align: right;
    flex-shrink: 0;
  }

  /* Table */
  .table-section {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header {
    padding: 12px 16px;
    color: var(--card-fg);
    font-size: 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
  }

  .table {
    display: flex;
    flex-direction: column;
  }

  .table-head {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    padding: 8px 16px;
    background: var(--muted);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted-fg);
    gap: 8px;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    padding: 10px 16px;
    border-top: 1px solid var(--border);
    align-items: center;
    gap: 8px;
  }

  .row-user {
    color: var(--card-fg);
    font-size: 12px;
  }

  .row-event {
    color: var(--muted-fg);
    font-size: 12px;
  }

  .badge-primary {
    background: color-mix(in srgb, var(--primary) 15%, transparent);
    color: var(--primary-fg);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .badge-accent {
    background: color-mix(in srgb, var(--accent) 15%, transparent);
    color: var(--accent-fg);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 20px;
    white-space: nowrap;
  }

  .badge-muted {
    background: color-mix(in srgb, var(--muted-fg) 10%, transparent);
    color: var(--muted-fg);
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 20px;
    white-space: nowrap;
  }
</style>
