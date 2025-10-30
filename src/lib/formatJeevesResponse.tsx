import React from 'react';

/**
 * Formats Jeeves responses with proper paragraph and bullet point rendering
 * Handles asterisk bullets (*), bullet points (•), bold text (**), and adds emojis
 */
export const formatJeevesResponse = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  return paragraphs.map((paragraph, idx) => {
    const trimmed = paragraph.trim();
    
    // Check if this paragraph contains bullet points (asterisk or bullet)
    const lines = trimmed.split('\n');
    const hasBullets = lines.some(line => {
      const trimmedLine = line.trim();
      return trimmedLine.startsWith('*') || trimmedLine.startsWith('•');
    });
    
    if (hasBullets) {
      // Render as a list
      return (
        <ul key={idx} className="mb-4 space-y-3 list-none pl-0">
          {lines.map((line, lineIdx) => {
            const trimmedLine = line.trim();
            
            // Handle asterisk bullets
            if (trimmedLine.startsWith('*')) {
              const content = trimmedLine.substring(1).trim();
              const formatted = formatTextWithBold(content);
              
              return (
                <li key={lineIdx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors">
                  <span className="text-primary text-lg mt-0.5">✨</span>
                  <span className="flex-1 leading-relaxed">{formatted}</span>
                </li>
              );
            } 
            // Handle bullet points
            else if (trimmedLine.startsWith('•')) {
              const content = trimmedLine.substring(1).trim();
              const formatted = formatTextWithBold(content);
              
              return (
                <li key={lineIdx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors">
                  <span className="text-primary text-lg mt-0.5">💡</span>
                  <span className="flex-1 leading-relaxed">{formatted}</span>
                </li>
              );
            } 
            else if (trimmedLine) {
              // Non-bullet line in a list context (like a heading)
              return (
                <div key={lineIdx} className="font-semibold text-primary mt-3 mb-2 flex items-center gap-2">
                  <span>📖</span>
                  {trimmedLine}
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </ul>
      );
    } else {
      // Regular paragraph with bold text support
      const formatted = formatTextWithBold(trimmed);
      return (
        <p key={idx} className="mb-4 leading-relaxed">
          {formatted}
        </p>
      );
    }
  });
};

/**
 * Formats bold text markers (**text**) into React components
 */
const formatTextWithBold = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={idx} className="font-semibold text-primary">
          {boldText}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};
