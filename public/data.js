window.siteData = {
  profile: {
    name: "Jamery Wang",
    title: "AI 时代原住民",
    base: "Hangzhou / Online",
    status: "Exploring AI-first builds",
    github: "https://github.com/jameryw",
    focus: ["LLM", "Agents", "Quant", "LangGraph", "Code-as-Policy"]
  },
  projects: [
    {
      slug: "xhs-growth-agent",
      code: "A1",
      label: "Growth Agent",
      title: "XhsGrowthAgent",
      featured: true,
      summary: "LangGraph 多 Agent 工作流，自动化小红书内容生命周期：选品→策略→文案→视觉→审核→发布→分析。",
      href: "https://github.com/JameryW/XhsGrowthAgent",
      demoUrl: "https://xhs.jameryw.dev",
      cta: "view source",
      status: "Active",
      stack: ["LangGraph", "Python", "Multi-Agent", "Vue 3", "Playwright"],
      timeframe: "2025–now",
      role: "Architect / Builder",
      detailTitle: "Multi-Agent Content Growth Engine",
      overview:
        "基于 LangGraph 的多 Agent 编排系统，把小红书内容运营从选题到发布到复盘的全流程自动化。8 个专业 Agent 分工协作，通过 Human Review Gate 保留人工审核环节，兼顾效率和质量控制。前端用 Vue 3 + Tailwind CSS 构建赛博朋克风格的审核面板。",
      highlights: [
        "8 个专业 Agent 分工：趋势侦察、内容策略、文案生成、视觉设计、人工审核、发布、数据分析、互动管理。",
        "智能模型路由：DeepSeek 做路由、Claude 做策略与文案、GPT-4o 做视觉与分析，按任务特性分配模型。",
        "Harness 驱动 + Loop 工程化：结构化工作流编排，支持断点续跑和状态持久化，Human Review Gate 保障发布质量。",
        "Vue 3 前端仪表盘 + CLI 双模式运行，支持 dry-run 验证和 Playwright 浏览器自动化。"
      ],
      outputs: ["Multi-agent workflow", "Content automation", "Analytics pipeline"],
      relatedNotes: ["why-agents-matter", "prompt-engineering-evolution"]
    },
    {
      slug: "quant-agent",
      code: "B2",
      label: "Quant Agent",
      title: "QuantAgent",
      featured: true,
      summary: "代码即策略的启发式代理框架 — 用可执行代码替代神经网络权重作为策略载体，迭代即学习，测试即记忆。",
      href: "https://github.com/JameryW/QuantAgent",
      demoUrl: "https://quant.jameryw.dev",
      cta: "view source",
      status: "Active research",
      stack: ["Python", "LLM", "Code-as-Policy", "SQLite", "Bandit"],
      timeframe: "2025–now",
      role: "Architect / Builder",
      detailTitle: "Code as Policy, Not Weights as Policy",
      overview:
        "传统强化学习用神经网络权重表达策略，本框架用可执行代码。策略是可读的、可验证的、可调试的。每次有效更新直接跳转到新策略，旧能力固化为回归测试防止遗忘，历史补丁折叠为简洁表示。",
      highlights: [
        "代码即策略 — 策略是可读代码，不是黑盒权重，可解释、可验证、可调试。",
        "迭代即学习 — 一次有效更新直接跳转到新策略，无需梯度下降的漫长训练。",
        "测试即记忆 — 旧能力固化为回归测试，防止策略更新导致能力遗忘。",
        "三层策略生成管线：生成→验证→shadow 晋升，含 Bandit 臂统计和健康检查闭环。"
      ],
      outputs: ["Heuristic agent framework", "Code-as-policy engine", "Bandit decision system"],
      relatedNotes: ["why-agents-matter", "prototype-first"]
    },
    {
      slug: "real-quant-engine",
      code: "C3",
      label: "Quant Engine",
      title: "RealQuantEngine",
      summary: "模块化量化策略库 — 多策略编排、券商适配和风控管理的交易引擎，支持 Futu 实盘与 dry-run。",
      href: "https://github.com/JameryW/RealQuantEngine",
      cta: "view source",
      status: "Active",
      stack: ["Python", "Trading", "Futu", "Risk Management", "Modular Strategy"],
      timeframe: "2025–now",
      role: "Architect / Builder",
      detailTitle: "Modular Quant Trading Engine",
      overview:
        "基于模块化架构的量化交易策略库，支持主策略（MRP、Chan）、辅助策略（MACD、DualMA）、市场状态检测（Bollinger、RSI）和过滤器的多层组合。通过券商适配器对接 Futu 实盘，含风控管理、状态管理和守护进程模式。",
      highlights: [
        "模块化策略架构 — Primary 主策略生成信号，Auxiliary 辅助策略提供参考，Regime 检测市场状态，Filter 决定执行。",
        "MRP v3 主策略含 4 个子策略：Trend、MeanRevert、VolBreakout、Defensive，自适应参与系数。",
        "券商适配器对接 Futu，支持 dry-run 和实盘双模式，含风控管理与守护进程。",
        "完整工具链：交易安全检查、指标计算、凭证管理和服务监控。"
      ],
      outputs: ["Trading engine", "Modular strategy library", "Broker adapter"],
      relatedNotes: ["why-agents-matter", "prototype-first"]
    },
    {
      slug: "quant-strategy-prototypes",
      code: "D4",
      label: "Strategy Lab",
      title: "QuantStrategyPrototypes",
      summary: "基于 arXiv 论文研究的量化策略原型集合 — 含回测引擎、10 个策略模块和 91% 测试覆盖率。",
      href: "https://github.com/JameryW/QuantStrategyPrototypes",
      cta: "view source",
      status: "Active",
      stack: ["Python", "Backtest", "arXiv Research", "CI/CD", "Strategy Prototyping"],
      timeframe: "2025–now",
      role: "Research / Builder",
      detailTitle: "Quantitative Strategy Prototypes from Paper Research",
      overview:
        "基于 arXiv 论文研究的量化策略原型集合，包含 10 个策略模块（Dual MA、Chan 缠论、VGRSI、Gap 缺口、Trend 强度、MRP 多因子等），配有完整回测引擎、186 个测试用例（91% 覆盖率）和 CI Pipeline。",
      highlights: [
        "10 个策略模块：Dual MA、Chan 缠论、VGRSI (arXiv 2605.01300)、Gap 缺口 (arXiv 2605.04004)、Trend 强度 (arXiv 2605.02326)、MRP 多因子等。",
        "完整回测引擎含 metrics、portfolio 和 data_fetcher 模块，支持港股和 A 股回测。",
        "186 个测试用例，91% 覆盖率，GitHub Actions CI 自动运行，阈值 60%。",
        "按策略分组的回测配置和按日期归档的回测报告，支持参数化批量回测。"
      ],
      outputs: ["Strategy prototypes", "Backtest engine", "Research-to-code pipeline"],
      relatedNotes: ["why-agents-matter", "prototype-first"]
    },
    {
      slug: "ultimate-coders",
      code: "E5",
      label: "Distributed AI",
      title: "UltimateCoders",
      featured: true,
      summary: "分布式 AI 编码系统 — Rust 核心处理索引、搜索、记忆与调度，Python 层负责 LLM 交互，支持 PyO3/gRPC 双模式。",
      href: "https://github.com/JameryW/UltimateCoders",
      cta: "view source",
      status: "Active",
      stack: ["Rust", "Python", "PyO3", "gRPC", "Multi-Agent", "TiKV", "Qdrant"],
      timeframe: "2025–now",
      role: "Architect / Builder",
      detailTitle: "Distributed AI Coding System",
      overview:
        "基于 Orchestrator-Worker 模式的分布式 AI 编码系统。Rust 核心负责索引、搜索、记忆和调度，Python 层处理 LLM 任务分解与代码生成。支持 PyO3 FFI 本地运行或 gRPC 分布式部署，运行时切换。存储后端支持 TiKV、Qdrant、PostgreSQL，NATS 消息总线。",
      highlights: [
        "Orchestrator-Worker 多 Agent 协作模式，任务分解与执行分离。",
        "Rust 核心引擎：索引、搜索、记忆、调度，高性能基础设施。",
        "Python LLM 层：任务分解、代码生成，灵活的模型接入。",
        "双通信模式：PyO3 FFI 本地高性能，gRPC 分布式扩展，运行时切换。",
        "多存储后端：TiKV 键值、Qdrant 向量、PostgreSQL 关系、NATS 消息队列。"
      ],
      outputs: ["Distributed AI system", "Rust-Python bridge", "Multi-agent orchestration"],
      relatedNotes: ["why-agents-matter", "prompt-engineering-evolution"]
    },
    {
      slug: "awesome-workflows",
      code: "H8",
      label: "Agent Workflows",
      title: "AwesomeWorkflows",
      featured: false,
      summary: "可在 Codex / Claude Code / Grok Build / DeepSeek Harness 复用的 Issue 驱动交付工作流 — 整合 Matt Pocock 工程技能与 Trellis 任务生命周期。",
      href: "https://github.com/JameryW/AwesomeWorkflows",
      cta: "view source",
      status: "Active",
      stack: ["Agent Skills", "Trellis", "Codex", "Claude Code", "GitHub Issues"],
      timeframe: "2026-08–now",
      role: "Architect / Builder",
      detailTitle: "Reusable Issue-Driven Delivery Workflow for AI Agents",
      overview:
        "一套以 Issue 为中心的交付工作流，把 Matt Pocock 的工程技能与 Trellis 任务生命周期组合起来：从澄清需求（grill-with-docs/wayfinder）、原型与规格（prototype/to-spec），到带阻塞依赖的垂直切片 Tickets（to-tickets），再到隔离的实现、验证与提交。Codex、Claude Code、Grok Build、DeepSeek Harness 四个平台通过各自的 skills 目录共享同一套交付约定；GitHub 是优先 Issue tracker，未认证时自动降级为 .scratch/ 本地 Markdown ticket。",
      highlights: [
        "完整交付链：idea → grill-with-docs/wayfinder → prototype → to-spec → to-tickets（带 blocking edges）→ tdd → 实现 → Trellis check + code-review → commit gate。",
        "多平台同一套约定：Codex `$codex-issue-flow`、Claude Code `/issue-delivery-flow`、Grok Build 与 DeepSeek Harness 各自入口，共享 .agents/skills/ 技能主体。",
        "内置 Matt Pocock 技能集 14+ 个（grilling、grill-with-docs、wayfinder、prototype、to-spec、to-tickets、tdd、implement、code-review、triage、domain-modeling 等），MIT 许可并附来源与许可文件。",
        "Trellis 集成：docs/agents/trellis.md 明确初始化前置条件，一张实现 ticket 对应一个新 Codex task + Trellis task；Trellis 运行时不在仓库内复制。",
        "Tracker 优先 GitHub Issues，gh 未认证自动降级为 .scratch/ 本地 Markdown ticket，远程修改需显式授权；附自检脚本 scripts/check-codex-issue-flow.py 验证接线完整性。"
      ],
      outputs: ["Reusable agent workflow", "Multi-platform skill packs", "Issue-driven delivery pipeline"],
      relatedNotes: ["skills-devoured-tools-fortified", "evolve-in-loop"]
    }
  ],
  notes: [
    {
      slug: "why-agents-matter",
      code: "N1",
      label: "Agents",
      title: "为什么 Agent 重要",
      titleEn: "Why Agents Matter",
      summary: "我更关心连续执行、记忆和工具协作，而不是单轮问答的漂亮程度。",
      summaryEn: "I care more about continuous execution, memory, and tool collaboration than about polished single-turn answers.",
      meta: "Focus: execution loop",
      status: "Research note",
      timeframe: "Current lens",
      detailTitle: "执行循环胜过单轮演示",
      detailTitleEn: "Execution Loop Over Single Turn Demos",
      overview:
        "我看重 Agent 的原因，不在于把聊天体验包装得更复杂，而在于它能不能把多个动作串成一个连续执行的过程。单轮回答再漂亮，也只是在解释世界；连续执行是在改变世界。",
      overviewEn:
        "What I value in agents isn't a more elaborate chat experience, but whether they can chain multiple actions into one continuous execution loop. A brilliant single-turn answer only explains the world; continuous execution changes it.",
      lens: "Agent systems are valuable when they coordinate memory, tools, and multi-step execution — not just when they talk better.",
      lensZh: "Agent 的价值在于协调记忆、工具和多步执行，而不只是更会说话。",
      bullets: [
        "连续执行比单轮回答更接近真实任务。用户要的不是一段解释，而是一个结果。",
        "工具调用能力决定了系统能否真正做事，而不只是生成文本。没有工具的 Agent 本质上还是聊天机器人。",
        "记忆和上下文管理是把体验从 demo 推向 workflow 的关键。每次对话都从零开始，等于每次都在重做。",
        "好的 Agent 框架应该让失败变得可见和可恢复，而不是把错误吞掉假装什么都没发生。"
      ],
      bulletsEn: [
        "Continuous execution is closer to real tasks than single-turn answers. Users don't want an explanation; they want an outcome.",
        "Tool-calling ability determines whether a system can actually do things rather than just generate text. An agent without tools is still essentially a chatbot.",
        "Memory and context management are what push an experience from demo to workflow. Starting from zero each time means redoing everything.",
        "A good agent framework should make failure visible and recoverable, instead of swallowing errors and pretending nothing happened.",
      ],
      outputs: ["Agent workflow lens", "Execution bias", "Tool-use perspective", "Failure recovery insight"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "prototype-first",
      code: "N2",
      label: "Build",
      title: "先做原型",
      titleEn: "Prototype First",
      summary: "先跑起来，再暴露真正的问题。很多判断只有在界面和脚本一起工作时才成立。",
      summaryEn: "Get it running first, then let the real problems surface. Many judgments only hold once the interface and the scripts work together.",
      meta: "Focus: fast validation",
      status: "Build note",
      timeframe: "Working rule",
      detailTitle: "先发一版，别过度解释",
      detailTitleEn: "Ship A First Version Before Over-Explaining",
      overview:
        "很多问题在抽象讨论里并不会出现，只有当脚本、界面和真实流程接起来之后，问题才会被准确暴露。先做一版不是粗糙的借口，而是更高效的判断工具。",
      overviewEn:
        "Many problems never appear in abstract discussion; they surface accurately only after scripts, interfaces, and real workflows are wired together. Shipping a first version isn't an excuse for roughness — it's a more efficient decision-making tool.",
      lens: "A runnable prototype is often a better decision tool than extended speculation — it surfaces the real constraints.",
      lensZh: "可运行的原型往往是比长篇推演更好的决策工具，它暴露的是真实约束。",
      bullets: [
        "真实交互能更快揭露结构问题和信息缺口，纸面讨论无法模拟真实路径。",
        "先做一版可以让后续优化有明确的基准，而不是对着虚无的完美方案去修改。",
        "原型不是粗糙的借口，而是更高效的判断工具。重要的是从结果里学习，而不是从概念里推演。",
        "这个站点本身就是 prototype-first 的产物：先上线，再从使用中迭代。"
      ],
      bulletsEn: [
        "Real interaction exposes structural problems and information gaps faster; whiteboard discussion can't simulate real paths.",
        "A first version gives later optimization a concrete baseline, instead of revising against an imaginary perfect plan.",
        "Prototypes aren't an excuse for sloppiness but a sharper judgment tool. What matters is learning from results, not deducing from concepts.",
        "This site is itself the product of prototype-first thinking: ship first, then iterate from real usage.",
      ],
      outputs: ["Prototype bias", "Faster decisions", "Concrete iteration loop"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "interface-as-signal",
      code: "N3",
      label: "Interface",
      title: "界面即信号",
      titleEn: "Interface as Signal",
      summary: "界面选择会暴露技术理解和产品判断，所以站点本身也应该是作品的一部分。",
      summaryEn: "Interface choices reveal technical understanding and product judgment, so the site itself should be part of the work.",
      meta: "Focus: visible taste",
      status: "Interface note",
      timeframe: "Ongoing principle",
      detailTitle: "界面也在解释构建者",
      detailTitleEn: "The Interface Also Explains The Builder",
      overview:
        "界面不只是承载内容的容器，它本身会透露技术理解、信息组织方式和审美判断，所以它应该参与表达，而不是退到背景。一个没有界面态度的个人站，很难形成记忆点。",
      overviewEn:
        "An interface isn't just a container for content — it reveals technical understanding, information architecture, and aesthetic judgment. It should carry meaning, not fade into the background. A personal site with no interface attitude is hard to remember.",
      lens: "The page itself is part of the message, not just a neutral wrapper around it — design choices are statements.",
      lensZh: "页面本身就是信息的一部分，而不只是中性容器，设计选择即表态。",
      bullets: [
        "视觉层级会暴露对内容优先级的判断。用户扫一眼就知道你认为什么最重要。",
        "交互细节能传达系统感、速度感和完成度。慢半拍的动画比没有动画更糟糕。",
        "个人站如果没有界面态度，就很难形成记忆点。模板网站的问题是它什么都没说。",
        "暗色控制台美学不是装饰，它是在几秒内传达'这个人做技术实验'的信号。"
      ],
      bulletsEn: [
        "Visual hierarchy exposes your judgment of content priority. One glance tells users what you consider most important.",
        "Interaction details convey a sense of system, speed, and polish. A laggy animation is worse than no animation.",
        "A personal site without an interface attitude leaves no impression. The problem with template sites is they say nothing.",
        "The dark-console aesthetic isn't decoration — it's a signal delivered in seconds: this person runs technical experiments.",
      ],
      outputs: ["Visible taste", "UI intent", "Signal-driven presentation"],
      relatedProjects: ["xhs-growth-agent"]
    },
    {
      slug: "prompt-engineering-evolution",
      code: "N4",
      label: "Prompt",
      title: "提示工程正在演进",
      titleEn: "Prompt Engineering Is Evolving",
      summary: "提示工程正在从手工技巧转向结构化接口，从写 prompt 变成设计工具和编排流程。",
      summaryEn: "Prompt engineering is shifting from handcrafted tricks to structured interfaces — from writing prompts to designing tools and orchestrating flows.",
      meta: "Focus: structural shift",
      status: "Observation note",
      timeframe: "2025 observation",
      detailTitle: "从巧妙提示到结构化接口",
      detailTitleEn: "From Clever Prompts To Structured Interfaces",
      overview:
        "当模型能力越来越强、工具调用越来越成熟的时候，手工写一段精心设计的 prompt 的价值在下降。真正有价值的是设计好工具接口、编排好执行流程、管理好上下文。",
      overviewEn:
        "As models grow stronger and tool calling matures, the value of a handcrafted, carefully worded prompt declines. What really matters is designing good tool interfaces, orchestrating execution flows, and managing context.",
      lens: "The future of prompt engineering is less about clever phrasing and more about system design — tool interfaces, execution flows, and context management.",
      lensZh: "提示工程的未来不在巧妙措辞，而在系统设计：工具接口、执行流和上下文管理。",
      bullets: [
        "Function calling 和结构化输出正在替代手工提示技巧。模型不需要被巧妙地引导，它需要被正确地接入。",
        "好的 Agent 设计更像系统工程：定义工具、管理状态、处理边界，而不是写一段完美的指令。",
        "上下文窗口扩大和记忆机制增强意味着单次提示的精细度不再是瓶颈。",
        "仍然需要理解模型能力的边界，但重点从'怎么说'转向'做什么和怎么做'。"
      ],
      bulletsEn: [
        "Function calling and structured output are replacing handcrafted prompting tricks. Models don't need clever coaxing; they need correct wiring.",
        "Good agent design is closer to systems engineering: define tools, manage state, and handle edge cases instead of perfecting a single instruction.",
        "Larger context windows and better memory mean the finesse of a single prompt is no longer the bottleneck.",
        "You still need to understand model limits, but the focus shifts from how to say it to what to do and how to do it.",
      ],
      outputs: ["Prompt evolution thesis", "System design lens", "Tool-first perspective"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "build-in-public",
      code: "N5",
      label: "Philosophy",
      title: "公开构建",
      titleEn: "Build In Public",
      featured: true,
      summary: "公开构建不是表演，是让迭代过程本身成为信号，让能力、判断和执行力可直接验证。",
      summaryEn: "Building in public isn't performance — it turns the iteration process itself into signal, making ability, judgment, and execution directly verifiable.",
      meta: "Focus: visible process",
      status: "Philosophy note",
      timeframe: "Ongoing practice",
      detailTitle: "过程也是产品",
      detailTitleEn: "The Process Is Part Of The Product",
      overview:
        "公开构建的核心不是为了展示勤奋，而是让迭代过程本身成为可验证的信号。别人能从提交记录、项目演进和决策轨迹里直接读到你的能力、判断和执行力。",
      overviewEn:
        "The point of building in public isn't showing diligence, but making the iteration process itself verifiable signal. Others can read your ability, judgment, and execution directly from commit history, project evolution, and decision trails.",
      lens: "Public building makes your process verifiable — it turns claims into evidence and intentions into track records.",
      lensZh: "公开构建让过程可验证，把宣称变成证据，把意图变成记录。",
      bullets: [
        "公开迭代比一份精美简历更有说服力。提交记录不会撒谎，但简历可以。",
        "失败记录比成功展示更有信息量。知道什么行不通比知道什么行得通更有价值。",
        "这个站点本身就是 build in public 的实践：从占位内容开始，持续往里填真实项目。",
        "公开不是目的，可验证才是。如果你不能让别人直接看到你的工作轨迹，你就还在靠声明。"
      ],
      bulletsEn: [
        "Public iteration is more convincing than a polished resume. Commit history doesn't lie; resumes can.",
        "Failure logs carry more information than success showcases. Knowing what doesn't work is more valuable than knowing what does.",
        "This site is itself an exercise in building in public: starting from placeholder content, continuously filling in real projects.",
        "Publicness isn't the goal — verifiability is. If others can't directly see your trail of work, you're still relying on claims.",
      ],
      outputs: ["Build-in-public thesis", "Verifiable signal", "Process as evidence"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "productivity-and-relations",
      code: "N6",
      label: "Org",
      title: "生产力与生产关系",
      titleEn: "Productivity & Production Relations",
      featured: true,
      summary: "生产力决定生产关系，用旧的组织形态匹配新生产力，终将被效率更极致的新形态替代。",
      summaryEn: "Productive forces determine production relations: organizations that match new productive forces with old forms will ultimately be replaced by a more radically efficient form.",
      meta: "Focus: organizational evolution",
      status: "Observation note",
      timeframe: "2025 observation",
      detailTitle: "当生产力超越组织外壳",
      detailTitleEn: "When Productivity Outgrows Its Organizational Shell",
      overview:
        "生产力决定生产关系，这是一个被历史反复验证的基本规律。如果一个组织还是想着用现有生产关系去匹配现有生产力，那么它就像之前资本主义代替封建主义，被另外一种效率更加极致的组织形态所代替。",
      overviewEn:
        "That productive forces determine production relations is a basic law repeatedly verified by history. If an organization still tries to fit existing productive forces into existing relations, it will — just as capitalism replaced feudalism — be displaced by a fundamentally more efficient organizational form.",
      lens: "Organizations that cling to outdated structures in the face of new productive forces will be displaced — not by worse competitors, but by fundamentally more efficient organizational forms.",
      lensZh: "抱着过时结构的组织将被取代，不是被更差的对手，而是被根本更高效的组织形态。",
      bullets: [
        "生产力决定生产关系，生产关系反作用于生产力。当生产力已经跃迁而生产关系不变，就形成制度性瓶颈。",
        "资本主义代替封建主义的本质不是技术升级，而是组织形态的跃迁 — 新的生产关系释放了新生产力的全部潜力。",
        "AI 时代最大的组织风险不是技术落后，而是用工业时代的科层制去管理信息时代的生产力。效率差距不是线性的，是结构性的。",
        "真正被淘汰的组织往往不是做错了什么，而是在新生产力面前，旧的组织形态本身就失去了存在的合理性。"
      ],
      bulletsEn: [
        "Productive forces determine production relations, and relations in turn react upon those forces. When productive forces leap while relations stay fixed, you get an institutional bottleneck.",
        "Capitalism replacing feudalism wasn't essentially a technology upgrade but an organizational leap — new relations unleashed the full potential of new productive forces.",
        "The biggest organizational risk of the AI era isn't lagging technology, but managing information-age productive forces with industrial-era bureaucracy. The efficiency gap isn't linear — it's structural.",
        "Organizations that get eliminated often did nothing wrong — in the face of new productive forces, the old organizational form simply lost its reason to exist.",
      ],
      outputs: ["Productivity-relations thesis", "Organizational evolution lens", "Structural disruption insight"],
      relatedProjects: ["xhs-growth-agent", "quant-agent"]
    },
    {
      slug: "evolve-in-loop",
      code: "N7",
      label: "Loop",
      title: "在loop中进化",
      titleEn: "Evolve In Loop",
      featured: true,
      summary: "进化的本质不是一次性跃迁，而是无数次闭环反馈的累积。每一次 loop 都是一次校准：行动→反馈→调整→再行动。",
      summaryEn: "Evolution isn't a one-time leap but the accumulation of countless closed feedback loops. Each loop is a calibration: act, feedback, adjust, act again.",
      meta: "Focus: feedback-driven growth",
      status: "Philosophy note",
      timeframe: "Ongoing practice",
      detailTitle: "闭环即进化",
      detailTitleEn: "Closing The Loop Is Evolving",
      overview:
        "进化的本质不是一次性跃迁，而是无数次闭环反馈的累积。每一次 loop 都是一次校准：行动→反馈→调整→再行动。真正的成长不发生在思考中，而发生在闭环完成的瞬间。",
      overviewEn:
        "Evolution isn't a one-time leap but the accumulation of countless closed feedback loops. Each loop is a calibration: act, feedback, adjust, act again. Real growth doesn't happen in thinking — it happens the moment a loop closes.",
      lens: "Growth is not a leap but a loop — each cycle of action, feedback, and adjustment compounds into real evolution.",
      lensZh: "成长不是跳跃而是循环，行动、反馈、调整的每一次复合都沉淀为真正的进化。",
      bullets: [
        "闭环比完美更重要。完成一次 loop 的价值远大于在脑中推演十次。",
        "反馈是进化的燃料。没有反馈的行动是盲目的，没有行动的反馈是空洞的。",
        "每次 loop 不需要很大，但必须完整。微小的闭环积累起来就是质的跃升。",
        "拒绝闭环就是在拒绝进化。停在半路的 loop 等于没有发生。"
      ],
      bulletsEn: [
        "Closing the loop matters more than perfection. Completing one loop beats ten mental simulations.",
        "Feedback is the fuel of evolution. Action without feedback is blind; feedback without action is hollow.",
        "Each loop doesn't need to be big, but it must be complete. Tiny closed loops accumulate into qualitative leaps.",
        "Refusing to close loops is refusing to evolve. A loop abandoned halfway might as well never have happened.",
      ],
      outputs: ["Loop evolution thesis", "Feedback-driven growth", "Compound improvement insight"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "quantity-to-quality",
      code: "N8",
      label: "Alpha",
      title: "量变引起质变",
      titleEn: "Quantity Becomes Quality",
      featured: true,
      summary: "持续高质量的数据产生高质量的策略，高质量策略催生新的 alpha。这是一个自增强的飞轮，不是线性积累。",
      summaryEn: "Sustained high-quality data produces high-quality strategies, and high-quality strategies spawn new alpha. It is a self-reinforcing flywheel, not linear accumulation.",
      meta: "Focus: data-strategy flywheel",
      status: "Research note",
      timeframe: "2025 observation",
      detailTitle: "数据飞轮催生 alpha",
      detailTitleEn: "The Data Flywheel Generates Alpha",
      overview:
        "量变引起质变，这不只是一句哲学判断，而是量化策略迭代的底层机制。持续高质量的数据产生高质量的策略，高质量的策略又反过来筛选和生成更高质量的数据，形成自增强的飞轮。新的 alpha 不是灵光一现，而是飞轮转出来的。",
      overviewEn:
        "Quantity turning into quality isn't just a philosophical claim — it's the underlying mechanism of quant strategy iteration. Sustained high-quality data produces high-quality strategies, which in turn filter and generate even higher-quality data: a self-reinforcing flywheel. New alpha isn't a flash of insight; it's what the flywheel spins out.",
      lens: "Alpha is not discovered in a single insight — it emerges from a compounding flywheel where quality data and quality strategies reinforce each other.",
      lensZh: "Alpha 不是在某次灵光一现中被发现的，它从优质数据与优质策略互相增强的复利飞轮中涌现。",
      bullets: [
        "数据质量决定策略质量，策略质量决定数据筛选标准。两者互为输入，形成正反馈回路。",
        "alpha 的半衰期在缩短，但飞轮效应在增强。单个 alpha 会衰减，但生产 alpha 的能力在累积。",
        "量变不是简单地堆数量，而是高密度、高信噪比的持续输出。垃圾数据的量变只会产生垃圾策略。",
        "真正的壁垒不是某个策略，而是持续生产策略的能力 — 即飞轮本身的转速和稳定性。"
      ],
      bulletsEn: [
        "Data quality determines strategy quality, and strategy quality determines data filtering standards. Each feeds the other, forming a positive feedback loop.",
        "Alpha's half-life is shrinking, but the flywheel effect is strengthening. Individual alphas decay; the capacity to produce alpha compounds.",
        "Accumulation isn't piling up volume, but sustained high-density, high-signal output. Accumulating garbage data only produces garbage strategies.",
        "The real moat isn't any single strategy but the capacity to keep producing strategies — the flywheel's speed and stability itself.",
      ],
      outputs: ["Data-strategy flywheel thesis", "Alpha compounding insight", "Quality reinforcement loop"],
      relatedProjects: ["quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    },
    {
      slug: "knowledge-depreciates-experience-appreciates",
      code: "N9",
      label: "Judgment",
      title: "知识贬值，经验升值",
      titleEn: "Knowledge Depreciates, Experience Appreciates",
      featured: true,
      summary: "AI 让可检索的知识快速贬值，却让从踩坑里长出来的工程经验升值。设计能扛亿级并发的分布式架构，靠的不是教科书上的基本知识。",
      summaryEn: "AI rapidly depreciates retrievable knowledge while appreciating engineering experience earned from real failures. Designing distributed architectures that survive hundred-million-scale concurrency takes more than textbook basics.",
      meta: "Focus: AI-era value shift",
      status: "Judgment note",
      timeframe: "2025 observation",
      detailTitle: "AI 时代的价值迁移",
      detailTitleEn: "The Value Shift In The AI Era",
      overview:
        "一个反直觉的判断：AI 时代让知识贬值，但让经验升值。知识是被检索的，AI 把检索成本压到趋近于零；而经验是被踩出来的，它包含失败、权衡和那些只在特定规模下才显形的边界条件。设计一个能承受亿级并发流量的分布式架构，绝不是拥有基本知识就足够的。",
      overviewEn:
        "A counterintuitive call: the AI era depreciates knowledge but appreciates experience. Knowledge is retrieved, and AI drives retrieval cost toward zero; experience is earned through failures — it contains the failures, trade-offs, and boundary conditions that only reveal themselves at specific scales. Designing a distributed architecture that withstands hundred-million-scale traffic takes far more than basic knowledge.",
      lens: "Knowledge is retrievable and AI drives its cost toward zero; experience is earned through failure and scale — and that is what becomes scarce and valuable.",
      lensZh: "知识可检索，AI 把它的成本压向零；经验靠失败和规模挣来，这才是稀缺和值钱的部分。",
      bullets: [
        "知识贬值不是因为知识没用，而是因为获取成本被 AI 拉平了。人人都能查到的，就不再是壁垒。",
        "经验升值是因为它无法被检索。亿级并发下的雪崩、热点 key、级联故障，这些只能在真实规模里学到。",
        "基本知识能让你画出架构图，但撑不住亿级流量。能撑住的是判断：哪里该冗余、哪里该降级、哪里该牺牲一致性。",
        "AI 时代最值钱的能力，是用经验去问对的问题、验证 AI 给的答案。知识免费了，但知道哪个答案靠谱，反而更贵了。"
      ],
      bulletsEn: [
        "Knowledge depreciates not because it's useless, but because AI flattened its acquisition cost. What everyone can look up is no longer a moat.",
        "Experience appreciates because it can't be retrieved. Traffic avalanches, hot keys, and cascading failures at hundred-million scale can only be learned at real scale.",
        "Basics let you draw architecture diagrams, but they won't survive that scale of traffic. What survives is judgment: where to add redundancy, where to degrade, where to sacrifice consistency.",
        "The most valuable AI-era skill is using experience to ask the right questions and verify AI's answers. Knowledge is free — but knowing which answer to trust costs more than ever.",
      ],
      outputs: ["AI-era value shift thesis", "Experience-as-scarcity insight", "Judgment over knowledge argument"],
      relatedProjects: ["real-quant-engine", "quant-agent"]
    },
    {
      slug: "skills-devoured-tools-fortified",
      code: "N10",
      label: "Moat",
      title: "技能被吞，工具成护城河",
      titleEn: "Skills Devoured, Tools Fortified",
      featured: true,
      summary: "模型能力越强，纯软件技能越像免费 API 一样被吞噬。真正难复刻的是连接物理世界的 tools——传感器、执行器、私有协议、真实环境的反馈闭环。",
      summaryEn: "The stronger models get, the more pure-software skills get devoured like free APIs. Truly hard to replicate are tools that touch the physical world — sensors, actuators, private protocols, real-environment feedback loops.",
      meta: "Focus: AI-era moat shift",
      status: "Moat note",
      timeframe: "2025 observation",
      detailTitle: "技能被吞噬，工具成护城河",
      detailTitleEn: "Skills Devoured, Tools Fortified",
      overview:
        "一个判断：大模型会让纯软件技能快速贬值。写文案、做表格、调 prompt——这些是模型的 API，一旦模型够强就免费可得，门槛归零。真正无法被吞噬的，是连接物理世界的 tools：硬件接口、私有协议、传感器与执行器、真实环境的反馈闭环。这些需要长期积累、实物调试和现场踩坑，模型再强也替代不了那段物理世界的摩擦。",
      overviewEn:
        "One call: large models will rapidly depreciate pure-software skills. Copywriting, spreadsheets, prompt tuning — these are the model's APIs; once models are strong enough they are free, and the barrier drops to zero. What can't be devoured is the layer connected to the physical world: hardware interfaces, private protocols, sensors and actuators, real-environment feedback loops. These demand long accumulation, physical debugging, and on-site failures — friction no model, however strong, can shortcut.",
      lens: "Skills are LLM-callable and trend toward free; tools that bridge the physical world carry friction — hardware, private protocols, real feedback loops — that models cannot shortcut.",
      lensZh: "技能可被模型调用并趋向免费；连接物理世界的工具自带摩擦，硬件、私有协议、真实反馈闭环，模型无法抄近道。",
      bullets: [
        "纯软件技能是模型的输入：能力越强，这些技能越像免费 API，可被一次性吞掉。prompt 工程、文案生成、表格自动化都属于这一类。",
        "物理世界的 tools 有不可压缩的摩擦：硬件驱动、私有协议、传感器标定、执行器时序，都需要实物调试和长期踩坑，无法靠 token 生成。",
        "护城河在反馈闭环里：连接真实环境的 tools 能拿到模型拿不到的数据——物理状态、故障现场、边缘 case——这才是难复刻的部分。",
        "结论：技能层会持续贬值，工具层会持续升值。把精力投在连接物理世界的 tools 上，比优化可被吞掉的技能更抗通胀。"
      ],
      bulletsEn: [
        "Pure-software skills are model inputs: the stronger the model, the more these skills behave like free APIs to be swallowed whole — prompt engineering, copywriting, and spreadsheet automation all belong here.",
        "Physical-world tools carry incompressible friction: hardware drivers, private protocols, sensor calibration, and actuator timing all demand physical debugging and long-term failure — none of it can be generated by tokens.",
        "The moat lives in the feedback loop: tools wired to real environments capture data models can't — physical states, failure scenes, edge cases. That is the hard-to-replicate part.",
        "Conclusion: the skills layer keeps depreciating while the tools layer keeps appreciating. Investing in tools that touch the physical world is more inflation-proof than optimizing skills that can be devoured.",
      ],
      outputs: ["Skills-as-LLM-API thesis", "Physical-friction moat insight", "Tools-over-skills argument"],
      relatedProjects: ["real-quant-engine", "quant-agent"]
    },
    {
      slug: "pure-software-devalued-physical-premium",
      code: "N11",
      label: "Value",
      title: "纯软件贬值，软硬一体升值",
      titleEn: "Pure Software Devalued, Physical Integration Premium",
      featured: true,
      summary: "大模型把纯软件能力不断内化为免费基础设施，与物理世界相连的软硬一体技术反而因真实数据闭环而升值。",
      summaryEn: "Large models keep internalizing pure-software capability into free infrastructure, while software-hardware integration tied to the physical world appreciates on the back of real-world data loops.",
      meta: "Focus: physical-connected premium",
      status: "Value note",
      timeframe: "2025 observation",
      detailTitle: "纯软件被内化，物理连接成溢价",
      detailTitleEn: "Pure Software Internalized, Physical Connection Commands A Premium",
      overview:
        "大模型正在把纯软件能力逐层内化：推理、代码生成、知识工作一旦被模型学会，就从收费功能变成免费基础设施，价格趋近于零。与之相对，与物理世界相连的软硬一体技术——传感器、执行器、具身终端、边缘实时闭环——每一次交付都要经过物理摩擦的检验，无法被 token 一次性生成。谁拥有真实世界的数据闭环，谁就拥有模型拿不到的稀缺输入，这部分价值会显著提升。",
      overviewEn:
        "Large models are internalizing pure-software capability layer by layer: once reasoning, code generation, and knowledge work are learned by models, they flip from paid features to free infrastructure, with price trending to zero. In contrast, software-hardware technology tied to the physical world — sensors, actuators, embodied terminals, edge real-time loops — must pass the test of physical friction on every delivery; it can't be generated by tokens in one shot. Whoever owns the real-world data loop owns scarce inputs no model can reach — and that value rises significantly.",
      lens: "Pure software is internalized by models toward zero marginal cost; software-hardware systems that close the loop with the physical world earn a premium from friction and real-world data no model can synthesize.",
      lensZh: "纯软件被模型内化到边际成本归零；与物理世界闭环的软硬一体系统，凭摩擦和模型合成不出的真实数据拿到溢价。",
      bullets: [
        "纯软件贬值是因为被内化：推理、代码、知识工作一旦进入模型能力圈，就从产品变成基础设施，调用成本趋近于零。",
        "软硬一体升值是因为有物理摩擦：传感器标定、执行器时序、边缘实时性、具身调试，每一步都不可压缩、不可跳过。",
        "溢价来自真实数据闭环：物理状态、故障现场、边缘 case 是模型合成不出来的稀缺输入，拥有闭环即拥有定价权。",
        "结论：少押注可被内化的纯软件层，多押注连接物理的软硬一体层——价值从代码本身转向真实世界的闭环。"
      ],
      bulletsEn: [
        "Pure software depreciates because it's internalized: once reasoning, code, and knowledge work enter the model's capability circle, they flip from product to infrastructure, and call cost trends to zero.",
        "Software-hardware integration appreciates because of physical friction: sensor calibration, actuator timing, edge real-time behavior, and embodied debugging — every step incompressible and unskippable.",
        "The premium comes from real data loops: physical states, failure scenes, and edge cases are scarce inputs models can't synthesize. Own the loop, own the pricing power.",
        "Conclusion: bet less on the internalizable pure-software layer, more on the physically connected software-hardware layer — value migrates from code itself to real-world loops.",
      ],
      outputs: ["Pure-software devaluation thesis", "Physical-connected premium insight", "Software-hardware integration argument"],
      relatedProjects: ["real-quant-engine", "quant-agent"]
    }
  ]
};
