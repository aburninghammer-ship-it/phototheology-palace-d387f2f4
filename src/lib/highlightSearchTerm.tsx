import React from "react";

/**
 * Highlights occurrences of a search term within text
 * Returns React nodes with matched terms wrapped in <mark>
 */
export function highlightSearchTerm(
  text: string,
  searchTerm: string,
  className: string = "bg-amber-500/30 text-foreground px-0.5 rounded"
): React.ReactNode {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return text;
  }

  // Escape special regex characters in search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Create regex for case-insensitive global match
  const regex = new RegExp(`(${escapedTerm})`, "gi");
  
  const parts = text.split(regex);
  
  if (parts.length === 1) {
    return text;
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <mark key={index} className={className}>
              {part}
            </mark>
          );
        }
        return part;
      })}
    </>
  );
}
