/** 「2026年 令和8年第2回定例会」のように、年つきの会期名を返す */
export function formatSessionLabel(session: {
  name: string;
  start_date: string;
}): string {
  const year = session.start_date.slice(0, 4);
  return `${year}年 ${session.name}`;
}

/**
 * 一般質問を行った日（公式の「会期及び日程表」より）。
 * キーは会期のslug、値は「何日目」→「月日（曜日）」。
 */
const QUESTION_DAY_DATES: Record<string, Record<number, string>> = {
  "r8-2": { 1: "6月15日（月）", 2: "6月16日（火）", 3: "6月17日（水）" },
  "r8-3": { 1: "9月15日（火）", 2: "9月16日（水）", 3: "9月17日（木）" },
};

/** 「1日目（6月15日（月））」のように、日付つきの表記を返す。日付が不明なら「1日目」 */
export function formatQuestionDay(
  sessionSlug: string | null | undefined,
  day: number
): string {
  const date = sessionSlug ? QUESTION_DAY_DATES[sessionSlug]?.[day] : undefined;
  return date ? `${day}日目　${date}` : `${day}日目`;
}

/**
 * 「令和8年9月定例会」のように、年月つきの短い会期名を返す。
 * 開始日の年月を使う（例: 2026-09-01 開始の定例会 → 令和8年9月定例会）。
 */
export function formatSessionMonthLabel(session: {
  name: string;
  start_date: string;
}): string {
  const [y, m] = session.start_date.split("-").map(Number);
  const kind = session.name.includes("臨時会") ? "臨時会" : "定例会";
  return `令和${y - 2018}年${m}月${kind}`;
}
