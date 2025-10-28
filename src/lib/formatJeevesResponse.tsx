import React from 'react';

/**
 * Formats Jeeves responses with proper paragraph and bullet point rendering
 * Handles both paragraph breaks and bullet points (•)
 */
export const formatJeevesResponse = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());

  return paragraphs.map((paragraph, idx) => {
    const trimmed = paragraph.trim();
    
    // Check if this paragraph contains bullet points
    const lines = trimmed.split('\n');
    const hasBullets = lines.some(line => line.trim().startsWith('•'));
    
    if (hasBullets) {
      // Render as a list
      return (
        <ul key={idx} className="mb-3 space-y-2 list-none pl-0">
          {lines.map((line, lineIdx) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('•')) {
              return (
                <li key={lineIdx} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="flex-1">{trimmedLine.substring(1).trim()}</span>
                </li>
              );
            } else if (trimmedLine) {
              // Non-bullet line in a list context (like a heading)
              return (
                <div key={lineIdx} className="font-semibold mt-2 mb-1">
                  {trimmedLine}
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </ul>
      );
    } else {
      // Regular paragraph
      return (
        <p key={idx} className="mb-3 leading-relaxed">
          {trimmed}
        </p>
      );
    }
  });
};
