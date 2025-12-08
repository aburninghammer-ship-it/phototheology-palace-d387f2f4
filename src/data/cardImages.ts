// Phototheology Palace Card Images Registry
// Maps room IDs to their card artwork

// Floor 1 - Furnishing (Green cards)
import storyRoom from "@/assets/cards/floor1/story-room.jpeg";
import translationRoom from "@/assets/cards/floor1/translation-room.jpeg";
import movieRoom from "@/assets/cards/floor1/movie-room.jpeg";
import fps24Room from "@/assets/cards/floor1/24fps-room.jpeg";
import floor1Back from "@/assets/cards/floor1/card-back.jpeg";

// Floor 2 - Investigation (Yellow cards)
import questionsRoom from "@/assets/cards/floor2/questions-room.jpeg";
import qaRoom from "@/assets/cards/floor2/qa-room.jpeg";
import defComRoom from "@/assets/cards/floor2/def-com-room.jpeg";
import symbolsTypesRoom from "@/assets/cards/floor2/symbols-types-room.jpeg";
import floor2Back from "@/assets/cards/floor2/card-back.jpeg";

// Floor 3 - Freestyle (Orange cards)
import listeningRoom from "@/assets/cards/floor3/listening-room.jpeg";
import historySocialFreestyle from "@/assets/cards/floor3/history-social-freestyle.jpeg";
import natureFreestyle from "@/assets/cards/floor3/nature-freestyle.jpeg";
import lifeExperienceFreestyle from "@/assets/cards/floor3/life-experience-freestyle.jpeg";
import bibleFreestyle from "@/assets/cards/floor3/bible-freestyle.jpeg";

// Floor 4 - Next Level (Red cards)
import fruitGentleness from "@/assets/cards/floor4/fruit-gentleness.jpeg";
import fruitPeace from "@/assets/cards/floor4/fruit-peace.jpeg";
import fruitMeekness from "@/assets/cards/floor4/fruit-meekness.jpeg";
import fruitTemperance from "@/assets/cards/floor4/fruit-temperance.jpeg";
import fruitLongsuffering from "@/assets/cards/floor4/fruit-longsuffering.jpeg";
import fruitJoy from "@/assets/cards/floor4/fruit-joy.jpeg";
import fruitFaith from "@/assets/cards/floor4/fruit-faith.jpeg";
import fruitLove from "@/assets/cards/floor4/fruit-love.jpeg";
import fruitGoodness from "@/assets/cards/floor4/fruit-goodness.jpeg";
import timezoneHeavenPresent from "@/assets/cards/floor4/timezone-heaven-present.jpeg";
import timezoneHeavenPast from "@/assets/cards/floor4/timezone-heaven-past.jpeg";
import timezoneHeavenFuture from "@/assets/cards/floor4/timezone-heaven-future.jpeg";
import timezoneEarthFuture from "@/assets/cards/floor4/timezone-earth-future.jpeg";
import timezoneEarthPresent from "@/assets/cards/floor4/timezone-earth-present.jpeg";
import timezoneEarthPast from "@/assets/cards/floor4/timezone-earth-past.jpeg";
import connect6Parables from "@/assets/cards/floor4/connect6-parables.jpeg";
import connect6Gospels from "@/assets/cards/floor4/connect6-gospels.jpeg";

// Floor 5 - Vision (Blue cards)
import blueRoom from "@/assets/cards/floor5/blue-room.jpeg";
import threeAngelsRoom from "@/assets/cards/floor5/three-angels-room.jpeg";

// Floor 6 - Three Heavens (Purple cards) - Mathematics Room variants
import mathDaniel70week from "@/assets/cards/floor6/math-daniel-70week.jpeg";
import math70year from "@/assets/cards/floor6/math-70year.jpeg";
import mathNoah120year from "@/assets/cards/floor6/math-noah-120year.jpeg";
import mathExodus400 from "@/assets/cards/floor6/math-exodus-400.jpeg";
import math1260year from "@/assets/cards/floor6/math-1260year.jpeg";
import math2300year from "@/assets/cards/floor6/math-2300year.jpeg";
import mathDivine from "@/assets/cards/floor6/math-divine.jpeg";
// Floor 6 - 8 Cycles Room cards
import cycle1Adamic from "@/assets/cards/floor6/cycle-1-adamic.jpeg";
import cycle2Noahic from "@/assets/cards/floor6/cycle-2-noahic.jpeg";
import cycle3Semitic from "@/assets/cards/floor6/cycle-3-semitic.jpeg";
import cycle4Abrahamic from "@/assets/cards/floor6/cycle-4-abrahamic.jpeg";

// Floor 7 - Spiritual/Emotional (Turquoise cards)
import meditationRoom from "@/assets/cards/floor7/meditation-room.jpeg";
import fireRoom from "@/assets/cards/floor7/fire-room.jpeg";
import floor7Back from "@/assets/cards/floor7/card-back.jpeg";

// Default card back
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
  // Floor 1 - Furnishing
  "sr": storyRoom,
  "tr": translationRoom,
  "br": movieRoom,
  "24": fps24Room,
  
  // Floor 2 - Investigation
  "qr": questionsRoom,
  "qa": qaRoom,
  "dc": defComRoom,
  "st": symbolsTypesRoom,
  
  // Floor 3 - Freestyle
  "lr": listeningRoom,
  "hf": historySocialFreestyle,
  "nf": natureFreestyle,
  "pf": lifeExperienceFreestyle,
  "bf": bibleFreestyle,
  
  // Floor 4 - Next Level (Fruit Room variants + Time Zone)
  "frt-gentleness": fruitGentleness,
  "frt-peace": fruitPeace,
  "frt-meekness": fruitMeekness,
  "frt-temperance": fruitTemperance,
  "frt-longsuffering": fruitLongsuffering,
  "frt-joy": fruitJoy,
  "frt-faith": fruitFaith,
  "frt-love": fruitLove,
  "frt-goodness": fruitGoodness,
  "tz-heaven-present": timezoneHeavenPresent,
  "tz-heaven-past": timezoneHeavenPast,
  "tz-heaven-future": timezoneHeavenFuture,
  "tz-earth-future": timezoneEarthFuture,
  "tz-earth-present": timezoneEarthPresent,
  "tz-earth-past": timezoneEarthPast,
  "c6-parables": connect6Parables,
  "c6-gospels": connect6Gospels,
  
  // Floor 5 - Vision
  "bl": blueRoom,
  "3a": threeAngelsRoom,
  
  // Floor 6 - Three Heavens (Mathematics Room variants)
  "math-70week": mathDaniel70week,
  "math-70year": math70year,
  "math-120year": mathNoah120year,
  "math-400year": mathExodus400,
  "math-1260year": math1260year,
  "math-2300year": math2300year,
  "math-divine": mathDivine,
  // Floor 6 - 8 Cycles Room
  "@ad": cycle1Adamic,
  "@no": cycle2Noahic,
  "@se": cycle3Semitic,
  "@ab": cycle4Abrahamic,
  
  // Floor 7 - Spiritual/Emotional
  "mr": meditationRoom,
  "frm": fireRoom,
};

// Floor-specific card backs
export const floorCardBacks: Record<number, string> = {
  1: floor1Back,
  2: floor2Back,
  7: floor7Back,
};

// Card metadata for the deck feature
export const cardData: CardImage[] = [
  // Floor 1 - Furnishing (Green)
  {
    roomId: "sr",
    roomName: "Story Room",
    floor: 1,
    imagePath: storyRoom,
    instruction: "This card encourages the memorization of Bible stories. These will be the building blocks of your \"Freestyle.\""
  },
  {
    roomId: "tr",
    roomName: "Translation (Encoding) Room",
    floor: 1,
    imagePath: translationRoom,
    instruction: "This card teaches us to translate the text from word to image. Translating Philippians 2:5, \"Let this mind be in you, which was also in Christ Jesus,\" one might see a hospital room where a \"brain transplant\" is occurring."
  },
  {
    roomId: "br",
    roomName: "Movie Room (The Bible Rendered)",
    floor: 1,
    imagePath: movieRoom,
    instruction: "This room juices down each set of 24 chapters into one image for a total of 50 images that move you from Genesis to Revelation."
  },
  {
    roomId: "24",
    roomName: "24FPS Room",
    floor: 1,
    imagePath: fps24Room,
    instruction: "This room focuses on memorizing the themes of each chapter, 24 chapters at a time. Create your own image for the theme of each chapter."
  },
  
  // Floor 2 - Investigation (Yellow)
  {
    roomId: "qr",
    roomName: "Questions Room",
    floor: 2,
    imagePath: questionsRoom,
    instruction: "Use this card to ask the text as many questions as you can. This card is designed to help you investigate a text more closely. Aim for 50 to 100 questions, even from the shortest text of the Bible, \"Jesus wept.\""
  },
  {
    roomId: "qa",
    roomName: "Question and Answer Room",
    floor: 2,
    imagePath: qaRoom,
    instruction: "Ask the text a series of questions and each by finding the answer in another text."
  },
  {
    roomId: "dc",
    roomName: "Def-Com Room / E-Sword",
    floor: 2,
    imagePath: defComRoom,
    instruction: "Using Bible software or Bible study materials (concordance, etc.) look up key words, meanings, and commentary to learn more about the text."
  },
  {
    roomId: "st",
    roomName: "Symbols/Types Room",
    floor: 2,
    imagePath: symbolsTypesRoom,
    instruction: "What symbols or types are in the story or can be connected to the story?"
  },
  
  // Floor 3 - Freestyle (Orange)
  {
    roomId: "nf",
    roomName: "Nature Freestyle Room",
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
  {
    roomId: "bf",
    roomName: "Bible Freestyle Room (Verse Genetics)",
    floor: 3,
    imagePath: bibleFreestyle,
    instruction: "Connect a \"random\" text with the text and find the connection between them."
  },
  
  // Floor 4 - Next Level (Red) - Fruit Room variants
  {
    roomId: "frt-love",
    roomName: "Fruit Room - Love",
    floor: 4,
    imagePath: fruitLove,
    instruction: "Study the text in the context of the specific fruit of the spirit: LOVE."
  },
  {
    roomId: "frt-joy",
    roomName: "Fruit Room - Joy",
    floor: 4,
    imagePath: fruitJoy,
    instruction: "Study the text in the context of the specific fruit of the spirit: JOY."
  },
  {
    roomId: "frt-peace",
    roomName: "Fruit Room - Peace",
    floor: 4,
    imagePath: fruitPeace,
    instruction: "Study the text in the context of the specific fruit of the spirit: PEACE."
  },
  {
    roomId: "frt-longsuffering",
    roomName: "Fruit Room - Longsuffering",
    floor: 4,
    imagePath: fruitLongsuffering,
    instruction: "Study the text in the context of the specific fruit of the spirit: LONGSUFFERING."
  },
  {
    roomId: "frt-gentleness",
    roomName: "Fruit Room - Gentleness",
    floor: 4,
    imagePath: fruitGentleness,
    instruction: "Study the text in the context of the specific fruit of the spirit: GENTLENESS."
  },
  {
    roomId: "frt-goodness",
    roomName: "Fruit Room - Goodness",
    floor: 4,
    imagePath: fruitGoodness,
    instruction: "Study the text in the context of the specific fruit of the spirit: GOODNESS."
  },
  {
    roomId: "frt-faith",
    roomName: "Fruit Room - Faith",
    floor: 4,
    imagePath: fruitFaith,
    instruction: "Study the text in the context of the specific fruit of the spirit: FAITH."
  },
  {
    roomId: "frt-meekness",
    roomName: "Fruit Room - Meekness",
    floor: 4,
    imagePath: fruitMeekness,
    instruction: "Study the text in the context of the specific fruit of the spirit: MEEKNESS."
  },
  {
    roomId: "frt-temperance",
    roomName: "Fruit Room - Temperance",
    floor: 4,
    imagePath: fruitTemperance,
    instruction: "Study the text in the context of the specific fruit of the spirit: TEMPERANCE."
  },
  // Floor 4 - Time Zone Room variants
  {
    roomId: "tz-heaven-present",
    roomName: "Time Zone Room - Heaven Present",
    floor: 4,
    imagePath: timezoneHeavenPresent,
    instruction: "Study the text in the context of events in Heaven's present."
  },
  {
    roomId: "tz-heaven-past",
    roomName: "Time Zone Room - Heaven Past",
    floor: 4,
    imagePath: timezoneHeavenPast,
    instruction: "Study the text in the context of events in Heaven's past."
  },
  {
    roomId: "tz-heaven-future",
    roomName: "Time Zone Room - Heaven Future",
    floor: 4,
    imagePath: timezoneHeavenFuture,
    instruction: "Study the text in the context of events in Heaven's future."
  },
  {
    roomId: "tz-earth-past",
    roomName: "Time Zone Room - Earth Past",
    floor: 4,
    imagePath: timezoneEarthPast,
    instruction: "Study the text in the context of events in Earth's past."
  },
  {
    roomId: "tz-earth-present",
    roomName: "Time Zone Room - Earth Present",
    floor: 4,
    imagePath: timezoneEarthPresent,
    instruction: "Study the text in the context of events in Earth's present."
  },
  {
    roomId: "tz-earth-future",
    roomName: "Time Zone Room - Earth Future",
    floor: 4,
    imagePath: timezoneEarthFuture,
    instruction: "Study the text in the context of events in Earth's future."
  },
  // Floor 4 - Connect 6 Room variants
  {
    roomId: "c6-parables",
    roomName: "Connect 6 Room - Parables",
    floor: 4,
    imagePath: connect6Parables,
    instruction: "Connect the text with a parable."
  },
  {
    roomId: "c6-gospels",
    roomName: "Connect 6 Room - Gospels",
    floor: 4,
    imagePath: connect6Gospels,
    instruction: "Connect the text with a gospel account."
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
  
  // Floor 6 - Three Heavens (Purple) - Mathematics Room variants
  {
    roomId: "math-70week",
    roomName: "Mathematics Room (Daniel's 70 Weeks)",
    floor: 6,
    imagePath: mathDaniel70week,
    instruction: "Connect with the mathematics of Daniel's 70-week prophecy."
  },
  {
    roomId: "math-70year",
    roomName: "Mathematics Room (70 Years)",
    floor: 6,
    imagePath: math70year,
    instruction: "Connect with the mathematics of the 70-year prophecy."
  },
  {
    roomId: "math-120year",
    roomName: "Mathematics Room (Noah's 120 Years)",
    floor: 6,
    imagePath: mathNoah120year,
    instruction: "Connect with the mathematics of Noah's 120-year prophecy."
  },
  {
    roomId: "math-400year",
    roomName: "Mathematics Room (Exodus 400 Years)",
    floor: 6,
    imagePath: mathExodus400,
    instruction: "Connect with the mathematics of the Exodus 400-year prophecy."
  },
  {
    roomId: "math-1260year",
    roomName: "Mathematics Room (1260 Years)",
    floor: 6,
    imagePath: math1260year,
    instruction: "Connect with the mathematics of the 1260-year prophecy."
  },
  {
    roomId: "math-2300year",
    roomName: "Mathematics Room (2300 Years)",
    floor: 6,
    imagePath: math2300year,
    instruction: "Connect with the mathematics of the 2300-year prophecy."
  },
  {
    roomId: "math-divine",
    roomName: "Mathematics Room (Divine Math)",
    floor: 6,
    imagePath: mathDivine,
    instruction: "In which cycle of divine math is the text located? Is there any significance?"
  },
  
  // Floor 6 - 8 Cycles Room
  {
    roomId: "@ad",
    roomName: "8 Cycles Room - #1 Adamic",
    floor: 6,
    imagePath: cycle1Adamic,
    instruction: "Study the text within the context of one of the 8 cycles of scripture. #1 of 8: Compare, contrast, or study within the Adamic Cycle. (Eden to Eden Lost)"
  },
  {
    roomId: "@no",
    roomName: "8 Cycles Room - #2 Noahic",
    floor: 6,
    imagePath: cycle2Noahic,
    instruction: "Study the text within the context of one of the 8 cycles of scripture. #2 of 8: Compare, contrast, or study within the Noahic Cycle. (Post Eden to the Flood)"
  },
  {
    roomId: "@se",
    roomName: "8 Cycles Room - #3 Semitic",
    floor: 6,
    imagePath: cycle3Semitic,
    instruction: "Study the text within the context of one of the 8 cycles of scripture. #3 of 8: Compare, contrast, or study within the Semitic Cycle. (Flood to Tower of Babel)"
  },
  {
    roomId: "@ab",
    roomName: "8 Cycles Room - #4 Abrahamic",
    floor: 6,
    imagePath: cycle4Abrahamic,
    instruction: "Study the text within the context of one of the 8 cycles of scripture. #4 of 8: Compare, contrast, or study within the Abrahamic Cycle. (Ur to Egyptian Bondage)"
  },
  
  // Floor 7 - Spiritual/Emotional (Turquoise)
  {
    roomId: "mr",
    roomName: "Meditation Room",
    floor: 7,
    imagePath: meditationRoom,
    instruction: "Spend time meditating on the study after you have fully completed it."
  },
  {
    roomId: "frm",
    roomName: "Fire Room",
    floor: 7,
    imagePath: fireRoom,
    instruction: "Enter into the feeling and emotion of the text or study."
  },
];

// Get card back image for a specific floor, or default
export const getCardBack = (floor?: number) => {
  if (floor && floorCardBacks[floor]) {
    return floorCardBacks[floor];
  }
  return cardBack;
};

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
  7: { bg: "bg-cyan-900/30", border: "border-cyan-500", name: "turquoise" },
  8: { bg: "bg-amber-900/30", border: "border-amber-500", name: "gold" },
};
