import { Container } from "@/components/layouts/container";
import { About } from "@/components/top/about";
import { BudgetOverviewBox } from "@/components/top/budget-overview-box";
import { GeneralQuestionsBanner } from "@/components/top/general-questions-banner";
import { Hero } from "@/components/top/hero";
import { PastSessionsSection } from "@/components/top/past-sessions-section";
import { TeamMirai } from "@/components/top/team-mirai";
import { siteConfig } from "@/config/site.config";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import { BillDisclaimer } from "@/features/bills/client/components/bill-detail/bill-disclaimer";
import { BillsByTagSection } from "@/features/bills/server/components/bills-by-tag-section";
import { FeaturedBillSection } from "@/features/bills/server/components/featured-bill-section";
import { loadHomeData } from "@/features/bills/server/loaders/load-home-data";
import type { BillWithContent } from "@/features/bills/shared/types";
import { HomeChatClient } from "@/features/chat/client/components/home-chat-client";
import { CurrentCouncilSession } from "@/features/council-sessions/client/components/current-council-session";
import { getAllPastSessions } from "@/features/council-sessions/server/loaders/get-all-past-sessions";
import { getCurrentCouncilSession } from "@/features/council-sessions/server/loaders/get-current-council-session";
import {
  formatSessionLabel,
  formatSessionMonthLabel,
} from "@/features/council-sessions/shared/utils/format-session-label";
import { getGeneralQuestionsBySession } from "@/features/general-questions/server/loaders/get-general-questions-by-session";
import { getJapanTime } from "@/lib/utils/date";

export default async function Home() {
  const { billsByTag, featuredBills } = await loadHomeData();

  const [currentSession, currentDifficulty, pastSessions] = await Promise.all([
    getCurrentCouncilSession(getJapanTime()),
    getDifficultyLevel(),
    getAllPastSessions(),
  ]);

  // 一般質問が登録されている定例会（新しい順）を集める
  const sessionCandidates = [
    ...(currentSession ? [currentSession] : []),
    ...pastSessions.filter((s) => s.id !== currentSession?.id),
  ].sort((a, b) => b.start_date.localeCompare(a.start_date));
  // 議案カードに出す「2026年 令和8年第3回定例会」などの表記
  const sessionLabels = Object.fromEntries(
    sessionCandidates.map((s) => [s.id, formatSessionLabel(s)])
  );
  // 注目の議案が、どの議会のものか（新しい順・重複なし）
  const shownSessionNames = [
    ...new Set(
      sessionCandidates
        .filter((s) => featuredBills.some((b) => b.council_session_id === s.id))
        .map((s) => formatSessionMonthLabel(s))
    ),
  ];
  const sessionsWithQuestions = (
    await Promise.all(
      sessionCandidates.map(async (s) =>
        (await getGeneralQuestionsBySession(s.id)).length > 0 ? s : null
      )
    )
  ).filter((s) => s !== null);

  const toBillChatContext = (bill: BillWithContent) => {
    return {
      name: `${bill.bill_content?.title}（${bill.name}）`,
      summary: bill.bill_content?.summary,
      tags: bill.tags?.map((tag) => tag.label) || [],
      isFeatured: featuredBills.some((b) => b.id === bill.id),
    };
  };

  return (
    <>
      <Hero />

      {/* 本日の定例会セクション */}
      <CurrentCouncilSession session={currentSession} />

      {/* 議案一覧セクション */}
      <Container className="">
        <div className="py-10">
          <main className="flex flex-col gap-16">
            {/* 一般質問への入口 */}
            <div className="flex flex-col gap-3">
              <GeneralQuestionsBanner sessions={sessionsWithQuestions} />
              <BudgetOverviewBox />
            </div>

            {/* 注目の議案セクション */}
            <FeaturedBillSection
              bills={featuredBills}
              sessionLabels={sessionLabels}
              shownSessionNames={shownSessionNames}
            />

            {/* タグ別議案一覧セクション */}
            <BillsByTagSection
              billsByTag={billsByTag}
              sessionLabels={sessionLabels}
            />
          </main>
        </div>
      </Container>

      {/* Archive セクション（過去の定例会） */}
      <div className="bg-mirai-surface-muted py-10">
        <Container>
          <div className="flex flex-col gap-8">
            <PastSessionsSection sessions={pastSessions} />

            {/* 公式サイトへの案内 */}
            <p className="text-sm leading-relaxed">
              <a
                href="https://www.city.yashio.lg.jp/gikai/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2"
              >
                市議会に提出されたすべての議案等は、市議会のホームページへ
              </a>
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* みらい議会とは セクション */}
        <About />

        {/* チームみらいについて セクション */}
        <TeamMirai />

        {/* 免責事項 */}
        <BillDisclaimer />
      </Container>

      {/* チャット機能 */}
      {siteConfig.features.aiChat && (
        <HomeChatClient
          currentDifficulty={currentDifficulty}
          bills={billsByTag
            .flatMap((x) => x.bills)
            .concat(featuredBills)
            .map(toBillChatContext)}
        />
      )}
    </>
  );
}
