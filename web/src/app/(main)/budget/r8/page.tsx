import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import {
  R8_BUDGET_TOTALS,
  R8_DIRECTION,
  R8_EXPENSE,
  R8_GROUPS,
  R8_REVENUE,
  R8_SOURCES,
} from "@/features/budget-overview/data/r8-priorities";
import { formatSenYen } from "@/features/budget-overview/utils/format-amount";

export const metadata = {
  title: `令和8年度の重点施策 | ${siteConfig.councilName}`,
  description:
    "八潮市の令和8年度当初予算の方向性と、主な事業を、公式資料をもとにわかりやすく整理しました。",
};

function yoy(a: number, b: number) {
  const diff = a - b;
  const pct = (diff / b) * 100;
  const sign = diff >= 0 ? "＋" : "△";
  return `${sign}${formatSenYen(Math.abs(diff))}（${sign}${Math.abs(pct).toFixed(1)}％）`;
}

export default function BudgetR8Page() {
  const t = R8_BUDGET_TOTALS;
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-2">令和8年度の重点施策</h1>
      <p className="text-sm leading-relaxed text-mirai-text-secondary mb-6">
        八潮市の令和8年度（2026年度）の当初予算について、予算の方向性と主な事業を、市が公開している資料をもとに整理しました。金額は、特にことわりがなければ令和8年度の当初予算額です。
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">予算の方向性</h2>
        <ul className="flex flex-col gap-3 text-sm leading-relaxed">
          {R8_DIRECTION.map((d) => (
            <li key={d} className="rounded-lg border border-black bg-white p-4">
              {d}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">予算の大きさ</h2>
        <div className="overflow-x-auto rounded-lg border border-black bg-white">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-mirai-text-secondary">
                <th className="px-3 py-2 font-medium">会計</th>
                <th className="px-3 py-2 font-medium text-right">令和8年度</th>
                <th className="px-3 py-2 font-medium text-right">
                  令和7年度からの増減
                </th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  ["一般会計", t.general],
                  ["特別会計（国民健康保険・介護保険など）", t.special],
                  ["企業会計（上水道・公共下水道）", t.enterprise],
                  ["合計", t.total],
                ] as const
              ).map(([label, v]) => (
                <tr key={label} className="border-b border-border/60">
                  <td className="px-3 py-2 font-medium">{label}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatSenYen(v.y8)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {yoy(v.y8, v.y7)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-black bg-white p-4">
          <h3 className="mb-2 text-sm font-bold">
            一般会計の収入（歳入）の主なもの
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {R8_REVENUE.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <td className="py-1.5 pr-2">{r.label}</td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatSenYen(r.k)}
                  </td>
                  <td className="w-14 py-1.5 text-right tabular-nums text-mirai-text-secondary">
                    {r.pct}％
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-lg border border-black bg-white p-4">
          <h3 className="mb-2 text-sm font-bold">
            一般会計の支出（歳出・目的別）の主なもの
          </h3>
          <table className="w-full text-sm">
            <tbody>
              {R8_EXPENSE.map((r) => (
                <tr key={r.label} className="border-t border-border">
                  <td className="py-1.5 pr-2">
                    {r.label}
                    <span className="block text-xs text-mirai-text-secondary">
                      前年度比 {r.yoy}％
                    </span>
                  </td>
                  <td className="py-1.5 text-right tabular-nums">
                    {formatSenYen(r.k)}
                  </td>
                  <td className="w-14 py-1.5 text-right tabular-nums text-mirai-text-secondary">
                    {r.pct}％
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-1">主な事業</h2>
        <p className="mb-4 text-xs leading-relaxed text-mirai-text-secondary">
          市の「令和8年度当初予算の概要」と「目玉事業」の資料に載っている事業を、分野ごとに並べました。
          <span className="ml-1 inline-block rounded-full bg-mirai-highlight px-2 py-0.5 text-[11px] font-medium text-mirai-text">
            新規
          </span>
          は新しく始まる事業です。
        </p>
        <div className="flex flex-col gap-8">
          {R8_GROUPS.map((g) => (
            <div key={g.heading}>
              <h3 className="mb-3 border-b border-black pb-2 text-base font-bold">
                {g.heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {g.items.map((it) => (
                  <li
                    key={it.title}
                    className="rounded-lg border border-black bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                      <p className="font-bold leading-snug">
                        {it.isNew && (
                          <span className="mr-2 inline-block rounded-full bg-mirai-highlight px-2 py-0.5 text-[11px] font-medium text-mirai-text">
                            新規
                          </span>
                        )}
                        {it.title}
                      </p>
                      <p className="shrink-0 text-sm font-bold tabular-nums">
                        {formatSenYen(it.amountK)}
                      </p>
                    </div>
                    {it.amountNote && (
                      <p className="mt-0.5 text-xs text-mirai-text-secondary">
                        ※{it.amountNote}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed">{it.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="text-sm leading-relaxed">
        <h2 className="text-lg font-bold mb-3">出典（八潮市の公式サイト）</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <a
              href={R8_SOURCES.overviewPage}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和8年度当初予算の概要（ページ）
            </a>
          </li>
          <li>
            <a
              href={R8_SOURCES.overviewPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和8年度当初予算の概要（PDF）
            </a>
          </li>
          <li>
            <a
              href={R8_SOURCES.medamaPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和8年度当初予算の概要 目玉事業（PDF）
            </a>
          </li>
          <li>
            <a
              href={R8_SOURCES.policySpeech}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              施政方針
            </a>
          </li>
        </ul>
        <p className="mt-4 text-xs text-mirai-text-secondary">
          このページの説明は、公式の資料をもとにAIを活用して整理したものです。金額や内容の正確な情報は、必ず公式サイトでご確認ください。当初予算は、その後の補正予算で変わることがあります。
        </p>
        <p className="mt-4">
          <Link href="/" className="underline">
            トップページへ戻る
          </Link>
        </p>
      </section>
    </Container>
  );
}
