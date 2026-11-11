/**
 * サイト設定ファイル（Admin）
 * Fork して別の地方議会向けに使用する場合はこのファイルを変更してください。
 */
export const siteConfig = {
  siteName: "みらい議会ー八潮市版",
  cityName: "八潮市",
  councilName: "八潮市議会",
  councilBaseUrl: "https://www.city.yashio.lg.jp/gikai/index.html",
  councilBillsDetailUrl: "https://www.city.yashio.lg.jp/gikai/jokyo/index.html",
  councilFactionExamples:
    "八潮市議会の会派名（例：自由民主党、公明党 等。実際の会派名に要更新）",
  /**
   * 外部AI（Claude CLI・AI Gateway）を使う機能の有効/無効。
   * false の間は、画面を隠すだけでなくサーバー側でも実行を拒否する。
   */
  features: {
    ai: false,
  },
} as const;
