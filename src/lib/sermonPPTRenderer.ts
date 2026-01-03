import PptxGenJS from 'pptxgenjs';
import {
  SlideDeck,
  SlideContent,
  PPT_THEMES,
  VENUE_PRESETS,
  ThemeId,
  VenueSize,
  SlideLayout,
  VisualStyle,
  VisualMood
} from '@/types/sermonPPT';

// Mood color variations
const MOOD_COLORS: Record<VisualMood, { bg: string; text: string; accent: string }> = {
  light: { bg: 'FFFFFF', text: '1A1A2E', accent: '3B82F6' },
  dark: { bg: '0F172A', text: 'F8FAFC', accent: '60A5FA' },
  warm: { bg: 'FDF8F3', text: '44403C', accent: 'D97706' },
  cool: { bg: 'F0F9FF', text: '1E3A5F', accent: '0EA5E9' },
  neutral: { bg: 'F9FAFB', text: '374151', accent: '6B7280' },
};

export class SermonPPTRenderer {
  private pptx: PptxGenJS;
  private deck: SlideDeck;
  private theme: typeof PPT_THEMES[ThemeId];
  private venue: typeof VENUE_PRESETS[VenueSize];

  constructor(deck: SlideDeck) {
    this.pptx = new PptxGenJS();
    this.deck = deck;
    this.theme = PPT_THEMES[deck.theme] || PPT_THEMES['palace-purple'];
    this.venue = VENUE_PRESETS[deck.venue] || VENUE_PRESETS['medium'];

    // Set presentation properties
    this.pptx.author = deck.metadata.preacher || 'Phototheology';
    this.pptx.title = deck.metadata.sermonTitle;
    this.pptx.subject = `Sermon: ${deck.metadata.sermonTitle}`;
    this.pptx.company = deck.metadata.church || 'Phototheology Palace';
  }

  private getScaledSize(baseSize: number): number {
    return Math.round(baseSize * this.venue.fontScale);
  }

  // Get colors based on visual style mood
  private getSlideColors(visualStyle?: VisualStyle) {
    if (visualStyle?.mood && MOOD_COLORS[visualStyle.mood]) {
      const moodColors = MOOD_COLORS[visualStyle.mood];
      return {
        background: visualStyle.invertColors ? this.theme.colors.accent : moodColors.bg,
        primary: visualStyle.invertColors ? moodColors.bg : this.theme.colors.primary,
        text: visualStyle.invertColors ? moodColors.bg : moodColors.text,
        accent: moodColors.accent,
        textMuted: this.theme.colors.textMuted,
      };
    }
    return visualStyle?.invertColors
      ? {
          background: this.theme.colors.accent,
          primary: this.theme.colors.background,
          text: this.theme.colors.background,
          accent: this.theme.colors.background,
          textMuted: this.theme.colors.background,
        }
      : this.theme.colors;
  }

  // Get font size multiplier based on emphasis
  private getEmphasisScale(emphasis?: string): number {
    switch (emphasis) {
      case 'dramatic': return 1.3;
      case 'bold': return 1.15;
      case 'subtle': return 0.9;
      case 'elegant': return 1.0;
      case 'modern': return 1.05;
      case 'classic': return 1.0;
      default: return 1.0;
    }
  }

  // Get alignment based on layout
  private getAlignment(layout?: SlideLayout): 'left' | 'center' | 'right' {
    switch (layout) {
      case 'left-aligned': return 'left';
      case 'right-aligned': return 'right';
      case 'centered':
      case 'minimal':
      case 'dramatic':
      case 'full-bleed':
      default: return 'center';
    }
  }

  // Render title slide with AI layout support
  private addTitleSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    // Title position based on layout
    const isDramatic = content.layout === 'dramatic' || content.visualStyle?.emphasis === 'dramatic';
    const titleY = isDramatic ? '30%' : '35%';

    slide.addText(content.title || this.deck.metadata.sermonTitle, {
      x: 0.5,
      y: titleY,
      w: '90%',
      h: 1.5,
      fontSize: this.getScaledSize((this.venue.titleSize + 8) * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    if (content.subtitle || this.deck.metadata.themePassage) {
      slide.addText(content.subtitle || this.deck.metadata.themePassage || '', {
        x: 0.5,
        y: isDramatic ? '55%' : '55%',
        w: '90%',
        h: 0.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.accent,
        align,
        italic: true,
      });
    }

    if (this.deck.metadata.preacher || this.deck.metadata.date) {
      const meta = [this.deck.metadata.preacher, this.deck.metadata.date]
        .filter(Boolean)
        .join(' • ');
      slide.addText(meta, {
        x: 0.5,
        y: '85%',
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align,
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Big Idea - dramatic by default
  private addBigIdeaSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark', emphasis: 'dramatic' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');

    // Use accent color for dramatic impact
    slide.background = { color: content.visualStyle?.invertColors ? colors.background : this.theme.colors.accent };
    const textColor = content.visualStyle?.invertColors ? colors.text : this.theme.colors.background;

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: '12%',
        w: '90%',
        h: 0.6,
        fontSize: this.getScaledSize(this.venue.captionSize + 2),
        fontFace: this.theme.fontBody,
        color: textColor,
        align: 'center',
        bold: true,
      });
    }

    slide.addText(content.body || '', {
      x: 0.5,
      y: '25%',
      w: '90%',
      h: 3,
      fontSize: this.getScaledSize((this.venue.titleSize - 4) * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: textColor,
      align: 'center',
      bold: true,
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Scripture with highlight support
  private addScriptureSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'elegant');

    slide.background = { color: colors.background };

    // Reference
    slide.addText(content.scripture?.reference || content.title || '', {
      x: 0.5,
      y: '8%',
      w: '90%',
      h: 0.6,
      fontSize: this.getScaledSize(this.venue.bodySize + 4),
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align,
      bold: true,
    });

    // Scripture text - check for highlights
    const scriptureText = content.scripture?.text || content.body || '';
    const highlightWords = content.scripture?.highlightWords || [];

    if (highlightWords.length > 0) {
      // Build text with highlights
      const textParts: Array<{ text: string; options?: any }> = [];
      let remainingText = scriptureText;

      highlightWords.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        const parts = remainingText.split(regex);
        parts.forEach(part => {
          if (part.toLowerCase() === word.toLowerCase()) {
            textParts.push({
              text: part,
              options: { bold: true, color: colors.accent }
            });
          } else if (part) {
            textParts.push({ text: part });
          }
        });
        remainingText = '';
      });

      if (textParts.length === 0) {
        textParts.push({ text: scriptureText });
      }

      slide.addText(textParts, {
        x: 0.75,
        y: '22%',
        w: '85%',
        h: 3.5,
        fontSize: this.getScaledSize((this.venue.bodySize + 2) * emphasisScale),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'middle',
        italic: true,
      });
    } else {
      slide.addText(scriptureText, {
        x: 0.75,
        y: '22%',
        w: '85%',
        h: 3.5,
        fontSize: this.getScaledSize((this.venue.bodySize + 2) * emphasisScale),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'middle',
        italic: true,
      });
    }

    // Version
    if (content.scripture?.version || this.deck.metadata.bibleVersion) {
      slide.addText(content.scripture?.version || this.deck.metadata.bibleVersion, {
        x: 0.5,
        y: '88%',
        w: '90%',
        h: 0.4,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align,
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Numbered point slide
  private addNumberedPointSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);

    slide.background = { color: colors.background };

    // Point number badge
    if (content.numbering) {
      slide.addText(content.numbering.label || `${content.numbering.current}`, {
        x: 0.5,
        y: '8%',
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.accent,
        align: align === 'center' ? 'center' : 'left',
        bold: true,
      });
    }

    // Title
    slide.addText(content.title || '', {
      x: 0.5,
      y: '18%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    // Body or bullets
    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: b, options: { bullet: true } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: '38%',
        w: '90%',
        h: 2.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '38%',
        w: '90%',
        h: 2.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Main point slide
  private addMainPointSlide(content: SlideContent): void {
    // Use numbered point renderer if numbering exists
    if (content.numbering) {
      this.addNumberedPointSlide(content);
      return;
    }

    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis);

    slide.background = { color: colors.background };

    slide.addText(content.title || '', {
      x: 0.5,
      y: '15%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: b, options: { bullet: true } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Quote slide with elegant styling
  private addQuoteSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { emphasis: 'elegant' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'elegant');

    slide.background = { color: colors.background };

    // Large quote mark
    slide.addText('"', {
      x: 0.3,
      y: '8%',
      w: 1,
      h: 1,
      fontSize: 80,
      fontFace: 'Georgia',
      color: colors.accent,
    });

    slide.addText(content.quote?.text || content.body || '', {
      x: 0.75,
      y: '22%',
      w: '85%',
      h: 2.8,
      fontSize: this.getScaledSize((this.venue.bodySize + 4) * emphasisScale),
      fontFace: this.theme.fontBody,
      color: colors.text,
      align: 'center',
      valign: 'middle',
      italic: true,
    });

    if (content.quote?.attribution) {
      slide.addText(`— ${content.quote.attribution}`, {
        x: 0.5,
        y: '78%',
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize + 2),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align: 'right',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Question slide - dramatic centered
  private addQuestionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark' });

    slide.background = { color: this.theme.colors.secondary };

    slide.addText('?', {
      x: '42%',
      y: '5%',
      w: 1.5,
      h: 1.5,
      fontSize: 80,
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align: 'center',
    });

    slide.addText(content.body || content.title || '', {
      x: 0.5,
      y: '30%',
      w: '90%',
      h: 2.5,
      fontSize: this.getScaledSize(this.venue.titleSize - 8),
      fontFace: this.theme.fontHeading,
      color: colors.text,
      align: 'center',
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Transition - minimal, breathing room
  private addTransitionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);

    slide.background = { color: colors.background };

    slide.addText(content.title || content.body || '', {
      x: 0.5,
      y: '40%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize - 8),
      fontFace: this.theme.fontHeading,
      color: colors.accent,
      align: 'center',
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Application slide - warm mood by default
  private addApplicationSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'warm' });
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    slide.addText('APPLICATION', {
      x: 0.5,
      y: '10%',
      w: '90%',
      h: 0.5,
      fontSize: this.getScaledSize(this.venue.captionSize),
      fontFace: this.theme.fontBody,
      color: colors.accent,
      align: align === 'center' ? 'center' : 'left',
      bold: true,
    });

    slide.addText(content.title || '', {
      x: 0.5,
      y: '18%',
      w: '90%',
      h: 0.8,
      fontSize: this.getScaledSize(this.venue.titleSize - 8),
      fontFace: this.theme.fontHeading,
      color: colors.primary,
      align,
      bold: true,
    });

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: b, options: { bullet: true } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
      });
    } else if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Appeal slide - dramatic, warm, urgent
  private addAppealSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');

    // Use accent for urgent feeling
    slide.background = { color: this.theme.colors.accent };

    slide.addText(content.title || 'INVITATION', {
      x: 0.5,
      y: '22%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.background,
      align: 'center',
      bold: true,
    });

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '45%',
        w: '90%',
        h: 2.5,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: this.theme.colors.background,
        align: 'center',
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Split layout slide (two columns)
  private addSplitSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const isSplit5050 = content.layout === 'split-50';

    slide.background = { color: colors.background };

    // Left column (wider if 70-30)
    const leftWidth = isSplit5050 ? '45%' : '62%';

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: '15%',
        w: leftWidth,
        h: 0.8,
        fontSize: this.getScaledSize(this.venue.titleSize - 4),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align: 'left',
        bold: true,
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '30%',
        w: leftWidth,
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
      });
    }

    // Right column - scripture or secondary content
    const rightX = isSplit5050 ? '52%' : '68%';
    const rightWidth = isSplit5050 ? '45%' : '28%';

    if (content.scripture) {
      slide.addText(content.scripture.reference, {
        x: rightX,
        y: '15%',
        w: rightWidth,
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: colors.accent,
        bold: true,
      });

      slide.addText(content.scripture.text, {
        x: rightX,
        y: '25%',
        w: rightWidth,
        h: 3.5,
        fontSize: this.getScaledSize(this.venue.bodySize - 2),
        fontFace: this.theme.fontBody,
        color: colors.text,
        italic: true,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Full bleed - text positioned for background overlay
  private addFullBleedSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle || { mood: 'dark' });
    const emphasisScale = this.getEmphasisScale(content.visualStyle?.emphasis || 'dramatic');

    // Dark overlay feel
    slide.background = { color: colors.background };

    if (content.title) {
      slide.addText(content.title, {
        x: '5%',
        y: '70%',
        w: '90%',
        h: 1,
        fontSize: this.getScaledSize(this.venue.titleSize * emphasisScale),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align: 'left',
        bold: true,
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: '5%',
        y: '82%',
        w: '90%',
        h: 0.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.textMuted,
        align: 'left',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  // Generic/fallback slide
  private addGenericSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    const colors = this.getSlideColors(content.visualStyle);
    const align = this.getAlignment(content.layout);

    slide.background = { color: colors.background };

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: '15%',
        w: '90%',
        h: 1,
        fontSize: this.getScaledSize(this.venue.titleSize - 4),
        fontFace: this.theme.fontHeading,
        color: colors.primary,
        align,
        bold: true,
      });
    }

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        align,
        valign: 'top',
      });
    }

    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: b, options: { bullet: true } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: content.title ? '35%' : '20%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: colors.text,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  public render(): void {
    for (const slide of this.deck.slides) {
      // Check for layout-specific rendering first
      if (slide.layout === 'split-50' || slide.layout === 'split-70-30' || slide.type === 'SPLIT') {
        this.addSplitSlide(slide);
        continue;
      }
      if (slide.layout === 'full-bleed' || slide.type === 'FULLBLEED') {
        this.addFullBleedSlide(slide);
        continue;
      }

      // Type-based rendering
      switch (slide.type) {
        case 'TITLE':
          this.addTitleSlide(slide);
          break;
        case 'BIG_IDEA':
          this.addBigIdeaSlide(slide);
          break;
        case 'SCRIPTURE':
          this.addScriptureSlide(slide);
          break;
        case 'MAIN_POINT':
        case 'NUMBERED_POINT':
          this.addMainPointSlide(slide);
          break;
        case 'QUOTE':
          this.addQuoteSlide(slide);
          break;
        case 'QUESTION':
          this.addQuestionSlide(slide);
          break;
        case 'TRANSITION':
          this.addTransitionSlide(slide);
          break;
        case 'APPLICATION':
          this.addApplicationSlide(slide);
          break;
        case 'APPEAL':
          this.addAppealSlide(slide);
          break;
        case 'ILLUSTRATION':
        case 'GOSPEL_CENTER':
        case 'DISCUSSION':
        case 'RECAP':
        case 'BLANK':
        default:
          this.addGenericSlide(slide);
          break;
      }
    }
  }

  public async download(): Promise<void> {
    const filename = this.deck.metadata.sermonTitle
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase();
    await this.pptx.writeFile({ fileName: `${filename}_sermon.pptx` });
  }

  public async getBlob(): Promise<Blob> {
    return await this.pptx.write({ outputType: 'blob' }) as Blob;
  }
}

export async function generateAndDownloadPPT(deck: SlideDeck): Promise<void> {
  const renderer = new SermonPPTRenderer(deck);
  renderer.render();
  await renderer.download();
}

// Alias for backward compatibility
export const downloadSermonPPT = generateAndDownloadPPT;
