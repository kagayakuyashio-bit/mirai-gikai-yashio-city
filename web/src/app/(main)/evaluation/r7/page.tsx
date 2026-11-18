import Link from "next/link";
import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { formatYenShort } from "@/features/budget-overview/utils/format-amount";
import evaluationData from "@/features/jimu-jigyo/data/r7-evaluation.json";

export const metadata = {
  title: `令和7年度 事務事業評価 | ${siteConfig.councilName}`,
  description:
    "八潮市が令和6年度に実施した374の事務事業について、市が行った評価の結果を一覧で見られます。",
};

type Row = {
  no: number;
  dept: string;
  section: string;
  name: string;
  total: number;
  necessity: "A" | "B" | "C";
  achievement: "A" | "B" | "C";
  overall: 0 | 1 | 2 | 3;
  direction: string;
};

const rows = evaluationData as Row[];

const OFFICIAL = {
  page: "https://www.city.yashio.lg.jp/shisei/gyosei/hyokaseido/r7-zimuzigyohyoka.html",
  summary:
    "https://www.city.yashio.lg.jp/shisei/gyosei/hyokaseido/r7-zimuzigyohyoka.files/r7-summary.pdf",
  list: "https://www.city.yashio.lg.jp/shisei/gyosei/hyokaseido/r7-zimuzigyohyoka.files/r7-rist.pdf",
  external:
    "https://www.city.yashio.lg.jp/shisei/gyosei/hyokaseido/R7gaibuhyoka.html",
  policyEval:
    "https://www.city.yashio.lg.jp/shisei/gyosei/hyokaseido/r7sesakuhyoka.html",
};

const NECESSITY: Record<Row["necessity"], string> = {
  A: "非常に高い",
  B: "高い",
  C: "ある程度認められる",
};
const ACHIEVEMENT: Record<Row["achievement"], string> = {
  A: "達成した（100％）",
  B: "概ね達成した（80％以上）",
  C: "達成できなかった（80％未満）",
};
const OVERALL: Record<Row["overall"], string> = {
  3: "☆☆☆ 順調",
  2: "☆☆ 概ね順調",
  1: "☆ 遅れ",
  0: "対象外",
};
const DIRECTIONS = [
  "現状のまま継続",
  "見直して継続",
  "他事業と統合して継続",
  "休止・廃止",
  "終了・完了",
];

function countBy<T extends string | number>(pick: (r: Row) => T) {
  const map = new Map<T, number>();
  for (const r of rows) map.set(pick(r), (map.get(pick(r)) ?? 0) + 1);
  return map;
}

function SummaryTable({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      <table className="w-full text-sm">
        <tbody>
          {items.map((it) => (
            <tr key={it.label} className="border-t border-border">
              <td className="py-1.5 pr-2">{it.label}</td>
              <td className="py-1.5 text-right tabular-nums">{it.count}件</td>
              <td className="w-14 py-1.5 text-right tabular-nums text-mirai-text-secondary">
                {Math.round((it.count / rows.length) * 100)}％
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EvaluationR7Page() {
  const necessity = countBy((r) => r.necessity);
  const achievement = countBy((r) => r.achievement);
  const overall = countBy((r) => r.overall);
  const direction = countBy((r) => r.direction);

  const depts: string[] = [];
  for (const r of rows) if (!depts.includes(r.dept)) depts.push(r.dept);
  const byDept = depts
    .map((d) => ({ dept: d, list: rows.filter((r) => r.dept === d) }))
    .sort((a, b) => b.list.length - a.list.length);

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-2">令和7年度 事務事業評価</h1>
      <p className="text-sm leading-relaxed text-mirai-text-secondary mb-6">
        八潮市が令和6年度に実施した{rows.length}
        の事務事業について、市が自分たちで行った評価の結果です。市が公開している一覧表の数字を、そのまま整理しています。この評価は市の内部評価であり、このサイト独自の採点や分析ではありません。
      </p>

      <section className="mb-8 grid gap-3 md:grid-cols-2">
        <SummaryTable
          title="必要性の評価"
          items={(["A", "B", "C"] as const).map((k) => ({
            label: `${k}：${NECESSITY[k]}`,
            count: necessity.get(k) ?? 0,
          }))}
        />
        <SummaryTable
          title="目標の達成度"
          items={(["A", "B", "C"] as const).map((k) => ({
            label: `${k}：${ACHIEVEMENT[k]}`,
            count: achievement.get(k) ?? 0,
          }))}
        />
        <SummaryTable
          title="計画期間を通じての総合評価"
          items={([3, 2, 1, 0] as const).map((k) => ({
            label: OVERALL[k],
            count: overall.get(k) ?? 0,
          }))}
        />
        <SummaryTable
          title="今後の方向性"
          items={DIRECTIONS.map((k) => ({
            label: k,
            count: direction.get(k) ?? 0,
          }))}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">担当部ごとの事業一覧</h2>
        <p className="mb-3 text-xs leading-relaxed text-mirai-text-secondary">
          総事業費は、事業費に人件費を加えた額です。各事業の詳しい評価は、市の「事務事業評価調書」（公式）をご覧ください。
        </p>
        <div className="flex flex-col gap-3">
          {byDept.map(({ dept, list }) => (
            <details
              key={dept}
              className="rounded-lg border border-black bg-white"
            >
              <summary className="cursor-pointer px-4 py-3 font-bold">
                {dept}（{list.length}事業）
              </summary>
              <div className="overflow-x-auto px-2 pb-3">
                <table className="w-full min-w-[640px] text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-mirai-text-secondary">
                      <th className="px-2 py-2 font-medium">事業名</th>
                      <th className="px-2 py-2 font-medium text-right">
                        総事業費
                      </th>
                      <th className="px-2 py-2 font-medium">必要性</th>
                      <th className="px-2 py-2 font-medium">達成度</th>
                      <th className="px-2 py-2 font-medium">総合評価</th>
                      <th className="px-2 py-2 font-medium">今後の方向性</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.no} className="border-b border-border/60">
                        <td className="px-2 py-2">
                          <div className="font-medium">{r.name}</div>
                          <div className="text-mirai-text-secondary">
                            {r.section}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums">
                          {formatYenShort(r.total)}
                        </td>
                        <td className="px-2 py-2">{r.necessity}</td>
                        <td className="px-2 py-2">{r.achievement}</td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          {OVERALL[r.overall]}
                        </td>
                        <td className="px-2 py-2">{r.direction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ))}
        </div>
        <p className="mt-3 text-xs text-mirai-text-secondary">
          必要性・達成度のA〜Cは、上の「必要性の評価」「目標の達成度」の区分に対応します。
        </p>
      </section>

      <section className="text-sm leading-relaxed">
        <h2 className="text-lg font-bold mb-3">出典（八潮市の公式サイト）</h2>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>
            <a
              href={OFFICIAL.page}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和7年度八潮市事務事業評価（評価調書など）
            </a>
          </li>
          <li>
            <a
              href={OFFICIAL.summary}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              事務事業評価 集計表（PDF）
            </a>
          </li>
          <li>
            <a
              href={OFFICIAL.list}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              事務事業評価 一覧表（PDF）
            </a>
          </li>
          <li>
            <a
              href={OFFICIAL.external}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和7年度八潮市外部評価報告書（外部の委員会による検証）
            </a>
          </li>
          <li>
            <a
              href={OFFICIAL.policyEval}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              令和7年度八潮市施策評価
            </a>
          </li>
        </ul>
        <p className="mt-4 text-xs text-mirai-text-secondary">
          このページは、公開されている資料をもとに整理したものです。正確な内容は、必ず公式サイトでご確認ください。
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
