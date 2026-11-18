import type { CouncilSession } from "../../shared/types";
import { getActiveCouncilSession } from "./get-active-council-session";
import { getAllPastSessions } from "./get-all-past-sessions";

/**
 * トップページの「注目の議案」「分野別の議案」に表示する定例会を返す。
 * 開会中の定例会があればそれ、なければ直近の（最も新しい）定例会。
 */
export async function getHomeDisplaySession(): Promise<CouncilSession | null> {
  const active = await getActiveCouncilSession();
  if (active) return active;
  const past = await getAllPastSessions();
  return past[0] ?? null;
}
