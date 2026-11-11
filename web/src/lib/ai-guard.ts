import { siteConfig } from "@/config/site.config";

/** 外部AIを呼ぶ処理の入口で呼び、無効時は実行前に例外で止める */
export function assertAiChatEnabled(): void {
  if (!siteConfig.features.aiChat) {
    throw new Error("AIチャット機能は無効になっています");
  }
}

export function assertAiInterviewEnabled(): void {
  if (!siteConfig.features.aiInterview) {
    throw new Error("AIインタビュー機能は無効になっています");
  }
}
