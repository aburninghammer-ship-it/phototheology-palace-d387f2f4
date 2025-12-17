import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, Clock, Award, CheckCircle, Play, 
  ChevronRight, Star, Users, BookOpen 
} from "lucide-react";
import { toast } from "sonner";

interface DiscipleshipPackagesProps {
  churchId: string;
}

const PACKAGE_TYPES = {
  seeker_to_disciple: { 
    label: "From Seeker to Disciple", 
    color: "bg-emerald-500",
    icon: BookOpen,
    description: "Foundation for new believers"
  },
  disciple_maker: { 
    label: "Disciples Who Make Disciples", 
    color: "bg-blue-500",
    icon: Users,
    description: "Learn to lead and multiply"
  },
  prophetic_identity: { 
    label: "Prophetic Identity & Mission", 
    color: "bg-purple-500",
    icon: Star,
    description: "Deep prophetic understanding"
  },
};

export function DiscipleshipPackages({ churchId }: DiscipleshipPackagesProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const { data: packages, isLoading } = useQuery({
    queryKey: ["discipleship-packages", churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discipleship_packages")
        .select("*")
        .eq("church_id", churchId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!churchId,
  });

  const { data: myProgress } = useQuery({
    queryKey: ["package-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("package_progress")
        .select("*, discipleship_packages(*)")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const enrollMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const { error } = await supabase.from("package_progress").insert({
        user_id: user?.id,
        package_id: packageId,
        current_week: 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package-progress"] });
      toast.success("Enrolled in discipleship package!");
    },
    onError: () => toast.error("Failed to enroll"),
  });

  const isEnrolled = (packageId: string) => 
    myProgress?.some((p) => p.package_id === packageId);

  const getProgress = (packageId: string) => 
    myProgress?.find((p) => p.package_id === packageId);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">12-Week Discipleship Packages</h2>
          <p className="text-muted-foreground">
            Intentional discipleship paths for commitment & leadership
          </p>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Packages</TabsTrigger>
          <TabsTrigger value="my-progress">My Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {packages?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No discipleship packages available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages?.map((pkg) => {
                const typeInfo = PACKAGE_TYPES[pkg.package_type as keyof typeof PACKAGE_TYPES] || PACKAGE_TYPES.seeker_to_disciple;
                const enrolled = isEnrolled(pkg.id);
                const progress = getProgress(pkg.id);
                const Icon = typeInfo.icon;
                const weekContent = pkg.week_content as any[];

                return (
                  <Card key={pkg.id} className="hover:shadow-lg transition-shadow flex flex-col">
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-lg ${typeInfo.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="w-fit mb-2">
                        {typeInfo.label}
                      </Badge>
                      <CardTitle className="text-lg">{pkg.title}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            12 Weeks
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {weekContent?.length || 12} Lessons
                          </span>
                        </div>

                        {pkg.completion_benefits && pkg.completion_benefits.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Completion unlocks:</p>
                            <div className="flex flex-wrap gap-1">
                              {pkg.completion_benefits.slice(0, 3).map((benefit, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {enrolled && progress ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Week {progress.current_week} of 12</span>
                            <span>{Math.round((progress.current_week / 12) * 100)}%</span>
                          </div>
                          <Progress value={(progress.current_week / 12) * 100} />
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedPackage(pkg.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => enrollMutation.mutate(pkg.id)}
                          disabled={enrollMutation.isPending}
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          Begin Journey
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-progress" className="space-y-4">
          {myProgress?.filter(p => !p.completed_at).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active discipleship journeys</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProgress?.filter(p => !p.completed_at).map((progress) => {
                const pkg = progress.discipleship_packages as any;
                if (!pkg) return null;
                const typeInfo = PACKAGE_TYPES[pkg.package_type as keyof typeof PACKAGE_TYPES] || PACKAGE_TYPES.seeker_to_disciple;

                return (
                  <Card key={progress.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${typeInfo.color}`} />
                        <div>
                          <h3 className="font-semibold">{pkg.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Week {progress.current_week} of 12
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(progress.current_week / 12) * 100} 
                          className="w-24"
                        />
                        <Button size="sm" onClick={() => setSelectedPackage(pkg.id)}>
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {myProgress?.filter(p => p.completed_at).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed packages yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myProgress?.filter(p => p.completed_at).map((progress) => {
                const pkg = progress.discipleship_packages as any;
                if (!pkg) return null;

                return (
                  <Card key={progress.id} className="border-green-500/20 bg-green-500/5">
                    <CardContent className="flex items-center gap-4 p-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-semibold">{pkg.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed {new Date(progress.completed_at!).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
