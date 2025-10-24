import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Gift } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function AdminAccessCodes() {
  const { toast } = useToast();
  const [maxUses, setMaxUses] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    link: string;
    expiresAt: string;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('generate-access-code', {
        body: { maxUses: maxUses ? parseInt(maxUses) : null }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      setGeneratedCode({
        code: response.data.code,
        link: `${window.location.origin}/access?code=${response.data.code}`,
        expiresAt: response.data.expiresAt
      });

      toast({
        title: "Success!",
        description: "Access code generated successfully",
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Generate Access Code</CardTitle>
            <CardDescription>
              Create a special 24-hour access link that grants lifetime premium access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses (optional)</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Leave blank for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                How many people can use this code? Leave blank for unlimited uses.
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Code
            </Button>

            {generatedCode && (
              <div className="space-y-4 mt-6 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label>Access Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.code}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.link}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.link)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Expires: {new Date(generatedCode.expiresAt).toLocaleString()}</p>
                  <p className="mt-2">
                    Share this link with users who should receive lifetime premium access. 
                    The link will expire in 24 hours from now.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
