---
name: visual-design-optimization
description: 子项目1：视觉/设计优化 - 间距节奏、section精简、Flex布局、舞台区调整
---

# 视觉/设计优化设计文档

MySite 静态个人网站的视觉与布局优化方案，涵盖间距规范、信息密度、布局系统和 Hero 舞台区调整。

## 背景

当前网站存在以下问题：
- 间距不一致，缺乏统一规范
- 主页 section 数量过多（17个），信息重复冗余
- 不等比例 grid 分栏视觉失衡
- Hero 舞台区元素堆叠过多，视觉复杂度高

## 设计目标

1. 建立响应式间距体系（桌面宽松、移动紧凑）
2. 精简主页结构至 9 个核心 section
3. 统一布局为 Flex 自适应，卡片自然流动
4. 简化 Hero 舞台区，突出核心元素

---

## 1. 全局间距节奏（双断点体系）

### 1.1 间距规范表

定义两套间距值，以 980px 为切换断点：

| 元素类型 | 桌面端 (>980px) | 移动端 (<980px) |
|----------|-----------------|-----------------|
| section padding | 48px | 24px |
| section 之间 gap | 32px | 16px |
| 卡片 padding | 28px | 20px |
| 网格/Flex gap | 20px | 12px |
| 内容行间距 | 1.7 | 1.6 |

### 1.2 CSS 实现

使用媒体查询在现有断点处切换：

```css
/* 桌面端默认值 */
.section { padding: 48px 0; }
.section + .section { margin-top: 32px; }
.glass-card, .ops-card, .stack-card { padding: 28px; }
.hero, .about-grid, .work-list, .notes-grid { gap: 20px; }
.lead, .section-summary, .stack-card p { line-height: 1.7; }

/* 移动端覆盖 */
@media (max-width: 980px) {
  .section { padding: 24px 0; }
  .section + .section { margin-top: 16px; }
  .glass-card, .ops-card, .stack-card { padding: 20px; }
  .hero, .about-grid, .work-list, .notes-grid { gap: 12px; }
  .lead, .section-summary, .stack-card p { line-height: 1.6; }
}
```

### 1.3 注意事项

- 760px 断点继承 980px 值，无需额外定义
- 移动端按钮、标签等小元素 padding 保持现有值（12-16px）
- Footer 间距单独处理，不受 section 规范约束

---

## 2. 主页 Section 精简

### 2.1 现状分析

原 17 个 section，存在多处重复：
- Ops 与 Hero hero-meta 都展示状态信息
- About 与 Signal Routes 都讲工作理念
- Command 与 Ops Immediate Upgrades 都列下一步计划
- Ticker 与 Activity 都展示关键词/动态
- Metrics、Timeline、Visual Lab 信息密度低

### 2.2 精简后结构（9 个 section）

| 序号 | Section | 内容说明 |
|------|---------|----------|
| 1 | Hero | 身份介绍 + 状态信息（整合 Ops） |
| 2 | About | 合并 Metrics + Stack + Signal Routes，完整的理念区块 |
| 3 | Work | 项目列表（保留） |
| 4 | Notes | 笔记列表（保留） |
| 5 | Activity | 最近动态（精简为 3-4 条） |
| 6 | Quote | 宣言（视觉喘息点，保留） |
| 7 | Contact | 联系方式（保留） |
| 8 | Footer | 底部信息（保留） |

### 2.3 内容迁移细节

**Hero 整合 Ops 状态：**
- 时间显示移到 header 的 topbar-meta 区域
- 状态信息合并到 Hero 的 hero-meta 区块
- 增加一个"Current Focus"小卡片展示即时目标

**About 合并内容：**
- 原 About 的"How I Work"作为主标题
- Metrics 的 Signal/Build/Geek 三点作为子区块标签
- Stack 的三层关注点作为正文内容
- Signal Routes 的三条主信号作为补充说明
- 使用 Flex 布局，卡片横向流动排列

**Activity 精简：**
- 从 data.js 的 activity 数组取最近 3-4 条
- 保持现有渲染逻辑，只调整数量

### 2.4 移除的 Section

| Section | 移除理由 |
|---------|----------|
| Ticker | 与 Activity 功能类似，滚动动画对移动端性能有影响 |
| Ops | 状态信息已整合到 Hero |
| Metrics | 内容精简后并入 About |
| Stack | 内容精简后并入 About |
| Signal Routes | 主题与 About 重叠，合并处理 |
| Visual Lab | 设计规则说明对外部用户意义不大 |
| Timeline | Discover/Build/Share 三步信息密度低 |
| Command | 下一步计划与 Ops 重复 |

### 2.5 HTML 修改要点

- 删除对应 section 标签及其内容
- 调整 Hero 内部结构（详见第4节）
- About section 扩展为多卡片 Flex 布局
- Activity 的 data-activity-feed 渲染逻辑调整为限制条数

---

## 3. Flex 自适应布局（全区域）

### 3.1 设计原则

将所有 grid 布局改为 flex-wrap：
- 容器：display: flex; flex-wrap: wrap; gap: <间距值>;
- 子元素：flex-basis 或 min-width 控制最小宽度
- 响应式：通过 min-width 自然折叠，无需媒体查询调整 grid-template-columns

### 3.2 各区域 Flex 配置

**Hero（文案区 + 舞台区）：**
```css
.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 26px; /* 桌面端保持现有值，或改为 20px */
}

.hero-copy {
  flex: 1 1 320px; /* 最小宽度保证内容不挤压 */
}

.hero-stage {
  flex: 1 1 280px;
}
```
桌面端两栏自然并排，移动端（宽度不足）自动折叠为单栏。

**About（多卡片流动）：**
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

**Work 列表：**
```css
.work-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.work-card {
  flex: 1 1 100%; /* 单栏占满，或改为多卡片并排 */
}
```

**Notes 网格：**
```css
.notes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.note-card {
  flex: 1 1 280px; /* 每行可容纳 2-3 个 */
}
```

**Activity Feed：**
```css
.activity-feed {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.activity-item {
  flex: 1 1 100%; /* 单栏占满 */
}
```

### 3.3 响应式行为

- 桌面端（宽度充足）：子元素并排排列，每行数量取决于 flex-basis 和容器宽度
- 移动端（宽度不足）：自动折叠为单栏，无需额外媒体查询

### 3.4 需要移除的 Grid 规则

删除以下 CSS 规则：
- `.hero { grid-template-columns: 1.1fr 0.9fr; }`
- `.about-grid { grid-template-columns: 1.05fr 0.95fr; }`
- `.ops-grid { grid-template-columns: ... }`
- `.metrics-grid { grid-template-columns: repeat(3, 1fr); }`
- `.notes-grid { grid-template-columns: repeat(3, 1fr); }`
- `.stack-grid { grid-template-columns: repeat(3, 1fr); }`
- `.lab-grid`, `.signal-grid`, `.build-track-grid` 等其他 grid 定义
- 响应式媒体查询中的 grid-template-columns 折叠规则

---

## 4. Hero 舞台区精简

### 4.1 当前结构

舞台区包含 5 个元素垂直堆叠：
- signal-card（信号卡片）
- terminal-card（终端卡片）
- hero-stack（3个小芯片）
- radar-panel（雷达扫描）
- stage-grid（3个小卡片）

### 4.2 精简后结构（2行布局）

**第1行：signal-card + terminal-card 并排**
```css
.hero-stage-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.signal-card, .terminal-card {
  flex: 1 1 200px;
}
```

**第2行：radar-panel 独占**
```css
.radar-panel {
  flex: 1 1 100%;
}
```

### 4.3 移除元素

- hero-stack（3个芯片） — 信息可整合到其他区域
- stage-grid（3个小卡片） — 与 hero-strip 重复，移除

### 4.4 HTML 修改

```html
<div class="hero-stage reveal">
  <div class="hero-stage-row">
    <div class="signal-card">...</div>
    <div class="terminal-card">...</div>
  </div>
  <div class="radar-panel">...</div>
</div>
```

### 4.5 CSS 修改

- 删除 `.hero-stack`, `.stage-grid` 相关样式
- 新增 `.hero-stage-row` 的 Flex 样式
- 调整 `.hero-stage` 内部 gap 为统一值

---

## 5. 其他页面影响

### 5.1 Projects / Notes / About 页面

- 间距规范同步应用（section padding, 卡片 padding, gap）
- Flex 布局同步应用（project-page-grid, notes-grid 等）
- 页面结构无需精简（已相对简洁）

### 5.2 详情页（project.html, note.html）

- 间距规范同步应用
- Flex 布局同步应用（detail-pager 等）

---

## 6. 实现优先级

1. **间距规范** — 先统一基础间距，后续布局调整在此基础上进行
2. **Section 精简** — 删除 HTML section，调整渲染逻辑
3. **Flex 布局** — 替换 CSS grid 规则
4. **舞台区调整** — 修改 Hero 内部结构

---

## 7. 验收标准

- 主页 section 数量从 17 减至 9
- 所有间距符合双断点规范表
- 所有 grid 布局改为 flex-wrap
- Hero 舞台区为 2 行布局（signal+terminal / radar）
- 桌面端视觉宽松透气，移动端紧凑但不拥挤
- 无内容丢失，移除的信息已整合到保留区域

---

## 8. 后续子项目

视觉优化完成后，依次执行：
- 子项目2：内容结构优化
- 子项目3：用户体验优化
- 子项目4：移动端适配（在 Flex 布局基础上细化）
- 子项目5：性能/加载优化
- 子项目6：SEO/规范优化