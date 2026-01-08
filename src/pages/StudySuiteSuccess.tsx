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
  FileText,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface DownloadFile {
  name: string;
  url: string;
}

export default function StudySuiteSuccess() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState<DownloadFile[] | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-product-download', {
        body: { product: 'study-suite' }
      });

      if (error) throw error;

      if (data?.urls && Array.isArray(data.urls)) {
        // Multiple files - show download list
        setDownloadFiles(data.urls);
        toast.success("Your downloads are ready!");
      } else if (data?.url) {
        // Single file fallback
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

  const handleFileDownload = (url: string, name: string) => {
    window.open(url, '_blank');
    toast.success(`Downloading ${name}...`);
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

                {!downloadFiles ? (
                  <>
                    <Button
                      size="lg"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full text-lg py-6 h-auto"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Preparing Downloads...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          Get Your PDFs
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      Click the button above to access your 3 PDF files.
                      You can return to this page anytime from your purchase confirmation email.
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Click each file to download:
                    </p>
                    {downloadFiles.map((file, index) => (
                      <motion.div
                        key={file.url}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-4"
                          onClick={() => handleFileDownload(file.url, file.name)}
                        >
                          <FileText className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                          <span className="capitalize">{file.name}</span>
                          <Download className="w-4 h-4 ml-auto text-muted-foreground" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
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
