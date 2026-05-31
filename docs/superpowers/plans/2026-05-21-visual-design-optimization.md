# 视觉/设计优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立响应式间距体系、精简主页结构、统一 Flex 布局、简化 Hero 舞台区

**Architecture:** 先统一 CSS 间距规范，再修改 HTML 结构，最后替换 grid 为 flex-wrap。改动集中在 styles.css 和 index.html，app.js 仅调整 Activity 渲染条数。

**Tech Stack:** Vanilla HTML/CSS/JS，无构建步骤，纯静态文件

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `public/styles.css` | 全局间距、Flex 布局、舞台区样式 | Modify |
| `public/index.html` | 移除 section、重构 Hero 舞台区 | Modify |
| `public/app.js:379-388` | Activity 渲染限制条数 | Modify |

---

### Task 1: CSS 全局间距规范 — 桌面端默认值

**Files:**
- Modify: `public/styles.css` (新增间距规则)

- [ ] **Step 1: 在 .section 规则后添加间距基础规则**

在 `public/styles.css` 中，找到 `.section` 规则（约第962行），在其后添加间距基础规则：

```css
/* ── Global Spacing System (Desktop) ── */
.section { padding: 48px 0; }
.section + .section { margin-top: 32px; }
.glass-card { padding: 28px; }
.ops-card { padding: 28px; }
.stack-card { padding: 28px; }
.hero { gap: 20px; }
.about-grid { gap: 20px; }
.work-list { gap: 16px; }
.notes-grid { gap: 20px; }
.lead { line-height: 1.7; }
.section-summary { line-height: 1.7; }
.stack-card p { line-height: 1.7; }
```

- [ ] **Step 2: 启动开发服务器验证**

Run: `npm run dev`
Expected: 服务启动在 http://localhost:4173

- [ ] **Step 3: 浏览器验证桌面端间距**

打开 http://localhost:4173，检查：
- section 之间有明显间隔（32px）
- 卡片内部更宽松（28px padding）
- 文字行间距更大（1.7）

- [ ] **Step 4: Commit**

```bash
git add public/styles.css
git commit -m "feat(spacing): add desktop spacing baseline rules"
```

---

### Task 2: CSS 全局间距规范 — 移动端覆盖

**Files:**
- Modify: `public/styles.css` (在媒体查询中添加移动端间距)

- [ ] **Step 1: 在 @media (max-width: 760px) 规则块内添加间距覆盖**

找到 `@media (max-width: 760px)` 规则块（约第2346行），在 `.site-frame` 规则后添加：

```css
@media (max-width: 760px) {
  /* 移动端间距覆盖 */
  .section { padding: 24px 0; }
  .section + .section { margin-top: 16px; }
  .glass-card { padding: 20px; }
  .ops-card { padding: 20px; }
  .stack-card { padding: 20px; }
  .hero { gap: 12px; }
  .about-grid { gap: 12px; }
  .work-list { gap: 12px; }
  .notes-grid { gap: 12px; }
  .lead { line-height: 1.6; }
  .section-summary { line-height: 1.6; }
  .stack-card p { line-height: 1.6; }

  /* 原有规则保持不变 */
  .site-frame { ... }
  ...
}
```

- [ ] **Step 2: 浏览器验证移动端间距**

在浏览器开发者工具中切换到移动端视图（宽度 <760px），检查：
- section padding 更紧凑（24px）
- 卡片 padding 更小（20px）
- gap 更小（12px）

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(spacing): add mobile spacing override in 760px breakpoint"
```

---

### Task 3: 移除主页 Ticker Section

**Files:**
- Modify: `public/index.html:218-231` (删除 ticker-section)

- [ ] **Step 1: 删除 ticker-section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="ticker-section reveal">`（约第218行），删除整个 section 至 `</section>`（约第231行）：

删除内容：
```html
<section class="ticker-section reveal" aria-label="Featured capabilities">
  <div class="ticker-track">
    <span>LLM Workflow</span>
    ...
  </div>
</section>
```

- [ ] **Step 2: 浏览器验证 section 已移除**

刷新页面，确认滚动关键词条已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove ticker section from homepage"
```

---

### Task 4: 移除主页 Ops Section

**Files:**
- Modify: `public/index.html:233-280` (删除 ops section)

- [ ] **Step 1: 删除 ops section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="ops section" id="now">`（约第233行），删除整个 section 至 `</section>`（约第280行）。

删除内容：
```html
<section class="ops section" id="now">
  <div class="section-head reveal">...</div>
  <div class="ops-grid">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 ops section 已移除**

刷新页面，确认"Operating Mode"区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove ops section from homepage"
```

---

### Task 5: 移除主页 Metrics Section

**Files:**
- Modify: `public/index.html:314-332` (删除 metrics section)

- [ ] **Step 1: 删除 metrics section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="metrics section">`（约第314行），删除整个 section 至 `</section>`（约第332行）。

删除内容：
```html
<section class="metrics section" aria-label="Key metrics">
  <div class="metrics-grid">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 metrics section 已移除**

刷新页面，确认 Signal/Build/Geek 三点区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove metrics section from homepage"
```

---

### Task 6: 移除主页 Stack Section

**Files:**
- Modify: `public/index.html:334-356` (删除 stack section)

- [ ] **Step 1: 删除 stack section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="stack section" id="stack">`（约第334行），删除整个 section 至 `</section>`（约第356行）。

删除内容：
```html
<section class="stack section" id="stack">
  <div class="section-head reveal">...</div>
  <div class="stack-grid">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 stack section 已移除**

刷新页面，确认 Focus Stack 区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove stack section from homepage"
```

---

### Task 7: 移除主页 Signal Routes Section

**Files:**
- Modify: `public/index.html:359-382` (删除 signal section)

- [ ] **Step 1: 删除 signal section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="signal section">`（约第359行），删除整个 section 至 `</section>`（约第382行）。

删除内容：
```html
<section class="signal section" aria-label="Signal routes">
  <div class="section-head reveal">...</div>
  <div class="signal-grid">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 signal section 已移除**

刷新页面，确认 Signal Routes 区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove signal routes section from homepage"
```

---

### Task 8: 移除主页 Visual Lab Section

**Files:**
- Modify: `public/index.html:384-407` (删除 lab section)

- [ ] **Step 1: 删除 lab section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="lab section">`（约第384行），删除整个 section 至 `</section>`（约第407行）。

删除内容：
```html
<section class="lab section" aria-label="Visual rules">
  <div class="section-head reveal">...</div>
  <div class="lab-grid">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 lab section 已移除**

刷新页面，确认 Visual Lab 区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove visual lab section from homepage"
```

---

### Task 9: 移除主页 Timeline Section

**Files:**
- Modify: `public/index.html:436-465` (删除 timeline section)

- [ ] **Step 1: 删除 timeline section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="timeline section">`（约第436行），删除整个 section 至 `</section>`（约第465行）。

删除内容：
```html
<section class="timeline section" aria-label="Build flow">
  <div class="section-head reveal">...</div>
  <div class="timeline-list">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 timeline section 已移除**

刷新页面，确认 Build Flow 区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove timeline section from homepage"
```

---

### Task 10: 移除主页 Command Section

**Files:**
- Modify: `public/index.html:474-487` (删除 command section)

- [ ] **Step 1: 删除 command section 标签及其内容**

在 `public/index.html` 中，找到 `<section class="command section">`（约第474行），删除整个 section 至 `</section>`（约第487行）。

删除内容：
```html
<section class="command section" aria-label="Next upgrade">
  <div class="command-card reveal">...</div>
</section>
```

- [ ] **Step 2: 浏览器验证 command section 已移除**

刷新页面，确认 Next Upgrade 区块已消失。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "refactor: remove command section from homepage"
```

---

### Task 11: Hero 舞台区精简 — 移除 hero-stack 和 stage-grid

**Files:**
- Modify: `public/index.html:178-215` (删除 hero-stack 和 stage-grid 元素)

- [ ] **Step 1: 删除 hero-stack 元素**

在 `public/index.html` 的 `.hero-stage` 内，找到 `<div class="hero-stack">`（约第178行），删除整个 div 至 `</div>`（约第191行）。

删除内容：
```html
<div class="hero-stack">
  <article class="stack-chip">...</article>
  <article class="stack-chip">...</article>
  <article class="stack-chip accent">...</article>
</div>
```

- [ ] **Step 2: 删除 stage-grid 元素**

在 `.hero-stage` 内，找到 `<div class="stage-grid">`（约第201行），删除整个 div 至 `</div>`（约第215行）。

删除内容：
```html
<div class="stage-grid">
  <article class="stage-mini">...</article>
  <article class="stage-mini">...</article>
  <article class="stage-mini accent">...</article>
</div>
```

- [ ] **Step 3: 浏览器验证舞台区已精简**

刷新页面，确认舞台区只剩下 signal-card、terminal-card、radar-panel 三个元素。

- [ ] **Step 4: Commit**

```bash
git add public/index.html
git commit -m "refactor(hero): remove hero-stack and stage-grid from hero stage"
```

---

### Task 12: Hero 舞台区重构 — signal-card 和 terminal-card 并排

**Files:**
- Modify: `public/index.html:157-177` (重构舞台区 HTML 结构)
- Modify: `public/styles.css` (新增 .hero-stage-row 样式)

- [ ] **Step 1: 修改 HTML 结构，将 signal-card 和 terminal-card 包裹在 hero-stage-row**

将 `.hero-stage` 内部结构改为：

```html
<div class="hero-stage reveal">
  <div class="hero-stage-row">
    <div class="signal-card">
      <p>Signal Layer</p>
      <strong>AI System Explorer</strong>
      <span>模型实验 / 工具链折腾 / 极客界面 / 持续迭代</span>
    </div>
    <div class="terminal-card">
      <div class="terminal-top">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="terminal-body">
        <p><span class="prompt">$</span> whoami</p>
        <p>Jamery Wang / AI enthusiast / builder</p>
        <p><span class="prompt">$</span> focus --current</p>
        <p>llm-workflows agent-systems rapid-prototypes</p>
        <p><span class="prompt">$</span> open github</p>
        <p class="terminal-link">github.com/jameryw</p>
      </div>
    </div>
  </div>
  <div class="radar-panel">
    <div class="radar-ring ring-1"></div>
    <div class="radar-ring ring-2"></div>
    <div class="radar-ring ring-3"></div>
    <div class="radar-core"></div>
    <div class="scan-line"></div>
    <div class="floating-tag tag-one">Prompt to product</div>
    <div class="floating-tag tag-two">Hack fast, ship signal</div>
  </div>
</div>
```

- [ ] **Step 2: 在 styles.css 中添加 .hero-stage-row 样式**

在 `.hero-stage` 规则后（约第732行）添加：

```css
.hero-stage-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.signal-card,
.terminal-card {
  flex: 1 1 200px;
}

.radar-panel {
  margin-top: 16px;
}
```

- [ ] **Step 3: 浏览器验证舞台区布局**

刷新页面，确认：
- signal-card 和 terminal-card 在桌面端并排显示
- radar-panel 在下方独占一行
- 移动端自动折叠为单栏

- [ ] **Step 4: Commit**

```bash
git add public/index.html public/styles.css
git commit -m "feat(hero): restructure stage area with flex layout for signal+terminal cards"
```

---

### Task 13: CSS Flex 布局 — Hero 区域

**Files:**
- Modify: `public/styles.css:446-453` (替换 .hero grid 为 flex)

- [ ] **Step 1: 修改 .hero 规则，替换 grid 为 flex**

找到 `.hero` 规则（约第446行），将：

```css
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 26px;
  min-height: auto;
  align-items: center;
  padding: 36px 0 14px;
}
```

改为：

```css
.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
  align-items: center;
  padding: 36px 0 14px;
}

.hero-copy {
  flex: 1 1 320px;
}

.hero-stage {
  flex: 1 1 280px;
}
```

- [ ] **Step 2: 浏览器验证 Hero flex 布局**

刷新页面，确认：
- 桌面端 hero-copy 和 hero-stage 并排
- 移动端（宽度不足）自动折叠为上下排列

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(layout): replace hero grid with flex-wrap layout"
```

---

### Task 14: CSS Flex 布局 — About-grid 区域

**Files:**
- Modify: `public/styles.css:990-994` (替换 .about-grid grid 为 flex)

- [ ] **Step 1: 修改 .about-grid 规则，替换 grid 为 flex**

找到 `.about-grid` 规则（约第990行），将：

```css
.about-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
}
```

改为：

```css
.about-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.about-grid > * {
  flex: 1 1 280px;
}
```

- [ ] **Step 2: 浏览器验证 About flex 布局**

刷新页面，确认 About 区块的玻璃卡片横向流动排列。

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(layout): replace about-grid with flex-wrap layout"
```

---

### Task 15: CSS Flex 布局 — Notes-grid 区域

**Files:**
- Modify: `public/styles.css:1300-1302` (替换 .notes-grid grid 为 flex)

- [ ] **Step 1: 修改 .notes-grid 规则，替换 grid 为 flex**

找到 `.notes-grid` 规则（约第1300行），将：

```css
.notes-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

改为：

```css
.notes-grid {
  display: flex;
  flex-wrap: wrap;
}

.note-card {
  flex: 1 1 280px;
}
```

注意：`.notes-grid` 在 `.project-page-grid, .notes-grid, ...` 组合规则中定义，需要单独拆出。

找到组合规则（约第1215行）：

```css
.project-page-grid,
.notes-grid,
.about-page-grid,
.page-status-grid,
.build-track-grid {
  display: grid;
  gap: 18px;
}
```

拆分为：

```css
.project-page-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.notes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.about-page-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.page-status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.build-track-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
```

并在各区域后添加子元素 flex 规则：

```css
.project-page-grid > * {
  flex: 1 1 280px;
}

.note-card {
  flex: 1 1 280px;
}

.about-page-grid > * {
  flex: 1 1 280px;
}

.page-status-grid > * {
  flex: 1 1 280px;
}

.track-card {
  flex: 1 1 280px;
}
```

- [ ] **Step 2: 浏览器验证 Notes flex 布局**

刷新主页和 notes.html，确认笔记卡片横向流动排列。

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(layout): replace notes-grid and other grids with flex-wrap"
```

---

### Task 16: CSS Flex 布局 — 移除响应式 grid-template-columns 规则

**Files:**
- Modify: `public/styles.css:2322-2344` (移除媒体查询中的 grid 折叠规则)

- [ ] **Step 1: 移除 @media (max-width: 980px) 中的 grid-template-columns 规则**

找到 `@media (max-width: 980px)` 规则块（约第2322行），删除其中的 grid-template-columns 相关规则：

删除内容：
```css
@media (max-width: 980px) {
  .hero,
  .about-grid,
  .about-page-grid,
  .metrics-grid,
  .stack-grid,
  .lab-grid,
  .signal-grid,
  .ops-grid,
  .project-page-grid,
  .page-status-grid,
  .build-track-grid,
  .detail-pager,
  .notes-grid,
  .command-card,
  .contact-card {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: auto;
  }
}
```

改为只保留必要的规则：

```css
@media (max-width: 980px) {
  .hero {
    min-height: auto;
  }
}
```

- [ ] **Step 2: 浏览器验证响应式 flex 折叠**

在浏览器开发者工具中切换到平板宽度（760-980px），确认所有区域自动折叠为单栏。

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "refactor: remove grid-template-columns rules from responsive breakpoints"
```

---

### Task 17: CSS Flex 布局 — Work-list 区域

**Files:**
- Modify: `public/styles.css:1319-1322` (确认 work-list flex 配置)

- [ ] **Step 1: 确认 work-list 已使用 flex**

检查 `.work-list` 规则，确认已有：

```css
.work-list {
  display: grid;
  gap: 16px;
}
```

改为：

```css
.work-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.work-card {
  flex: 1 1 100%;
}
```

- [ ] **Step 2: 浏览器验证 Work flex 布局**

刷新主页，确认项目列表卡片正常显示（保持单栏布局）。

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(layout): convert work-list to flex-wrap layout"
```

---

### Task 18: CSS Flex 布局 — Activity Feed 区域

**Files:**
- Modify: `public/styles.css:2225-2228` (修改 activity-feed 为 flex)

- [ ] **Step 1: 确认 activity-feed 已使用 flex**

检查 `.activity-feed` 规则（约第2225行），确认已有：

```css
.activity-feed {
  display: grid;
  gap: 10px;
}
```

改为：

```css
.activity-feed {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.activity-item {
  flex: 1 1 100%;
}
```

- [ ] **Step 2: 浏览器验证 Activity flex 布局**

刷新主页，确认活动条目正常显示（保持单栏布局）。

- [ ] **Step 3: Commit**

```bash
git add public/styles.css
git commit -m "feat(layout): convert activity-feed to flex-wrap layout"
```

---

### Task 19: App.js — Activity 渲染限制条数

**Files:**
- Modify: `public/app.js:379-388` (限制 activity 条数为 4)

- [ ] **Step 1: 修改 activity 渲染逻辑，限制为最近 4 条**

找到 activity 渲染代码（约第379-388行），将：

```javascript
const activityFeedNode = document.querySelector("[data-activity-feed]");
if (activityFeedNode && siteData.activity) {
  activityFeedNode.innerHTML = siteData.activity.map((item) => `
    <div class="activity-item reveal">
      <span class="activity-dot ${item.signal}"></span>
      <span class="activity-text">${item.text}</span>
      <span class="activity-time">${item.time}</span>
    </div>
  `).join("");
}
```

改为（数据来自站内 data.js，无外部输入风险）：

```javascript
const activityFeedNode = document.querySelector("[data-activity-feed]");
if (activityFeedNode && siteData.activity) {
  // Data from site-controlled data.js, safe for innerHTML
  activityFeedNode.innerHTML = siteData.activity.slice(0, 4).map((item) => `
    <div class="activity-item reveal">
      <span class="activity-dot ${item.signal}"></span>
      <span class="activity-text">${item.text}</span>
      <span class="activity-time">${item.time}</span>
    </div>
  `).join("");
}
```

- [ ] **Step 2: 浏览器验证 Activity 条数**

刷新主页，确认活动区域只显示最近 4 条记录。

- [ ] **Step 3: Commit**

```bash
git add public/app.js
git commit -m "refactor: limit activity feed to 4 recent items"
```

---

### Task 20: CSS 清理 — 移除废弃的 grid 相关样式

**Files:**
- Modify: `public/styles.css` (移除 hero-stack, stage-grid, ops-grid 等废弃样式)

- [ ] **Step 1: 移除 .hero-stack 相关样式**

找到并删除以下规则（约第811-837行）：

```css
.hero-stack {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stack-chip {
  padding: 18px 14px;
  border-radius: 20px;
}

.stack-chip span {
  display: block;
  margin-bottom: 10px;
  color: var(--cyan);
  font-size: 0.8rem;
  letter-spacing: 0.18em;
}

.stack-chip strong {
  font-size: 1.05rem;
}

.stack-chip.accent {
  background: linear-gradient(180deg, rgba(255, 79, 216, 0.16), rgba(255, 255, 255, 0.02));
}
```

- [ ] **Step 2: 移除 .stage-grid 相关样式**

找到并删除以下规则（约第919-933行）：

```css
.stage-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stage-mini {
  padding: 16px 14px;
  border-radius: 18px;
}

.stage-mini.accent {
  background: linear-gradient(180deg, rgba(216, 255, 98, 0.1), rgba(255, 255, 255, 0.03));
}
```

- [ ] **Step 3: 移除 .ops-grid grid-template-columns 规则**

找到并删除以下规则：

```css
.ops-grid {
  grid-template-columns: 1.15fr 0.95fr 0.9fr;
}
```

- [ ] **Step 4: 移除 .metrics-grid grid-template-columns 规则**

找到并删除以下规则：

```css
.metrics-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

- [ ] **Step 5: 移除 .stack-grid 相关样式**

找到并删除以下规则：

```css
.stack-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
```

- [ ] **Step 6: 移除 .lab-grid grid-template-columns 规则**

找到并删除以下规则：

```css
.lab-grid {
  grid-template-columns: 1.2fr 0.8fr 0.8fr;
}
```

- [ ] **Step 7: 移除 .signal-grid grid-template-columns 规则**

找到并删除以下规则：

```css
.signal-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
```

- [ ] **Step 8: 移除 .ticker-section 相关样式**

找到并删除以下规则：

```css
.ticker-section {
  overflow: hidden;
  padding: 2px 0 18px;
}

.ticker-track {
  display: flex;
  gap: 18px;
  width: max-content;
  animation: ticker 22s linear infinite;
}

.ticker-section:hover .ticker-track {
  animation-play-state: paused;
}

.ticker-track span {
  display: inline-flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid rgba(162, 176, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text);
  white-space: nowrap;
}
```

以及 ticker 动画：

```css
@keyframes ticker {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

- [ ] **Step 9: Commit**

```bash
git add public/styles.css
git commit -m "refactor: remove deprecated grid and ticker styles"
```

---

### Task 21: About Section 扩展 — 合并内容

**Files:**
- Modify: `public/index.html:283-312` (扩展 About section 内容)

- [ ] **Step 1: 扩展 About section，添加合并内容**

将 About section 从两个玻璃卡片扩展为更多卡片，整合 Metrics/Stack/Signal Routes 内容：

```html
<section class="about section" id="about">
  <div class="section-head reveal">
    <p class="section-kicker">About</p>
    <h2>How I Work</h2>
    <p class="section-summary">高频关注，高速试验，优先动手。</p>
  </div>
  <div class="about-grid">
    <article class="glass-card statement reveal">
      <ul class="compact-list">
        <li>追模型更新和新工具链</li>
        <li>把想法快速做成可运行原型</li>
        <li>用页面和代码同时发出技术信号</li>
      </ul>
    </article>
    <article class="glass-card detail reveal">
      <div>
        <span>AI</span>
        <p>对大模型、工具调用、自动化协作保持高频探索。</p>
      </div>
      <div>
        <span>Build</span>
        <p>偏爱把想法立刻做成原型，而不是长期停在概念层。</p>
      </div>
      <div>
        <span>Geek</span>
        <p>喜欢干净的代码和带点攻击性的界面表达。</p>
      </div>
    </article>
    <article class="glass-card reveal">
      <p class="stack-label">Signal</p>
      <h3>AI Native</h3>
      <p>明确偏向模型能力、工作流编排和工具协作，而非泛技术展示。</p>
    </article>
    <article class="glass-card reveal">
      <p class="stack-label">Build</p>
      <h3>Prototype First</h3>
      <p>先做出可运行版本，再从结果里迭代判断，而非停留在概念层。</p>
    </article>
    <article class="glass-card reveal">
      <p class="stack-label">Geek</p>
      <h3>Interface Taste</h3>
      <p>页面本身也是作品的一部分，带有控制面板和实验室气味。</p>
    </article>
  </div>
</section>
```

- [ ] **Step 2: 浏览器验证 About 扩展内容**

刷新页面，确认 About 区块现在有 5 个卡片横向流动排列。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat(about): expand section with merged metrics/stack/signal content"
```

---

### Task 22: 最终验证 — 检查所有改动

**Files:**
- Verify: `public/index.html`, `public/styles.css`, `public/app.js`

- [ ] **Step 1: 运行开发服务器**

Run: `npm run dev`
Expected: 服务启动成功

- [ ] **Step 2: 桌面端验证**

在浏览器中打开 http://localhost:4173，检查：

1. **Section 数量**：主页只有 9 个 section（Hero, About, Work, Notes, Activity, Quote, Contact, Footer）
2. **间距**：section 之间有明显间隔，卡片内部宽松
3. **Flex 布局**：所有区域卡片横向流动排列
4. **Hero 舞台区**：signal-card 和 terminal-card 并排，radar-panel 在下方

- [ ] **Step 3: 移动端验证**

在浏览器开发者工具中切换到移动端视图（宽度 <760px），检查：

1. 所有区域自动折叠为单栏
2. 间距更紧凑但不拥挤
3. Hero 舞台区 signal-card 和 terminal-card 也折叠为上下排列

- [ ] **Step 4: 其他页面验证**

访问 projects.html、notes.html、about.html，确认：
- Flex 布局正常工作
- 间距规范一致

- [ ] **Step 5: 最终 Commit（如有遗漏修复）**

```bash
git add -A
git commit -m "feat(visual): complete visual design optimization"
```

---

## Summary

**总改动：**
- `public/styles.css`: 新增间距规范、Flex 布局替换、移除废弃样式
- `public/index.html`: 移除 8 个 section、重构 Hero 舞台区、扩展 About 内容
- `public/app.js`: Activity 渲染限制为 4 条

**验收标准：**
- 主页 section 从 17 减至 9
- 所有间距符合双断点规范
- 所有 grid 布局改为 flex-wrap
- Hero 舞台区为 2 行布局
- 桌面端宽松、移动端紧凑