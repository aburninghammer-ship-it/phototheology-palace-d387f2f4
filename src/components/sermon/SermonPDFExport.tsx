import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface Sermon {
  title: string;
  theme_passage: string;
  sermon_style: string;
  smooth_stones: string[];
  bridges: string[];
  movie_structure: {
    opening?: string;
    climax?: string;
    resolution?: string;
    call_to_action?: string;
  };
  full_sermon?: string;
}

interface SermonPDFExportProps {
  sermon: Sermon;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

// Helper function to strip HTML tags and decode entities
const stripHtml = (html: string): string => {
  if (!html) return "";
  
  // First decode HTML entities
  let text = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
  
  // Replace <br> and </p> with newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<\/div>/gi, '\n');
  
  // Remove blockquote tags but keep content
  text = text.replace(/<blockquote[^>]*>/gi, '\n"');
  text = text.replace(/<\/blockquote>/gi, '"\n');
  
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Clean up extra whitespace
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.replace(/^\s+|\s+$/g, '');
  
  return text;
};

export function SermonPDFExport({ sermon, variant = "outline", size = "sm" }: SermonPDFExportProps) {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Helper to add text with word wrap
      const addText = (text: string, fontSize: number, isBold = false, indent = 0) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const cleanText = stripHtml(text);
        const lines = doc.splitTextToSize(cleanText, maxWidth - indent);
        
        // Check if we need a new page
        if (y + lines.length * (fontSize * 0.5) > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(lines, margin + indent, y);
        y += lines.length * (fontSize * 0.5) + 5;
      };

      const addSection = (title: string, content: string | string[]) => {
        // Add section divider
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y - 2, pageWidth - margin, y - 2);
        y += 5;
        
        addText(title, 14, true);
        if (Array.isArray(content)) {
          content.forEach((item, idx) => {
            const cleanItem = stripHtml(item);
            addText(`${idx + 1}. ${cleanItem}`, 11, false, 5);
          });
        } else if (content) {
          addText(content, 11);
        }
        y += 8;
      };

      // Title - centered with decoration
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      const titleText = stripHtml(sermon.title);
      const titleLines = doc.splitTextToSize(titleText, maxWidth);
      doc.text(titleLines, pageWidth / 2, y, { align: "center" });
      y += titleLines.length * 12 + 5;

      // Decorative line under title
      doc.setDrawColor(100, 100, 150);
      doc.setLineWidth(0.5);
      doc.line(margin + 30, y, pageWidth - margin - 30, y);
      y += 15;

      // Metadata
      doc.setFontSize(11);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(80, 80, 80);
      doc.text(`Style: ${sermon.sermon_style}`, pageWidth / 2, y, { align: "center" });
      y += 10;
      doc.setTextColor(0, 0, 0);

      // Theme/Passage
      addSection("📖 Theme / Main Passage", sermon.theme_passage);

      // Movie Structure - Opening
      if (sermon.movie_structure.opening) {
        addSection("🎬 Opening Hook", sermon.movie_structure.opening);
      }

      // 5 Smooth Stones
      if (sermon.smooth_stones?.length > 0) {
        addSection("🪨 5 Smooth Stones (Key Insights)", sermon.smooth_stones);
      }

      // Bridges
      if (sermon.bridges?.length > 0) {
        addSection("🌉 Narrative Bridges", sermon.bridges);
      }

      // Climax
      if (sermon.movie_structure.climax) {
        addSection("⛰️ Climax / Main Point", sermon.movie_structure.climax);
      }

      // Resolution
      if (sermon.movie_structure.resolution) {
        addSection("✨ Resolution", sermon.movie_structure.resolution);
      }

      // Call to Action
      if (sermon.movie_structure.call_to_action) {
        addSection("📢 Call to Action", sermon.movie_structure.call_to_action);
      }

      // Full Sermon
      if (sermon.full_sermon) {
        doc.addPage();
        y = 20;
        
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Full Sermon", pageWidth / 2, y, { align: "center" });
        y += 15;
        
        doc.setDrawColor(100, 100, 150);
        doc.line(margin + 30, y, pageWidth - margin - 30, y);
        y += 15;
        
        addText(sermon.full_sermon, 11);
      }

      // Footer on each page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("Created with Phototheology Sermon Builder", margin, 285);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 285);
      }

      // Save
      const filename = `${titleText.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_sermon.pdf`;
      doc.save(filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button size={size} variant={variant} onClick={exportToPDF} disabled={exporting}>
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-1" />
      )}
      PDF
    </Button>
  );
}
