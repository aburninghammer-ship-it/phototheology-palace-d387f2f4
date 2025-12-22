import { palaceFloors, type Room, type Floor } from "@/data/palaceData";

/**
 * CRITICAL: This file ensures Jeeves NEVER hallucinates Palace content.
 * All room references must match exactly what exists in palaceData.ts
 * 
 * LAST UPDATED: Added Mathematics Room (MATH) to Floor 5 - Vision Floor
 */

export interface ValidatedRoom {
  id: string;
  name: string;
  tag: string;
  floor: number;
  floorName: string;
  purpose: string;
  coreQuestion: string;
  method: string;
  examples: string[];
  pitfalls: string[];
}

// Build validated room registry from source of truth
export const VALID_ROOMS: Map<string, ValidatedRoom> = new Map();
export const ROOM_BY_TAG: Map<string, ValidatedRoom> = new Map();
export const ROOM_BY_NAME: Map<string, ValidatedRoom> = new Map();

// Initialize registry
palaceFloors.forEach(floor => {
  floor.rooms.forEach(room => {
    const validated: ValidatedRoom = {
      id: room.id,
      name: room.name,
      tag: room.tag,
      floor: floor.number,
      floorName: floor.name,
      purpose: room.purpose,
      coreQuestion: room.coreQuestion,
      method: room.method,
      examples: room.examples,
      pitfalls: room.pitfalls,
    };
    
    VALID_ROOMS.set(room.id, validated);
    ROOM_BY_TAG.set(room.tag.toUpperCase(), validated);
    ROOM_BY_NAME.set(room.name.toLowerCase(), validated);
  });
});

/**
 * Get the EXACT methodology for a room - NO HALLUCINATIONS ALLOWED
 */
export function getRoomMethod(roomIdOrTag: string): string | null {
  const upper = roomIdOrTag.toUpperCase();
  const room = VALID_ROOMS.get(roomIdOrTag) || ROOM_BY_TAG.get(upper);
  return room?.method || null;
}

/**
 * Get complete room details - MUST use this for any Palace references
 */
export function getValidatedRoom(roomIdOrTag: string): ValidatedRoom | null {
  const upper = roomIdOrTag.toUpperCase();
  return VALID_ROOMS.get(roomIdOrTag) || ROOM_BY_TAG.get(upper) || null;
}

/**
 * Generate the strict schema Jeeves MUST follow
 */
export function generatePalaceSchema(): string {
  let schema = "# PHOTOTHEOLOGY PALACE - COMPLETE ROOM REGISTRY\n\n";
  schema += "## CRITICAL: You may ONLY reference rooms that exist in this registry.\n";
  schema += "## NEVER make up methodologies. ALWAYS use the exact method listed below.\n\n";
  
  palaceFloors.forEach(floor => {
    schema += `\n### FLOOR ${floor.number}: ${floor.name.toUpperCase()}\n`;
    schema += `Subtitle: ${floor.subtitle}\n`;
    schema += `Description: ${floor.description}\n\n`;
    
    floor.rooms.forEach(room => {
      schema += `#### ${room.tag} - ${room.name}\n`;
      schema += `**Purpose:** ${room.purpose}\n\n`;
      schema += `**Core Question:** ${room.coreQuestion}\n\n`;
      schema += `**METHOD (USE EXACTLY AS WRITTEN):** ${room.method}\n\n`;
      schema += `**Examples:**\n`;
      room.examples.forEach(ex => schema += `- ${ex}\n`);
      schema += `\n**Pitfalls to Avoid:**\n`;
      room.pitfalls.forEach(pit => schema += `- ${pit}\n`);
      schema += `\n---\n\n`;
    });
  });
  
  return schema;
}

/**
 * STRUCTURAL CORRECTIONS - HARD CONSTRAINTS (Locked In)
 * These rules are treated as hard constraints, not preferences.
 */

export const STRUCTURAL_CONSTRAINTS = {
  // 1. No "Theological Floor" - theology is expressed through valid rooms and principles only
  NO_THEOLOGICAL_FLOOR: true,
  
  // 2. Connect-6 ONLY when ALL 6 genres are explicitly engaged
  CONNECT6_REQUIRES_ALL_SIX: true,
  
  // 3. 5D is Heaven Dimension (Dimensions Room), NOT part of Prophecy Room
  FIVE_D_IS_DIMENSIONS_ROOM: true,
  
  // 4. 24FPS is ONLY for mnemonic images tied to chapters/events, NOT analytical
  TWENTYFOUR_FPS_IS_MNEMONIC_ONLY: true,
  
  // 5. When a room has multiple principles, select ONE only
  ONE_PRINCIPLE_PER_ROOM: true,
  
  // Hard prohibitions
  NO_INVENTED_FLOORS: true,
  NO_PHANTOM_PRINCIPLES: true,
  NO_SYMBOLIC_DRIFT: true,
};

// The 6 valid Connect-6 genres (ALL must be engaged to use C6)
export const CONNECT6_GENRES = [
  "Prophecy",
  "Parable", 
  "Epistle",
  "History",
  "Gospel",
  "Poetry"
] as const;

// The 5 valid Dimensions (5D = Heaven, NOT eschatology/prophecy)
export const DIMENSIONS_5D = {
  "1D": "Literal - What the text literally says",
  "2D": "Christ - How it points to Jesus", 
  "3D": "Me - Personal application",
  "4D": "Church - Application to community of believers",
  "5D": "Heaven - Eternal/heavenly perspective (NOT eschatology)",
} as const;

// 24FPS valid usages (mnemonic ONLY)
export const VALID_24FPS_USAGES = [
  "chapter mnemonic image",
  "event mnemonic",
  "story frame",
  "visual anchor",
  "memory hook",
] as const;

// Invalid 24FPS usages (analytical - PROHIBITED)
export const INVALID_24FPS_USAGES = [
  "theological analysis",
  "doctrinal framework",
  "interpretive lens",
  "analytical engine",
  "reasoning tool",
] as const;

/**
 * Validate that a response follows STRUCTURAL CONSTRAINTS
 */
export function validateJeevesResponse(response: string): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for common hallucination patterns - invalid room tags
  const roomTagPattern = /\*\*([A-Z]{1,4})\s*[-:]/g;
  let match;
  
  while ((match = roomTagPattern.exec(response)) !== null) {
    const tag = match[1];
    if (!ROOM_BY_TAG.has(tag)) {
      errors.push(`HALLUCINATION: Invalid room tag "${tag}" - this room does not exist in the Palace`);
    }
  }
  
  // CONSTRAINT 1: No "Theological Floor" references
  if (response.match(/theological\s*floor/i)) {
    errors.push(
      `STRUCTURAL VIOLATION: "Theological Floor" referenced. There is no Theological Floor. ` +
      `Theology is expressed through valid rooms and principles only.`
    );
  }
  
  // CONSTRAINT 2: Connect-6 requires ALL 6 genres
  if (response.includes("Connect-6") || response.includes("C6")) {
    const c6Section = response.match(/Connect-6.*?(?=\n\n|\*\*[A-Z]|$)/is)?.[0] || "";
    const genresFound = CONNECT6_GENRES.filter(genre => 
      c6Section.toLowerCase().includes(genre.toLowerCase())
    );
    
    if (genresFound.length > 0 && genresFound.length < 6) {
      errors.push(
        `STRUCTURAL VIOLATION: Connect-6 used with only ${genresFound.length}/6 genres engaged. ` +
        `Connect-6 may NOT be used unless ALL 6 genres (Prophecy, Parable, Epistle, History, Gospel, Poetry) are explicitly engaged. ` +
        `Missing: ${CONNECT6_GENRES.filter(g => !genresFound.includes(g)).join(", ")}`
      );
    }
    
    // Also check for Theme Room themes being incorrectly used in C6
    const themeRoomThemes = [
      "Life of Christ Wall", "Sanctuary Wall", "Time Prophecy Wall",
      "Time-Prophecy Wall", "Great Controversy Wall", "Heaven Ceiling", "Gospel Floor"
    ];
    
    themeRoomThemes.forEach(theme => {
      if (c6Section.includes(theme)) {
        errors.push(
          `STRUCTURAL VIOLATION: "${theme}" found in Connect-6 section. ` +
          `These themes belong to Theme Room (TRm), NOT Connect-6. ` +
          `Connect-6 is about GENRE rules only.`
        );
      }
    });
  }
  
  // CONSTRAINT 3: 5D is Dimensions Room (Heaven), NOT Prophecy
  if (response.match(/5D.*?(eschatolog|prophecy|prophetic|end.?time|apocalyptic)/i) ||
      response.match(/(eschatolog|prophetic\s+goal|end.?time|apocalyptic).*?5D/i)) {
    warnings.push(
      `STRUCTURAL WARNING: 5D appears to be used for eschatology/prophecy. ` +
      `5D = Heaven Dimension (Dimensions Room) - eternal/heavenly perspective. ` +
      `It is NOT "eschatological goal" or part of Prophecy Room.`
    );
  }
  
  // CONSTRAINT 4: 24FPS is mnemonic ONLY
  if (response.includes("24FPS") || response.includes("24F")) {
    const fps24Section = response.match(/24FPS.*?(?=\n\n|\*\*[A-Z]|$)/is)?.[0] || "";
    
    const analyticalUsage = INVALID_24FPS_USAGES.some(usage => 
      fps24Section.toLowerCase().includes(usage.toLowerCase())
    );
    
    if (analyticalUsage) {
      errors.push(
        `STRUCTURAL VIOLATION: 24FPS used as analytical engine. ` +
        `24FPS is ONLY for mnemonic images tied to chapters or events. ` +
        `It suggests visual anchors, NOT theological analysis.`
      );
    }
    
    // Check if it's being used without mnemonic purpose
    const hasMnemonicPurpose = VALID_24FPS_USAGES.some(usage =>
      fps24Section.toLowerCase().includes(usage.toLowerCase())
    ) || fps24Section.match(/image|picture|visual|frame|scene|anchor/i);
    
    if (!hasMnemonicPurpose && fps24Section.length > 100) {
      warnings.push(
        `STRUCTURAL WARNING: 24FPS section may lack mnemonic purpose. ` +
        `Ensure it's suggesting a memorable image, not doing theological analysis.`
      );
    }
  }
  
  // Check Bible Freestyle isn't doing philosophy
  if (response.includes("Bible Freestyle") || response.includes("BF")) {
    const bfSection = response.match(/Bible Freestyle.*?(?=\*\*|$)/s)?.[0] || "";
    if (bfSection.length > 300 && !bfSection.match(/→.*?→/)) {
      errors.push(
        `STRUCTURAL VIOLATION: Bible Freestyle doing theological analysis instead of Verse Genetics. ` +
        `BF method: "Pick a verse; name 3–5 'relatives' (brothers/cousins)." ` +
        `Example: "John 3:16 → Rom 5:8, 1 John 4:9-10, Eph 2:4-5"`
      );
    }
  }
  
  // CONSTRAINT 5 & 6: Check for invented floors or phantom principles
  const inventedFloorPatterns = [
    /floor\s*9/i, /ninth\s*floor/i, /theological\s*floor/i,
    /floor\s*10/i, /tenth\s*floor/i
  ];
  
  inventedFloorPatterns.forEach(pattern => {
    if (response.match(pattern)) {
      errors.push(`STRUCTURAL VIOLATION: Invented floor detected. Only Floors 0-8 exist.`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate gem content before saving
 */
export function validateGemContent(gemContent: string): {
  valid: boolean;
  errors: string[];
  tier: "beginner" | "intermediate" | "master" | "unknown";
} {
  const errors: string[] = [];
  let tier: "beginner" | "intermediate" | "master" | "unknown" = "unknown";
  
  // Detect tier
  if (gemContent.match(/beginner\s*gem/i)) tier = "beginner";
  else if (gemContent.match(/intermediate\s*gem/i)) tier = "intermediate";
  else if (gemContent.match(/master\s*gem/i)) tier = "master";
  
  // Run structural validation
  const structuralValidation = validateJeevesResponse(gemContent);
  errors.push(...structuralValidation.errors);
  
  // Master tier specific validation
  if (tier === "master") {
    // Master tier should have higher density and assume fluency
    if (gemContent.length < 500) {
      errors.push(`Master tier gem may be too brief. Master assumes fluency and density.`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    tier
  };
}

/**
 * Get list of all valid room tags for quick reference
 */
export function getAllRoomTags(): string[] {
  return Array.from(ROOM_BY_TAG.keys());
}

/**
 * Get rooms for a specific floor
 */
export function getRoomsByFloor(floorNumber: number): ValidatedRoom[] {
  return Array.from(VALID_ROOMS.values()).filter(r => r.floor === floorNumber);
}
