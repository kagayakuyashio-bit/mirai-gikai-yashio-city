import "server-only";
import { createAdminClient } from "@mirai-gikai/supabase";

export type CouncilMember = {
  id: string;
  name: string;
  seatNumber: number;
  termsCount: number | null;
  factionName: string | null;
  termStart: string | null;
  termEnd: string | null;
  sourceUrl: string | null;
};

/** 議員名簿を議席番号順に取得する */
export async function getCouncilMembers(): Promise<CouncilMember[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("council_members")
    .select(
      "id, name, seat_number, terms_count, term_start, term_end, source_url, factions(display_name)"
    )
    .order("seat_number", { ascending: true });

  if (error) {
    console.error("Failed to fetch council members:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    seatNumber: row.seat_number,
    termsCount: row.terms_count,
    factionName: row.factions?.display_name ?? null,
    termStart: row.term_start,
    termEnd: row.term_end,
    sourceUrl: row.source_url,
  }));
}
