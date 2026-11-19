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
/** 評価項目の説明（市の外部評価報告書「表3 令和7年度事務事業評価結果」の記載による） */
const CRITERIA: { item: string; meaning: string; options: string }[] = [
  {
    item: "必要性",
    meaning: "その事業について、市が関わる必要性",
    options: "非常に高い／高い／ある程度認められる",
  },
  {
    item: "目標達成度",
    meaning: "令和6年度の目標をどれだけ達成したか",
    options:
      "達成した（100％）／概ね達成した（80％以上）／達成できなかった（80％未満）",
  },
  {
    item: "実施内容・方法",
    meaning: "成果を上げたり費用を減らしたりするための見直しの余地",
    options: "余地が大きい／ある程度余地がある／余地がない",
  },
  {
    item: "公平性",
    meaning: "i. 受益者が一部に偏っていないか　ii. 受益者負担を見直す余地",
    options:
      "i. 偏りがある／やや偏りがある／偏りがない　ii. 余地がある／余地がない／受益者負担がない",
  },
  {
    item: "課題",
    meaning: "評価の時点で認識されている問題・課題",
    options: "課題はほとんどない／ある程度課題がある／大きな課題がある",
  },
  {
    item: "総合評価",
    meaning: "最終目標に対する進捗の状況",
    options: "順調／概ね順調／遅れ",
  },
  {
    item: "今後の方向性",
    meaning: "計画期間を通じての今後の方向",
    options:
      "現状のまま継続／見直して継続／他事業と統合して継続／休止・廃止／終了・完了",
  },
];

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
        <h2 className="text-lg font-bold mb-3">評価のしくみ</h2>
        <div className="rounded-lg border border-black bg-white p-4 text-sm leading-relaxed">
          <p className="mb-2 font-bold">市の評価は、どのように行われているか</p>
          <ul className="mb-4 list-disc pl-5 flex flex-col gap-1">
            <li>
              市の担当課が、自分たちの事業について評価シートに記入する「内部評価」です。事業の見直しや、職員の意識改革、市民への説明責任を果たすことなどを目的に行われています。
            </li>
            <li>
              下の表の区分（A・B・Cなど）は、各担当課がその基準に照らして判断した結果です。点数を合計して決めるような計算式は、市の資料では公開されていません。
            </li>
            <li>
              「目標達成度」は、区分の名前に達成割合の目安（100％／80％以上／80％未満）が付いています。
            </li>
            <li>
              374事業のうち、外部の委員会（八潮市外部評価委員会）が検証したのは、事務事業評価の4事業と、指定管理者の年次事業評価の2事業です。
            </li>
          </ul>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-xs">
              <thead>
                <tr className="border-b border-border text-left text-mirai-text-secondary">
                  <th className="px-2 py-2 font-medium">評価項目</th>
                  <th className="px-2 py-2 font-medium">何を評価するか</th>
                  <th className="px-2 py-2 font-medium">評価の区分</th>
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((c) => (
                  <tr
                    key={c.item}
                    className="border-b border-border/60 align-top"
                  >
                    <td className="px-2 py-2 font-medium whitespace-nowrap">
                      {c.item}
                    </td>
                    <td className="px-2 py-2">{c.meaning}</td>
                    <td className="px-2 py-2">{c.options}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 mb-2 font-bold">このページでの数字の扱い</p>
          <ul className="list-disc pl-5 flex flex-col gap-1">
            <li>
              市が公開している「事務事業評価
              一覧表」（PDF）を機械で読み取り、そのまま表示しています。このサイトで、独自に点数を付けたり、順位をつけたりはしていません。
            </li>
            <li>
              読み取った{rows.length}
              事業の件数は、市の「集計表」と「外部評価報告書」の集計と、全項目で一致することを確認しています。
            </li>
            <li>
              割合は、件数を{rows.length}
              で割って、小数点以下を四捨五入したものです（足し合わせても100％にならない場合があります）。
            </li>
            <li>
              総事業費は、一覧表の「総事業費」（事業費＋人件費）を、万円単位に四捨五入して表示しています。
            </li>
            <li>
              「公平性」など、このページに載せていない評価項目は、市の一覧表や評価調書でご覧いただけます。
            </li>
          </ul>
        </div>
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
