import { committees, factions, tags } from "./data";
import { createAdminClient, clearAllData } from "../shared/helper";

/**
 * 開発用DBに「枠」だけを登録する。
 * 議案・定例会・インタビューなどのデータは登録しない。
 */
async function seedDatabase() {
  const supabase = createAdminClient();
  console.log("🌱 Starting database seeding...");

  try {
    await clearAllData(supabase);

    const { data: insertedTags, error: tagsError } = await supabase
      .from("tags")
      .insert(tags)
      .select("id");
    if (tagsError) {
      throw new Error(`Failed to insert tags: ${tagsError.message}`);
    }

    const { data: insertedCommittees, error: committeesError } = await supabase
      .from("committees")
      .insert(committees)
      .select("id");
    if (committeesError) {
      throw new Error(
        `Failed to insert committees: ${committeesError.message}`
      );
    }

    const { data: insertedFactions, error: factionsError } = await supabase
      .from("factions")
      .insert(factions)
      .select("id");
    if (factionsError) {
      throw new Error(`Failed to insert factions: ${factionsError.message}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log(`  Tags: ${insertedTags?.length ?? 0}`);
    console.log(`  Committees: ${insertedCommittees?.length ?? 0}`);
    console.log(`  Factions: ${insertedFactions?.length ?? 0}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
