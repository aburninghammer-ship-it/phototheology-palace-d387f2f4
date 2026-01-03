import PptxGenJS from 'pptxgenjs';
import { 
  SlideDeck, 
  SlideContent, 
  PPT_THEMES, 
  VENUE_PRESETS,
  ThemeId,
  VenueSize 
} from '@/types/sermonPPT';

export class SermonPPTRenderer {
  private pptx: PptxGenJS;
  private deck: SlideDeck;
  private theme: typeof PPT_THEMES[ThemeId];
  private venue: typeof VENUE_PRESETS[VenueSize];

  constructor(deck: SlideDeck) {
    this.pptx = new PptxGenJS();
    this.deck = deck;
    this.theme = PPT_THEMES[deck.theme];
    this.venue = VENUE_PRESETS[deck.venue];

    // Set presentation properties
    this.pptx.author = deck.metadata.preacher || 'Phototheology';
    this.pptx.title = deck.metadata.sermonTitle;
    this.pptx.subject = `Sermon: ${deck.metadata.sermonTitle}`;
    this.pptx.company = deck.metadata.church || 'Phototheology Palace';
  }

  private getScaledSize(baseSize: number): number {
    return Math.round(baseSize * this.venue.fontScale);
  }

  private addTitleSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Main title
    slide.addText(content.title || this.deck.metadata.sermonTitle, {
      x: 0.5,
      y: '35%',
      w: '90%',
      h: 1.5,
      fontSize: this.getScaledSize(this.venue.titleSize + 8),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.primary,
      align: 'center',
      bold: true,
    });

    // Subtitle (theme passage)
    if (content.subtitle || this.deck.metadata.themePassage) {
      slide.addText(content.subtitle || this.deck.metadata.themePassage || '', {
        x: 0.5,
        y: '55%',
        w: '90%',
        h: 0.8,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: this.theme.colors.accent,
        align: 'center',
        italic: true,
      });
    }

    // Preacher/Date
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
        color: this.theme.colors.textMuted,
        align: 'center',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addBigIdeaSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.accent };

    slide.addText(content.title || 'BIG IDEA', {
      x: 0.5,
      y: '15%',
      w: '90%',
      h: 0.6,
      fontSize: this.getScaledSize(this.venue.captionSize + 2),
      fontFace: this.theme.fontBody,
      color: this.theme.colors.background,
      align: 'center',
      bold: true,
    });

    slide.addText(content.body || '', {
      x: 0.5,
      y: '30%',
      w: '90%',
      h: 2.5,
      fontSize: this.getScaledSize(this.venue.titleSize - 4),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.background,
      align: 'center',
      bold: true,
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addScriptureSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Reference
    slide.addText(content.scripture?.reference || content.title || '', {
      x: 0.5,
      y: '10%',
      w: '90%',
      h: 0.6,
      fontSize: this.getScaledSize(this.venue.bodySize + 4),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.accent,
      align: 'center',
      bold: true,
    });

    // Scripture text
    slide.addText(content.scripture?.text || content.body || '', {
      x: 0.75,
      y: '25%',
      w: '85%',
      h: 3,
      fontSize: this.getScaledSize(this.venue.bodySize + 2),
      fontFace: this.theme.fontBody,
      color: this.theme.colors.text,
      align: 'center',
      valign: 'middle',
      italic: true,
    });

    // Version
    if (content.scripture?.version || this.deck.metadata.bibleVersion) {
      slide.addText(content.scripture?.version || this.deck.metadata.bibleVersion, {
        x: 0.5,
        y: '85%',
        w: '90%',
        h: 0.4,
        fontSize: this.getScaledSize(this.venue.captionSize),
        fontFace: this.theme.fontBody,
        color: this.theme.colors.textMuted,
        align: 'center',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addMainPointSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Point number/title
    slide.addText(content.title || '', {
      x: 0.5,
      y: '15%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.primary,
      align: 'left',
      bold: true,
    });

    // Body or bullets
    if (content.bullets && content.bullets.length > 0) {
      const bulletText = content.bullets.map(b => ({ text: b, options: { bullet: true } }));
      slide.addText(bulletText, {
        x: 0.5,
        y: '35%',
        w: '90%',
        h: 3,
        fontSize: this.getScaledSize(this.venue.bodySize),
        fontFace: this.theme.fontBody,
        color: this.theme.colors.text,
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
        color: this.theme.colors.text,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addQuoteSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    // Quote mark
    slide.addText('"', {
      x: 0.3,
      y: '10%',
      w: 1,
      h: 1,
      fontSize: 72,
      fontFace: 'Georgia',
      color: this.theme.colors.accent,
    });

    // Quote text
    slide.addText(content.quote?.text || content.body || '', {
      x: 0.75,
      y: '25%',
      w: '85%',
      h: 2.5,
      fontSize: this.getScaledSize(this.venue.bodySize + 4),
      fontFace: this.theme.fontBody,
      color: this.theme.colors.text,
      align: 'center',
      valign: 'middle',
      italic: true,
    });

    // Attribution
    if (content.quote?.attribution) {
      slide.addText(`— ${content.quote.attribution}`, {
        x: 0.5,
        y: '75%',
        w: '90%',
        h: 0.5,
        fontSize: this.getScaledSize(this.venue.captionSize + 2),
        fontFace: this.theme.fontBody,
        color: this.theme.colors.textMuted,
        align: 'right',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addQuestionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.secondary };

    slide.addText('?', {
      x: '42%',
      y: '5%',
      w: 1.5,
      h: 1.5,
      fontSize: 80,
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.accent,
      align: 'center',
    });

    slide.addText(content.body || content.title || '', {
      x: 0.5,
      y: '35%',
      w: '90%',
      h: 2,
      fontSize: this.getScaledSize(this.venue.titleSize - 8),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.text,
      align: 'center',
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addTransitionSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    slide.addText(content.title || '', {
      x: 0.5,
      y: '40%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize - 4),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.accent,
      align: 'center',
      valign: 'middle',
    });

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addApplicationSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    slide.addText('APPLICATION', {
      x: 0.5,
      y: '10%',
      w: '90%',
      h: 0.5,
      fontSize: this.getScaledSize(this.venue.captionSize),
      fontFace: this.theme.fontBody,
      color: this.theme.colors.accent,
      align: 'left',
      bold: true,
    });

    slide.addText(content.title || '', {
      x: 0.5,
      y: '18%',
      w: '90%',
      h: 0.8,
      fontSize: this.getScaledSize(this.venue.titleSize - 8),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.primary,
      align: 'left',
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
        color: this.theme.colors.text,
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
        color: this.theme.colors.text,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  private addAppealSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.accent };

    slide.addText(content.title || 'INVITATION', {
      x: 0.5,
      y: '25%',
      w: '90%',
      h: 1,
      fontSize: this.getScaledSize(this.venue.titleSize),
      fontFace: this.theme.fontHeading,
      color: this.theme.colors.background,
      align: 'center',
      bold: true,
    });

    if (content.body) {
      slide.addText(content.body, {
        x: 0.5,
        y: '50%',
        w: '90%',
        h: 2,
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

  private addGenericSlide(content: SlideContent): void {
    const slide = this.pptx.addSlide();
    slide.background = { color: this.theme.colors.background };

    if (content.title) {
      slide.addText(content.title, {
        x: 0.5,
        y: '15%',
        w: '90%',
        h: 1,
        fontSize: this.getScaledSize(this.venue.titleSize - 4),
        fontFace: this.theme.fontHeading,
        color: this.theme.colors.primary,
        align: 'left',
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
        color: this.theme.colors.text,
        valign: 'top',
      });
    }

    if (content.speakerNotes) {
      slide.addNotes(content.speakerNotes);
    }
  }

  public render(): void {
    for (const slide of this.deck.slides) {
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
