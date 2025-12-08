// Phototheology Palace Card Images Registry
// Maps room IDs to their card artwork

// Floor 1 - Furnishing (Green cards)
// No cards uploaded yet

// Floor 2 - Investigation (Yellow cards)
import questionsRoom from "@/assets/cards/floor2/questions-room.jpeg";

// Floor 3 - Freestyle (Orange cards)
import listeningRoom from "@/assets/cards/floor3/listening-room.jpeg";
import historySocialFreestyle from "@/assets/cards/floor3/history-social-freestyle.jpeg";
import natureFreestyle from "@/assets/cards/floor3/nature-freestyle.jpeg";
import lifeExperienceFreestyle from "@/assets/cards/floor3/life-experience-freestyle.jpeg";

// Floor 4 - Next Level (Red cards)
// No cards uploaded yet

// Floor 5 - Vision (Blue cards)
import blueRoom from "@/assets/cards/floor5/blue-room.jpeg";
import threeAngelsRoom from "@/assets/cards/floor5/three-angels-room.jpeg";

// Floor 6-8 cards
// No cards uploaded yet

// Card back
import cardBack from "@/assets/cards/card-back.jpeg";

export interface CardImage {
  roomId: string;
  roomName: string;
  floor: number;
  imagePath: string;
  instruction: string;
}

// Registry mapping room IDs to card images
export const cardImageRegistry: Record<string, string> = {
  // Floor 2 - Investigation
  "qr": questionsRoom,
  
  // Floor 3 - Freestyle
  "lr": listeningRoom,
  "hf": historySocialFreestyle,
  "nf": natureFreestyle,
  "pf": lifeExperienceFreestyle,
  
  // Floor 5 - Vision
  "bl": blueRoom,
  "3a": threeAngelsRoom,
};

// Card metadata for the deck feature
export const cardData: CardImage[] = [
  // Floor 2 - Investigation (Yellow)
  {
    roomId: "qr",
    roomName: "Questions Room",
    floor: 2,
    imagePath: questionsRoom,
    instruction: "Use this card to ask the text as many questions as you can. This card is designed to help you investigate a text more closely. Aim for 50 to 100 questions, even from the shortest text of the Bible, \"Jesus wept.\""
  },
  
  // Floor 3 - Freestyle (Orange)
  {
    roomId: "nf",
    roomName: "Nature/Freestyle Room",
    floor: 3,
    imagePath: natureFreestyle,
    instruction: "Apply an object lesson from nature in connection with the text."
  },
  {
    roomId: "pf",
    roomName: "Life Experience Freestyle Room",
    floor: 3,
    imagePath: lifeExperienceFreestyle,
    instruction: "Use a life experience to illustrate the lesson from the text."
  },
  {
    roomId: "hf",
    roomName: "History/Social Freestyle Room",
    floor: 3,
    imagePath: historySocialFreestyle,
    instruction: "Use an example from secular history to illustrate a lesson from the text."
  },
  {
    roomId: "lr",
    roomName: "Listening Room",
    floor: 3,
    imagePath: listeningRoom,
    instruction: "Pull a lesson from a sermon you've heard previously to help expound upon the text."
  },
  
  // Floor 5 - Vision (Blue)
  {
    roomId: "bl",
    roomName: "Blue Room",
    floor: 5,
    imagePath: blueRoom,
    instruction: "Study the text in greater detail of the Sanctuary."
  },
  {
    roomId: "3a",
    roomName: "Three Angels Room",
    floor: 5,
    imagePath: threeAngelsRoom,
    instruction: "Study the text in the context of the Revelation 14:6-12 specifically."
  },
];

// Get card back image
export const getCardBack = () => cardBack;

// Get card image for a room, returns undefined if no card exists
export const getCardImage = (roomId: string): string | undefined => {
  return cardImageRegistry[roomId.toLowerCase()];
};

// Get all cards for a specific floor
export const getCardsByFloor = (floor: number): CardImage[] => {
  return cardData.filter(card => card.floor === floor);
};

// Get all available cards
export const getAllCards = (): CardImage[] => {
  return cardData;
};

// Floor color themes
export const floorColors: Record<number, { bg: string; border: string; name: string }> = {
  1: { bg: "bg-emerald-900/30", border: "border-emerald-500", name: "green" },
  2: { bg: "bg-yellow-900/30", border: "border-yellow-500", name: "yellow" },
  3: { bg: "bg-orange-900/30", border: "border-orange-500", name: "orange" },
  4: { bg: "bg-red-900/30", border: "border-red-500", name: "red" },
  5: { bg: "bg-blue-900/30", border: "border-blue-500", name: "blue" },
  6: { bg: "bg-purple-900/30", border: "border-purple-500", name: "purple" },
  7: { bg: "bg-pink-900/30", border: "border-pink-500", name: "pink" },
  8: { bg: "bg-amber-900/30", border: "border-amber-500", name: "gold" },
};
