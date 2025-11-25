import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Gift, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RedeemCode() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{
    message: string;
    accessType?: string;
    durationMonths?: number;
  } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter an access code",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to redeem an access code",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setResult(null);

    try {
      const { data, error } = await supabase.rpc('redeem_access_code', {
        code_input: code.trim().toUpperCase()
      });

      if (error) throw error;

      // Type guard for the response
      const response = data as { 
        success: boolean; 
        message?: string; 
        error?: string;
        access_type?: string;
        duration_months?: number;
      };

      if (response.success) {
        setSuccess(true);
        setResult({
          message: response.message || "Access granted!",
          accessType: response.access_type,
          durationMonths: response.duration_months
        });
        
        toast({
          title: "Success! 🎉",
          description: response.message || "Access granted!",
        });

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast({
          title: "Invalid Code",
          description: response.error || "This code is invalid or has expired",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redeem code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      <div className="container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-20">
        <Card className="shadow-elegant">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-palace flex items-center justify-center animate-pulse-glow">
              {success ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <Gift className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-serif">
                {success ? "Access Granted!" : "Redeem Access Code"}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-2">
                {success 
                  ? "Your premium access has been activated"
                  : "Enter your special access code to unlock premium features"
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6">
            {success && result ? (
              <div className="space-y-4">
                <div className="p-6 bg-primary/10 border-2 border-primary rounded-lg text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="font-bold text-lg">{result.message}</h3>
                  {result.accessType === 'lifetime' ? (
                    <p className="text-muted-foreground">
                      You now have <span className="font-bold text-primary">lifetime access</span> to all premium features!
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      You have <span className="font-bold text-primary">{result.durationMonths} months</span> of premium access!
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-center">What's included:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Full access to all 8 floors of the Palace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Unlimited AI assistance with Jeeves</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Access to all study tools and games</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Bible study series creator</span>
                    </li>
                  </ul>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Redirecting to home page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRedeem} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Access Code
                  </label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter your code (e.g., PTXYZ123)"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    disabled={loading}
                    className="text-center text-lg tracking-wider font-mono touch-manipulation"
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Access codes are case-insensitive
                  </p>
                </div>

                <Button 
                  type="submit"
                  className="w-full gradient-palace text-white shadow-purple hover:shadow-glow touch-manipulation"
                  size="lg"
                  disabled={loading || !code.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-5 w-5" />
                      Redeem Code
                    </>
                  )}
                </Button>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">How to get an access code:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-1">
                        <li>Receive an invitation email from an admin</li>
                        <li>Get a code through a special promotion</li>
                        <li>Contact support for trial access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
