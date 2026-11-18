import { ArrowRight, ChevronDown, ExternalLink, Wallet } from "lucide-react";
import Link from "next/link";

const TAX_MAP_URL =
  "https://tax.inshatancountry.com/local-tax/?pref=11&entity=112348";

const itemClass =
  "flex items-center justify-between gap-4 py-3 text-mirai-text hover:text-primary transition-colors";

/** クリックすると3つのリンクが開く「八潮市の予算・評価・お金の使い道」の案内 */
export function BudgetOverviewBox() {
  return (
    <details className="group bg-card border border-border rounded-lg">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-muted/40 rounded-lg [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          <Wallet className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-mirai-text">
              八潮市の予算・評価・お金の使い道
            </p>
            <p className="mt-0.5 text-sm text-mirai-text-secondary">
              重点施策、事務事業評価、お金の使い道をまとめて見る
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-mirai-text-muted shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mx-5 mb-2 flex flex-col divide-y divide-border border-t border-border">
        <li>
          <Link href="/budget/r8" className={itemClass}>
            <span>
              <span className="block text-sm font-bold">
                令和8年度の重点施策
              </span>
              <span className="block text-xs text-mirai-text-secondary">
                予算の方向性と主要施策をわかりやすく解説します
              </span>
            </span>
            <ArrowRight className="w-5 h-5 text-mirai-text-muted shrink-0" />
          </Link>
        </li>
        <li>
          <Link href="/evaluation/r7" className={itemClass}>
            <span>
              <span className="block text-sm font-bold">事務事業評価</span>
              <span className="block text-xs text-mirai-text-secondary">
                市が行った374事業の評価結果（必要性・達成度・総合評価など）を見られます
              </span>
            </span>
            <ArrowRight className="w-5 h-5 text-mirai-text-muted shrink-0" />
          </Link>
        </li>
        <li>
          <a
            href={TAX_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={itemClass}
          >
            <span>
              <span className="block text-sm font-bold">
                八潮市のお金の使い道（外部サイト）
              </span>
              <span className="block text-xs text-mirai-text-secondary">
                「税金の使い道マップ」で、市の収入と支出をわかりやすく見ることができます（民間の外部サイトです）
              </span>
            </span>
            <ExternalLink className="w-5 h-5 text-mirai-text-muted shrink-0" />
          </a>
        </li>
      </ul>
    </details>
  );
}
