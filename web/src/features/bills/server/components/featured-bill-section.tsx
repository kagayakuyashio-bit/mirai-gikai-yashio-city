import Link from "next/link";
import { BillCard } from "../../client/components/bill-list/bill-card";
import type { BillWithContent } from "../../shared/types";

interface FeaturedBillSectionProps {
  bills: BillWithContent[];
  /** 定例会ID → 「2026年 令和8年第3回定例会」などの表記 */
  sessionLabels?: Record<string, string>;
  /** 表示中の議案がどの議会のものか（例: 「令和8年9月定例会」）。新しい順 */
  shownSessionNames?: string[];
}

export function FeaturedBillSection({
  bills,
  sessionLabels = {},
  shownSessionNames = [],
}: FeaturedBillSectionProps) {
  if (bills.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      {/* セクションヘッダー */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[22px] font-bold text-mirai-text leading-[1.48]">
          注目の議案🔥
        </h2>
        <p className="text-xs font-medium text-mirai-text-secondary leading-[1.67]">
          市議会に上程された注目議案
        </p>
        {shownSessionNames.length > 0 && (
          <p className="mt-1">
            <span className="inline-block rounded-full bg-mirai-highlight px-3 py-1 text-xs font-bold text-mirai-text">
              {shownSessionNames.join("・")}を表示中
            </span>
          </p>
        )}
      </div>

      {/* 注目の議案カード */}
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
  );
}
