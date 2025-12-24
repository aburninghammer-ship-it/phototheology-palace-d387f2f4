// Exodus 1-24 24FPS Chapter Data - "Deliverance" Theme
// Based on PhotoTheology Master Class by Ivor Myers

export interface ChapterFrame {
  chapter: number;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
}

export const exodus24fpsData: ChapterFrame[] = [
  {
    chapter: 1,
    title: "A New Pharaoh",
    summary: "A new king arises in Egypt who does not know Joseph. Israel multiplies but faces oppression and slavery.",
    memoryHook: "New crown, new cruelty",
    symbol: "👑"
  },
  {
    chapter: 2,
    title: "Moses' Birth and Flight",
    summary: "Moses is born, hidden in a basket, rescued by Pharaoh's daughter, then flees to Midian after killing an Egyptian.",
    memoryHook: "Basket baby becomes fugitive",
    symbol: "🧺"
  },
  {
    chapter: 3,
    title: "The Burning Bush",
    summary: "God appears to Moses in a burning bush that is not consumed. Moses is called to deliver Israel.",
    memoryHook: "Fire that doesn't destroy",
    symbol: "🔥"
  },
  {
    chapter: 4,
    title: "Moses' Rod",
    summary: "God gives Moses miraculous signs: rod becomes serpent, hand becomes leprous. Aaron is appointed as spokesman.",
    memoryHook: "The stem of 4 is a rod",
    symbol: "🪄"
  },
  {
    chapter: 5,
    title: "Bricks and Straw",
    summary: "Moses confronts Pharaoh. Pharaoh increases Israel's burden - bricks without straw.",
    memoryHook: "5 fingers making bricks",
    symbol: "🧱"
  },
  {
    chapter: 6,
    title: "Genealogy of Moses and Aaron",
    summary: "God reaffirms His covenant. The genealogy of Moses and Aaron is given.",
    memoryHook: "6 generations listed",
    symbol: "📜"
  },
  {
    chapter: 7,
    title: "Rod/Bloody Rivers",
    summary: "Moses' rod swallows the magicians' rods. First plague: water turns to blood.",
    memoryHook: "7 is a rod that makes blood",
    symbol: "🩸"
  },
  {
    chapter: 8,
    title: "Frogs, Lice, Flies",
    summary: "Plagues 2-4: Frogs cover the land, dust becomes lice, swarms of flies.",
    memoryHook: "8 looks like stacked frogs",
    symbol: "🐸"
  },
  {
    chapter: 9,
    title: "Dead Animals, Boils, Hail",
    summary: "Plagues 5-7: Livestock die, boils break out, hail destroys crops.",
    memoryHook: "9 plagues nearly complete",
    symbol: "🌨️"
  },
  {
    chapter: 10,
    title: "Locusts and Darkness",
    summary: "Plagues 8-9: Locusts devour everything, thick darkness covers Egypt for 3 days.",
    memoryHook: "L for locust, 0 for no light",
    symbol: "🦗"
  },
  {
    chapter: 11,
    title: "Preparation for Deliverance",
    summary: "God announces the final plague: death of firstborn. Israel prepares to leave.",
    memoryHook: "11 = two arms raised in celebration",
    symbol: "🙌"
  },
  {
    chapter: 12,
    title: "The Passover",
    summary: "The Passover lamb is instituted. Death passes over houses with blood on doorposts. Israel leaves Egypt.",
    memoryHook: "1 passing over the 2",
    symbol: "🚪"
  },
  {
    chapter: 13,
    title: "The Firstborn Are Mine",
    summary: "God claims all firstborn. Unleavened bread feast instituted. Pillar of cloud and fire leads.",
    memoryHook: "13 = unlucky for firstborn of Egypt",
    symbol: "👶"
  },
  {
    chapter: 14,
    title: "Parting of the Red Sea",
    summary: "Pharaoh pursues. God parts the Red Sea. Israel crosses on dry ground. Egypt's army drowns.",
    memoryHook: "14 = 1 sea split into 4 walls",
    symbol: "🌊"
  },
  {
    chapter: 15,
    title: "The Song of Moses",
    summary: "Moses and Israel sing of God's victory. Miriam leads women in worship. Bitter waters made sweet at Marah.",
    memoryHook: "15 = musical notes",
    symbol: "🎵"
  },
  {
    chapter: 16,
    title: "Manna",
    summary: "God provides manna from heaven and quail. Double portion on sixth day for Sabbath.",
    memoryHook: "1 is a wall, 6 is a man with belly full",
    symbol: "🍞"
  },
  {
    chapter: 17,
    title: "Water from Rock / Lifted Hands",
    summary: "Moses strikes the rock at Horeb. Israel defeats Amalek as Moses holds up his hands.",
    memoryHook: "17 = rod striking rock",
    symbol: "⛰️"
  },
  {
    chapter: 18,
    title: "Jethro's Counsel",
    summary: "Jethro visits Moses, gives wise counsel on delegating leadership and judging the people.",
    memoryHook: "1 counsels the 8 (Jethro counsels Moses)",
    symbol: "👴"
  },
  {
    chapter: 19,
    title: "Israel Prepares to Encounter God",
    summary: "Israel camps at Sinai. God descends on the mountain with thunder, lightning, and thick cloud.",
    memoryHook: "19 at the foot of the mountain",
    symbol: "⛈️"
  },
  {
    chapter: 20,
    title: "The Ten Commandments",
    summary: "God speaks the Ten Commandments from Mount Sinai. The people tremble with fear.",
    memoryHook: "20 = 2 tablets of 10 commandments",
    symbol: "📋"
  },
  {
    chapter: 21,
    title: "Laws Regarding Slavery",
    summary: "Laws about Hebrew servants, personal injuries, and property. Eye for eye, tooth for tooth.",
    memoryHook: "21 = age of freedom",
    symbol: "⛓️"
  },
  {
    chapter: 22,
    title: "Laws Regarding Theft and Justice",
    summary: "Laws about theft, property damage, social responsibility, and moral conduct.",
    memoryHook: "22 on a protest sign",
    symbol: "⚖️"
  },
  {
    chapter: 23,
    title: "Laws, Festivals, Conquest",
    summary: "Laws against slander. Three annual feasts instituted. Promise of conquest of Canaan.",
    memoryHook: "1-Slander, 2-Festivals, 3-Conquest",
    symbol: "🎉"
  },
  {
    chapter: 24,
    title: "Moses Ascends the Mount",
    summary: "Covenant confirmed with blood. Moses, Aaron, Nadab, Abihu, and 70 elders see God. Moses enters the cloud for 40 days.",
    memoryHook: "Small 2 ascending big 4",
    symbol: "☁️"
  }
];

export const getExodusChapter = (chapter: number): ChapterFrame | undefined => {
  return exodus24fpsData.find(c => c.chapter === chapter);
};
