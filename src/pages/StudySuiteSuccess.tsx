import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  CheckCircle,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function StudySuiteSuccess() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-product-download', {
        body: { product: 'study-suite' }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Download started!");
      } else {
        throw new Error("No download URL received");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again or contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Thank You | Study Suite"
        description="Your PhotoTheology Study Suite is ready for download."
      />
      <Navigation />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-background to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>

            <Badge variant="outline" className="text-green-600 border-green-500/30">
              Purchase Complete
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold">
              Thank You for Your Purchase
            </h1>

            <p className="text-xl text-muted-foreground">
              Your PhotoTheology Study Suite is ready for download.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center space-y-6">
                <Building2 className="w-12 h-12 text-primary mx-auto" />

                <div>
                  <h2 className="text-2xl font-bold mb-2">PhotoTheology Study Suite</h2>
                  <p className="text-muted-foreground">
                    Complete method training for all 8 Floors
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full text-lg py-6 h-auto"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Click the button above to download your PDF.
                  You can return to this page anytime from your purchase confirmation email.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-2xl font-bold">Begin Your Training</h2>
            <p className="text-muted-foreground">
              You now have access to the complete Phototheology method. Enter the Palace
              and begin applying what you learn in the Study Suite to your own Bible study.
            </p>
            <Button asChild size="lg">
              <Link to="/palace">
                Enter the Palace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
