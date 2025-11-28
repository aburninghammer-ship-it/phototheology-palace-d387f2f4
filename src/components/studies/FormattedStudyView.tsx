import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Card } from "@/components/ui/card";
import DOMPurify from "dompurify";

interface FormattedStudyViewProps {
  content: string;
}

export const FormattedStudyView = ({ content }: FormattedStudyViewProps) => {
  // Check if content is HTML (from TipTap editor) or markdown/plain text
  const isHtmlContent = (text: string) => {
    return /<[a-z][\s\S]*>/i.test(text);
  };

  // Sanitize HTML content
  const sanitizeHtml = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'span', 'div'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
    });
  };

  // Split content by Jeeves Research sections
  const sections = content.split(/(?=### Jeeves Research:)/);
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.trim()) return null;
        
        // Check if this is a Jeeves Research section
        const isJeevesSection = section.includes("### Jeeves Research:");
        
        if (isJeevesSection) {
          // Extract the question and content
          const lines = section.split('\n');
          const questionLine = lines.find(l => l.includes("### Jeeves Research:"));
          const timestampLine = lines.find(l => l.includes("*Saved on"));
          
          // Get content after the timestamp
          const timestampIndex = lines.findIndex(l => l.includes("*Saved on"));
          const jeevesContent = lines.slice(timestampIndex + 1).join('\n').trim();
          
          return (
            <Card key={index} className="p-6 bg-gradient-to-br from-card to-muted/30 border-primary/20 shadow-lg">
              <div className="mb-6 pb-4 border-b border-border/50">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl">🤖</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-1">
                      {questionLine?.replace("### Jeeves Research:", "").trim() || "Jeeves Research"}
                    </h3>
                    {timestampLine && (
                      <p className="text-xs text-muted-foreground">
                        {timestampLine.replace(/\*/g, "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="jeeves-response space-y-4">
                {formatJeevesResponse(jeevesContent)}
              </div>
            </Card>
          );
        }
        
        // Regular content - check if it's HTML or markdown
        if (isHtmlContent(section)) {
          // Render HTML content properly
          return (
            <Card key={index} className="p-6 shadow-sm">
              <div 
                className="formatted-content prose prose-sm dark:prose-invert max-w-none
                  prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground
                  prose-em:text-foreground/90 prose-li:text-foreground prose-a:text-primary
                  [&>p]:mb-4 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(section) }}
              />
            </Card>
          );
        }
        
        // Markdown/plain text content - use formatJeevesResponse
        return (
          <Card key={index} className="p-6 shadow-sm">
            <div className="formatted-content space-y-4">
              {formatJeevesResponse(section)}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
