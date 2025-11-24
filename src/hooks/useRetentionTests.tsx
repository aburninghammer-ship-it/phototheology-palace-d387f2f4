import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useRetentionTests = (roomId: string, floorNumber: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Placeholder until types regenerate after migration
  const { data: tests, isLoading } = useQuery({
    queryKey: ["retention-tests", roomId, floorNumber],
    queryFn: async () => {
      // Will work once mastery_retention_tests table types are available
      return [];
    },
  });

  const completeTest = useMutation({
    mutationFn: async ({ testType, score }: { testType: string; score: number }) => {
      const passed = score >= 80;
      // Will work once table types regenerate
      return { passed, allPassed: false };
    },
    onSuccess: ({ passed, allPassed }) => {
      queryClient.invalidateQueries({ queryKey: ["retention-tests", roomId, floorNumber] });
      queryClient.invalidateQueries({ queryKey: ["room-mastery", roomId, floorNumber] });

      if (allPassed) {
        toast({
          title: "🏆 TRUE MASTER ACHIEVED!",
          description: "You've proven long-term retention and understanding. Congratulations!",
          duration: 6000,
        });
      } else if (passed) {
        toast({
          title: "✅ Retention Test Passed!",
          description: "Your knowledge has proven durable over time.",
        });
      } else {
        toast({
          title: "Review Needed",
          description: "Score below 80%. Keep practicing and try again later.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Retention test error:", error);
      toast({
        title: "Test Error",
        description: "Failed to record test results. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    tests,
    isLoading,
    completeTest: completeTest.mutate,
    isCompleting: completeTest.isPending,
  };
};
