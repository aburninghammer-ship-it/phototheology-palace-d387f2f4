import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChurchCampaignsProps {
  churchId: string;
  hasTier2Access: boolean;
}

export function ChurchCampaigns({ churchId, hasTier2Access }: ChurchCampaignsProps) {
  const navigate = useNavigate();

  if (!hasTier2Access) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Church Campaigns</CardTitle>
          <CardDescription className="text-foreground/70">Launch coordinated study campaigns across your entire congregation</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-primary/10 border-primary/30">
            <Lock className="h-4 w-4 text-primary" />
            <AlertDescription className="ml-2 text-foreground/80">
              <strong>Tier 2 Feature:</strong> Upgrade to Leadership Tools or Growth Suite to unlock church-wide campaign management.
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto text-primary"
                onClick={() => navigate("/pricing")}
              >
                View Plans →
              </Button>
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            <div className="border border-border/50 rounded-xl p-4 bg-background/30">
              <h3 className="font-semibold mb-2 text-foreground">What are Church Campaigns?</h3>
              <p className="text-sm text-foreground/70">
                Launch coordinated Bible study challenges that your entire congregation participates in together. 
                For example: "This week, everyone studies Daniel 2" or "Connect the Cross to Prophecy using the Palace."
              </p>
            </div>
            
            <div className="border border-border/50 rounded-xl p-4 bg-background/30">
              <h3 className="font-semibold mb-2 text-foreground">Campaign Benefits</h3>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Unified study across all age groups</li>
                <li>• Track participation and engagement</li>
                <li>• Pre-built campaign templates</li>
                <li>• Custom campaign creation</li>
                <li>• Automatic member notifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // TODO: Implement actual campaign management when tier 2+ is active
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-foreground">Church Campaigns</CardTitle>
        <CardDescription className="text-foreground/70">Launch coordinated study campaigns across your entire congregation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/60 text-center py-12">
          Campaign management coming soon...
        </p>
      </CardContent>
    </Card>
  );
}
