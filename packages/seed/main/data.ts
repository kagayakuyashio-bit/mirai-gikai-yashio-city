import type { Database } from "@mirai-gikai/supabase";

type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type FactionInsert = Database["public"]["Tables"]["factions"]["Insert"];
type CommitteeInsert = Database["public"]["Tables"]["committees"]["Insert"];

// 議案・定例会・インタビュー等のデータは登録しない（管理画面から登録する）

// 会派データ（八潮市議会 令和7年9月28日時点）
export const factions: FactionInsert[] = [
  {
    name: "minsei",
    display_name: "民政クラブ",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "komei",
    display_name: "公明党",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "kyosan",
    display_name: "日本共産党",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "mirai-kaigi-840",
    display_name: "みらい会議840",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "mimosa",
    display_name: "ミモザの会",
    sort_order: 5,
    is_active: true,
  },
  {
    name: "yashio-fight",
    display_name: "やしおファイトの会",
    sort_order: 6,
    is_active: true,
  },
  {
    name: "rikken-yashio",
    display_name: "りっけん八潮の会",
    sort_order: 7,
    is_active: true,
  },
  {
    name: "mushozoku",
    display_name: "無所属",
    sort_order: 8,
    is_active: true,
  },
];

// 委員会データ（八潮市議会）
export const committees: CommitteeInsert[] = [
  {
    name: "総務文教常任委員会",
    description: "総務、文教に関する事項の審査",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "建設水道常任委員会",
    description: "建設、水道に関する事項の審査",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "健康福祉常任委員会",
    description: "健康、福祉に関する事項の審査",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "議会運営委員会",
    description: "議会の運営に関する事項の審査",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "公共施設整備等調査特別委員会",
    description: "公共施設の整備等に関する調査",
    sort_order: 5,
    is_active: true,
  },
];

// タグデータ
export const tags: TagInsert[] = [
  {
    label: "まちづくり・環境",
    description: "まちづくり、環境保護、都市計画に関する議案",
    featured_priority: 1,
  },
  {
    label: "子育て・教育",
    description: "子育て支援、教育政策、若者支援に関する議案",
    featured_priority: 2,
  },
  {
    label: "福祉・医療",
    description: "福祉、医療、高齢者支援に関する議案",
    featured_priority: 3,
  },
];
