import React from 'react';

/**
 * Formats Jeeves responses with proper paragraph and bullet point rendering
 * Handles asterisk bullets (*), bullet points (•), bold text (**), and adds emojis
 * Specifically designed to remove asterisks and make output visually appealing
 */
export const formatJeevesResponse = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // First, clean up any stray asterisks at the start of lines (replace with bullet points)
  let cleanedText = text.replace(/^\s*\*\s+/gm, '• ');
  
  // Split by double newlines for paragraphs
  const paragraphs = cleanedText.split('\n\n').filter(p => p.trim());

  return paragraphs.map((paragraph, idx) => {
    const trimmed = paragraph.trim();
    
    // Check if this paragraph contains bullet points (asterisk or bullet)
    const lines = trimmed.split('\n');
    const hasBullets = lines.some(line => {
      const trimmedLine = line.trim();
      return trimmedLine.startsWith('•') || trimmedLine.startsWith('-');
    });
    
    if (hasBullets) {
      // Render as a list
      return (
        <ul key={idx} className="mb-4 space-y-3 list-none pl-0">
          {lines.map((line, lineIdx) => {
            let trimmedLine = line.trim();
            
            // Handle bullet points (• or -)
            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
              const content = trimmedLine.substring(1).trim();
              const formatted = formatTextWithBoldAndEmoji(content);
              
              return (
                <li key={lineIdx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/10 transition-all">
                  <span className="text-primary text-lg mt-0.5 flex-shrink-0">✨</span>
                  <span className="flex-1 leading-relaxed text-base">{formatted}</span>
                </li>
              );
            } 
            else if (trimmedLine) {
              // Non-bullet line in a list context (like a heading or regular text)
              const formatted = formatTextWithBoldAndEmoji(trimmedLine);
              return (
                <div key={lineIdx} className="mb-2 leading-relaxed text-base">
                  {formatted}
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </ul>
      );
    } else {
      // Regular paragraph with bold text and emoji support
      const formatted = formatTextWithBoldAndEmoji(trimmed);
      return (
        <p key={idx} className="mb-4 leading-relaxed text-base">
          {formatted}
        </p>
      );
    }
  });
};

/**
 * Formats bold text markers (**text**) and preserves emojis in React components
 */
const formatTextWithBoldAndEmoji = (text: string): React.ReactNode => {
  // Split by bold markers
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-primary">
          {boldText}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};
