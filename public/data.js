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
        "基于 LangGraph 的多 Agent 编排系统，把小红书内容运营从选题到发布到复盘的全流程自动化。8 个专业 Agent 分工协作，通过 Human Review Gate 保留人工审核环节，兼顾效率和质量控制。前端用 Vue 3 + Element Plus 构建赛博朋克风格的审核面板。",
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
      meta: "Focus: execution loop",
      status: "Research note",
      timeframe: "Current lens",
      detailTitle: "执行循环胜过单轮演示",
      detailTitleEn: "Execution Loop Over Single Turn Demos",
      overview:
        "我看重 Agent 的原因，不在于把聊天体验包装得更复杂，而在于它能不能把多个动作串成一个连续执行的过程。单轮回答再漂亮，也只是在解释世界；连续执行是在改变世界。",
      lens: "Agent systems are valuable when they coordinate memory, tools, and multi-step execution — not just when they talk better.",
      bullets: [
        "连续执行比单轮回答更接近真实任务。用户要的不是一段解释，而是一个结果。",
        "工具调用能力决定了系统能否真正做事，而不只是生成文本。没有工具的 Agent 本质上还是聊天机器人。",
        "记忆和上下文管理是把体验从 demo 推向 workflow 的关键。每次对话都从零开始，等于每次都在重做。",
        "好的 Agent 框架应该让失败变得可见和可恢复，而不是把错误吞掉假装什么都没发生。"
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
      meta: "Focus: fast validation",
      status: "Build note",
      timeframe: "Working rule",
      detailTitle: "先发一版，别过度解释",
      detailTitleEn: "Ship A First Version Before Over-Explaining",
      overview:
        "很多问题在抽象讨论里并不会出现，只有当脚本、界面和真实流程接起来之后，问题才会被准确暴露。先做一版不是粗糙的借口，而是更高效的判断工具。",
      lens: "A runnable prototype is often a better decision tool than extended speculation — it surfaces the real constraints.",
      bullets: [
        "真实交互能更快揭露结构问题和信息缺口，纸面讨论无法模拟真实路径。",
        "先做一版可以让后续优化有明确的基准，而不是对着虚无的完美方案去修改。",
        "原型不是粗糙的借口，而是更高效的判断工具。重要的是从结果里学习，而不是从概念里推演。",
        "这个站点本身就是 prototype-first 的产物：先上线，再从使用中迭代。"
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
      meta: "Focus: visible taste",
      status: "Interface note",
      timeframe: "Ongoing principle",
      detailTitle: "界面也在解释构建者",
      detailTitleEn: "The Interface Also Explains The Builder",
      overview:
        "界面不只是承载内容的容器，它本身会透露技术理解、信息组织方式和审美判断，所以它应该参与表达，而不是退到背景。一个没有界面态度的个人站，很难形成记忆点。",
      lens: "The page itself is part of the message, not just a neutral wrapper around it — design choices are statements.",
      bullets: [
        "视觉层级会暴露对内容优先级的判断。用户扫一眼就知道你认为什么最重要。",
        "交互细节能传达系统感、速度感和完成度。慢半拍的动画比没有动画更糟糕。",
        "个人站如果没有界面态度，就很难形成记忆点。模板网站的问题是它什么都没说。",
        "暗色控制台美学不是装饰，它是在几秒内传达'这个人做技术实验'的信号。"
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
      meta: "Focus: structural shift",
      status: "Observation note",
      timeframe: "2025 observation",
      detailTitle: "从巧妙提示到结构化接口",
      detailTitleEn: "From Clever Prompts To Structured Interfaces",
      overview:
        "当模型能力越来越强、工具调用越来越成熟的时候，手工写一段精心设计的 prompt 的价值在下降。真正有价值的是设计好工具接口、编排好执行流程、管理好上下文。",
      lens: "The future of prompt engineering is less about clever phrasing and more about system design — tool interfaces, execution flows, and context management.",
      bullets: [
        "Function calling 和结构化输出正在替代手工提示技巧。模型不需要被巧妙地引导，它需要被正确地接入。",
        "好的 Agent 设计更像系统工程：定义工具、管理状态、处理边界，而不是写一段完美的指令。",
        "上下文窗口扩大和记忆机制增强意味着单次提示的精细度不再是瓶颈。",
        "仍然需要理解模型能力的边界，但重点从'怎么说'转向'做什么和怎么做'。"
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
      summary: "公开构建不是表演，是让迭代过程本身成为信号，让能力、判断和执行力可直接验证。",
      meta: "Focus: visible process",
      status: "Philosophy note",
      timeframe: "Ongoing practice",
      detailTitle: "过程也是产品",
      detailTitleEn: "The Process Is Part Of The Product",
      overview:
        "公开构建的核心不是为了展示勤奋，而是让迭代过程本身成为可验证的信号。别人能从提交记录、项目演进和决策轨迹里直接读到你的能力、判断和执行力。",
      lens: "Public building makes your process verifiable — it turns claims into evidence and intentions into track records.",
      bullets: [
        "公开迭代比一份精美简历更有说服力。提交记录不会撒谎，但简历可以。",
        "失败记录比成功展示更有信息量。知道什么行不通比知道什么行得通更有价值。",
        "这个站点本身就是 build in public 的实践：从占位内容开始，持续往里填真实项目。",
        "公开不是目的，可验证才是。如果你不能让别人直接看到你的工作轨迹，你就还在靠声明。"
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
      summary: "生产力决定生产关系，用旧的组织形态匹配新生产力，终将被效率更极致的新形态替代。",
      meta: "Focus: organizational evolution",
      status: "Observation note",
      timeframe: "2025 observation",
      detailTitle: "当生产力超越组织外壳",
      detailTitleEn: "When Productivity Outgrows Its Organizational Shell",
      overview:
        "生产力决定生产关系，这是一个被历史反复验证的基本规律。如果一个组织还是想着用现有生产关系去匹配现有生产力，那么它就像之前资本主义代替封建主义，被另外一种效率更加极致的组织形态所代替。",
      lens: "Organizations that cling to outdated structures in the face of new productive forces will be displaced — not by worse competitors, but by fundamentally more efficient organizational forms.",
      bullets: [
        "生产力决定生产关系，生产关系反作用于生产力。当生产力已经跃迁而生产关系不变，就形成制度性瓶颈。",
        "资本主义代替封建主义的本质不是技术升级，而是组织形态的跃迁 — 新的生产关系释放了新生产力的全部潜力。",
        "AI 时代最大的组织风险不是技术落后，而是用工业时代的科层制去管理信息时代的生产力。效率差距不是线性的，是结构性的。",
        "真正被淘汰的组织往往不是做错了什么，而是在新生产力面前，旧的组织形态本身就失去了存在的合理性。"
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
      summary: "进化的本质不是一次性跃迁，而是无数次闭环反馈的累积。每一次 loop 都是一次校准：行动→反馈→调整→再行动。",
      meta: "Focus: feedback-driven growth",
      status: "Philosophy note",
      timeframe: "Ongoing practice",
      detailTitle: "闭环即进化",
      detailTitleEn: "Closing The Loop Is Evolving",
      overview:
        "进化的本质不是一次性跃迁，而是无数次闭环反馈的累积。每一次 loop 都是一次校准：行动→反馈→调整→再行动。真正的成长不发生在思考中，而发生在闭环完成的瞬间。",
      lens: "Growth is not a leap but a loop — each cycle of action, feedback, and adjustment compounds into real evolution.",
      bullets: [
        "闭环比完美更重要。完成一次 loop 的价值远大于在脑中推演十次。",
        "反馈是进化的燃料。没有反馈的行动是盲目的，没有行动的反馈是空洞的。",
        "每次 loop 不需要很大，但必须完整。微小的闭环积累起来就是质的跃升。",
        "拒绝闭环就是在拒绝进化。停在半路的 loop 等于没有发生。"
      ],
      outputs: ["Loop evolution thesis", "Feedback-driven growth", "Compound improvement insight"],
      relatedProjects: ["xhs-growth-agent", "quant-agent", "real-quant-engine", "quant-strategy-prototypes"]
    }
  ]
};
