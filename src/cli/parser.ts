/**
 * 零依赖 argv 解析（cli.md §9）。
 *
 * 支持：
 * - `--key value` / `--key=value`
 * - `--flag`（布尔，需在 `booleanFlags` 集合中，否则会贪婪吃下一个 token 作 value）
 * - `-f value` / `-f`（短 flag，产出原始短名，由调用方映射成长名）
 * - `--`（终止 flag 解析，其后全部当位置参数）
 * - 重复 flag 收集成字符串数组
 */
import type { ParsedArgv } from './types';

/**
 * @param argv 去掉 `node` 与脚本路径后的参数（即 `process.argv.slice(2)`）
 * @param booleanFlags 已知的布尔 flag 名集合（含长名与短名），这些 flag 不吞掉下一个 token
 */
export function parseArgv(
  argv: readonly string[],
  booleanFlags: ReadonlySet<string> = new Set()
): ParsedArgv {
  const positional: string[] = [];
  const options: Record<string, string | boolean | string[]> = {};
  let stopFlags = false;

  const setOption = (key: string, value: string | boolean): void => {
    const existing = options[key];
    if (existing === undefined) {
      options[key] = value;
      return;
    }
    // 重复 flag：仅当新旧都是字符串时合并成数组，否则后者覆盖
    if (typeof value !== 'string') {
      options[key] = value;
      return;
    }
    if (Array.isArray(existing)) {
      existing.push(value);
    } else if (typeof existing === 'string') {
      options[key] = [existing, value];
    } else {
      options[key] = value;
    }
  };

  const isValueLike = (token: string | undefined): boolean =>
    token !== undefined && (token === '-' || !token.startsWith('-'));

  const consume = (key: string, i: number): number => {
    if (booleanFlags.has(key)) {
      setOption(key, true);
      return i;
    }
    const next = argv[i + 1];
    if (isValueLike(next)) {
      setOption(key, next as string);
      return i + 1;
    }
    setOption(key, true);
    return i;
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (stopFlags) {
      positional.push(token);
      continue;
    }
    if (token === '--') {
      stopFlags = true;
      continue;
    }

    if (token.startsWith('--') && token.length > 2) {
      const body = token.slice(2);
      const eq = body.indexOf('=');
      if (eq >= 0) {
        setOption(body.slice(0, eq), body.slice(eq + 1));
      } else {
        i = consume(body, i);
      }
    } else if (token.startsWith('-') && token.length > 1 && !isNumericToken(token)) {
      const body = token.slice(1);
      const eq = body.indexOf('=');
      if (eq >= 0) {
        setOption(body.slice(0, eq), body.slice(eq + 1));
      } else {
        i = consume(body, i);
      }
    } else {
      positional.push(token);
    }
  }

  return { positional, options };
}

/** `-5` / `-3.14` 这类负数 token 视为位置参数，而非短 flag。 */
function isNumericToken(token: string): boolean {
  return /^-\d/.test(token);
}
