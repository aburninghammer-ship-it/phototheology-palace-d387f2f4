import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function StudentVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [eduEmail, setEduEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eduEmail.toLowerCase().endsWith('.edu')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid .edu email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-student", {
        body: { email: eduEmail },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        toast({
          title: "Verified!",
          description: data.message,
        });
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              Student Verification
            </h1>
            <p className="text-muted-foreground">
              Students get free access for 1 year!
            </p>
          </div>

          {!verified ? (
            <Card>
              <CardHeader>
                <CardTitle>Verify Your Student Status</CardTitle>
                <CardDescription>
                  Enter your .edu email address to get free access to all Premium features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edu-email">Educational Email (.edu)</Label>
                    <Input
                      id="edu-email"
                      type="email"
                      placeholder="yourname@university.edu"
                      value={eduEmail}
                      onChange={(e) => setEduEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be a valid .edu email address
                    </p>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>What you'll get:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Full Premium access for 1 year</li>
                        <li>All AI Study GPTs</li>
                        <li>Unlimited games and courses</li>
                        <li>Renewal required annually with .edu verification</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <Button 
                    type="submit" 
                    className="w-full gradient-palace" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Student Status"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h2 className="text-2xl font-bold">Verified!</h2>
                  <p className="text-muted-foreground">
                    You now have free Premium access for 1 year. Redirecting...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
