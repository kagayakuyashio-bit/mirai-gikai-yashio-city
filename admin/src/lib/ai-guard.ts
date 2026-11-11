import { siteConfig } from "@/config/site.config";

export const AI_DISABLED_MESSAGE = "AI機能は無効になっています";

/** 外部AIを呼ぶ処理の入口で呼び、無効時は実行前に例外で止める */
export function assertAiEnabled(): void {
  if (!siteConfig.features.ai) {
    throw new Error(AI_DISABLED_MESSAGE);
  }
}
