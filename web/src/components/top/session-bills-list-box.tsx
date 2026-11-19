import { ArrowRight, ChevronDown, FileText } from "lucide-react";
import Link from "next/link";
import type { BillWithContent } from "@/features/bills/shared/types";
import { formatSessionLabel } from "@/features/council-sessions/shared/utils/format-session-label";

type Props = {
  session: { slug: string | null; name: string; start_date: string };
  bills: BillWithContent[];
};

/** 議案番号の並び順（議案第○号 → 議第○号議案 → 請願第○号） */
function sortKey(b: BillWithContent): [number, number] {
  const num = Number((b.bill_number ?? "").replace(/\D/g, "")) || 0;
  const n = b.bill_number ?? "";
  const kind = n.startsWith("議案第") ? 0 : n.startsWith("議第") ? 1 : 2;
  return [kind, num];
}

/** クリックすると、その定例会の提出議案がすべて開く */
export function SessionBillsListBox({ session, bills }: Props) {
  if (bills.length === 0) return null;
  const sorted = [...bills].sort((a, b) => {
    const [ka, na] = sortKey(a);
    const [kb, nb] = sortKey(b);
    return ka - kb || na - nb;
  });

  return (
    <details className="group bg-card border border-border rounded-lg">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 hover:bg-muted/40 rounded-lg [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-mirai-text">
              {formatSessionLabel(session)}の提出議案一覧
            </p>
            <p className="mt-0.5 text-sm text-mirai-text-secondary">
              全{bills.length}件の議案を一覧で見られます
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-mirai-text-muted shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <ul className="mx-5 flex flex-col divide-y divide-border border-t border-border">
        {sorted.map((bill) => (
          <li key={bill.id}>
            <Link
              href={`/bills/${bill.id}`}
              className="flex items-center justify-between gap-4 py-3 text-mirai-text hover:text-primary transition-colors"
            >
              <span className="min-w-0">
                <span className="block text-xs text-mirai-text-secondary">
                  {bill.bill_number}
                  {bill.status_note ? `　｜　${bill.status_note}` : ""}
                </span>
                <span className="block text-sm font-bold leading-snug">
                  {bill.bill_content?.title ?? bill.name}
                </span>
              </span>
              <ArrowRight className="w-5 h-5 text-mirai-text-muted shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
      {session.slug && (
        <p className="mx-5 mb-3 mt-1 border-t border-border pt-3 text-sm">
          <Link
            href={`/sessions/${session.slug}/bills`}
            className="font-bold underline underline-offset-2"
          >
            この定例会の議案ページを開く
          </Link>
        </p>
      )}
    </details>
  );
}
