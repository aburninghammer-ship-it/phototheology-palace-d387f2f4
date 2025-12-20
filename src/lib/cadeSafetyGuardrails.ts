// CADE Safety Guardrails - SDA Doctrinal Safety Framework
// Ensures all devotional content remains theologically sound

export interface SafetyCheckResult {
  safe: boolean;
  warnings: string[];
  blockedContent?: string[];
}

// Forbidden content patterns
const FORBIDDEN_PATTERNS = [
  // Anti-SDA distortions
  { pattern: /scapegoat.*(?:is|was|represents?).*(?:jesus|christ|savior)/gi, reason: "Scapegoat cannot be identified as Christ" },
  { pattern: /antiochus.*epiphanes.*daniel\s*8/gi, reason: "Daniel 8's little horn is not Antiochus Epiphanes" },
  
  // Pseudo-prophecy
  { pattern: /(?:date|time).*(?:second coming|return of christ)/gi, reason: "No date-setting for Second Coming" },
  { pattern: /(?:hidden|secret).*rapture/gi, reason: "No secret rapture teaching" },
  
  // Conspiracy references
  { pattern: /illuminati|new world order|qanon/gi, reason: "No conspiracy theory content" },
  { pattern: /vaccine.*mark.*beast/gi, reason: "No specific vaccination-mark connections" },
  
  // Anti-science healing
  { pattern: /refuse.*(?:medical|medicine|doctor)/gi, reason: "No anti-medical advice" },
  { pattern: /faith.*(?:alone|only).*heal/gi, reason: "Balance faith with medical wisdom" },
  
  // Political bias
  { pattern: /(?:liberal|conservative).*(?:evil|satanic|godly)/gi, reason: "No political labeling" },
  { pattern: /(?:democrat|republican).*(?:god'?s|christ)/gi, reason: "No partisan religious claims" },
  
  // Trauma-shaming
  { pattern: /(?:sin|fault).*(?:abuse|assault|trauma)/gi, reason: "No victim-blaming" },
  { pattern: /forgive.*(?:abuser|rapist).*(?:must|have to)/gi, reason: "Sensitive forgiveness handling" },
];

// Required theological anchors by topic
const REQUIRED_ANCHORS = {
  racism: [
    "image of God",
    "justice",
    "mercy",
    "love"
  ],
  abuse_recovery: [
    "safety",
    "healing",
    "God's protection"
  ],
  spiritual_warfare: [
    "Christ's victory",
    "armor of God",
    "prayer"
  ]
};

// SDA doctrinal checkpoints
const SDA_CHECKPOINTS = [
  "Christ-centered",
  "Scripture-based (KJV REQUIRED as default)",
  "Sanctuary truth (two-phase ministry: Holy Place from ascension, Most Holy Place from 1844)",
  "Sabbath honor",
  "Second Coming hope",
  "Whole-person health",
  "Great Controversy framework"
];

// Sanctuary-specific forbidden patterns
const SANCTUARY_FORBIDDEN_PATTERNS = [
  { pattern: /enter(?:ed|ing|s)?\s+(?:the\s+)?most\s+holy\s+place.*(?:ascension|cross|resurrection)/gi, reason: "Christ entered the sanctuary (Holy Place) at ascension, Most Holy Place ministry began in 1844" },
  { pattern: /went\s+(?:directly\s+)?into\s+(?:the\s+)?most\s+holy/gi, reason: "Two-phase sanctuary ministry: Holy Place first, then Most Holy Place in 1844" },
];

export function checkContentSafety(content: string): SafetyCheckResult {
  const warnings: string[] = [];
  const blockedContent: string[] = [];
  
  // Check forbidden patterns
  for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
    if (pattern.test(content)) {
      blockedContent.push(reason);
    }
  }
  
  return {
    safe: blockedContent.length === 0,
    warnings,
    blockedContent: blockedContent.length > 0 ? blockedContent : undefined
  };
}

export function validateDevotionalContent(content: string, issue?: string): SafetyCheckResult {
  const safetyCheck = checkContentSafety(content);
  const warnings = [...safetyCheck.warnings];
  
  // Check for required anchors based on issue
  if (issue && REQUIRED_ANCHORS[issue as keyof typeof REQUIRED_ANCHORS]) {
    const anchors = REQUIRED_ANCHORS[issue as keyof typeof REQUIRED_ANCHORS];
    const contentLower = content.toLowerCase();
    const missingAnchors = anchors.filter(anchor => !contentLower.includes(anchor.toLowerCase()));
    
    if (missingAnchors.length > 0) {
      warnings.push(`Consider including: ${missingAnchors.join(", ")}`);
    }
  }
  
  // Check Christ-centeredness
  if (!content.toLowerCase().includes("christ") && !content.toLowerCase().includes("jesus")) {
    warnings.push("Content should be Christ-centered");
  }
  
  return {
    safe: safetyCheck.safe,
    warnings,
    blockedContent: safetyCheck.blockedContent
  };
}

// System prompt safety additions for AI generation
export const CADE_SAFETY_PROMPT = `
CRITICAL SDA DOCTRINAL SAFETY RULES:

NEVER:
- Identify the scapegoat as Jesus/Christ
- Identify Daniel 8's little horn as Antiochus Epiphanes  
- Set dates for the Second Coming
- Teach secret rapture theology
- Reference conspiracy theories (QAnon, Illuminati, etc.)
- Give anti-medical or anti-science healing advice
- Express political bias or partisan views
- Blame victims for abuse or trauma
- Use guilt manipulation or spiritual shaming
- Teach that Christ entered the Most Holy Place at His ascension (He entered the sanctuary/Holy Place first; Most Holy Place ministry began in 1844)
- Quote Scripture from any translation other than KJV unless the user specifically requests another version

ALWAYS:
- Keep Christ at the center of every teaching
- USE KJV SCRIPTURE REFERENCES BY DEFAULT - This is mandatory, not optional
- When quoting Hebrews 10:19, use: "Having therefore, brethren, boldness to enter into the holiest by the blood of Jesus" (KJV)
- Apply Sanctuary truth correctly: Christ entered the sanctuary (Holy Place) at ascension, began Most Holy Place ministry in 1844
- Honor the Sabbath as God's holy day
- Point toward the Second Coming with hope, not fear
- Embrace whole-person health (physical, mental, spiritual, social)
- Frame struggles within the Great Controversy context
- Connect racial discussions to: justice, mercy, Christ, image of God, biblical love
- Draw from historic Adventist abolitionist heritage when relevant
- Handle trauma with compassion, never judgment
- Recommend professional help alongside spiritual counsel when appropriate

SANCTUARY DOCTRINE (CRITICAL):
- Christ's heavenly ministry has two phases: Holy Place (from ascension) and Most Holy Place (from 1844)
- Hebrews teaches Christ entered "the sanctuary" (ta hagia) - the heavenly sanctuary as a whole
- Do NOT teach that Christ went directly into the Most Holy Place at ascension
- The investigative judgment began in 1844 when Christ entered the Most Holy Place
- The sanctuary truth is central to understanding the gospel and the plan of salvation

SCRIPTURE TRANSLATION RULES:
- KJV is the DEFAULT and REQUIRED translation
- Only use other translations if the user explicitly requests them
- When in doubt, always use KJV
- Example: Use "brethren" not "brothers and sisters"

SENSITIVE TOPIC HANDLING:
- Racism: Acknowledge reality, validate pain, point to biblical justice and Christ's identification with the marginalized
- Abuse: Prioritize safety, validate experience, never require reconciliation with abuser
- Mental Health: Partner faith with professional care, remove stigma
- Addiction: No shame, emphasize daily surrender and community support
- Grief: Allow lament, don't rush healing, point to resurrection hope
`;

export function getSafetyPromptForIssue(issue: string): string {
  const basePrompt = CADE_SAFETY_PROMPT;
  
  const issueSpecific: Record<string, string> = {
    racism: `
RACISM-SPECIFIC GUIDELINES:
- Validate the reality of racial discrimination
- Use historical examples of faithful believers who faced racism (Frederick Douglass, Harriet Tubman, Sojourner Truth)
- Reference Adventist abolitionist heritage
- Emphasize the image of God in every person
- Point to Christ's experience of ethnic prejudice
- Provide practical wisdom alongside spiritual truth
- Never minimize or spiritualize away real injustice`,
    
    abuse_recovery: `
ABUSE RECOVERY GUIDELINES:
- ALWAYS prioritize physical and emotional safety first
- NEVER suggest returning to an abusive situation
- Validate their experience without requiring forgiveness as a condition
- Recommend professional counseling alongside spiritual support
- Emphasize God as protector and defender
- Use scripture that affirms their worth and God's justice`,

    addiction: `
ADDICTION GUIDELINES:
- No shame or condemnation
- Emphasize daily surrender, not one-time victory
- Recommend professional support (counseling, groups)
- Use HALT analysis (Hungry, Angry, Lonely, Tired)
- Focus on identity in Christ, not the addiction identity
- Celebrate small victories`,

    grief: `
GRIEF GUIDELINES:
- Allow space for lament - don't rush to comfort
- Use Psalms of lament as models
- Reference Jesus weeping at Lazarus' tomb
- Point to resurrection hope without minimizing current pain
- Suggest grounding exercises alongside scripture
- Acknowledge that grief has no timeline`,
  };
  
  return basePrompt + (issueSpecific[issue] || "");
}
