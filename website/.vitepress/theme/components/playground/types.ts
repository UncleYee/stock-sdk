/**
 * Playground 共享类型定义
 *
 * 设计目标：每个 SDK 方法在自己的 spec 文件中既声明参数表单，也内联调度逻辑（run 函数），
 * 完全消除原 Playground.vue 中长达 400 行的 dispatcher switch。
 */

/**
 * 分类 key —— 决定方法在侧边栏归属于哪一组（按"数据类别"分）。
 *
 * 注意：v1.10.x playground UI 改版时把原 `extended` 大杂烩拆成了多个细分类。
 * 旧的 `extended` 仍保留，但只承载真正杂项（交易日历、单股资金流概览等 4 个）。
 */
export type CategoryKey =
  | 'quotes'
  | 'kline'
  | 'indicator'
  | 'fundFlow'
  | 'northbound'
  | 'marketEvent'
  | 'dragonTiger'
  | 'blockTradeMargin'
  | 'board'
  | 'fund'
  | 'futures'
  | 'options'
  | 'batch'
  | 'search'
  | 'extended';

/**
 * 市场 key —— 与"数据类别"正交的另一维标签，用于侧边栏的市场过滤芯片。
 *
 * - `a` / `hk` / `us`：A 股 / 港股 / 美股个股（含指数、ETF 等具体标的）
 * - `fund`：公募基金（开放式 / ETF / LOF）
 * - `futures`：期货（国内商品 / 股指 / 全球商品）
 * - `options`：期权（股指期权 / ETF 期权 / 商品期权）
 * - `board`：板块（行业 / 概念 / 地域）
 * - `all`：与具体市场无关的通用工具（如交易日历、search）。
 *   选任何一个具体市场芯片时，标 `all` 的方法依然会被显示，以免它们被过滤掉。
 */
export type MarketKey =
  | 'a'
  | 'hk'
  | 'us'
  | 'fund'
  | 'futures'
  | 'options'
  | 'board'
  | 'all';

export interface ParamSelectOption {
  value: string;
  label: string;
}

export interface ParamSpec {
  key: string;
  label: string;
  /**
   * - `'text'` / `'number'`：原生 input
   * - `'select'`：下拉，需配合 `options`
   * - `'date'`：原生 `<input type="date">`，值为 `YYYY-MM-DD`
   */
  type: 'text' | 'number' | 'select' | 'date';
  default: string;
  required?: boolean;
  placeholder?: string;
  /** 仅 type === 'select' 使用 */
  options?: ParamSelectOption[];
}

export interface RunContext {
  /**
   * 在请求执行过程中实时上报进度（仅批量接口需要），
   * 主组件订阅后会更新结果区的 loading 文案。
   */
  onProgress?: (message: string) => void;
}

export interface MethodSpec {
  /** 方法名（同 SDK 方法名，必须唯一） */
  name: string;
  /** 一行人话描述，显示在标题旁 */
  desc: string;
  category: CategoryKey;
  /**
   * 该方法面向哪些市场。允许多个（如 `getKlineWithIndicators` 跨 A/HK/US 三市）。
   * 用于侧边栏的市场过滤芯片：选 A 股芯片时，只显示数组含 `'a'` 或 `'all'` 的方法。
   *
   * 设计原则：
   * - 只标"调用这个接口实际查询的市场"，不要标"理论上能跑的市场"
   * - 通用工具（交易日历、search）用 `['all']`，永远会被显示
   * - 多市场方法显式列出（如 `['a', 'hk', 'us']`），不要用 `'all'` 偷懒
   */
  market: MarketKey[];
  /** 表单参数定义 */
  params: ParamSpec[];
  /**
   * 代码示例。
   * - 字符串：静态示例（适合需要展示完整结构、与具体参数关系不大的方法，如 `getKlineWithIndicators`）
   * - 函数：基于当前参数动态生成示例（推荐，复制即可运行）
   */
  code: string | ((params: Record<string, string>) => string);
  /**
   * 实际请求执行函数。原 dispatcher switch 的每个 case 都内联到这里，
   * 让 SDK 方法的"参数定义"和"调用方式"在同一处声明。
   */
  run: (
    sdk: any,
    params: Record<string, string>,
    ctx: RunContext
  ) => Promise<unknown>;
}

export interface CategorySpec {
  key: CategoryKey;
  label: string;
  /** Iconify 图标 ID（如 'lucide:bar-chart-3'） */
  icon: string;
  /** 分类强调色 */
  color: string;
}

/**
 * 市场过滤芯片定义（侧边栏顶部）。
 *
 * `key: null` 表示"不过滤"。其余 key 与 MethodSpec.market 数组做交集判断。
 */
export interface MarketChipSpec {
  /** `null` = 不过滤；其余为具体市场 */
  key: MarketKey | null;
  label: string;
  /** 短标签，窄屏下显示（如有） */
  shortLabel?: string;
}
