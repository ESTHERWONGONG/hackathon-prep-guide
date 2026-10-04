window.PREP_TASKS = [
  {
    "id": "overview-plan",
    "chapter": "overview",
    "label": "确定开赛时刻、制作周期和预计有效队伍数",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "overview-capacity",
    "chapter": "overview",
    "label": "按测算落实评委、直播时长和预算",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "overview-publish",
    "chapter": "overview",
    "label": "发布规则版本、完整赛程和负责人联系方式",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "journey-open",
    "chapter": "journey",
    "label": "开放报名，验证唯一ID与提交回执",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "journey-checkin",
    "chapter": "journey",
    "label": "核对签到、成员、迟到和退出状态",
    "anchor": "T0",
    "hours": 2,
    "when": "always"
  },
  {
    "id": "journey-mid",
    "chapter": "journey",
    "label": "收集中途状态，处理求助与退出",
    "anchor": "MID",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "tracks-rules",
    "chapter": "tracks",
    "label": "公布赛道资格、人数下限及不足额处理",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "tracks-lock",
    "chapter": "tracks",
    "label": "逐队确认并冻结赛道",
    "anchor": "T0",
    "hours": 2,
    "when": "always"
  },
  {
    "id": "tracks-valid",
    "chapter": "tracks",
    "label": "核定有效提交数，确认单轮或两轮",
    "anchor": "D",
    "hours": 12,
    "when": "always"
  },
  {
    "id": "build-seal",
    "chapter": "build",
    "label": "封存命题、约束、交付和验收示例",
    "anchor": "T0",
    "hours": -24,
    "when": "always"
  },
  {
    "id": "build-release",
    "chapter": "build",
    "label": "同步公布命题，保存公告与答疑",
    "anchor": "T0",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "build-declare",
    "chapter": "build",
    "label": "收齐成员承诺、复用声明和二开基线",
    "anchor": "T0",
    "hours": 2,
    "when": "always"
  },
  {
    "id": "demo-rehearse",
    "chapter": "demo",
    "label": "完成会议、共享、声音和候场彩排",
    "anchor": "T0",
    "hours": -48,
    "when": "always"
  },
  {
    "id": "demo-assets",
    "chapter": "demo",
    "label": "预检视频、权限、文字稿和离线备份",
    "anchor": "PRECHECK",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "demo-order",
    "chapter": "demo",
    "label": "冻结展示名单，见证抽签并通知顺序",
    "anchor": "LIVE",
    "hours": -24,
    "when": "always"
  },
  {
    "id": "scoring-calibrate",
    "chapter": "scoring",
    "label": "完成评委回避申报和样例校准",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "scoring-assign",
    "chapter": "scoring",
    "label": "核验每件作品3专业+5互评的分配",
    "anchor": "D",
    "hours": 12,
    "when": "always"
  },
  {
    "id": "scoring-lock",
    "chapter": "scoring",
    "label": "补齐有效评分，锁分并双人交叉核算",
    "anchor": "SCORE_LOCK",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "scoring-final",
    "chapter": "scoring",
    "label": "完成5名固定决赛评委评分和复核",
    "anchor": "EVENT_END",
    "hours": 12,
    "when": "final"
  },
  {
    "id": "awards-publish",
    "chapter": "awards",
    "label": "公布奖项、资金、兼得和同分规则",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "awards-confirm",
    "chapter": "awards",
    "label": "处理成绩申诉，核验获奖资格与递补",
    "anchor": "FINAL_LOCK",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "awards-deliver",
    "chapter": "awards",
    "label": "按公告发奖并保存签收回执",
    "anchor": "AWARD",
    "hours": 0,
    "when": "always"
  },
  {
    "id": "templates-entry",
    "chapter": "templates",
    "label": "配置报名/签到字段、权限和回执",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "templates-review",
    "chapter": "templates",
    "label": "配置提交、评分、申诉表及受限导出",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "templates-test",
    "chapter": "templates",
    "label": "用测试队跑通全部表单链路",
    "anchor": "T0",
    "hours": -48,
    "when": "always"
  },
  {
    "id": "archive-ready",
    "chapter": "archive",
    "label": "确认作品页字段、授权和维护期限",
    "anchor": "T0",
    "hours": -48,
    "when": "always"
  },
  {
    "id": "archive-publish",
    "chapter": "archive",
    "label": "上线经授权作品、录播和执行回顾",
    "anchor": "EVENT_END",
    "hours": 168,
    "when": "always"
  },
  {
    "id": "archive-followup",
    "chapter": "archive",
    "label": "检查链接，回访项目并汇总反馈",
    "anchor": "EVENT_END",
    "hours": 720,
    "when": "always"
  },
  {
    "id": "operations-roster",
    "chapter": "operations",
    "label": "落实岗位轮值、升级联系人和备援",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "operations-drill",
    "chapter": "operations",
    "label": "演练断网、换场、主持接管和提交故障",
    "anchor": "T0",
    "hours": -48,
    "when": "always"
  },
  {
    "id": "operations-support",
    "chapter": "operations",
    "label": "检查公告、客服、资源和故障登记",
    "anchor": "T0",
    "hours": -1,
    "when": "always"
  },
  {
    "id": "sources-check",
    "chapter": "sources",
    "label": "核对原文、日期和线上线下适用范围",
    "anchor": "T0",
    "hours": -336,
    "when": "always"
  },
  {
    "id": "sources-boundary",
    "chapter": "sources",
    "label": "区分赛事事实、自定规则与未核实内容",
    "anchor": "T0",
    "hours": -168,
    "when": "always"
  },
  {
    "id": "network-platform-map",
    "label": "完成平台入口、账户归属与负责人清单",
    "anchor": "T0",
    "hours": -336,
    "chapter": "network-plan",
    "when": "always"
  },
  {
    "id": "network-access-matrix",
    "label": "核对平台容量、访问权限与数据保留范围",
    "anchor": "T0",
    "hours": -168,
    "chapter": "network-plan",
    "when": "always"
  },
  {
    "id": "network-data-walkthrough",
    "label": "测试队伍跑通报名到提交并核验回执、导出",
    "anchor": "T0",
    "hours": -72,
    "chapter": "network-plan",
    "when": "always"
  },
  {
    "id": "network-rehearsal",
    "label": "完成入会、路演与集中提交联调并关闭阻塞问题",
    "anchor": "T0",
    "hours": -48,
    "chapter": "network-drill",
    "when": "always"
  },
  {
    "id": "network-failover",
    "label": "验证备用主持、备用入口与提交故障处理卡",
    "anchor": "T0",
    "hours": -24,
    "chapter": "network-drill",
    "when": "always"
  },
  {
    "id": "network-closeout",
    "label": "归档运行记录并移除到期的临时访问权",
    "anchor": "EVENT_END",
    "hours": 24,
    "chapter": "network-drill",
    "when": "always"
  },
  {
    "id": "venue-booking",
    "label": "取得场地时段、人数容量、费用与限制的书面确认",
    "anchor": "T0",
    "hours": -720,
    "when": "onsite",
    "chapter": "venue-plan"
  },
  {
    "id": "venue-floorplan",
    "label": "与场地方确认分区、动线和无障碍安排",
    "anchor": "T0",
    "hours": -336,
    "when": "onsite",
    "chapter": "venue-plan"
  },
  {
    "id": "venue-services",
    "label": "确认供电网络、跨夜安排及现场服务联系人",
    "anchor": "T0",
    "hours": -168,
    "when": "onsite",
    "chapter": "venue-plan"
  },
  {
    "id": "venue-setup",
    "label": "完成分区布置、指引与设备物资交接",
    "anchor": "T0",
    "hours": -24,
    "when": "onsite",
    "chapter": "venue-ready"
  },
  {
    "id": "venue-inspection",
    "label": "与场地方联合验收并处理影响开场的问题",
    "anchor": "T0",
    "hours": -2,
    "when": "onsite",
    "chapter": "venue-ready"
  },
  {
    "id": "venue-handover",
    "label": "完成撤场清点、恢复场地并取得交接确认",
    "anchor": "EVENT_END",
    "hours": 12,
    "when": "onsite",
    "chapter": "venue-ready"
  },
  {
    "id": "sponsor-budget",
    "label": "赞助负责人确认预算缺口，交付现金／实物资源清单",
    "anchor": "T0",
    "hours": -720,
    "chapter": "sponsor-plan",
    "when": "always"
  },
  {
    "id": "sponsor-proposal",
    "label": "合作负责人定稿一页方案，列清权益、成本与可交付时间",
    "anchor": "T0",
    "hours": -504,
    "chapter": "sponsor-plan",
    "when": "always"
  },
  {
    "id": "sponsor-confirm",
    "label": "合作负责人核实已确认伙伴，记录资源到位日和双方联系人",
    "anchor": "T0",
    "hours": -168,
    "chapter": "sponsor-plan",
    "when": "always"
  },
  {
    "id": "sponsor-assets",
    "label": "合作负责人收齐品牌与资源素材，交付权益台账并获确认",
    "anchor": "T0",
    "hours": -72,
    "chapter": "sponsor-delivery",
    "when": "always"
  },
  {
    "id": "sponsor-report",
    "label": "合作负责人提交实际交付报告，逐项附汇总数据或验收链接",
    "anchor": "EVENT_END",
    "hours": 168,
    "chapter": "sponsor-delivery",
    "when": "always"
  },
  {
    "id": "sponsor-close",
    "label": "财务与合作负责人核清尾项，记录奖品、资源和权益关闭情况",
    "anchor": "EVENT_END",
    "hours": 336,
    "chapter": "sponsor-delivery",
    "when": "always"
  },
  {
    "id": "catering-count",
    "label": "餐饮负责人按天逐餐核对人数，交付用餐与特殊餐汇总表",
    "anchor": "T0",
    "hours": -168,
    "when": "onsite",
    "chapter": "catering-plan"
  },
  {
    "id": "catering-vendor",
    "label": "采购负责人确认菜单、报价和改量截止日，留存供应商确认单",
    "anchor": "T0",
    "hours": -120,
    "when": "onsite",
    "chapter": "catering-plan"
  },
  {
    "id": "catering-final",
    "label": "餐饮负责人复核最终份数、配送联系人与备用渠道",
    "anchor": "T0",
    "hours": -24,
    "when": "onsite",
    "chapter": "catering-plan"
  },
  {
    "id": "catering-flow",
    "label": "现场负责人确认供餐布局与批次，交付领餐动线和公告文案",
    "anchor": "T0",
    "hours": -48,
    "when": "onsite",
    "chapter": "catering-service"
  },
  {
    "id": "catering-shifts",
    "label": "餐饮负责人排定接货、分发与清理班次，确认每餐负责人",
    "anchor": "T0",
    "hours": -24,
    "when": "onsite",
    "chapter": "catering-service"
  },
  {
    "id": "catering-review",
    "label": "餐饮负责人汇总实际餐量与异常，交付对账和改进记录",
    "anchor": "EVENT_END",
    "hours": 24,
    "when": "onsite",
    "chapter": "catering-service"
  },
  {
    "id": "event-owners",
    "label": "总协调确认岗位主责与替补，交付岗位和联系人表",
    "anchor": "T0",
    "hours": -168,
    "chapter": "event-staff",
    "when": "always"
  },
  {
    "id": "event-roster",
    "label": "会务负责人排定值班与交接，发布工作人员手册",
    "anchor": "T0",
    "hours": -72,
    "chapter": "event-staff",
    "when": "always"
  },
  {
    "id": "event-training",
    "label": "各岗位完成权限检查与流程演练，记录问题及修复负责人",
    "anchor": "T0",
    "hours": -24,
    "chapter": "event-staff",
    "when": "always"
  },
  {
    "id": "event-runsheet",
    "label": "流程负责人定稿执行表，补齐环节负责人、入口和切换信号",
    "anchor": "T0",
    "hours": -72,
    "chapter": "event-run",
    "when": "always"
  },
  {
    "id": "event-rehearsal",
    "label": "总协调带队演练缺席与掉线，确认公告渠道及应急联系人",
    "anchor": "T0",
    "hours": -24,
    "chapter": "event-run",
    "when": "always"
  },
  {
    "id": "event-close",
    "label": "会务负责人核对设备、权限与未结事项，交付收尾记录",
    "anchor": "EVENT_END",
    "hours": 24,
    "chapter": "event-run",
    "when": "always"
  }
];
