/**
 * 千円単位の金額を、「44億3,539万3千円」のような読みやすい表記にする。
 * 例: 1129 → 112万9千円 / 4435393 → 44億3,539万3千円
 */
export function formatSenYen(thousandYen: number): string {
  const oku = Math.floor(thousandYen / 100000);
  const rest = thousandYen % 100000;
  const man = Math.floor(rest / 10);
  const sen = rest % 10;
  let out = "";
  if (oku > 0) out += `${oku.toLocaleString("ja-JP")}億`;
  if (man > 0) out += `${man.toLocaleString("ja-JP")}万`;
  if (sen > 0) out += `${sen}千`;
  return `${out || "0"}円`;
}

/** 円単位の金額を、万円単位まで丸めて表記する（1万円未満は円のまま） */
export function formatYenShort(yen: number): string {
  if (yen >= 100000000) {
    return `${(yen / 100000000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}億円`;
  }
  if (yen >= 10000) {
    return `${Math.round(yen / 10000).toLocaleString("ja-JP")}万円`;
  }
  return `${yen.toLocaleString("ja-JP")}円`;
}
