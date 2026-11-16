import { Container } from "@/components/layouts/container";
import { siteConfig } from "@/config/site.config";
import { getCouncilMembers } from "@/features/council-members/server/get-council-members";

export const metadata = {
  title: `議員名簿 | ${siteConfig.councilName}`,
  description: `${siteConfig.councilName}の議員の氏名・当選回数・会派の一覧です。`,
};

const OFFICIAL_URL = "https://www.city.yashio.lg.jp/gikai/giinmeibo.html";

export default async function MembersPage() {
  const members = await getCouncilMembers();

  // 会派ごとの人数（名簿の並び順で最初に出てきた順）
  const factionCounts = new Map<string, number>();
  for (const m of members) {
    const key = m.factionName ?? "会派なし";
    factionCounts.set(key, (factionCounts.get(key) ?? 0) + 1);
  }

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-2">議員名簿</h1>
      <p className="text-sm leading-relaxed text-mirai-text-secondary mb-6">
        {siteConfig.councilName}
        の議員の一覧です（議席番号順）。氏名・当選回数・会派だけを載せています。
        {members[0]?.termStart && members[0]?.termEnd && (
          <>
            {" "}
            任期は{formatJapaneseDate(members[0].termStart)}から
            {formatJapaneseDate(members[0].termEnd)}までです。
          </>
        )}
      </p>

      {members.length === 0 ? (
        <p className="py-8 text-center text-sm text-mirai-text-secondary">
          まだ議員の情報を登録していません。
        </p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">会派ごとの人数</h2>
            <ul className="flex flex-wrap gap-2">
              {[...factionCounts.entries()].map(([name, count]) => (
                <li
                  key={name}
                  className="rounded-full border border-black px-3 py-1 text-sm"
                >
                  {name} {count}人
                </li>
              ))}
            </ul>
          </section>

          <ul className="flex flex-col gap-3">
            {members.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-black bg-white px-4 py-3"
              >
                <p className="text-xs text-mirai-text-secondary">
                  議席 {m.seatNumber}番
                </p>
                <p className="text-lg font-bold">{m.name}</p>
                <p className="text-sm">
                  {m.factionName ?? "会派なし"}
                  {m.termsCount != null && ` ／ 当選${m.termsCount}回`}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-8 text-xs leading-relaxed text-mirai-text-secondary">
        出典：
        <a
          href={OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          八潮市議会 議員名簿（公式サイト）
        </a>
        （2026年11月4日更新分を確認）。最新の名簿は公式サイトをご覧ください。住所・連絡先は掲載していません。
      </p>
    </Container>
  );
}

/** "2025-09-28" → "令和7年9月28日" */
function formatJapaneseDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const reiwa = y - 2018;
  return `令和${reiwa}年${m}月${d}日`;
}
