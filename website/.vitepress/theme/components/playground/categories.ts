import type { CategorySpec, MarketChipSpec } from './types';

/**
 * Playground 侧边栏分类定义。
 * 顺序即侧边栏展示顺序。
 *
 * v1.10.x 改版：把原本一桶 27 个方法的 `extended` 拆成 5 个细分类
 * （fundFlow / northbound / marketEvent / dragonTiger / blockTradeMargin），
 * 剩下的 `extended` 只承载真正杂项（交易日历、单股资金流概览 4 个）。
 */
export const categories: CategorySpec[] = [
  // 行情 & K 线 & 指标
  { key: 'quotes', label: '实时行情', icon: 'lucide:bar-chart-3', color: '#3b82f6' },
  { key: 'kline', label: 'K 线数据', icon: 'lucide:line-chart', color: '#22c55e' },
  { key: 'indicator', label: '技术指标', icon: 'lucide:trending-up', color: '#f59e0b' },

  // 资金 & 异动 & 龙虎榜（A 股深度数据）
  { key: 'fundFlow', label: '资金流向', icon: 'lucide:wallet', color: '#14b8a6' },
  { key: 'northbound', label: '沪深港通', icon: 'lucide:arrow-left-right', color: '#6366f1' },
  { key: 'marketEvent', label: '涨停异动', icon: 'lucide:siren', color: '#f43f5e' },
  { key: 'dragonTiger', label: '龙虎榜', icon: 'lucide:trophy', color: '#facc15' },
  { key: 'blockTradeMargin', label: '大宗融资', icon: 'lucide:package', color: '#84cc16' },

  // 跨市场数据类别
  { key: 'board', label: '板块数据', icon: 'lucide:layout-grid', color: '#06b6d4' },
  { key: 'fund', label: '公募基金', icon: 'lucide:landmark', color: '#0ea5e9' },
  { key: 'futures', label: '期货行情', icon: 'lucide:flame', color: '#f97316' },
  { key: 'options', label: '期权数据', icon: 'lucide:target', color: '#d946ef' },

  // 工具类
  { key: 'batch', label: '批量查询', icon: 'lucide:layers', color: '#8b5cf6' },
  { key: 'search', label: '搜索', icon: 'lucide:search', color: '#ec4899' },
  { key: 'extended', label: '其它工具', icon: 'lucide:wrench', color: '#ef4444' },
];

/**
 * 市场过滤芯片（侧边栏顶部，搜索框下方）。
 * 顺序：先"全部"，再按使用频率排（A 股优先），最后是"通用"兜底。
 */
export const marketChips: MarketChipSpec[] = [
  { key: null, label: '全部' },
  { key: 'a', label: 'A 股' },
  { key: 'hk', label: '港股' },
  { key: 'us', label: '美股' },
  { key: 'fund', label: '基金' },
  { key: 'futures', label: '期货' },
  { key: 'options', label: '期权' },
  { key: 'board', label: '板块' },
  { key: 'all', label: '通用' },
];
