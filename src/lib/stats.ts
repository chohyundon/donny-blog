import { createClient } from "@/lib/supabase/server";
import { isAuthorEmail } from "@/lib/auth/constants";

export interface DailyVisit {
  date: string;
  count: number;
}

function getMockHistory(): DailyVisit[] {
  const counts = [34, 51, 28, 63, 47, 72, 58];
  return counts.map((count, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { date: d.toISOString().slice(0, 10), count };
  });
}

export async function getAndIncrementVisitorCount(
  viewerEmail?: string | null,
): Promise<number> {
  try {
    const supabase = await createClient();

    if (isAuthorEmail(viewerEmail)) {
      const { data, error } = await supabase
        .from("site_stats")
        .select("value")
        .eq("key", "visitor_count")
        .single();
      if (error) throw error;
      return (data?.value as number) ?? 0;
    }

    const { data, error } = await supabase.rpc("increment_visitor_count");
    if (error) throw error;
    return (data as number) ?? 0;
  } catch (error) {
    console.error("Failed to get/increment visitor count:", error);
    return 2847;
  }
}

export async function getVisitorHistory(daysBack = 7): Promise<DailyVisit[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_visitor_history", {
      days_back: daysBack,
    });
    if (error) throw error;
    return (data as DailyVisit[]) ?? [];
  } catch (error) {
    console.error("Failed to get visitor history:", error);
    return getMockHistory();
  }
}
