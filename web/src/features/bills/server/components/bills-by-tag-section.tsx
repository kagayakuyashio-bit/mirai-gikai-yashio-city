import Link from "next/link";
import { BillCard } from "../../client/components/bill-list/bill-card";
import type { BillsByTag } from "../../shared/types";

interface BillsByTagSectionProps {
  billsByTag: BillsByTag[];
  /** 定例会ID → 「2026年 令和8年第3回定例会」などの表記 */
  sessionLabels?: Record<string, string>;
}

export function BillsByTagSection({
  billsByTag,
  sessionLabels = {},
}: BillsByTagSectionProps) {
  if (billsByTag.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-12">
      {billsByTag.map(({ tag, bills }) => (
        <section key={tag.id} className="flex flex-col gap-6">
          {/* タグヘッダー */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[22px] font-bold text-black leading-[1.48]">
              {tag.label}
            </h2>
            {tag.description && (
              <p className="text-xs text-mirai-text-secondary">
                {tag.description}
              </p>
            )}
          </div>

          {/* 議案カード一覧 */}
          <div className="flex flex-col gap-4">
            {bills.map((bill) => (
              <Link key={bill.id} href={`/bills/${bill.id}`}>
                <BillCard
                  bill={bill}
                  sessionLabel={
                    bill.council_session_id
                      ? sessionLabels[bill.council_session_id]
                      : undefined
                  }
                />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
