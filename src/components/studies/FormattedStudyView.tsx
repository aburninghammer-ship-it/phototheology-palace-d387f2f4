import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Card } from "@/components/ui/card";

interface FormattedStudyViewProps {
  content: string;
}

export const FormattedStudyView = ({ content }: FormattedStudyViewProps) => {
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
            <Card key={index} className="p-6 bg-gradient-to-br from-card to-muted/30 border-primary/20">
              <div className="mb-4 pb-4 border-b border-border/50">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-2xl">🤖</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">
                      {questionLine?.replace("### Jeeves Research:", "").trim() || "Research"}
                    </h3>
                    {timestampLine && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {timestampLine.replace(/\*/g, "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="jeeves-response space-y-3">
                {formatJeevesResponse(jeevesContent)}
              </div>
            </Card>
          );
        }
        
        // Regular content (non-Jeeves)
        return (
          <Card key={index} className="p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {section.split('\n').map((line, i) => {
                if (!line.trim()) return <br key={i} />;
                if (line.startsWith('###')) {
                  return <h3 key={i} className="text-xl font-bold mb-3 mt-4">{line.replace('###', '')}</h3>;
                }
                if (line.startsWith('##')) {
                  return <h2 key={i} className="text-2xl font-bold mb-3 mt-4">{line.replace('##', '')}</h2>;
                }
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-3xl font-bold mb-4 mt-4">{line.replace('# ', '')}</h1>;
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                }
                return <p key={i} className="mb-2">{line}</p>;
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
