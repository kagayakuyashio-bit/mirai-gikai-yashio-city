import { ArrowRight, ChevronDown, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatSessionLabel } from "@/features/council-sessions/shared/utils/format-session-label";

type BannerSession = {
  slug: string | null;
  name: string;
  start_date: string;
};

type GeneralQuestionsBannerProps = {
  /** 一般質問が登録されている定例会（新しい順） */
  sessions: BannerSession[];
};

/** クリックすると、定例会ごとのリンクが開く「一般質問」の案内 */
export function GeneralQuestionsBanner({
  sessions,
}: GeneralQuestionsBannerProps) {
  const links = sessions.filter(
    (s): s is BannerSession & { slug: string } => !!s.slug
  );
  if (links.length === 0) return null;

  return (
    <details className="group bg-card border border-border rounded-lg">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-muted/40 rounded-lg [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-mirai-text">一般質問</p>
            <p className="mt-0.5 text-sm text-mirai-text-secondary">
              どの議員がどんなテーマを質問したかを一覧で見られます
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-mirai-text-muted shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mx-5 mb-2 flex flex-col divide-y divide-border border-t border-border">
        {links.map((session) => (
          <li key={session.slug}>
            <Link
              href={`/sessions/${session.slug}/questions`}
              className="flex items-center justify-between gap-4 py-3 text-sm font-bold text-mirai-text hover:text-primary transition-colors"
            >
              <span>{formatSessionLabel(session)}</span>
              <ArrowRight className="w-5 h-5 text-mirai-text-muted shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
