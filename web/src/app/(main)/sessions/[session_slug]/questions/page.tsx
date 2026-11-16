import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layouts/container";
import { getCouncilSessionBySlug } from "@/features/council-sessions/server/loaders/get-council-session-by-slug";
import { getGeneralQuestionsBySession } from "@/features/general-questions/server/loaders/get-general-questions-by-session";

interface SessionQuestionsRouteProps {
  params: Promise<{
    session_slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: SessionQuestionsRouteProps): Promise<Metadata> {
  const { session_slug } = await params;
  const session = await getCouncilSessionBySlug(session_slug);

  if (!session) {
    return { title: "会期が見つかりません" };
  }

  return {
    title: `${session.name} 一般質問`,
    description: `${session.name}の一般質問で、どの議員がどんなテーマを取り上げたかの一覧です。`,
  };
}

export default async function SessionQuestionsRoute({
  params,
}: SessionQuestionsRouteProps) {
  const { session_slug } = await params;
  const session = await getCouncilSessionBySlug(session_slug);

  if (!session) {
    notFound();
  }

  const questions = await getGeneralQuestionsBySession(session.id);
  const sourceUrl = questions.find((q) => q.source_url)?.source_url ?? null;

  // 質問の日（1日目、2日目…）ごとにまとめる
  const days = [...new Set(questions.map((q) => q.session_day))].sort(
    (a, b) => a - b
  );

  return (
    <Container className="py-10">
      <h1 className="text-2xl font-bold mb-2">{session.name} 一般質問</h1>
      <p className="text-sm leading-relaxed text-mirai-text-secondary mb-6">
        一般質問は、議員が市の仕事や考えをたずねる場です。ここでは、どの議員がどんなテーマを取り上げたかを一覧にしています。
        質問や答えの中身は、議事録が公開されてから追加する予定です。
      </p>

      {questions.length === 0 ? (
        <p className="py-8 text-center text-sm text-mirai-text-secondary">
          まだ一般質問の情報を登録していません。
        </p>
      ) : (
        days.map((day) => (
          <section key={day} className="mb-8">
            <h2 className="text-lg font-bold mb-3">{day}日目</h2>
            <ul className="flex flex-col gap-3">
              {questions
                .filter((q) => q.session_day === day)
                .sort((a, b) => a.question_order - b.question_order)
                .map((q) => (
                  <li
                    key={q.id}
                    className="rounded-lg border border-black bg-white px-4 py-3"
                  >
                    <p className="text-xs text-mirai-text-secondary">
                      {q.question_order}番目
                      {q.questioner_party && ` ／ ${q.questioner_party}`}
                    </p>
                    <p className="text-lg font-bold mb-2">
                      {q.questioner_name}
                    </p>
                    <ul className="list-disc pl-5 text-sm leading-relaxed">
                      {q.topics.map((t) => (
                        <li key={t.title}>{t.title}</li>
                      ))}
                    </ul>
                  </li>
                ))}
            </ul>
          </section>
        ))
      )}

      <p className="mt-8 text-xs leading-relaxed text-mirai-text-secondary">
        出典：
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            八潮市議会 一般質問通告者及び通告書一覧表（公式PDF）
          </a>
        ) : (
          "八潮市議会（公式サイト）"
        )}
        。質問の項目は公式の資料をもとに、文末を短くして載せています。詳しくは公式資料をご覧ください。
      </p>
      <p className="mt-4 text-sm">
        <Link href={`/sessions/${session.slug}/bills`} className="underline">
          この定例会の議案を見る
        </Link>
      </p>
    </Container>
  );
}
