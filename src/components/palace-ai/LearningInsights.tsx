import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle, Target, Clock, Lightbulb } from "lucide-react";
import { LearningProfile } from "@/hooks/usePalaceAI";

interface LearningInsightsProps {
  profile: LearningProfile & { last_analysis_at: string };
}

export const LearningInsights = ({ profile }: LearningInsightsProps) => {
  return (
    <div className="space-y-6">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Your Strengths
          </CardTitle>
          <CardDescription>Areas where you excel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.top_strengths?.length > 0 ? (
            profile.top_strengths.map((strength, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-1">{strength.room_id}</Badge>
                    <p className="font-medium">{strength.skill}</p>
                    {strength.evidence && (
                      <p className="text-sm text-muted-foreground">{strength.evidence}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">
                      {Math.round(strength.confidence_score * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </div>
                <Progress value={strength.confidence_score * 100} className="h-2" />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No strengths identified yet</p>
          )}
        </CardContent>
      </Card>

      {/* Weaknesses & Focus Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-orange-500" />
            Focus Areas
          </CardTitle>
          <CardDescription>Skills to develop</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.identified_weaknesses?.length > 0 ? (
            profile.identified_weaknesses.map((weakness, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{weakness.room_id}</Badge>
                      <Badge variant={
                        weakness.frequency === 'high' ? 'destructive' :
                        weakness.frequency === 'medium' ? 'default' : 'secondary'
                      }>
                        {weakness.frequency}
                      </Badge>
                    </div>
                    <p className="font-medium">{weakness.skill}</p>
                    <p className="text-sm text-muted-foreground">{weakness.error_pattern}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">No focus areas identified yet</p>
          )}
        </CardContent>
      </Card>

      {/* Blind Spots */}
      {profile.blind_spots && profile.blind_spots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Blind Spots
            </CardTitle>
            <CardDescription>Principles you may be overlooking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.blind_spots.map((spot, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{spot.room_id}</Badge>
                  <p className="text-sm font-medium text-red-500">
                    Missed {spot.missed_count}x
                  </p>
                </div>
                <p className="font-medium">{spot.principle}</p>
                <p className="text-sm text-muted-foreground mt-1">{spot.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Predicted Struggles */}
      {profile.predicted_struggles && profile.predicted_struggles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              AI Predictions
            </CardTitle>
            <CardDescription>Areas you may struggle with next</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.predicted_struggles.map((pred, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{pred.room_id}</Badge>
                  <Progress value={pred.confidence * 100} className="w-24 h-1.5" />
                </div>
                <p className="font-medium text-sm">{pred.verse_ref}</p>
                <p className="text-sm text-muted-foreground mt-1">{pred.reason}</p>
                <p className="text-xs text-purple-500 mt-1">
                  {Math.round(pred.confidence * 100)}% confidence
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Learning Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Your Learning Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Learning Style</p>
              <p className="font-semibold capitalize">{profile.learning_style || "Mixed"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Optimal Difficulty</p>
              <Badge variant="secondary" className="capitalize">{profile.optimal_difficulty}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Attention Span
              </p>
              <p className="font-semibold">{profile.attention_span_minutes} minutes</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Best Study Times</p>
              <div className="flex gap-1 flex-wrap">
                {profile.best_study_times?.map((time, idx) => (
                  <Badge key={idx} variant="outline" className="capitalize">{time}</Badge>
                ))}
              </div>
            </div>
          </div>

          {profile.recommended_focus_areas && profile.recommended_focus_areas.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5">
              <p className="text-sm font-medium mb-2">Recommended Focus</p>
              <div className="flex gap-2 flex-wrap">
                {profile.recommended_focus_areas.map((area, idx) => (
                  <Badge key={idx} className="gap-1">
                    <Target className="h-3 w-3" />
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};