import { supabase } from "@/lib/supabase";

export async function getSettings() {
  const { data } = await supabase
    .from("Settings")
    .select("*");

  if (!data) return {};

  return data.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}