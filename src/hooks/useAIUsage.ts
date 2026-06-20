import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AIUsage = {
  used: number;
  cap: number;
  plan: "free" | "pro" | "school";
  reset_at: string;
};

export function useAIUsage() {
  return useQuery<AIUsage>({
    queryKey: ["ai-usage"],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke("get-ai-usage", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (error) throw error;
      return data as AIUsage;
    },
    refetchInterval: 60_000,
  });
}
