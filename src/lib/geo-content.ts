import type { GeoPageContent, LocalizedText, SeoPage } from "@/lib/types";
import { localizedText } from "@/lib/seo";

type GeoProfile = {
  audience: LocalizedText;
  scenario: LocalizedText;
  power: LocalizedText;
  standards: LocalizedText;
  software: LocalizedText;
  compliance: LocalizedText;
  decision: LocalizedText;
  risk: LocalizedText;
};

const DEFAULT_PROFILE: GeoProfile = {
  audience: {
    en: "overseas EV charging buyers, distributors, and project operators",
    zh: "海外充电桩采购方、渠道商和项目运营商",
  },
  scenario: {
    en: "home, commercial, fleet, and public charging projects",
    zh: "家用、商用、车队和公共充电项目",
  },
  power: {
    en: "3.5KW portable charging to 720KW DC fast charging",
    zh: "3.5KW便携式充电到720KW直流快充",
  },
  standards: {
    en: "Type 2, CCS2, CCS1, NACS, GB/T, CHAdeMO, and market-specific options",
    zh: "Type 2、CCS2、CCS1、NACS、GB/T、CHAdeMO及区域化接口选项",
  },
  software: {
    en: "OCPP, RFID, app control, remote diagnostics, and load management where required",
    zh: "按需支持OCPP、RFID、APP控制、远程诊断和负载管理",
  },
  compliance: {
    en: "CE, UKCA, IEC, MID, OCPP validation, and project-specific documentation paths",
    zh: "CE、UKCA、IEC、MID、OCPP验证和项目所需文件路径",
  },
  decision: {
    en: "match the charger family to the target market, installation constraints, backend platform, and long-term service plan",
    zh: "让充电桩系列匹配目标市场、安装约束、后台平台和长期服务计划",
  },
  risk: {
    en: "choosing only by catalog power rating without validating site, software, and compliance requirements",
    zh: "只按目录功率选择设备，而未验证站点、软件和合规要求",
  },
};

const GEO_PROFILES: Record<string, Partial<GeoProfile>> = {
  "ev-charger-manufacturer": {
    audience: { en: "buyers evaluating EV charger manufacturers", zh: "正在评估充电桩制造商的采购方" },
    scenario: { en: "portable, AC, DC, and energy storage charging portfolios", zh: "便携式、交流、直流和储能充电产品组合" },
    decision: { en: "verify real product range, engineering support, certifications, and repeat production capacity", zh: "验证真实产品范围、工程支持、认证和复购生产能力" },
  },
  "ev-charger-oem-odm": {
    audience: { en: "brands, distributors, and operators planning OEM or ODM cooperation", zh: "规划OEM或ODM合作的品牌商、渠道商和运营商" },
    scenario: { en: "private-label wallbox, commercial AC, and DC fast charger programs", zh: "贴牌壁挂桩、商用交流桩和直流快充项目" },
    decision: { en: "define market, enclosure, branding, firmware, certification, packaging, and forecast before samples", zh: "在样品前明确市场、结构、品牌、固件、认证、包装和预测量" },
  },
  "ocpp-ev-charger": {
    audience: { en: "operators that need chargers connected to a CMS or payment platform", zh: "需要设备接入CMS或支付平台的运营商" },
    scenario: { en: "commercial AC charging, fleet charging, and public DC fast charging networks", zh: "商用交流、车队充电和公共直流快充网络" },
    software: { en: "OCPP 1.6J or project-specific OCPP validation with RFID, remote start, meter values, and fault reporting", zh: "OCPP 1.6J或项目指定OCPP验证，覆盖RFID、远程启动、计量值和故障上报" },
  },
  "dc-fast-charger": {
    audience: { en: "operators planning public, fleet, highway, or destination fast charging", zh: "规划公共、车队、高速或目的地快充的运营商" },
    scenario: { en: "30KW compact DC chargers through 720KW split DC systems", zh: "30KW紧凑型直流桩到720KW分体式直流系统" },
    power: { en: "30KW, 40KW, 60KW, 80KW, 120KW, 180KW, 240KW, 360KW, 480KW, 600KW, and 720KW", zh: "30KW、40KW、60KW、80KW、120KW、180KW、240KW、360KW、480KW、600KW和720KW" },
  },
  "commercial-ev-charging-station": {
    audience: { en: "commercial property owners, parking operators, and charging network investors", zh: "商业地产方、停车运营商和充电网络投资方" },
    scenario: { en: "parking lots, workplaces, retail destinations, fleet depots, and public charging stations", zh: "停车场、办公园区、零售目的地、车队场站和公共充电站" },
  },
  "home-wallbox-ev-charger": {
    audience: { en: "home charger brands, residential installers, and distributors", zh: "家用充电品牌、住宅安装商和渠道商" },
    scenario: { en: "7KW, 11KW, 22KW, and North American Level 2 wallbox projects", zh: "7KW、11KW、22KW和北美Level 2壁挂桩项目" },
    power: { en: "7KW to 22KW AC wallbox and 7.5KW to 12KW Level 2 options", zh: "7KW至22KW交流壁挂桩，以及7.5KW至12KW Level 2选项" },
  },
  "energy-storage-ev-charging": {
    audience: { en: "operators with weak-grid, peak-demand, solar, or high-power charging constraints", zh: "面临弱电网、峰值负荷、光伏或高功率充电约束的运营商" },
    scenario: { en: "energy storage charging systems, solar integration, V2G-ready planning, and EMS-controlled sites", zh: "储能充电系统、光伏接入、V2G规划和EMS控制站点" },
    power: { en: "integrated storage charging, 480KW class systems, and site-specific EMS design", zh: "储充一体、480KW级系统和站点化EMS设计" },
  },
  "mode-2-mode-3-mode-4-ev-charging": {
    audience: { en: "buyers mapping charging modes to real product categories", zh: "需要把充电模式对应到真实产品分类的采购方" },
    scenario: { en: "Mode 2 portable charging, Mode 3 fixed AC charging, and Mode 4 DC fast charging", zh: "Mode 2便携式充电、Mode 3固定交流充电和Mode 4直流快充" },
  },
  "ev-charger-manufacturer-selection": {
    audience: { en: "buyers building a manufacturer shortlist", zh: "正在建立制造商短名单的采购方" },
    scenario: { en: "supplier comparison, sample validation, and long-term procurement decisions", zh: "供应商比较、样品验证和长期采购决策" },
  },
  "ac-vs-dc-ev-charger": {
    audience: { en: "site owners comparing AC and DC charger investment", zh: "正在比较交流和直流投资的站点业主" },
    scenario: { en: "mixed charging sites where dwell time and turnaround speed differ", zh: "停留时间和周转速度差异明显的混合充电站点" },
  },
  "ccs2-ccs1-nacs-gbt-chademo": {
    audience: { en: "buyers choosing connector standards for export or multi-market projects", zh: "为出口或多市场项目选择接口标准的采购方" },
    standards: { en: "CCS2, CCS1, NACS, GB/T, CHAdeMO, Type 2, and regional connector planning", zh: "CCS2、CCS1、NACS、GB/T、CHAdeMO、Type 2和区域化接口规划" },
  },
  "ocpp-1-6j-vs-ocpp-2-0-1": {
    audience: { en: "operators and software teams comparing OCPP protocol paths", zh: "比较OCPP协议路线的运营商和软件团队" },
    software: { en: "OCPP 1.6J, OCPP 2.0.1 readiness, CMS integration, security profiles, and smart charging", zh: "OCPP 1.6J、OCPP 2.0.1准备度、CMS对接、安全配置和智能充电" },
  },
  "ev-charger-certifications-ce-ukca": {
    audience: { en: "buyers planning European, UK, and export certification paths", zh: "规划欧洲、英国和出口认证路径的采购方" },
    compliance: { en: "CE, UKCA, IEC, EMC, MID metering, OCPP validation, labels, and documentation", zh: "CE、UKCA、IEC、EMC、MID计量、OCPP验证、标签和文件" },
  },
  "dynamic-load-balancing-ev-charger": {
    audience: { en: "sites adding chargers under limited grid capacity", zh: "在有限电力容量下增加充电设备的站点" },
    software: { en: "dynamic load balancing, metering, building load monitoring, app control, and EMS logic", zh: "动态负载均衡、计量、建筑负荷监测、APP控制和EMS逻辑" },
  },
  "ev-charger-for-parking-lots": {
    audience: { en: "parking lot owners, property managers, and charging operators", zh: "停车场业主、物业管理方和充电运营商" },
    scenario: { en: "parking lots with employees, visitors, shoppers, residents, and fleet users", zh: "服务员工、访客、购物者、住户和车队用户的停车场" },
  },
  "ev-charger-for-fleet-charging": {
    audience: { en: "fleet operators planning depot and route charging", zh: "规划场站和路线充电的车队运营商" },
    scenario: { en: "fleet depots, logistics yards, bus charging, taxi charging, and scheduled vehicle dispatch", zh: "车队场站、物流园、公交充电、出租车充电和班次化车辆调度" },
  },
  "ev-charger-for-hotels": {
    audience: { en: "hotels, resorts, and destination property operators", zh: "酒店、度假村和目的地物业运营方" },
    scenario: { en: "overnight guest charging, destination charging, branded parking amenities, and optional premium DC charging", zh: "过夜住客充电、目的地充电、品牌化停车配套和可选高端直流快充" },
  },
  "dc-fast-charger-site-planning": {
    audience: { en: "operators planning DC fast charging sites before hardware procurement", zh: "硬件采购前规划直流快充站点的运营商" },
    scenario: { en: "grid study, parking layout, power allocation, connector mix, backend integration, and maintenance planning", zh: "电网评估、停车布局、功率分配、接口组合、后台对接和维护规划" },
  },
};

function mergeProfile(slug: string): GeoProfile {
  return { ...DEFAULT_PROFILE, ...(GEO_PROFILES[slug] || {}) };
}

function text(en: string, zh: string): LocalizedText {
  return { en, zh };
}

export function getGeoPageContent(page: SeoPage): GeoPageContent {
  const profile = mergeProfile(page.slug);
  const titleEn = localizedText(page.title, "en");
  const titleZh = localizedText(page.title, "zh");

  return {
    directAnswer: text(
      `${titleEn} should be evaluated as a practical procurement decision, not only a keyword or catalog category. For ${profile.audience.en}, the strongest choice is the option that fits ${profile.scenario.en}, supports ${profile.power.en}, and can be validated against ${profile.standards.en}. The main risk is ${profile.risk.en}.`,
      `${titleZh}应作为实际采购决策来评估，而不只是关键词或目录分类。对${profile.audience.zh}来说，更可靠的选择应匹配${profile.scenario.zh}，覆盖${profile.power.zh}，并能按${profile.standards.zh}进行验证。主要风险是${profile.risk.zh}。`
    ),
    buyerCriteria: [
      {
        label: text("Target market and standards", "目标市场与标准"),
        guidance: text(
          `Confirm the destination market, vehicle base, connector standard, voltage, language, and installation rules before choosing hardware. This prevents a charger from matching the power requirement but failing the local deployment requirement.`,
          `先确认目标市场、车型基础、接口标准、电压、语言和安装规则，再选择硬件。这样可以避免设备功率看似匹配，却无法满足本地部署要求。`
        ),
      },
      {
        label: text("Electrical capacity and site design", "电力容量与站点设计"),
        guidance: text(
          `Review available grid capacity, cable distance, cabinet space, parking layout, weather exposure, and future expansion. These site factors often decide whether AC, compact DC, high-power DC, or storage charging is realistic.`,
          `评估可用电力容量、线缆距离、配电柜空间、停车布局、户外环境和未来扩容。这些站点因素通常决定交流、紧凑直流、大功率直流或储能充电是否现实。`
        ),
      },
      {
        label: text("Software and operation readiness", "软件与运营准备度"),
        guidance: text(
          `Check ${profile.software.en}. A charger for shared or paid use should be validated with the target backend before mass production, especially authorization, metering, remote start, fault reporting, and firmware update behavior.`,
          `核查${profile.software.zh}。共享或收费场景的设备应在量产前用目标后台验证，尤其是授权、计量、远程启动、故障上报和固件升级行为。`
        ),
      },
      {
        label: text("Certification and documentation", "认证与文件"),
        guidance: text(
          `Plan ${profile.compliance.en} before samples are approved. Certification affects labels, components, firmware settings, product manuals, packaging, and the final export documentation package.`,
          `样品确认前就要规划${profile.compliance.zh}。认证会影响标签、部件、固件设置、说明书、包装和最终出口文件包。`
        ),
      },
      {
        label: text("Supplier execution and repeat supply", "供应商执行与复购能力"),
        guidance: text(
          `A useful supplier should support sample validation, pilot feedback, ODM/OEM changes, spare parts, and stable repeat production. The best decision is to ${profile.decision.en}.`,
          `有价值的供应商应支持样品验证、试点反馈、ODM/OEM调整、备件和稳定复购生产。更好的决策是${profile.decision.zh}。`
        ),
      },
    ],
    specSnapshot: [
      {
        label: text("Best-fit buyer", "适合采购方"),
        value: profile.audience,
        note: text("Use this page to shortlist requirements before contacting suppliers.", "用于在联系供应商前梳理需求短名单。"),
      },
      {
        label: text("Typical scenario", "典型场景"),
        value: profile.scenario,
        note: text("The scenario determines charger type, quantity, and operating model.", "场景决定设备类型、数量和运营模型。"),
      },
      {
        label: text("Power range", "功率范围"),
        value: profile.power,
        note: text("Confirm power against grid capacity and vehicle charging behavior.", "需结合电网容量和车辆充电行为确认。"),
      },
      {
        label: text("Connector and standards", "接口与标准"),
        value: profile.standards,
        note: text("Connector planning should follow the target vehicle mix and country.", "接口规划应跟随目标车型和国家。"),
      },
      {
        label: text("Software and compliance", "软件与合规"),
        value: text(`${profile.software.en}; ${profile.compliance.en}`, `${profile.software.zh}；${profile.compliance.zh}`),
        note: text("Validate before mass production or site rollout.", "量产或站点铺设前验证。"),
      },
    ],
    faqs: [
      {
        question: text(`What should buyers confirm first for ${titleEn}?`, `${titleZh}应先确认什么？`),
        answer: text(
          `Start with the target market, user scenario, available electrical capacity, connector standard, backend platform, and certification route. These facts shape the charger family before model-level comparison begins.`,
          `先确认目标市场、用户场景、可用电力容量、接口标准、后台平台和认证路线。这些事实会先决定产品系列，再进入具体型号比较。`
        ),
      },
      {
        question: text("Which YINGLITECH product lines are usually relevant?", "通常关联哪些盈利科技产品线？"),
        answer: text(
          `Relevant options can include portable EV chargers, home AC wallboxes, commercial AC chargers, DC fast chargers, and energy storage charging systems. The final mix depends on ${profile.scenario.en}.`,
          `相关选项可包括便携式充电器、家用交流壁挂桩、商用交流桩、直流快充和储能充电系统。最终组合取决于${profile.scenario.zh}。`
        ),
      },
      {
        question: text("When does OCPP matter?", "什么时候需要重视OCPP？"),
        answer: text(
          `OCPP matters when chargers need to connect with a third-party CMS, payment flow, RFID access, remote diagnostics, or load management. Buyers should test the target platform before scaling orders.`,
          `当设备需要接入第三方CMS、支付流程、RFID权限、远程诊断或负载管理时，就需要重视OCPP。采购方应在扩大订单前测试目标平台。`
        ),
      },
      {
        question: text("What information helps YINGLITECH quote accurately?", "哪些信息有助于盈利科技准确报价？"),
        answer: text(
          `Share the destination country, charger quantity, power level, connector, installation type, network requirements, certification needs, branding scope, and expected timeline. Photos or drawings of the site are useful for project matching.`,
          `请提供目的国家、设备数量、功率等级、接口、安装方式、联网要求、认证需求、品牌定制范围和预期时间。站点照片或图纸也有助于项目匹配。`
        ),
      },
      {
        question: text("Is price the main selection factor?", "价格是最主要的选择因素吗？"),
        answer: text(
          `Price matters, but it should be compared after requirements are aligned. A lower price can become expensive if the charger misses certification, backend compatibility, thermal performance, or service requirements.`,
          `价格重要，但应在需求对齐后比较。如果设备缺少认证、后台兼容、散热表现或服务能力，低价最终可能更贵。`
        ),
      },
    ],
    yinglitechFit: text(
      `YINGLITECH is Shenzhen Yingli Technology Co., Ltd., an EV charger manufacturer in Shenzhen, Guangdong, China. The company supplies portable EV chargers, home wallboxes, commercial AC charging stations, DC fast chargers, and energy storage charging systems, with ODM/OEM cooperation for overseas brands, distributors, and charging operators. For ${titleEn}, buyers can start from the related products below and send a project inquiry with market, power, connector, certification, and platform requirements.`,
      `YINGLITECH为深圳市盈利科技有限公司，位于中国广东深圳，是电动汽车充电桩制造商。公司提供便携式充电器、家用壁挂桩、商用交流充电站、直流快充和储能充电系统，可为海外品牌、渠道商和充电运营商提供ODM/OEM合作。针对${titleZh}，采购方可从下方相关产品开始，并提交包含市场、功率、接口、认证和平台需求的项目询盘。`
    ),
  };
}
