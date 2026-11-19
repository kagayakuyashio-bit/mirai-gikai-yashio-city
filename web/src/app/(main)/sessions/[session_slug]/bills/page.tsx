import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { GeneralQuestionsBanner } from "@/components/top/general-questions-banner";
import { getDifficultyLevel } from "@/features/bill-difficulty/server/loaders/get-difficulty-level";
import { SessionBillsPage } from "@/features/bills/server/components/session-bills-page";
import { getSessionBills } from "@/features/bills/server/loaders/get-session-bills";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";
import { getGeneralQuestionsBySession } from "@/features/general-questions/server/loaders/get-general-questions-by-session";

interface SessionBillsRouteProps {
  params: Promise<{
    session_slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: SessionBillsRouteProps): Promise<Metadata> {
  const { session_slug } = await params;
  const session = await getCouncilSessionBySlug(session_slug);

  if (!session) {
    return { title: "会期が見つかりません" };
  }

  return {
    title: `${session.name} 議案一覧`,
    description: `${session.name}に上程された議案の一覧です。`,
  };
}

export default async function SessionBillsRoute({
  params,
}: SessionBillsRouteProps) {
  const { session_slug } = await params;

  const [session, difficultyLevel] = await Promise.all([
    getCouncilSessionBySlug(session_slug),
    getDifficultyLevel(),
  ]);

  if (!session) {
    notFound();
  }

  const bills = await getSessionBills(session.id, difficultyLevel);
  // 一般質問が登録されている会期だけ、案内を出す
  const hasQuestions =
    (await getGeneralQuestionsBySession(session.id)).length > 0;

  return (
    <Container className="py-10">
      {hasQuestions && (
        <div className="mb-6">
          <GeneralQuestionsBanner sessions={[session]} />
        </div>
      )}
      <SessionBillsPage session={session} bills={bills} />
    </Container>
  );
}
