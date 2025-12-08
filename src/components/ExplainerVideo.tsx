import { Card } from "@/components/ui/card";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ExplainerVideo = () => {
  const [showVideo, setShowVideo] = useState(false);
  
  // YouTube video embed (replace VIDEO_ID with actual ID when available)
  const youtubeVideoId = "dQw4w9WgXcQ"; // Placeholder - replace with actual video ID
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`;
  const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            See Phototheology in Action
          </h2>
          <Card className="overflow-hidden shadow-xl border-2 relative">
            {showVideo ? (
              <div className="aspect-video">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Phototheology Explainer Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div 
                className="aspect-video relative cursor-pointer group"
                onClick={() => setShowVideo(true)}
              >
                <img 
                  src={youtubeThumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a gradient if thumbnail fails
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="bg-primary/90 rounded-full p-4 sm:p-6 group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="h-8 w-8 sm:h-12 sm:w-12 text-primary-foreground fill-current" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-shadow font-medium drop-shadow-lg">
                    Click to watch the 2-minute overview
                  </p>
                </div>
              </div>
            )}
          </Card>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Learn how the Palace method transforms Bible study
          </p>
        </div>
      </div>
    </section>
  );
};
