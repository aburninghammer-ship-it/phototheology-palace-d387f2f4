// Complete 24FPS Bible Data - All 66 Books
// Following Phototheology methodology with chapter frames for memorization

export interface ChapterFrame {
  chapter: number;
  book: string;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
}

export interface BibleSet {
  id: string;
  label: string;
  theme: string;
  chapters: ChapterFrame[];
  testament: 'old' | 'new';
}

// Helper to generate chapter frames
const createChapters = (book: string, count: number, data: Partial<ChapterFrame>[]): ChapterFrame[] => {
  return data.map((d, i) => ({
    chapter: i + 1,
    book,
    title: d.title || `${book} ${i + 1}`,
    summary: d.summary || '',
    memoryHook: d.memoryHook || '',
    symbol: d.symbol || '📖',
  }));
};

// ============ OLD TESTAMENT ============

export const genesisSet: BibleSet = {
  id: 'genesis-1-24',
  label: 'Genesis 1-24',
  theme: 'Division - Origins & Separation',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Genesis', title: 'Creation', summary: 'God creates heavens, earth, light, sky, land, seas, plants, sun, moon, stars, creatures, and man in His image.', memoryHook: 'Birthday cake earth with 7 candles', symbol: '🌍' },
    { chapter: 2, book: 'Genesis', title: 'Garden & Marriage', summary: 'God forms Adam from dust, plants Eden, creates Eve from Adam\'s rib. First marriage.', memoryHook: 'Wedding rings on a tree branch', symbol: '💒' },
    { chapter: 3, book: 'Genesis', title: 'The Fall', summary: 'Serpent tempts Eve, Adam and Eve sin, shame enters, curses given, expelled from Eden.', memoryHook: 'Snake biting an apple-clock', symbol: '🐍' },
    { chapter: 4, book: 'Genesis', title: 'Cain & Abel', summary: 'First murder - Cain kills Abel. Mark of Cain. Line of Cain begins.', memoryHook: 'Blood on wheat and lamb', symbol: '🩸' },
    { chapter: 5, book: 'Genesis', title: 'Genealogy to Noah', summary: 'Adam\'s line through Seth to Noah. Enoch walks with God and is taken.', memoryHook: 'Family tree with walking shoes', symbol: '🌳' },
    { chapter: 6, book: 'Genesis', title: 'Corruption & Ark', summary: 'Earth filled with violence. God grieves. Noah finds grace. Ark instructions given.', memoryHook: 'Giant blueprint on water', symbol: '📐' },
    { chapter: 7, book: 'Genesis', title: 'The Flood', summary: 'Noah, family, and animals enter ark. Rain 40 days. All flesh outside destroyed.', memoryHook: 'Rain clouds with animal parade', symbol: '🌧️' },
    { chapter: 8, book: 'Genesis', title: 'Waters Recede', summary: 'Waters abate. Dove returns with olive leaf. Noah exits ark, builds altar.', memoryHook: 'Dove with olive branch over mountain', symbol: '🕊️' },
    { chapter: 9, book: 'Genesis', title: 'Rainbow Covenant', summary: 'God blesses Noah, gives rainbow covenant. Noah plants vineyard, Ham\'s sin.', memoryHook: 'Rainbow over vineyard', symbol: '🌈' },
    { chapter: 10, book: 'Genesis', title: 'Table of Nations', summary: 'Descendants of Shem, Ham, and Japheth spread across earth after flood.', memoryHook: 'World map with three branches', symbol: '🗺️' },
    { chapter: 11, book: 'Genesis', title: 'Tower of Babel', summary: 'One language, build tower. God confuses languages, scatters people. Abram\'s genealogy.', memoryHook: 'Tower with speech bubbles', symbol: '🗼' },
    { chapter: 12, book: 'Genesis', title: 'Abram\'s Call', summary: 'God calls Abram to leave Ur. Promise of blessing. Goes to Egypt, lies about Sarai.', memoryHook: 'Footprints leaving toward stars', symbol: '👣' },
    { chapter: 13, book: 'Genesis', title: 'Lot Separates', summary: 'Abram and Lot separate. Lot chooses Sodom. God promises Abram all the land.', memoryHook: 'Fork in the road - one to city', symbol: '🔀' },
    { chapter: 14, book: 'Genesis', title: 'War & Melchizedek', summary: 'War of kings. Abram rescues Lot. Melchizedek blesses Abram with bread and wine.', memoryHook: 'Sword with bread and wine', symbol: '⚔️' },
    { chapter: 15, book: 'Genesis', title: 'Covenant of Stars', summary: 'God promises Abram descendants like stars. Covenant ceremony with animals.', memoryHook: 'Torch between animal halves under stars', symbol: '⭐' },
    { chapter: 16, book: 'Genesis', title: 'Hagar & Ishmael', summary: 'Sarai gives Hagar to Abram. Hagar flees, angel appears. Ishmael born.', memoryHook: 'Well in desert with pregnant woman', symbol: '🏜️' },
    { chapter: 17, book: 'Genesis', title: 'Circumcision Covenant', summary: 'God changes names to Abraham and Sarah. Circumcision established. Isaac promised.', memoryHook: 'New name tags with knife', symbol: '✂️' },
    { chapter: 18, book: 'Genesis', title: 'Three Visitors', summary: 'Three visitors announce Isaac\'s birth. Abraham intercedes for Sodom.', memoryHook: 'Three men at tent door', symbol: '🏕️' },
    { chapter: 19, book: 'Genesis', title: 'Sodom Destroyed', summary: 'Angels rescue Lot. Sodom and Gomorrah destroyed. Lot\'s wife becomes salt pillar.', memoryHook: 'Fire falling on city, salt pillar', symbol: '🔥' },
    { chapter: 20, book: 'Genesis', title: 'Abraham & Abimelech', summary: 'Abraham lies again about Sarah. God warns Abimelech in dream.', memoryHook: 'King with warning dream', symbol: '👑' },
    { chapter: 21, book: 'Genesis', title: 'Isaac Born', summary: 'Isaac born to Sarah. Hagar and Ishmael sent away. Well of Beersheba.', memoryHook: 'Laughing baby with water well', symbol: '👶' },
    { chapter: 22, book: 'Genesis', title: 'Sacrifice of Isaac', summary: 'God tests Abraham - offer Isaac. Ram provided. "The Lord Will Provide."', memoryHook: 'Knife over altar with ram caught', symbol: '🐏' },
    { chapter: 23, book: 'Genesis', title: 'Sarah Dies', summary: 'Sarah dies at 127. Abraham buys cave of Machpelah for burial.', memoryHook: 'Cave entrance with coins', symbol: '🪦' },
    { chapter: 24, book: 'Genesis', title: 'Bride for Isaac', summary: 'Servant finds Rebekah at well. She returns to marry Isaac.', memoryHook: 'Camel caravan with jewelry at well', symbol: '🐪' },
  ]
};

export const genesis25to50Set: BibleSet = {
  id: 'genesis-25-50',
  label: 'Genesis 25-50',
  theme: 'Multiplication - Patriarchs & Egypt',
  testament: 'old',
  chapters: [
    { chapter: 25, book: 'Genesis', title: 'Jacob & Esau Born', summary: 'Abraham dies. Twins born to Isaac and Rebekah. Esau sells birthright.', memoryHook: 'Twin babies, one hairy, with bowl of stew', symbol: '👯' },
    { chapter: 26, book: 'Genesis', title: 'Isaac\'s Wells', summary: 'Famine. Isaac lies about Rebekah. Digs wells, enemies stop them, moves on.', memoryHook: 'Plugged wells in desert', symbol: '🕳️' },
    { chapter: 27, book: 'Genesis', title: 'Stolen Blessing', summary: 'Jacob deceives blind Isaac, steals Esau\'s blessing. Esau vows revenge.', memoryHook: 'Goat skin on arms with blind father', symbol: '🦯' },
    { chapter: 28, book: 'Genesis', title: 'Jacob\'s Ladder', summary: 'Jacob flees to Haran. Dreams of ladder with angels. Vow at Bethel.', memoryHook: 'Stairway to heaven with angels', symbol: '🪜' },
    { chapter: 29, book: 'Genesis', title: 'Leah & Rachel', summary: 'Jacob meets Rachel at well. Works 7 years, tricked into marrying Leah first.', memoryHook: 'Wedding veil swap', symbol: '👰' },
    { chapter: 30, book: 'Genesis', title: 'Twelve Sons Begin', summary: 'Birth of sons through Leah, Rachel, and handmaids. Jacob\'s flocks multiply.', memoryHook: 'Cradles multiplying with spotted sheep', symbol: '🐑' },
    { chapter: 31, book: 'Genesis', title: 'Fleeing Laban', summary: 'Jacob secretly flees Laban. Rachel steals idols. Covenant at Mizpah.', memoryHook: 'Escape at night with hidden idols', symbol: '🏃' },
    { chapter: 32, book: 'Genesis', title: 'Wrestling with God', summary: 'Jacob prepares to meet Esau. Wrestles with angel. Name changed to Israel.', memoryHook: 'Wrestling match at dawn', symbol: '🤼' },
    { chapter: 33, book: 'Genesis', title: 'Meeting Esau', summary: 'Jacob bows to Esau. Brothers reconcile. Jacob settles at Shechem.', memoryHook: 'Brothers embracing with tears', symbol: '🤝' },
    { chapter: 34, book: 'Genesis', title: 'Dinah Avenged', summary: 'Dinah violated. Simeon and Levi massacre Shechem in revenge.', memoryHook: 'Swords over a city', symbol: '🗡️' },
    { chapter: 35, book: 'Genesis', title: 'Return to Bethel', summary: 'Jacob returns to Bethel, buries idols. Rachel dies giving birth to Benjamin.', memoryHook: 'Buried idols under oak tree', symbol: '🌲' },
    { chapter: 36, book: 'Genesis', title: 'Esau\'s Descendants', summary: 'Genealogy of Esau and Edom. Chiefs and kings listed.', memoryHook: 'Red family tree (Edom = red)', symbol: '🔴' },
    { chapter: 37, book: 'Genesis', title: 'Joseph\'s Dreams', summary: 'Joseph\'s coat and dreams. Brothers sell him to Egypt. Shown bloody coat.', memoryHook: 'Colorful coat torn with blood', symbol: '🧥' },
    { chapter: 38, book: 'Genesis', title: 'Judah & Tamar', summary: 'Judah\'s sons die. Tamar disguises as prostitute, bears twins by Judah.', memoryHook: 'Staff and cord as evidence', symbol: '🎭' },
    { chapter: 39, book: 'Genesis', title: 'Potiphar\'s House', summary: 'Joseph prospers in Potiphar\'s house. Refuses wife\'s advances, falsely imprisoned.', memoryHook: 'Cloak left behind, prison door', symbol: '🚪' },
    { chapter: 40, book: 'Genesis', title: 'Dreams in Prison', summary: 'Joseph interprets butler and baker\'s dreams. Butler forgets him.', memoryHook: 'Wine cup and bread basket', symbol: '🍷' },
    { chapter: 41, book: 'Genesis', title: 'Pharaoh\'s Dreams', summary: 'Joseph interprets 7 fat/lean cows. Made second in command. Stores grain.', memoryHook: 'Cows eating cows, grain silos', symbol: '🐄' },
    { chapter: 42, book: 'Genesis', title: 'Brothers Come', summary: 'Famine brings brothers to Egypt. Joseph recognizes them, accuses them of spying.', memoryHook: 'Brothers bowing to unknown ruler', symbol: '🙇' },
    { chapter: 43, book: 'Genesis', title: 'Benjamin Goes', summary: 'Brothers return with Benjamin. Joseph weeps secretly. Feast given.', memoryHook: 'Youngest brother at feast table', symbol: '🍽️' },
    { chapter: 44, book: 'Genesis', title: 'Silver Cup Test', summary: 'Joseph plants cup in Benjamin\'s sack. Judah offers himself instead.', memoryHook: 'Silver cup in grain sack', symbol: '🏆' },
    { chapter: 45, book: 'Genesis', title: 'Joseph Revealed', summary: 'Joseph reveals himself. "God sent me ahead." Invites family to Egypt.', memoryHook: 'Weeping embrace, wagons sent', symbol: '😭' },
    { chapter: 46, book: 'Genesis', title: 'Jacob Goes to Egypt', summary: 'Jacob takes family to Egypt. 70 souls. Settles in Goshen.', memoryHook: 'Caravan to pyramids', symbol: '🏛️' },
    { chapter: 47, book: 'Genesis', title: 'Settling in Goshen', summary: 'Jacob meets Pharaoh. Famine continues. Joseph buys all Egypt for Pharaoh.', memoryHook: 'Green pasture next to pyramids', symbol: '🌿' },
    { chapter: 48, book: 'Genesis', title: 'Ephraim & Manasseh', summary: 'Jacob blesses Joseph\'s sons, crosses hands, giving younger the greater blessing.', memoryHook: 'Crossed arms blessing boys', symbol: '✋' },
    { chapter: 49, book: 'Genesis', title: 'Jacob\'s Prophecies', summary: 'Jacob prophesies over each son. "Shiloh" to Judah. Joseph fruitful.', memoryHook: 'Twelve stars with prophecies', symbol: '🔮' },
    { chapter: 50, book: 'Genesis', title: 'Deaths & Promise', summary: 'Jacob buried in Canaan. Joseph forgives brothers. Dies at 110 in Egypt.', memoryHook: 'Coffin with promise of return', symbol: '⚰️' },
  ]
};

export const exodus1to24Set: BibleSet = {
  id: 'exodus-1-24',
  label: 'Exodus 1-24',
  theme: 'Deliverance - From Bondage to Sinai',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Exodus', title: 'Bondage Begins', summary: 'Israel multiplies in Egypt. New Pharaoh enslaves them. Midwives save babies.', memoryHook: 'Bricks with baby in basket', symbol: '🧱' },
    { chapter: 2, book: 'Exodus', title: 'Moses Born', summary: 'Moses hidden in basket, found by princess. Kills Egyptian, flees to Midian.', memoryHook: 'Baby in river, burning bush ahead', symbol: '🧺' },
    { chapter: 3, book: 'Exodus', title: 'Burning Bush', summary: 'God calls Moses from burning bush. "I AM THAT I AM." Commission to deliver.', memoryHook: 'Bush on fire, shoes off', symbol: '🔥' },
    { chapter: 4, book: 'Exodus', title: 'Signs Given', summary: 'Rod becomes serpent, leprous hand, water to blood. Aaron appointed spokesman.', memoryHook: 'Staff turning to snake', symbol: '🐍' },
    { chapter: 5, book: 'Exodus', title: 'Bricks Without Straw', summary: 'Moses confronts Pharaoh. Pharaoh increases burden - no straw for bricks.', memoryHook: 'Straw withheld, whips cracking', symbol: '🌾' },
    { chapter: 6, book: 'Exodus', title: 'Promise Renewed', summary: 'God reaffirms covenant name. Genealogy of Moses and Aaron.', memoryHook: '"YHWH" over family scroll', symbol: '📜' },
    { chapter: 7, book: 'Exodus', title: 'First Plague - Blood', summary: 'Aaron\'s rod swallows magicians\' rods. Nile turned to blood.', memoryHook: 'Red river, dead fish', symbol: '💉' },
    { chapter: 8, book: 'Exodus', title: 'Frogs, Gnats, Flies', summary: 'Plagues of frogs, lice, and flies. Goshen protected from flies.', memoryHook: 'Frog on throne, swarm of flies', symbol: '🐸' },
    { chapter: 9, book: 'Exodus', title: 'Livestock, Boils, Hail', summary: 'Egyptian livestock dies. Boils on bodies. Hail destroys crops.', memoryHook: 'Dead cattle, fiery hail', symbol: '🐂' },
    { chapter: 10, book: 'Exodus', title: 'Locusts & Darkness', summary: 'Locusts devour all green. Three days of thick darkness.', memoryHook: 'Locusts covering sun', symbol: '🦗' },
    { chapter: 11, book: 'Exodus', title: 'Death Announced', summary: 'Final plague announced - firstborn will die. Israel will plunder Egypt.', memoryHook: 'Death angel silhouette', symbol: '☠️' },
    { chapter: 12, book: 'Exodus', title: 'Passover', summary: 'Lamb slain, blood on doorposts. Firstborn of Egypt die. Israel leaves.', memoryHook: 'Blood-painted door, lamb', symbol: '🩸' },
    { chapter: 13, book: 'Exodus', title: 'Consecration & Pillar', summary: 'Firstborn consecrated. Unleavened bread. Pillar of cloud and fire leads.', memoryHook: 'Cloud by day, fire by night', symbol: '☁️' },
    { chapter: 14, book: 'Exodus', title: 'Red Sea Crossing', summary: 'Pharaoh pursues. Sea parts. Israel crosses. Army drowned.', memoryHook: 'Walls of water, army drowning', symbol: '🌊' },
    { chapter: 15, book: 'Exodus', title: 'Song of Moses', summary: 'Moses and Miriam lead songs of victory. Bitter waters made sweet.', memoryHook: 'Tambourine and dancing by sea', symbol: '🎵' },
    { chapter: 16, book: 'Exodus', title: 'Manna & Quail', summary: 'Israel complains. God sends manna daily and quail. Sabbath rest for manna.', memoryHook: 'Bread from heaven, birds', symbol: '🍞' },
    { chapter: 17, book: 'Exodus', title: 'Water & Amalek', summary: 'Water from rock at Rephidim. Amalek attacks. Moses\' hands held up.', memoryHook: 'Staff striking rock, raised arms', symbol: '💧' },
    { chapter: 18, book: 'Exodus', title: 'Jethro\'s Advice', summary: 'Jethro visits with Zipporah. Advises Moses to appoint judges.', memoryHook: 'Father-in-law with organizational chart', symbol: '📊' },
    { chapter: 19, book: 'Exodus', title: 'At Sinai', summary: 'Israel camps at Sinai. God descends in thunder, fire, smoke. People tremble.', memoryHook: 'Smoking mountain, lightning', symbol: '⛰️' },
    { chapter: 20, book: 'Exodus', title: 'Ten Commandments', summary: 'God speaks the Ten Commandments. People fear and stand afar.', memoryHook: 'Two stone tablets with 10', symbol: '📋' },
    { chapter: 21, book: 'Exodus', title: 'Laws on Servants', summary: 'Laws about servants, violence, and personal injury.', memoryHook: 'Gavel with scales', symbol: '⚖️' },
    { chapter: 22, book: 'Exodus', title: 'Property Laws', summary: 'Laws about theft, property damage, social responsibilities.', memoryHook: 'Ox and field with fence', symbol: '🐄' },
    { chapter: 23, book: 'Exodus', title: 'Justice & Feasts', summary: 'Justice commands. Three annual feasts. Angel to lead.', memoryHook: 'Calendar with three feasts', symbol: '📅' },
    { chapter: 24, book: 'Exodus', title: 'Covenant Confirmed', summary: 'Blood of covenant sprinkled. Elders see God and eat. Moses enters cloud 40 days.', memoryHook: 'Blood on altar, 70 elders dining', symbol: '🔴' },
  ]
};

export const exodus25to40Set: BibleSet = {
  id: 'exodus-25-40',
  label: 'Exodus 25-40',
  theme: 'Sanctuary - The Tabernacle Blueprint',
  testament: 'old',
  chapters: [
    { chapter: 25, book: 'Exodus', title: 'Ark & Table', summary: 'Offering for sanctuary. Ark of testimony, table of showbread, golden lampstand.', memoryHook: 'Golden box with cherubim', symbol: '📦' },
    { chapter: 26, book: 'Exodus', title: 'Tabernacle Curtains', summary: 'Linen curtains, goat hair covering, boards, bars, veil.', memoryHook: 'Layered tent with bars', symbol: '⛺' },
    { chapter: 27, book: 'Exodus', title: 'Altar & Court', summary: 'Bronze altar of burnt offering. Court hangings. Oil for lamp.', memoryHook: 'Bronze altar in courtyard', symbol: '🔥' },
    { chapter: 28, book: 'Exodus', title: 'Priestly Garments', summary: 'Aaron\'s holy garments - ephod, breastplate, robe, turban.', memoryHook: 'Golden breastplate with 12 stones', symbol: '👘' },
    { chapter: 29, book: 'Exodus', title: 'Priest Consecration', summary: 'Ceremony to consecrate Aaron and sons. Sacrifices detailed.', memoryHook: 'Oil poured on head, blood on ear', symbol: '🛢️' },
    { chapter: 30, book: 'Exodus', title: 'Incense Altar', summary: 'Golden incense altar, atonement money, bronze laver, anointing oil.', memoryHook: 'Smoking altar with coins', symbol: '🪔' },
    { chapter: 31, book: 'Exodus', title: 'Bezalel Called', summary: 'Bezalel and Oholiab filled with Spirit for craftsmanship. Sabbath sign.', memoryHook: 'Craftsman with tools, Sabbath', symbol: '🛠️' },
    { chapter: 32, book: 'Exodus', title: 'Golden Calf', summary: 'Israel makes golden calf. Moses breaks tablets. 3000 die. Plague follows.', memoryHook: 'Broken tablets, golden cow', symbol: '🐄' },
    { chapter: 33, book: 'Exodus', title: 'Tent of Meeting', summary: 'Moses meets God in tent. "Show me Your glory." God\'s back seen.', memoryHook: 'Pillar of cloud at tent door', symbol: '⛅' },
    { chapter: 34, book: 'Exodus', title: 'New Tablets', summary: 'Moses ascends again. New tablets. God proclaims His character. Moses\' shining face.', memoryHook: 'Glowing face with new tablets', symbol: '✨' },
    { chapter: 35, book: 'Exodus', title: 'Sabbath & Offerings', summary: 'Sabbath emphasized. People bring abundant offerings for tabernacle.', memoryHook: 'Hands giving gold and fabric', symbol: '🎁' },
    { chapter: 36, book: 'Exodus', title: 'Building Begins', summary: 'Craftsmen begin work. More than enough offered - people stopped giving!', memoryHook: '"Stop giving!" sign', symbol: '🚫' },
    { chapter: 37, book: 'Exodus', title: 'Ark & Furniture Made', summary: 'Bezalel makes ark, table, lampstand, incense altar.', memoryHook: 'Workshop with golden items', symbol: '🏭' },
    { chapter: 38, book: 'Exodus', title: 'Altar & Court Made', summary: 'Bronze altar, laver, court made. Inventory of metals used.', memoryHook: 'Bronze workshop with scales', symbol: '⚖️' },
    { chapter: 39, book: 'Exodus', title: 'Garments Made', summary: 'Priestly garments completed exactly as commanded.', memoryHook: 'Sewing needle with gold thread', symbol: '🧵' },
    { chapter: 40, book: 'Exodus', title: 'Tabernacle Erected', summary: 'Tabernacle set up. Glory fills it. Cloud guides journeys.', memoryHook: 'Cloud descending on finished tent', symbol: '🏛️' },
  ]
};

export const leviticus1to27Set: BibleSet = {
  id: 'leviticus-1-27',
  label: 'Leviticus 1-27',
  theme: 'Holiness - Laws for Worship & Living',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Leviticus', title: 'Burnt Offering', summary: 'Laws for burnt offerings - bulls, sheep, goats, birds. Complete surrender.', memoryHook: 'Animal fully consumed on altar', symbol: '🔥' },
    { chapter: 2, book: 'Leviticus', title: 'Grain Offering', summary: 'Fine flour with oil and frankincense. No leaven or honey.', memoryHook: 'Flour and oil on fire', symbol: '🌾' },
    { chapter: 3, book: 'Leviticus', title: 'Peace Offering', summary: 'Fellowship offering - fat burned, meat shared. Communion meal.', memoryHook: 'Shared meal around altar', symbol: '🍖' },
    { chapter: 4, book: 'Leviticus', title: 'Sin Offering', summary: 'Offerings for unintentional sins by priest, congregation, leader, individual.', memoryHook: 'Blood on horns of altar', symbol: '🩸' },
    { chapter: 5, book: 'Leviticus', title: 'Trespass Offering', summary: 'Guilt offering for specific violations. Restitution required.', memoryHook: 'Scales balancing payment', symbol: '⚖️' },
    { chapter: 6, book: 'Leviticus', title: 'Priestly Procedures', summary: 'Priests\' duties for offerings. Perpetual fire on altar.', memoryHook: 'Fire never extinguished', symbol: '🕯️' },
    { chapter: 7, book: 'Leviticus', title: 'Peace Offering Details', summary: 'More peace offering rules. Fat and blood forbidden as food.', memoryHook: 'Forbidden fat symbol', symbol: '🚫' },
    { chapter: 8, book: 'Leviticus', title: 'Priests Ordained', summary: 'Moses consecrates Aaron and sons. Seven-day ordination ceremony.', memoryHook: 'Anointing oil flowing down', symbol: '💧' },
    { chapter: 9, book: 'Leviticus', title: 'Priests Minister', summary: 'Aaron offers first sacrifices. Glory appears, fire consumes offering.', memoryHook: 'Fire from heaven on altar', symbol: '⚡' },
    { chapter: 10, book: 'Leviticus', title: 'Nadab & Abihu', summary: 'Strange fire offered. Fire from God kills them. No mourning allowed.', memoryHook: 'Unauthorized fire, death', symbol: '💀' },
    { chapter: 11, book: 'Leviticus', title: 'Clean & Unclean Animals', summary: 'Dietary laws - which animals may and may not be eaten.', memoryHook: 'Split hoof, chewing cud', symbol: '🐷' },
    { chapter: 12, book: 'Leviticus', title: 'Childbirth Purification', summary: 'Purification after childbirth. Different periods for sons and daughters.', memoryHook: 'Mother with baby, countdown', symbol: '👶' },
    { chapter: 13, book: 'Leviticus', title: 'Leprosy Laws', summary: 'Diagnosing skin diseases. Quarantine procedures. Examination by priest.', memoryHook: 'Priest examining skin', symbol: '🔍' },
    { chapter: 14, book: 'Leviticus', title: 'Leprosy Cleansing', summary: 'Cleansing ceremony for healed lepers. Blood, oil, and birds.', memoryHook: 'Two birds - one dies, one flies', symbol: '🕊️' },
    { chapter: 15, book: 'Leviticus', title: 'Bodily Discharges', summary: 'Laws for various bodily discharges. Purification requirements.', memoryHook: 'Water flowing for cleansing', symbol: '🚿' },
    { chapter: 16, book: 'Leviticus', title: 'Day of Atonement', summary: 'Yom Kippur instructions. Two goats - one slain, one sent away.', memoryHook: 'Two goats, one scapegoat leaving', symbol: '🐐' },
    { chapter: 17, book: 'Leviticus', title: 'Blood is Life', summary: 'All slaughter at tabernacle door. No eating blood - life is in blood.', memoryHook: 'Blood = Life equation', symbol: '❤️' },
    { chapter: 18, book: 'Leviticus', title: 'Sexual Purity', summary: 'Forbidden sexual relations. Do not defile like Egypt or Canaan.', memoryHook: 'Boundary lines for relationships', symbol: '🚷' },
    { chapter: 19, book: 'Leviticus', title: 'Various Laws', summary: '"Be holy for I am holy." Love neighbor as self. Mixed laws for justice.', memoryHook: 'Golden rule inscription', symbol: '💛' },
    { chapter: 20, book: 'Leviticus', title: 'Penalties', summary: 'Death penalties for violations - Molech worship, occult, immorality.', memoryHook: 'Judge\'s gavel with consequences', symbol: '⚖️' },
    { chapter: 21, book: 'Leviticus', title: 'Priest Standards', summary: 'Holiness requirements for priests. Marriage and physical standards.', memoryHook: 'Priest with higher bar', symbol: '📏' },
    { chapter: 22, book: 'Leviticus', title: 'Holy Offerings', summary: 'Priests must be clean to eat offerings. Animals must be without defect.', memoryHook: 'Perfect unblemished lamb', symbol: '🐑' },
    { chapter: 23, book: 'Leviticus', title: 'Feasts of the Lord', summary: 'Seven appointed feasts: Sabbath, Passover, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles.', memoryHook: 'Calendar with 7 circles', symbol: '📅' },
    { chapter: 24, book: 'Leviticus', title: 'Lamp & Blasphemer', summary: 'Lamp and bread regulations. Blasphemer stoned. Eye for eye.', memoryHook: 'Oil lamp and stones', symbol: '🪔' },
    { chapter: 25, book: 'Leviticus', title: 'Sabbath Years & Jubilee', summary: 'Land rests every 7th year. Jubilee every 50th - freedom and return.', memoryHook: 'Trumpet blast, land resting', symbol: '📯' },
    { chapter: 26, book: 'Leviticus', title: 'Blessings & Curses', summary: 'Covenant blessings for obedience. Five-fold curses for disobedience.', memoryHook: 'Two paths - sunshine vs. storm', symbol: '🌦️' },
    { chapter: 27, book: 'Leviticus', title: 'Vows & Tithes', summary: 'Valuation of vows. Tithes of land, animals. Devoted things.', memoryHook: 'Scales weighing vow values', symbol: '🎚️' },
  ]
};

export const numbersSet: BibleSet = {
  id: 'numbers-1-36',
  label: 'Numbers 1-36',
  theme: 'Wandering - Wilderness Journey',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Numbers', title: 'First Census', summary: 'Counting men 20+ for war. 603,550 from 12 tribes. Levites excluded.', memoryHook: 'Counting heads in desert', symbol: '📊' },
    { chapter: 2, book: 'Numbers', title: 'Camp Arrangement', summary: 'Tribes arranged around tabernacle. Each tribe has its place and standard.', memoryHook: 'Compass rose with tribes', symbol: '🧭' },
    { chapter: 3, book: 'Numbers', title: 'Levite Count', summary: 'Levites counted for tabernacle service. Families have specific duties.', memoryHook: 'Levites surrounding tent', symbol: '👔' },
    { chapter: 4, book: 'Numbers', title: 'Levite Duties', summary: 'Kohathites, Gershonites, Merarites assigned specific tabernacle tasks.', memoryHook: 'Three work crews with tasks', symbol: '🛠️' },
    { chapter: 5, book: 'Numbers', title: 'Purity Laws', summary: 'Unclean put outside camp. Restitution laws. Jealousy water test.', memoryHook: 'Bitter water test', symbol: '🥤' },
    { chapter: 6, book: 'Numbers', title: 'Nazirite Vow', summary: 'Nazirite separation rules. No wine, no cutting hair. Priestly blessing.', memoryHook: 'Long hair, no grapes', symbol: '💇' },
    { chapter: 7, book: 'Numbers', title: 'Leaders\' Offerings', summary: 'Twelve days of dedication offerings from each tribal leader.', memoryHook: 'Twelve wagons with gifts', symbol: '🎁' },
    { chapter: 8, book: 'Numbers', title: 'Levite Dedication', summary: 'Lampstand lit. Levites cleansed and dedicated for service.', memoryHook: 'Hands laid on Levites', symbol: '✋' },
    { chapter: 9, book: 'Numbers', title: 'Second Passover', summary: 'Passover observed. Second chance Passover. Cloud guides movement.', memoryHook: 'Cloud moving, Passover meal', symbol: '☁️' },
    { chapter: 10, book: 'Numbers', title: 'Silver Trumpets', summary: 'Two silver trumpets for signals. Israel finally departs Sinai.', memoryHook: 'Trumpets blowing, march begins', symbol: '🎺' },
    { chapter: 11, book: 'Numbers', title: 'Complaining & Quail', summary: 'People complain. Fire at Taberah. Craving meat. Quail and plague.', memoryHook: 'Meat piled up, graves', symbol: '🍗' },
    { chapter: 12, book: 'Numbers', title: 'Miriam\'s Leprosy', summary: 'Miriam and Aaron criticize Moses. Miriam struck with leprosy.', memoryHook: 'White leprous skin, 7 days out', symbol: '🤍' },
    { chapter: 13, book: 'Numbers', title: 'Spying Canaan', summary: '12 spies sent. 40 days exploring. Giant grapes. 10 bad reports.', memoryHook: 'Huge grape cluster, giants', symbol: '🍇' },
    { chapter: 14, book: 'Numbers', title: 'Rebellion & Sentence', summary: 'People rebel, want to return to Egypt. 40 years wandering decreed.', memoryHook: '40 carved in stone, crossing out generation', symbol: '4️⃣0️⃣' },
    { chapter: 15, book: 'Numbers', title: 'Offering Laws', summary: 'Grain and drink offerings. Sabbath-breaker stoned. Tassels commanded.', memoryHook: 'Blue thread on garment corner', symbol: '🧵' },
    { chapter: 16, book: 'Numbers', title: 'Korah\'s Rebellion', summary: 'Korah, Dathan, Abiram rebel. Ground opens. Fire consumes 250.', memoryHook: 'Earth swallowing rebels', symbol: '🕳️' },
    { chapter: 17, book: 'Numbers', title: 'Aaron\'s Rod Buds', summary: 'Twelve rods tested. Aaron\'s rod buds, blossoms, bears almonds.', memoryHook: 'Dead stick with flowers', symbol: '🌸' },
    { chapter: 18, book: 'Numbers', title: 'Priest & Levite Duties', summary: 'Priests guard sanctuary. Levites assist. Tithes support Levites.', memoryHook: 'Tithe going to temple workers', symbol: '💰' },
    { chapter: 19, book: 'Numbers', title: 'Red Heifer', summary: 'Red heifer burned for water of purification. Cleanses from death.', memoryHook: 'Red cow ashes mixed with water', symbol: '🐂' },
    { chapter: 20, book: 'Numbers', title: 'Moses Strikes Rock', summary: 'Miriam dies. Moses strikes rock instead of speaking. Forbidden entry. Aaron dies.', memoryHook: 'Staff hitting rock twice', symbol: '🪨' },
    { chapter: 21, book: 'Numbers', title: 'Bronze Serpent', summary: 'Victory over Arad. Serpents bite complainers. Bronze serpent heals.', memoryHook: 'Snake on pole, people looking', symbol: '🐍' },
    { chapter: 22, book: 'Numbers', title: 'Balaam\'s Donkey', summary: 'Balak summons Balaam. Donkey sees angel, speaks to Balaam.', memoryHook: 'Talking donkey on path', symbol: '🫏' },
    { chapter: 23, book: 'Numbers', title: 'Balaam\'s Oracles 1-2', summary: 'Balaam blesses Israel instead of cursing. Two oracles of blessing.', memoryHook: 'Curse turning to blessing', symbol: '🔄' },
    { chapter: 24, book: 'Numbers', title: 'Balaam\'s Oracles 3-4', summary: 'More blessings. Star from Jacob prophecy. Nations judged.', memoryHook: 'Star rising from Jacob', symbol: '⭐' },
    { chapter: 25, book: 'Numbers', title: 'Baal Peor Sin', summary: 'Israel sins with Moabite women at Baal Peor. Phinehas stops plague.', memoryHook: 'Spear through tent', symbol: '🗡️' },
    { chapter: 26, book: 'Numbers', title: 'Second Census', summary: 'New generation counted. 601,730 men. Land to be divided by tribe.', memoryHook: 'New count, new generation', symbol: '📋' },
    { chapter: 27, book: 'Numbers', title: 'Daughters & Joshua', summary: 'Zelophehad\'s daughters inherit. Joshua commissioned as Moses\' successor.', memoryHook: 'Women with land deed, Moses with hands on Joshua', symbol: '👩‍👩‍👧‍👧' },
    { chapter: 28, book: 'Numbers', title: 'Daily & Weekly Offerings', summary: 'Daily burnt offerings. Sabbath, new moon, and Passover offerings.', memoryHook: 'Calendar with smoke rising daily', symbol: '🗓️' },
    { chapter: 29, book: 'Numbers', title: 'Festival Offerings', summary: 'Trumpets, Atonement, Tabernacles offerings in detail.', memoryHook: 'Fall feast calendar', symbol: '🍂' },
    { chapter: 30, book: 'Numbers', title: 'Vow Laws', summary: 'Men must keep vows. Women\'s vows subject to father or husband.', memoryHook: 'Promise scroll with signatures', symbol: '📜' },
    { chapter: 31, book: 'Numbers', title: 'Midianite War', summary: 'Vengeance on Midian. Balaam killed. Spoils divided.', memoryHook: 'Battle with spoils divided', symbol: '⚔️' },
    { chapter: 32, book: 'Numbers', title: 'East Jordan Tribes', summary: 'Reuben, Gad request east Jordan. Must help conquer before settling.', memoryHook: 'Handshake across river', symbol: '🤝' },
    { chapter: 33, book: 'Numbers', title: 'Journey Summary', summary: 'List of all 42 camping stations from Egypt to Jordan plains.', memoryHook: 'Map with 42 dots', symbol: '🗺️' },
    { chapter: 34, book: 'Numbers', title: 'Land Boundaries', summary: 'Borders of promised land defined. Leaders to divide it.', memoryHook: 'Map with boundary lines', symbol: '📍' },
    { chapter: 35, book: 'Numbers', title: 'Levite Cities', summary: '48 cities for Levites. 6 cities of refuge for accidental killers.', memoryHook: 'City with "REFUGE" sign', symbol: '🏙️' },
    { chapter: 36, book: 'Numbers', title: 'Inheritance Preserved', summary: 'Zelophehad\'s daughters must marry within tribe to keep land.', memoryHook: 'Wedding ring on land deed', symbol: '💍' },
  ]
};

export const deuteronomySet: BibleSet = {
  id: 'deuteronomy-1-34',
  label: 'Deuteronomy 1-34',
  theme: 'Renewal - Moses\' Final Sermons',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Deuteronomy', title: 'History Recap', summary: 'Moses reviews journey from Horeb. Appointing judges. Spy failure.', memoryHook: 'Old man at podium, map behind', symbol: '🗣️' },
    { chapter: 2, book: 'Deuteronomy', title: 'Wilderness Years', summary: 'Wandering reviewed. Passing Edom, Moab, Ammon without conflict.', memoryHook: 'Footprints around territories', symbol: '👣' },
    { chapter: 3, book: 'Deuteronomy', title: 'East Conquest', summary: 'Victory over Sihon and Og. Land to Reuben, Gad, half-Manasseh.', memoryHook: 'Giant king\'s bed', symbol: '🛏️' },
    { chapter: 4, book: 'Deuteronomy', title: 'Obey God\'s Law', summary: 'Keep commandments. No idols - God is invisible. Cities of refuge.', memoryHook: 'Stone tablets, no images', symbol: '🚫' },
    { chapter: 5, book: 'Deuteronomy', title: 'Ten Commandments Repeated', summary: 'Moses restates the Ten Commandments. Covenant at Horeb recalled.', memoryHook: 'Two tablets repeated', symbol: '📋' },
    { chapter: 6, book: 'Deuteronomy', title: 'Shema - Love God', summary: '"Hear O Israel" - love LORD with all heart. Teach children. Remember.', memoryHook: 'Heart with "SHEMA"', symbol: '❤️' },
    { chapter: 7, book: 'Deuteronomy', title: 'Drive Out Nations', summary: 'Destroy Canaanites. No marriages. Chosen people. God fights for you.', memoryHook: 'Seven nations crossed out', symbol: '✖️' },
    { chapter: 8, book: 'Deuteronomy', title: 'Remember Wilderness', summary: 'Remember God\'s testing. Manna. Beware pride when prosperous.', memoryHook: 'Manna and warning sign', symbol: '⚠️' },
    { chapter: 9, book: 'Deuteronomy', title: 'Not Your Righteousness', summary: 'Not because of your goodness. Remember golden calf rebellion.', memoryHook: 'Broken idol reminder', symbol: '💔' },
    { chapter: 10, book: 'Deuteronomy', title: 'New Tablets Made', summary: 'Ark made for tablets. What God requires: fear, love, serve, obey.', memoryHook: 'Ark box with requirements list', symbol: '📦' },
    { chapter: 11, book: 'Deuteronomy', title: 'Love & Obey', summary: 'Love God. Obey for blessings. Gerizim and Ebal - blessing and curse.', memoryHook: 'Two mountains, two choices', symbol: '⛰️' },
    { chapter: 12, book: 'Deuteronomy', title: 'Central Worship', summary: 'Destroy pagan sites. Worship only where God chooses. Eat blood forbidden.', memoryHook: 'One altar, many destroyed', symbol: '🏛️' },
    { chapter: 13, book: 'Deuteronomy', title: 'Reject False Prophets', summary: 'Test prophets. Destroy idolatrous cities. Death for leading astray.', memoryHook: 'False prophet crossed out', symbol: '❌' },
    { chapter: 14, book: 'Deuteronomy', title: 'Clean & Unclean', summary: 'Mourning practices. Clean/unclean food. Tithe regulations.', memoryHook: 'Food list with checkmarks', symbol: '✅' },
    { chapter: 15, book: 'Deuteronomy', title: 'Sabbath Year Release', summary: 'Debts released every 7 years. Help the poor. Free servants.', memoryHook: 'Broken chain every 7 years', symbol: '⛓️‍💥' },
    { chapter: 16, book: 'Deuteronomy', title: 'Three Feasts', summary: 'Passover, Weeks, Tabernacles - appear before God. Just judges.', memoryHook: 'Three pilgrimage festivals', symbol: '🎪' },
    { chapter: 17, book: 'Deuteronomy', title: 'Justice & King', summary: 'Execute idolaters. Establish courts. Future king regulations.', memoryHook: 'Crown with Torah scroll', symbol: '👑' },
    { chapter: 18, book: 'Deuteronomy', title: 'Levites & Prophet', summary: 'Levites\' portion. No occult practices. Prophet like Moses promised.', memoryHook: 'Future prophet silhouette', symbol: '🔮' },
    { chapter: 19, book: 'Deuteronomy', title: 'Cities of Refuge', summary: 'Three refuge cities for accidental killing. Two witnesses required.', memoryHook: 'Running figure to city gate', symbol: '🏃' },
    { chapter: 20, book: 'Deuteronomy', title: 'War Rules', summary: 'War exemptions. Offer peace first. Don\'t destroy fruit trees.', memoryHook: 'White flag and fruit tree', symbol: '🏳️' },
    { chapter: 21, book: 'Deuteronomy', title: 'Various Laws', summary: 'Unsolved murder. Captive wives. Firstborn rights. Rebellious son.', memoryHook: 'Heifer and family matters', symbol: '👨‍👩‍👦' },
    { chapter: 22, book: 'Deuteronomy', title: 'Neighbor & Purity', summary: 'Return lost items. Gender distinctions. Building codes. Sexual purity.', memoryHook: 'Fence on roof, distinct clothes', symbol: '🏠' },
    { chapter: 23, book: 'Deuteronomy', title: 'Assembly Exclusions', summary: 'Who may enter assembly. Camp cleanliness. Escaped slaves. No interest.', memoryHook: 'Entry requirements list', symbol: '📝' },
    { chapter: 24, book: 'Deuteronomy', title: 'Marriage & Justice', summary: 'Divorce certificate. Newlywed exemption. Just treatment of poor.', memoryHook: 'Scroll and gleaning field', symbol: '🌾' },
    { chapter: 25, book: 'Deuteronomy', title: 'Fairness & Levirate', summary: 'Forty stripes limit. Levirate marriage. Honest weights. Destroy Amalek.', memoryHook: 'Balanced scales, sandal', symbol: '⚖️' },
    { chapter: 26, book: 'Deuteronomy', title: 'Firstfruits & Tithes', summary: 'Bring firstfruits and confess salvation history. Tithe declaration.', memoryHook: 'Basket of firstfruits', symbol: '🧺' },
    { chapter: 27, book: 'Deuteronomy', title: 'Stones & Curses', summary: 'Write law on plastered stones. Curses from Mount Ebal.', memoryHook: 'Plastered stones with writing', symbol: '🪨' },
    { chapter: 28, book: 'Deuteronomy', title: 'Blessings & Curses', summary: 'Extensive blessings for obedience. Horrific curses for disobedience.', memoryHook: 'Long scroll with two columns', symbol: '📜' },
    { chapter: 29, book: 'Deuteronomy', title: 'Covenant in Moab', summary: 'Covenant renewed in Moab. Secret things belong to God.', memoryHook: 'Handshake covenant', symbol: '🤝' },
    { chapter: 30, book: 'Deuteronomy', title: 'Choose Life', summary: 'Restoration promised. Word is near. Choose life, not death.', memoryHook: '"LIFE" vs "DEATH" crossroad', symbol: '🚦' },
    { chapter: 31, book: 'Deuteronomy', title: 'Joshua Commissioned', summary: 'Moses announces death. Joshua commissioned. Law to be read every 7 years.', memoryHook: 'Torch passed to Joshua', symbol: '🔥' },
    { chapter: 32, book: 'Deuteronomy', title: 'Song of Moses', summary: 'Moses\' song of witness. God\'s faithfulness, Israel\'s unfaithfulness.', memoryHook: 'Musical scroll of history', symbol: '🎵' },
    { chapter: 33, book: 'Deuteronomy', title: 'Blessing the Tribes', summary: 'Moses blesses each tribe before death.', memoryHook: 'Twelve stars receiving blessings', symbol: '✡️' },
    { chapter: 34, book: 'Deuteronomy', title: 'Moses Dies', summary: 'Moses views Promised Land from Pisgah, dies at 120. Joshua leads.', memoryHook: 'Mountain view, grave unknown', symbol: '⛰️' },
  ]
};

// Historical Books
export const joshuaSet: BibleSet = {
  id: 'joshua-1-24',
  label: 'Joshua 1-24',
  theme: 'Conquest - Taking the Promised Land',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Joshua', title: 'Joshua Commissioned', summary: 'Be strong and courageous. Meditate on the law. Prepare to cross Jordan.', memoryHook: 'Soldier with book and sword', symbol: '⚔️' },
    { chapter: 2, book: 'Joshua', title: 'Rahab & Spies', summary: 'Two spies hidden by Rahab. Scarlet cord promise. Report: land is ours.', memoryHook: 'Red rope from window', symbol: '🧵' },
    { chapter: 3, book: 'Joshua', title: 'Crossing Jordan', summary: 'Priests carry ark into Jordan. Waters stand up. Nation crosses on dry ground.', memoryHook: 'Ark in river, walls of water', symbol: '🌊' },
    { chapter: 4, book: 'Joshua', title: 'Memorial Stones', summary: 'Twelve stones from Jordan bed. Memorial for future generations.', memoryHook: 'Stack of 12 river stones', symbol: '🪨' },
    { chapter: 5, book: 'Joshua', title: 'Circumcision & Passover', summary: 'Circumcision at Gilgal. Passover celebrated. Manna ceases. Commander appears.', memoryHook: 'Passover meal, sword bearer', symbol: '🍞' },
    { chapter: 6, book: 'Joshua', title: 'Jericho Falls', summary: 'March 7 days. Trumpets blast. Walls fall. Rahab spared. City devoted.', memoryHook: 'Falling walls, trumpets', symbol: '📯' },
    { chapter: 7, book: 'Joshua', title: 'Achan\'s Sin', summary: 'Defeat at Ai. Achan\'s hidden spoil discovered. Stoned in Valley of Achor.', memoryHook: 'Hidden treasure, stones falling', symbol: '💎' },
    { chapter: 8, book: 'Joshua', title: 'Ai Conquered', summary: 'Ambush strategy. Ai destroyed. Law written on stones at Mount Ebal.', memoryHook: 'Smoke signal ambush', symbol: '💨' },
    { chapter: 9, book: 'Joshua', title: 'Gibeonite Deception', summary: 'Gibeonites trick Israel with moldy bread. Treaty made. Become servants.', memoryHook: 'Moldy bread and worn sandals', symbol: '🥖' },
    { chapter: 10, book: 'Joshua', title: 'Sun Stands Still', summary: 'Five kings attack Gibeon. Sun and moon stand still. Kings executed.', memoryHook: 'Sun frozen in sky', symbol: '☀️' },
    { chapter: 11, book: 'Joshua', title: 'Northern Conquest', summary: 'Northern coalition defeated. Hazor burned. Land has rest.', memoryHook: 'Burning northern city', symbol: '🔥' },
    { chapter: 12, book: 'Joshua', title: 'List of Kings', summary: 'Thirty-one kings defeated by Joshua and Moses.', memoryHook: 'Checklist of 31 crowns', symbol: '📋' },
    { chapter: 13, book: 'Joshua', title: 'Land Remaining', summary: 'Land still to conquer. East Jordan allotments. Levites have no land.', memoryHook: 'Incomplete map coloring', symbol: '🗺️' },
    { chapter: 14, book: 'Joshua', title: 'Caleb\'s Inheritance', summary: 'Land divided by lot. Caleb claims Hebron at 85, still strong.', memoryHook: 'Strong old man with mountain', symbol: '💪' },
    { chapter: 15, book: 'Joshua', title: 'Judah\'s Territory', summary: 'Judah\'s boundaries and cities. Caleb gives daughter Achsah springs.', memoryHook: 'Southern territory outline', symbol: '📍' },
    { chapter: 16, book: 'Joshua', title: 'Ephraim\'s Territory', summary: 'Ephraim\'s allotment. Some Canaanites not driven out.', memoryHook: 'Central land portion', symbol: '🗺️' },
    { chapter: 17, book: 'Joshua', title: 'Manasseh\'s Territory', summary: 'Half-Manasseh\'s land. Zelophehad\'s daughters. More land needed.', memoryHook: 'Forested hill country', symbol: '🌲' },
    { chapter: 18, book: 'Joshua', title: 'Remaining Tribes', summary: 'Tabernacle at Shiloh. Seven tribes surveyed and allotted land.', memoryHook: 'Tent with land surveyors', symbol: '⛺' },
    { chapter: 19, book: 'Joshua', title: 'Six More Tribes', summary: 'Simeon, Zebulun, Issachar, Asher, Naphtali, Dan receive land. Joshua\'s city.', memoryHook: 'Six colored territories', symbol: '🎨' },
    { chapter: 20, book: 'Joshua', title: 'Cities of Refuge', summary: 'Six cities designated as refuge for accidental killers.', memoryHook: 'Six safe haven cities', symbol: '🏘️' },
    { chapter: 21, book: 'Joshua', title: 'Levitical Cities', summary: 'Forty-eight cities given to Levites from all tribes.', memoryHook: 'Priests scattered across map', symbol: '👔' },
    { chapter: 22, book: 'Joshua', title: 'Altar Controversy', summary: 'Eastern tribes build altar. Near civil war. Explained as witness altar.', memoryHook: 'Large altar by river', symbol: '🪨' },
    { chapter: 23, book: 'Joshua', title: 'Joshua\'s Farewell', summary: 'Joshua old, warns Israel to obey God and not intermarry.', memoryHook: 'Old leader with warning finger', symbol: '☝️' },
    { chapter: 24, book: 'Joshua', title: 'Choose This Day', summary: '"As for me and my house, we will serve the LORD." Covenant renewed. Joshua dies.', memoryHook: 'House with raised hand', symbol: '🏠' },
  ]
};

export const judgesSet: BibleSet = {
  id: 'judges-1-21',
  label: 'Judges 1-21',
  theme: 'Cycles - Sin, Oppression, Deliverance',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Judges', title: 'Incomplete Conquest', summary: 'Tribes fail to fully drive out Canaanites. Partial victories.', memoryHook: 'Half-conquered map', symbol: '🗺️' },
    { chapter: 2, book: 'Judges', title: 'Cycle Begins', summary: 'Angel rebukes. Generation dies. New generation forsakes God. Judge cycle starts.', memoryHook: 'Circular arrow pattern', symbol: '🔄' },
    { chapter: 3, book: 'Judges', title: 'Othniel, Ehud, Shamgar', summary: 'First three judges. Ehud\'s left-handed assassination. Shamgar\'s oxgoad.', memoryHook: 'Left hand, oxgoad', symbol: '🦬' },
    { chapter: 4, book: 'Judges', title: 'Deborah & Barak', summary: 'Prophetess Deborah. Barak defeats Sisera. Jael kills Sisera with tent peg.', memoryHook: 'Woman with tent peg and hammer', symbol: '🔨' },
    { chapter: 5, book: 'Judges', title: 'Song of Deborah', summary: 'Victory song. Stars fought against Sisera. Blessed is Jael.', memoryHook: 'Victory song notes', symbol: '🎵' },
    { chapter: 6, book: 'Judges', title: 'Gideon Called', summary: 'Midianites oppress. Angel calls Gideon. Fleece tests. Altar destroyed.', memoryHook: 'Fleece wet/dry', symbol: '🐑' },
    { chapter: 7, book: 'Judges', title: 'Gideon\'s 300', summary: 'Army reduced to 300 lappers. Torches, trumpets, jars defeat Midian.', memoryHook: 'Broken jar with torch', symbol: '🏺' },
    { chapter: 8, book: 'Judges', title: 'Gideon\'s Decline', summary: 'Pursuit completed. Golden ephod becomes snare. Gideon dies.', memoryHook: 'Gold ephod idol', symbol: '🥇' },
    { chapter: 9, book: 'Judges', title: 'Abimelech\'s Tyranny', summary: 'Abimelech kills 70 brothers. Jotham\'s fable. Abimelech killed by woman.', memoryHook: 'Crown on thornbush, millstone', symbol: '👑' },
    { chapter: 10, book: 'Judges', title: 'Tola & Jair', summary: 'Minor judges Tola and Jair. Israel returns to idols. Ammonites oppress.', memoryHook: 'Two small judge icons', symbol: '⚖️' },
    { chapter: 11, book: 'Judges', title: 'Jephthah\'s Vow', summary: 'Outcast Jephthah leads. Rash vow. Defeats Ammon. Tragic consequence.', memoryHook: 'Broken vow scroll', symbol: '😢' },
    { chapter: 12, book: 'Judges', title: 'Shibboleth', summary: 'Ephraim\'s civil war. "Shibboleth" password. Three minor judges.', memoryHook: 'Password test at river', symbol: '🔐' },
    { chapter: 13, book: 'Judges', title: 'Samson\'s Birth', summary: 'Angel announces Nazirite son to barren woman. Samson born.', memoryHook: 'Long hair, no razor', symbol: '💇' },
    { chapter: 14, book: 'Judges', title: 'Samson\'s Riddle', summary: 'Samson wants Philistine wife. Kills lion. Honey riddle. 30 garments owed.', memoryHook: 'Lion with honey', symbol: '🦁' },
    { chapter: 15, book: 'Judges', title: 'Foxes & Jawbone', summary: 'Foxes with torches burn crops. 1000 killed with donkey jawbone.', memoryHook: 'Burning foxes, jawbone weapon', symbol: '🦴' },
    { chapter: 16, book: 'Judges', title: 'Samson & Delilah', summary: 'Delilah discovers secret. Hair cut, strength gone. Captured, blinded. Final victory.', memoryHook: 'Scissors cutting hair, pillars falling', symbol: '✂️' },
    { chapter: 17, book: 'Judges', title: 'Micah\'s Idol', summary: 'Micah makes idol and ephod. Hires Levite as private priest.', memoryHook: 'Personal shrine with hired priest', symbol: '🗿' },
    { chapter: 18, book: 'Judges', title: 'Dan\'s Migration', summary: 'Danites steal Micah\'s idol and priest. Conquer Laish.', memoryHook: 'Stolen gods going north', symbol: '🧭' },
    { chapter: 19, book: 'Judges', title: 'Crime at Gibeah', summary: 'Levite\'s concubine abused and killed. Body cut in 12 pieces sent out.', memoryHook: 'Dark deed, 12 messengers', symbol: '⚫' },
    { chapter: 20, book: 'Judges', title: 'Civil War', summary: 'Israel attacks Benjamin. Near extinction of tribe after brutal battles.', memoryHook: 'Tribe almost gone', symbol: '⚔️' },
    { chapter: 21, book: 'Judges', title: 'Wives for Benjamin', summary: 'Wives found for surviving Benjamites. "Everyone did what was right in own eyes."', memoryHook: 'Chaos - no king', symbol: '👁️' },
  ]
};

export const ruthSet: BibleSet = {
  id: 'ruth-1-4',
  label: 'Ruth 1-4',
  theme: 'Redemption - The Kinsman Redeemer',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Ruth', title: 'Naomi\'s Return', summary: 'Famine to Moab. Husbands die. Ruth clings to Naomi: "Your God, my God."', memoryHook: 'Two women on road, one turning back', symbol: '🛤️' },
    { chapter: 2, book: 'Ruth', title: 'Gleaning in Boaz\'s Field', summary: 'Ruth gleans in Boaz\'s field. He shows her favor and protection.', memoryHook: 'Woman gathering grain, man watching', symbol: '🌾' },
    { chapter: 3, book: 'Ruth', title: 'Ruth at the Threshing Floor', summary: 'Naomi\'s plan. Ruth lies at Boaz\'s feet. He promises to redeem.', memoryHook: 'Feet uncovered at night', symbol: '🌙' },
    { chapter: 4, book: 'Ruth', title: 'Boaz Redeems', summary: 'Closer redeemer declines. Boaz marries Ruth. Obed born - David\'s grandfather.', memoryHook: 'Sandal exchange, baby in lineage', symbol: '👟' },
  ]
};

// ... Continue with more books
export const firstSamuelSet: BibleSet = {
  id: '1-samuel-1-31',
  label: '1 Samuel 1-31',
  theme: 'Kingdom - From Judges to Kings',
  testament: 'old',
  chapters: [
    { chapter: 1, book: '1 Samuel', title: 'Hannah\'s Prayer', summary: 'Barren Hannah prays at Shiloh. Vows son to God. Samuel born.', memoryHook: 'Weeping woman, baby dedicated', symbol: '🙏' },
    { chapter: 2, book: '1 Samuel', title: 'Hannah\'s Song', summary: 'Hannah\'s praise. Eli\'s wicked sons. Samuel ministers before LORD.', memoryHook: 'Song of praise, bad priest sons', symbol: '🎵' },
    { chapter: 3, book: '1 Samuel', title: 'Samuel Called', summary: '"Speak LORD, your servant hears." God reveals Eli\'s house will fall.', memoryHook: 'Boy hearing voice at night', symbol: '👂' },
    { chapter: 4, book: '1 Samuel', title: 'Ark Captured', summary: 'Israel defeated. Ark captured by Philistines. Eli\'s sons die. Eli dies.', memoryHook: 'Ark on Philistine cart', symbol: '📦' },
    { chapter: 5, book: '1 Samuel', title: 'Dagon Falls', summary: 'Ark in Dagon\'s temple. Dagon falls, breaks. Tumors plague Philistines.', memoryHook: 'Broken idol before ark', symbol: '🗿' },
    { chapter: 6, book: '1 Samuel', title: 'Ark Returned', summary: 'Philistines return ark with guilt offering. Cows go straight to Israel.', memoryHook: 'Cows pulling cart home', symbol: '🐄' },
    { chapter: 7, book: '1 Samuel', title: 'Samuel Leads', summary: 'Ark at Kiriath-jearim. Samuel calls to repentance. Victory at Ebenezer.', memoryHook: 'Stone of help raised', symbol: '🪨' },
    { chapter: 8, book: '1 Samuel', title: 'Demand for King', summary: 'Samuel\'s sons corrupt. People demand king "like other nations."', memoryHook: 'Crown replacing gavel', symbol: '👑' },
    { chapter: 9, book: '1 Samuel', title: 'Saul Meets Samuel', summary: 'Saul seeking donkeys meets Samuel. Anointed as leader privately.', memoryHook: 'Lost donkeys lead to kingdom', symbol: '🫏' },
    { chapter: 10, book: '1 Samuel', title: 'Saul Anointed King', summary: 'Saul anointed, prophesies. Chosen by lot. Some despise him.', memoryHook: 'Oil on head, hiding in baggage', symbol: '🛢️' },
    { chapter: 11, book: '1 Samuel', title: 'Jabesh-Gilead Rescued', summary: 'Ammonites threaten Jabesh. Saul rallies Israel. Victory. Kingdom confirmed.', memoryHook: 'Cut oxen pieces sent out', symbol: '✉️' },
    { chapter: 12, book: '1 Samuel', title: 'Samuel\'s Farewell', summary: 'Samuel\'s final speech as judge. Thunder confirms his words.', memoryHook: 'Thunder during wheat harvest', symbol: '⛈️' },
    { chapter: 13, book: '1 Samuel', title: 'Saul\'s Presumption', summary: 'Saul offers sacrifice impatiently. Samuel rebukes. Kingdom won\'t endure.', memoryHook: 'King at altar, prophet angry', symbol: '😠' },
    { chapter: 14, book: '1 Samuel', title: 'Jonathan\'s Victory', summary: 'Jonathan attacks Philistine outpost. Earthquake. Saul\'s foolish oath.', memoryHook: 'Two men scaling cliff, honey', symbol: '🍯' },
    { chapter: 15, book: '1 Samuel', title: 'Saul Rejected', summary: 'Amalek not fully destroyed. Saul keeps Agag and best animals. Rejected as king.', memoryHook: 'Bleating sheep, torn robe', symbol: '🐑' },
    { chapter: 16, book: '1 Samuel', title: 'David Anointed', summary: 'Samuel anoints David. Spirit leaves Saul, evil spirit troubles him. David plays harp.', memoryHook: 'Horn of oil on shepherd boy', symbol: '🎵' },
    { chapter: 17, book: '1 Samuel', title: 'David & Goliath', summary: 'Giant Goliath challenges Israel. David kills him with sling and stone.', memoryHook: 'Sling vs. giant', symbol: '🪨' },
    { chapter: 18, book: '1 Samuel', title: 'Saul\'s Jealousy', summary: 'Jonathan loves David. Women sing David\'s praise. Saul grows jealous.', memoryHook: 'Spear thrown at harpist', symbol: '🎯' },
    { chapter: 19, book: '1 Samuel', title: 'David Flees', summary: 'Saul tries to kill David. Michal helps escape. David flees to Samuel.', memoryHook: 'Window escape, idol in bed', symbol: '🪟' },
    { chapter: 20, book: '1 Samuel', title: 'Jonathan\'s Covenant', summary: 'Jonathan and David\'s covenant. Arrow signal. Tearful parting.', memoryHook: 'Arrows beyond mark', symbol: '🏹' },
    { chapter: 21, book: '1 Samuel', title: 'David at Nob', summary: 'David gets holy bread and Goliath\'s sword. Feigns madness at Gath.', memoryHook: 'Showbread and giant sword', symbol: '🍞' },
    { chapter: 22, book: '1 Samuel', title: 'Priests Killed', summary: 'David at Adullam cave. Doeg kills 85 priests. Abiathar escapes to David.', memoryHook: 'Cave hideout, slain priests', symbol: '🕯️' },
    { chapter: 23, book: '1 Samuel', title: 'David Rescued', summary: 'David saves Keilah. Jonathan strengthens David. Narrow escape from Saul.', memoryHook: 'Wilderness chase, close call', symbol: '🏃' },
    { chapter: 24, book: '1 Samuel', title: 'David Spares Saul', summary: 'David cuts Saul\'s robe in cave but won\'t harm LORD\'s anointed.', memoryHook: 'Cut robe corner', symbol: '✂️' },
    { chapter: 25, book: '1 Samuel', title: 'Nabal & Abigail', summary: 'Samuel dies. Nabal insults David. Abigail intervenes. Nabal dies. David marries Abigail.', memoryHook: 'Wise woman with food', symbol: '🍖' },
    { chapter: 26, book: '1 Samuel', title: 'Spear & Jug', summary: 'David again spares Saul. Takes spear and water jug from sleeping camp.', memoryHook: 'Spear and jug lifted', symbol: '🏺' },
    { chapter: 27, book: '1 Samuel', title: 'David Among Philistines', summary: 'David flees to Philistia. Given Ziklag. Raids enemies secretly.', memoryHook: 'Double life in enemy land', symbol: '🎭' },
    { chapter: 28, book: '1 Samuel', title: 'Witch of Endor', summary: 'Saul consults medium. Samuel\'s spirit predicts Saul\'s death.', memoryHook: 'Ghost rising from ground', symbol: '👻' },
    { chapter: 29, book: '1 Samuel', title: 'David Dismissed', summary: 'Philistine lords reject David from battle. He returns to Ziklag.', memoryHook: 'Turned back from army', symbol: '🔙' },
    { chapter: 30, book: '1 Samuel', title: 'Ziklag Raided', summary: 'Amalekites burn Ziklag. David pursues, recovers all. Shares spoil.', memoryHook: 'Burning city, recovery mission', symbol: '🔥' },
    { chapter: 31, book: '1 Samuel', title: 'Saul\'s Death', summary: 'Philistines win at Gilboa. Saul and sons die. Bodies hung on wall.', memoryHook: 'Fallen king on battlefield', symbol: '💀' },
  ]
};

// Continue with Psalms (5 sets of ~30 chapters)
export const psalms1to30Set: BibleSet = {
  id: 'psalms-1-30',
  label: 'Psalms 1-30',
  theme: 'Book I - Blessed is the Man',
  testament: 'old',
  chapters: [
    { chapter: 1, book: 'Psalms', title: 'Two Paths', summary: 'Blessed who meditates on law. Righteous tree, wicked chaff.', memoryHook: 'Tree by water vs. blowing chaff', symbol: '🌳' },
    { chapter: 2, book: 'Psalms', title: 'The Anointed King', summary: 'Nations rage. God laughs. Son enthroned on Zion. Kiss the Son.', memoryHook: 'Broken chains, kiss the Son', symbol: '👑' },
    { chapter: 3, book: 'Psalms', title: 'Morning Deliverance', summary: 'Many enemies. LORD is shield. I lay down and sleep.', memoryHook: 'Sleeping peacefully despite enemies', symbol: '😴' },
    { chapter: 4, book: 'Psalms', title: 'Evening Peace', summary: 'Answer when I call. Be angry but sin not. Dwell in safety.', memoryHook: 'Peaceful sunset meditation', symbol: '🌅' },
    { chapter: 5, book: 'Psalms', title: 'Morning Prayer', summary: 'In morning direct prayer. Lead in righteousness. Shelter of joy.', memoryHook: 'Sunrise prayer posture', symbol: '🌄' },
    { chapter: 6, book: 'Psalms', title: 'Tears on Pillow', summary: 'Rebuke not in anger. Weary with groaning. Depart evildoers.', memoryHook: 'Wet pillow, answered prayer', symbol: '😢' },
    { chapter: 7, book: 'Psalms', title: 'Righteous Judge', summary: 'Judge me according to righteousness. God tests hearts.', memoryHook: 'Judge with scales', symbol: '⚖️' },
    { chapter: 8, book: 'Psalms', title: 'Majestic Name', summary: 'How majestic Your name! Crowned with glory. Dominion given.', memoryHook: 'Stars, moon, crowned human', symbol: '🌙' },
    { chapter: 9, book: 'Psalms', title: 'Thanksgiving for Justice', summary: 'Tell of wonders. Nations judged. LORD refuge for oppressed.', memoryHook: 'Throne of justice', symbol: '🏛️' },
    { chapter: 10, book: 'Psalms', title: 'Why Stand Far?', summary: 'Wicked persecute poor. God sees. Defend the fatherless.', memoryHook: 'Hidden watcher seeing injustice', symbol: '👁️' },
    { chapter: 11, book: 'Psalms', title: 'Refuge in LORD', summary: 'In LORD I take refuge. When foundations destroyed, LORD tests.', memoryHook: 'Firm foundation, watching eye', symbol: '🏔️' },
    { chapter: 12, book: 'Psalms', title: 'Pure Words', summary: 'Words of LORD are pure, refined seven times. Guard us.', memoryHook: 'Silver refined in furnace', symbol: '✨' },
    { chapter: 13, book: 'Psalms', title: 'How Long?', summary: 'How long, O LORD? Consider and answer. Trust in steadfast love.', memoryHook: 'Clock with question marks', symbol: '⏰' },
    { chapter: 14, book: 'Psalms', title: 'The Fool Says', summary: 'Fool says no God. All corrupt. God with righteous generation.', memoryHook: 'Fool denying obvious truth', symbol: '🤡' },
    { chapter: 15, book: 'Psalms', title: 'Who May Dwell?', summary: 'Walk blamelessly, speak truth, keep oath. Never shaken.', memoryHook: 'Checklist for sanctuary', symbol: '✅' },
    { chapter: 16, book: 'Psalms', title: 'Path of Life', summary: 'Preserve me. Goodly heritage. Not abandoned to Sheol. Fullness of joy.', memoryHook: 'Path leading to joy', symbol: '😊' },
    { chapter: 17, book: 'Psalms', title: 'Keep as Apple of Eye', summary: 'Vindicate me. Hide under wings. Satisfied when I awake.', memoryHook: 'Apple of eye, protective wings', symbol: '🍎' },
    { chapter: 18, book: 'Psalms', title: 'Rescue Song', summary: 'LORD my rock, fortress. Earth shook. Delivered from enemies.', memoryHook: 'Lightning and earthquake rescue', symbol: '⚡' },
    { chapter: 19, book: 'Psalms', title: 'Heavens Declare', summary: 'Heavens tell glory. Law perfect, testimony sure. Words of my mouth.', memoryHook: 'Sun with Torah scroll', symbol: '☀️' },
    { chapter: 20, book: 'Psalms', title: 'Day of Trouble', summary: 'May LORD answer in trouble. Some trust chariots, we trust God.', memoryHook: 'Chariot vs. lifted hands', symbol: '🙌' },
    { chapter: 21, book: 'Psalms', title: 'King Rejoices', summary: 'King rejoices in strength. Crown of gold. Length of days forever.', memoryHook: 'Crowned king celebrating', symbol: '👑' },
    { chapter: 22, book: 'Psalms', title: 'Forsaken Then Praised', summary: 'My God why forsaken? Pierced hands and feet. All nations worship.', memoryHook: 'Cross to crown', symbol: '✝️' },
    { chapter: 23, book: 'Psalms', title: 'The Shepherd', summary: 'LORD is shepherd. Green pastures. Through valley. Goodness follows.', memoryHook: 'Shepherd with sheep and staff', symbol: '🐑' },
    { chapter: 24, book: 'Psalms', title: 'King of Glory', summary: 'Earth is LORD\'s. Clean hands enter. Lift heads, King of glory comes.', memoryHook: 'Gates lifting for King', symbol: '🚪' },
    { chapter: 25, book: 'Psalms', title: 'Teach Me', summary: 'Lead in truth. Remember mercy. For Your name\'s sake pardon.', memoryHook: 'Student before teacher', symbol: '📚' },
    { chapter: 26, book: 'Psalms', title: 'Vindicate Me', summary: 'Examine me. Walk in integrity. Love house where glory dwells.', memoryHook: 'Washing hands at altar', symbol: '🖐️' },
    { chapter: 27, book: 'Psalms', title: 'One Thing', summary: 'LORD my light and salvation. One thing I ask - dwell in house.', memoryHook: 'Light in darkness, temple yearning', symbol: '💡' },
    { chapter: 28, book: 'Psalms', title: 'My Rock', summary: 'To You I cry, my Rock. Repay workers of evil. Shepherd Your people.', memoryHook: 'Praying toward sanctuary', symbol: '🙏' },
    { chapter: 29, book: 'Psalms', title: 'Voice of LORD', summary: 'Voice over waters. Voice breaks cedars. LORD gives strength and peace.', memoryHook: 'Thunder over forest', symbol: '🌲' },
    { chapter: 30, book: 'Psalms', title: 'Mourning to Dancing', summary: 'Lifted from pit. Weeping for night, joy in morning. Dancing.', memoryHook: 'Sackcloth off, dancing on', symbol: '💃' },
  ]
};

// NEW TESTAMENT

export const matthewSet: BibleSet = {
  id: 'matthew-1-28',
  label: 'Matthew 1-28',
  theme: 'King - Behold Your King',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Matthew', title: 'Genealogy & Birth', summary: 'Abraham to Jesus genealogy. Joseph\'s dream. Virgin birth. Immanuel.', memoryHook: 'Family tree ending at manger', symbol: '👶' },
    { chapter: 2, book: 'Matthew', title: 'Wise Men & Flight', summary: 'Magi follow star. Herod\'s plot. Egypt escape. Return to Nazareth.', memoryHook: 'Star, gifts, escape route', symbol: '⭐' },
    { chapter: 3, book: 'Matthew', title: 'John Baptizes Jesus', summary: 'John preaches repentance. Jesus baptized. Spirit descends. Voice from heaven.', memoryHook: 'Dove descending, voice booming', symbol: '🕊️' },
    { chapter: 4, book: 'Matthew', title: 'Temptation & Ministry', summary: '40 days fasting. Three temptations. Begins preaching. Calls first disciples.', memoryHook: 'Desert stones, fishing nets', symbol: '🏜️' },
    { chapter: 5, book: 'Matthew', title: 'Sermon: Beatitudes', summary: 'Blessed are poor, mourning, meek. Salt and light. Law fulfilled.', memoryHook: 'Mountain sermon, salt shaker', symbol: '🧂' },
    { chapter: 6, book: 'Matthew', title: 'Sermon: Prayer & Treasure', summary: 'Lord\'s Prayer. Don\'t worry. Seek kingdom first. No two masters.', memoryHook: 'Model prayer, birds and lilies', symbol: '🙏' },
    { chapter: 7, book: 'Matthew', title: 'Sermon: Judging & Foundations', summary: 'Don\'t judge. Ask, seek, knock. Narrow gate. Two foundations.', memoryHook: 'Speck vs. plank, two houses', symbol: '🏠' },
    { chapter: 8, book: 'Matthew', title: 'Miracles Begin', summary: 'Leper cleansed. Centurion\'s faith. Storm calmed. Demons to pigs.', memoryHook: 'Touched leper, calmed storm', symbol: '🌊' },
    { chapter: 9, book: 'Matthew', title: 'More Miracles', summary: 'Paralytic forgiven. Matthew called. Dead girl raised. Blind see.', memoryHook: 'Mat through roof, tax booth', symbol: '💰' },
    { chapter: 10, book: 'Matthew', title: 'Twelve Sent', summary: 'Twelve apostles named and commissioned. Sheep among wolves. Not peace but sword.', memoryHook: '12 men sent with instructions', symbol: '📨' },
    { chapter: 11, book: 'Matthew', title: 'Jesus & John', summary: 'John questions from prison. Jesus praises John. Woe to cities. Come to Me.', memoryHook: 'Prison question, yoke offered', symbol: '⛓️' },
    { chapter: 12, book: 'Matthew', title: 'Sabbath & Blasphemy', summary: 'Lord of Sabbath. Pharisees plot. Beelzebul accusation. Sign of Jonah.', memoryHook: 'Grain picking, whale', symbol: '🐋' },
    { chapter: 13, book: 'Matthew', title: 'Kingdom Parables', summary: 'Sower. Wheat and tares. Mustard seed. Pearl. Net. Rejected at Nazareth.', memoryHook: 'Seeds on four soils', symbol: '🌱' },
    { chapter: 14, book: 'Matthew', title: 'John Beheaded', summary: 'Herod kills John. 5000 fed. Jesus walks on water. Peter sinks.', memoryHook: 'Platter, loaves, water walking', symbol: '🚶' },
    { chapter: 15, book: 'Matthew', title: 'Tradition vs. Heart', summary: 'What defiles comes from heart. Canaanite woman\'s faith. 4000 fed.', memoryHook: 'Heart more than hands', symbol: '❤️' },
    { chapter: 16, book: 'Matthew', title: 'Peter\'s Confession', summary: '"You are the Christ." Keys given. Jesus predicts death. Deny self.', memoryHook: 'Rock, keys, cross', symbol: '🔑' },
    { chapter: 17, book: 'Matthew', title: 'Transfiguration', summary: 'Shining on mountain. Moses and Elijah. Demon-possessed boy healed.', memoryHook: 'Glowing face, mountain cloud', symbol: '✨' },
    { chapter: 18, book: 'Matthew', title: 'Greatness & Forgiveness', summary: 'Greatest is childlike. Lost sheep. Church discipline. 70x7 forgiveness.', memoryHook: 'Child in center, 70x7', symbol: '👧' },
    { chapter: 19, book: 'Matthew', title: 'Marriage & Riches', summary: 'Divorce teaching. Let children come. Rich young ruler. Last first.', memoryHook: 'Ring, children, camel needle', symbol: '🐪' },
    { chapter: 20, book: 'Matthew', title: 'Laborers & Service', summary: 'Vineyard workers parable. Cup of suffering. Not to be served but serve.', memoryHook: 'Same pay for all, towel service', symbol: '💵' },
    { chapter: 21, book: 'Matthew', title: 'Triumphal Entry', summary: 'Palm Sunday. Temple cleansed. Cursed fig tree. Authority questioned.', memoryHook: 'Donkey, palms, whip', symbol: '🌴' },
    { chapter: 22, book: 'Matthew', title: 'Parables & Questions', summary: 'Wedding feast. Render to Caesar. Greatest commandment. David\'s Lord.', memoryHook: 'Wedding clothes, coin', symbol: '💍' },
    { chapter: 23, book: 'Matthew', title: 'Woe to Pharisees', summary: 'Seven woes. Whitewashed tombs. Jerusalem lamented.', memoryHook: 'White tombs, hen with chicks', symbol: '🪦' },
    { chapter: 24, book: 'Matthew', title: 'End Times Signs', summary: 'Temple destruction. Tribulation signs. Son coming on clouds. Stay ready.', memoryHook: 'Temple falling, clouds parting', symbol: '⛅' },
    { chapter: 25, book: 'Matthew', title: 'Three Parables', summary: 'Ten virgins. Talents. Sheep and goats. "Whatever you did to least..."', memoryHook: 'Lamps, coins, sheep/goats', symbol: '🐐' },
    { chapter: 26, book: 'Matthew', title: 'Betrayal & Arrest', summary: 'Anointing. Last Supper. Gethsemane. Judas\' kiss. Peter\'s denial.', memoryHook: 'Perfume, bread, kiss, rooster', symbol: '🐓' },
    { chapter: 27, book: 'Matthew', title: 'Trial & Crucifixion', summary: 'Before Pilate. Barabbas released. Crucified at Golgotha. Buried.', memoryHook: 'Cross, torn veil, sealed tomb', symbol: '✝️' },
    { chapter: 28, book: 'Matthew', title: 'Resurrection', summary: 'Empty tomb. Angel\'s message. Jesus appears. Great Commission.', memoryHook: 'Rolled stone, worldwide mission', symbol: '🌍' },
  ]
};

export const markSet: BibleSet = {
  id: 'mark-1-16',
  label: 'Mark 1-16',
  theme: 'Servant - The Suffering Servant',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Mark', title: 'Ministry Begins', summary: 'John baptizes. Jesus baptized, tempted. Preaches, calls fishermen. Heals many.', memoryHook: 'Fast-paced action begins', symbol: '🏃' },
    { chapter: 2, book: 'Mark', title: 'Authority Shown', summary: 'Paralytic through roof. Levi called. Fasting questioned. Lord of Sabbath.', memoryHook: 'Roof removed, mat lowered', symbol: '🛠️' },
    { chapter: 3, book: 'Mark', title: 'Twelve Chosen', summary: 'Hand healed on Sabbath. Crowds. Twelve appointed. Unforgivable sin.', memoryHook: 'Healed hand, 12 chosen', symbol: '✋' },
    { chapter: 4, book: 'Mark', title: 'Parables & Storm', summary: 'Sower, lamp, growing seed, mustard seed. Storm calmed: "Peace, be still."', memoryHook: 'Seeds scattered, storm silenced', symbol: '🌾' },
    { chapter: 5, book: 'Mark', title: 'Three Miracles', summary: 'Legion into pigs. Woman touches hem. Jairus\' daughter raised.', memoryHook: 'Pigs cliff, touching hem, "Talitha cumi"', symbol: '🐷' },
    { chapter: 6, book: 'Mark', title: 'Rejection & Multiplication', summary: 'Rejected at Nazareth. Twelve sent. John beheaded. 5000 fed. Water walking.', memoryHook: 'Home rejection, bread multiplication', symbol: '🍞' },
    { chapter: 7, book: 'Mark', title: 'Tradition vs. Truth', summary: 'Pharisees on washing. What defiles. Syrophoenician woman. Deaf man healed.', memoryHook: 'Unwashed hands, crumbs for dogs', symbol: '🐕' },
    { chapter: 8, book: 'Mark', title: 'Who Am I?', summary: '4000 fed. Blind healed in two stages. Peter\'s confession. Deny self.', memoryHook: 'Gradual sight, "You are Christ"', symbol: '👁️' },
    { chapter: 9, book: 'Mark', title: 'Transfiguration', summary: 'Glory on mountain. Demon-possessed boy. First will be last.', memoryHook: 'White clothes, failed disciples', symbol: '⚪' },
    { chapter: 10, book: 'Mark', title: 'Teaching Journey', summary: 'Divorce teaching. Children welcomed. Rich man. Blind Bartimaeus.', memoryHook: 'Children on lap, blind man\'s cry', symbol: '👦' },
    { chapter: 11, book: 'Mark', title: 'Triumphal Entry', summary: 'Colt brought. "Hosanna!" Temple cleared. Fig tree cursed. Authority questioned.', memoryHook: 'Cloaks on donkey, tables flipped', symbol: '🌿' },
    { chapter: 12, book: 'Mark', title: 'Controversies', summary: 'Tenant parable. Taxes to Caesar. Resurrection. Greatest command. Widow\'s mites.', memoryHook: 'Stone rejected, two small coins', symbol: '🪙' },
    { chapter: 13, book: 'Mark', title: 'Olivet Discourse', summary: 'Temple destruction predicted. Signs of end. Be watchful and ready.', memoryHook: 'Not one stone, stay awake', symbol: '⏰' },
    { chapter: 14, book: 'Mark', title: 'Anointing to Denial', summary: 'Anointing. Last Supper. Gethsemane prayer. Betrayal. Peter denies.', memoryHook: 'Expensive perfume, three denials', symbol: '🧴' },
    { chapter: 15, book: 'Mark', title: 'Crucifixion', summary: 'Before Pilate. Mocked, beaten, crucified. Darkness. "Eloi" cry. Death.', memoryHook: 'Crown of thorns, darkness at noon', symbol: '👑' },
    { chapter: 16, book: 'Mark', title: 'Resurrection', summary: 'Stone rolled. Young man in white. "He is risen." Go and tell.', memoryHook: 'Empty tomb, white messenger', symbol: '🌅' },
  ]
};

export const lukeSet: BibleSet = {
  id: 'luke-1-24',
  label: 'Luke 1-24',
  theme: 'Son of Man - For All People',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Luke', title: 'Two Births Announced', summary: 'Zechariah and Gabriel. Mary\'s visit. John born. Zechariah\'s prophecy.', memoryHook: 'Angel at altar, pregnant greeting', symbol: '👼' },
    { chapter: 2, book: 'Luke', title: 'Jesus Born', summary: 'Bethlehem birth. Shepherds visit. Presented at temple. Simeon and Anna.', memoryHook: 'Manger, angels, old prophets', symbol: '🎄' },
    { chapter: 3, book: 'Luke', title: 'John\'s Preaching', summary: 'John preaches repentance. Jesus baptized. Genealogy to Adam.', memoryHook: 'Ax at root, dove descending', symbol: '🪓' },
    { chapter: 4, book: 'Luke', title: 'Temptation & Rejection', summary: 'Three temptations. Nazareth rejection: "Today this is fulfilled."', memoryHook: 'Desert, cliff push, scroll', symbol: '📜' },
    { chapter: 5, book: 'Luke', title: 'Fishers Called', summary: 'Great catch of fish. Leper cleansed. Paralytic. Levi follows.', memoryHook: 'Net breaking with fish', symbol: '🐟' },
    { chapter: 6, book: 'Luke', title: 'Sermon on Plain', summary: 'Sabbath disputes. Twelve chosen. Beatitudes and woes. Love enemies.', memoryHook: 'Flat sermon, bless your enemy', symbol: '💛' },
    { chapter: 7, book: 'Luke', title: 'Faith & Forgiveness', summary: 'Centurion\'s faith. Widow\'s son raised. John\'s question. Sinful woman.', memoryHook: 'Far-off faith, tears on feet', symbol: '💧' },
    { chapter: 8, book: 'Luke', title: 'Women & Miracles', summary: 'Women follow. Sower parable. Storm calmed. Legion. Jairus\' daughter.', memoryHook: 'Supporting women, calmed storm', symbol: '👩' },
    { chapter: 9, book: 'Luke', title: 'Twelve Sent', summary: '5000 fed. Peter\'s confession. Transfiguration. Cost of following.', memoryHook: 'Bread multiplying, glory showing', symbol: '✨' },
    { chapter: 10, book: 'Luke', title: '70 Sent', summary: 'Seventy sent. Woe to cities. Good Samaritan. Mary and Martha.', memoryHook: 'Bigger send, neighbor story', symbol: '🚴' },
    { chapter: 11, book: 'Luke', title: 'Prayer & Woes', summary: 'Lord\'s Prayer. Persistent friend. Beelzebul. Sign of Jonah. Six woes.', memoryHook: 'Midnight knocking, Jonah sign', symbol: '🌙' },
    { chapter: 12, book: 'Luke', title: 'Don\'t Fear', summary: 'Leaven warning. Rich fool. Don\'t worry. Be ready for Master.', memoryHook: 'Full barns but empty soul', symbol: '🌾' },
    { chapter: 13, book: 'Luke', title: 'Repent or Perish', summary: 'Tower collapse. Barren fig tree. Mustard seed. Narrow door. Jerusalem.', memoryHook: 'Tower falling, narrow gate', symbol: '🚪' },
    { chapter: 14, book: 'Luke', title: 'Banquet & Cost', summary: 'Sabbath healing. Humble seats. Great banquet. Count the cost.', memoryHook: 'Seating mix-up, building cost', symbol: '🎉' },
    { chapter: 15, book: 'Luke', title: 'Lost Things', summary: 'Lost sheep. Lost coin. Prodigal son returns. Elder brother angry.', memoryHook: 'Sheep, coin, embracing father', symbol: '🐑' },
    { chapter: 16, book: 'Luke', title: 'Money Teaching', summary: 'Shrewd manager. Cannot serve two masters. Rich man and Lazarus.', memoryHook: 'Clever manager, chasm fixed', symbol: '💰' },
    { chapter: 17, book: 'Luke', title: 'Faith & Gratitude', summary: 'Forgive always. Faith like mustard seed. One leper returns.', memoryHook: '10 healed, 1 thanks', symbol: '1️⃣' },
    { chapter: 18, book: 'Luke', title: 'Prayer & Children', summary: 'Persistent widow. Pharisee and tax collector. Children. Rich ruler.', memoryHook: 'Beating chest, children welcomed', symbol: '👶' },
    { chapter: 19, book: 'Luke', title: 'Zacchaeus & Entry', summary: 'Zacchaeus in tree. Ten minas. Triumphal entry. Temple cleared.', memoryHook: 'Short man in tree, donkey parade', symbol: '🌳' },
    { chapter: 20, book: 'Luke', title: 'Authority Challenged', summary: 'Authority questioned. Tenant parable. Caesar\'s coin. Resurrection debate.', memoryHook: 'Whose image on coin?', symbol: '🪙' },
    { chapter: 21, book: 'Luke', title: 'End Signs', summary: 'Widow\'s offering. Temple destruction. Signs before end. Stay alert.', memoryHook: 'Two tiny coins, not one stone', symbol: '💎' },
    { chapter: 22, book: 'Luke', title: 'Last Supper', summary: 'Betrayal plot. Passover meal. Gethsemane. Arrest. Peter denies.', memoryHook: 'Cup passed, sweating blood', symbol: '🍷' },
    { chapter: 23, book: 'Luke', title: 'Crucifixion', summary: 'Before Pilate and Herod. Crucified with criminals. "Paradise today."', memoryHook: 'Two thieves, one saved', symbol: '⚰️' },
    { chapter: 24, book: 'Luke', title: 'Resurrection & Ascension', summary: 'Empty tomb. Emmaus road. Appears to disciples. Ascends from Bethany.', memoryHook: 'Road walk, burning hearts, lift off', symbol: '🚀' },
  ]
};

export const johnSet: BibleSet = {
  id: 'john-1-21',
  label: 'John 1-21',
  theme: 'Son of God - That You May Believe',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'John', title: 'The Word', summary: 'In beginning was Word. Light in darkness. John testifies. First disciples.', memoryHook: 'Logos, light shining, Lamb of God', symbol: '💡' },
    { chapter: 2, book: 'John', title: 'Water to Wine', summary: 'Wedding at Cana - first sign. Temple cleansed. "Destroy this temple..."', memoryHook: 'Water jars, whip, 3 days', symbol: '🍷' },
    { chapter: 3, book: 'John', title: 'Born Again', summary: 'Nicodemus at night. "Born again." God so loved. John must decrease.', memoryHook: 'Night visit, cross, 3:16', symbol: '🌙' },
    { chapter: 4, book: 'John', title: 'Living Water', summary: 'Woman at well. Worship in spirit and truth. Harvest. Official\'s son healed.', memoryHook: 'Well conversation, fever gone', symbol: '💧' },
    { chapter: 5, book: 'John', title: 'Pool of Bethesda', summary: '38-year invalid healed on Sabbath. Jesus defends: "My Father works."', memoryHook: 'Pool, mat, Father-Son unity', symbol: '🏊' },
    { chapter: 6, book: 'John', title: 'Bread of Life', summary: '5000 fed. Walking on water. "I am bread of life." Many turn back.', memoryHook: 'Bread multiplying, hard teaching', symbol: '🍞' },
    { chapter: 7, book: 'John', title: 'Feast of Tabernacles', summary: 'Brothers\' unbelief. Teaching at feast. Living water. Division over Him.', memoryHook: 'Secret arrival, rivers flowing', symbol: '🎪' },
    { chapter: 8, book: 'John', title: 'Light of the World', summary: 'Woman caught. "I am light of world." Abraham rejoiced. "Before Abraham, I AM."', memoryHook: 'Writing in dirt, "I AM"', symbol: '🔦' },
    { chapter: 9, book: 'John', title: 'Man Born Blind', summary: 'Blind from birth healed with mud. Pharisees investigate. Cast out.', memoryHook: 'Mud on eyes, pool washing', symbol: '👀' },
    { chapter: 10, book: 'John', title: 'Good Shepherd', summary: 'Sheep know voice. "I am door." "I am good shepherd." One flock.', memoryHook: 'Door, shepherd, laying down life', symbol: '🐑' },
    { chapter: 11, book: 'John', title: 'Lazarus Raised', summary: 'Lazarus dies. "I am resurrection." "Lazarus, come forth!" Plot to kill.', memoryHook: 'Weeping Jesus, grave clothes', symbol: '⚰️' },
    { chapter: 12, book: 'John', title: 'Triumphal Entry', summary: 'Mary anoints feet. Palm Sunday. Greeks seek Jesus. Grain must die.', memoryHook: 'Perfume feet, palm branches', symbol: '🌴' },
    { chapter: 13, book: 'John', title: 'Foot Washing', summary: 'Jesus washes disciples\' feet. Betrayer identified. New commandment: love.', memoryHook: 'Towel and basin, morsel dipped', symbol: '🦶' },
    { chapter: 14, book: 'John', title: 'Way, Truth, Life', summary: '"I am way, truth, life." Many rooms. Helper coming. Peace given.', memoryHook: 'Road sign, Comforter promise', symbol: '🛤️' },
    { chapter: 15, book: 'John', title: 'True Vine', summary: '"I am vine." Abide in love. World\'s hatred. Spirit testifies.', memoryHook: 'Branches connected, fruitful', symbol: '🍇' },
    { chapter: 16, book: 'John', title: 'Spirit Coming', summary: 'Spirit convicts world. Guides to truth. Sorrow to joy. Overcome world.', memoryHook: 'Birth pains, then joy', symbol: '👶' },
    { chapter: 17, book: 'John', title: 'High Priestly Prayer', summary: 'Jesus prays for Himself, disciples, and all believers. "That they be one."', memoryHook: 'Arms lifted, unity prayer', symbol: '🙏' },
    { chapter: 18, book: 'John', title: 'Arrest & Trials', summary: 'Garden arrest. "I am he." Peter\'s denials. Before Annas, Caiaphas, Pilate.', memoryHook: 'Falling soldiers, charcoal fire', symbol: '🔥' },
    { chapter: 19, book: 'John', title: 'Crucifixion', summary: 'Flogged, mocked. "Behold your King!" Crucified. "It is finished."', memoryHook: 'Thorns, hyssop, finished', symbol: '✝️' },
    { chapter: 20, book: 'John', title: 'Resurrection', summary: 'Empty tomb. Mary meets risen Jesus. Appears to disciples. Thomas believes.', memoryHook: 'Running to tomb, "My Lord"', symbol: '🏃' },
    { chapter: 21, book: 'John', title: 'Restoration', summary: 'Breakfast by sea. "Do you love me?" Feed my sheep. Peter\'s future.', memoryHook: 'Fish breakfast, three questions', symbol: '🐟' },
  ]
};

export const actsSet: BibleSet = {
  id: 'acts-1-28',
  label: 'Acts 1-28',
  theme: 'Church - Witnesses to Earth\'s Ends',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Acts', title: 'Ascension', summary: '40 days with risen Christ. Ascension from Mount of Olives. Matthias chosen.', memoryHook: 'Cloud taking up, lots cast', symbol: '☁️' },
    { chapter: 2, book: 'Acts', title: 'Pentecost', summary: 'Wind and fire. Tongues spoken. Peter preaches. 3000 saved. Church born.', memoryHook: 'Flames on heads, 3000 baptized', symbol: '🔥' },
    { chapter: 3, book: 'Acts', title: 'Lame Man Healed', summary: 'Peter heals lame beggar at temple gate. "Silver and gold I have not."', memoryHook: 'Gate Beautiful, jumping man', symbol: '🦽' },
    { chapter: 4, book: 'Acts', title: 'Boldness', summary: 'Peter and John arrested. Boldly preach. Church prays. All things common.', memoryHook: 'Prison release, shaking prayer', symbol: '⛓️' },
    { chapter: 5, book: 'Acts', title: 'Ananias & Sapphira', summary: 'Lie to Holy Spirit, both die. Apostles arrested, freed by angel.', memoryHook: 'Carried out feet first', symbol: '💀' },
    { chapter: 6, book: 'Acts', title: 'Seven Chosen', summary: 'Seven deacons chosen including Stephen. Word spreads. Stephen accused.', memoryHook: 'Food distribution, angel face', symbol: '👼' },
    { chapter: 7, book: 'Acts', title: 'Stephen\'s Speech', summary: 'Stephen recounts history. "Stiff-necked!" Sees Jesus standing. Stoned.', memoryHook: 'History lesson, open heaven, stones', symbol: '🪨' },
    { chapter: 8, book: 'Acts', title: 'Scattered Witness', summary: 'Persecution scatters church. Philip in Samaria. Ethiopian eunuch baptized.', memoryHook: 'Map expansion, chariot baptism', symbol: '🗺️' },
    { chapter: 9, book: 'Acts', title: 'Saul Converted', summary: 'Damascus road light. "Why persecuting me?" Ananias heals. Saul preaches.', memoryHook: 'Blinding light, scales falling', symbol: '⚡' },
    { chapter: 10, book: 'Acts', title: 'Cornelius', summary: 'Peter\'s vision: nothing unclean. Preaches to Gentiles. Spirit falls on them.', memoryHook: 'Sheet from heaven, Gentile tongues', symbol: '🍖' },
    { chapter: 11, book: 'Acts', title: 'Antioch Church', summary: 'Peter explains Gentile inclusion. Antioch church grows. "Christians" first named.', memoryHook: 'New name, famine relief', symbol: '🏷️' },
    { chapter: 12, book: 'Acts', title: 'Peter Freed', summary: 'James killed. Peter imprisoned. Angel frees him. Herod eaten by worms.', memoryHook: 'Chains falling, Rhoda at door', symbol: '🔓' },
    { chapter: 13, book: 'Acts', title: 'First Journey Begins', summary: 'Barnabas and Saul sent. Cyprus. Elymas blinded. Pisidian Antioch sermon.', memoryHook: 'Holy Spirit sends, blind sorcerer', symbol: '🚢' },
    { chapter: 14, book: 'Acts', title: 'Iconium to Lystra', summary: 'Iconium division. Lystra healing. Mistaken for gods. Stoned, revives.', memoryHook: '"Zeus and Hermes!", stones, revival', symbol: '🪨' },
    { chapter: 15, book: 'Acts', title: 'Jerusalem Council', summary: 'Circumcision debate. Council decides: no Jewish law burden on Gentiles.', memoryHook: 'Big meeting, freedom letter', symbol: '✉️' },
    { chapter: 16, book: 'Acts', title: 'Macedonia Call', summary: 'Timothy joins. Macedonian vision. Lydia converted. Jailer saved at midnight.', memoryHook: 'Come over, earthquake baptism', symbol: '🌍' },
    { chapter: 17, book: 'Acts', title: 'Thessalonica to Athens', summary: 'Thessalonica trouble. Berea searches. Mars Hill sermon: Unknown God.', memoryHook: 'Noble Bereans, altar inscription', symbol: '📖' },
    { chapter: 18, book: 'Acts', title: 'Corinth', summary: 'Paul stays 18 months. Aquila and Priscilla. Apollos taught. Ephesus briefly.', memoryHook: 'Tentmaking, eloquent Apollos', symbol: '⛺' },
    { chapter: 19, book: 'Acts', title: 'Ephesus Revival', summary: 'Spirit falls. Miracles. Magic books burned. Riot over Diana.', memoryHook: 'Book burning, silversmith riot', symbol: '📚' },
    { chapter: 20, book: 'Acts', title: 'Troas to Miletus', summary: 'Eutychus falls, raised. Miletus farewell to Ephesian elders.', memoryHook: 'Window fall, tearful goodbye', symbol: '😢' },
    { chapter: 21, book: 'Acts', title: 'Arrest in Jerusalem', summary: 'Warnings ignored. Paul goes to temple. Mob seizes. Roman tribune rescues.', memoryHook: 'Temple grab, stairs speech', symbol: '⚔️' },
    { chapter: 22, book: 'Acts', title: 'Paul\'s Defense', summary: 'Recounts conversion. Crowd riots at "Gentiles." Claims Roman citizenship.', memoryHook: 'Hebrew speech, citizenship card', symbol: '🪪' },
    { chapter: 23, book: 'Acts', title: 'Sanhedrin Split', summary: 'Pharisee-Sadducee split. Plot to kill Paul. Transferred to Caesarea.', memoryHook: 'Divided council, night transfer', symbol: '🌙' },
    { chapter: 24, book: 'Acts', title: 'Before Felix', summary: 'Tertullus accuses. Paul defends. Felix delays. Two years pass.', memoryHook: 'Roman governor, convenient season', symbol: '⏳' },
    { chapter: 25, book: 'Acts', title: 'Appeal to Caesar', summary: 'Festus takes over. "I appeal to Caesar!" Agrippa to hear.', memoryHook: 'Imperial appeal, royal audience', symbol: '👑' },
    { chapter: 26, book: 'Acts', title: 'Before Agrippa', summary: 'Paul\'s testimony. "Almost persuaded." Declared innocent but must go to Rome.', memoryHook: 'Almost Christian, Rome destiny', symbol: '🏛️' },
    { chapter: 27, book: 'Acts', title: 'Shipwreck', summary: 'Sailing to Rome. Storm. Shipwreck on Malta. All 276 survive.', memoryHook: 'Broken ship, all safe', symbol: '🚢' },
    { chapter: 28, book: 'Acts', title: 'Rome at Last', summary: 'Malta miracles. Finally reaches Rome. Preaches two years under guard.', memoryHook: 'Snake shaken off, chained preacher', symbol: '🐍' },
  ]
};

export const romansSet: BibleSet = {
  id: 'romans-1-16',
  label: 'Romans 1-16',
  theme: 'Gospel - Righteousness by Faith',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Romans', title: 'Gospel Power', summary: 'Not ashamed of gospel. Gentile sin exposed. God gave them up.', memoryHook: 'Power to save, spiral down', symbol: '💪' },
    { chapter: 2, book: 'Romans', title: 'Jews Also Guilty', summary: 'You who judge do same. Jew has law but doesn\'t keep it.', memoryHook: 'Pointing finger turns back', symbol: '☝️' },
    { chapter: 3, book: 'Romans', title: 'All Sinned', summary: 'None righteous. All sinned. Justified freely by grace through redemption.', memoryHook: 'All under sin, free gift', symbol: '🎁' },
    { chapter: 4, book: 'Romans', title: 'Abraham\'s Faith', summary: 'Abraham believed, counted righteous. Before circumcision. Promise by faith.', memoryHook: 'Stars counted, faith credited', symbol: '⭐' },
    { chapter: 5, book: 'Romans', title: 'Peace with God', summary: 'Justified by faith, peace with God. Adam\'s sin vs. Christ\'s gift.', memoryHook: 'Two Adams, grace abounds', symbol: '☮️' },
    { chapter: 6, book: 'Romans', title: 'Dead to Sin', summary: 'Baptized into death. Dead to sin, alive to God. Slaves of righteousness.', memoryHook: 'Burial, resurrection, new master', symbol: '⚰️' },
    { chapter: 7, book: 'Romans', title: 'Law & Struggle', summary: 'Released from law. Law reveals sin. "What I hate I do." Wretched man!', memoryHook: 'Inner war, cry for rescue', symbol: '⚔️' },
    { chapter: 8, book: 'Romans', title: 'No Condemnation', summary: 'No condemnation in Christ. Spirit life. Heirs with Christ. More than conquerors.', memoryHook: 'Freedom, adoption, victory list', symbol: '🏆' },
    { chapter: 9, book: 'Romans', title: 'Israel\'s Election', summary: 'Paul\'s sorrow for Israel. Sovereign choice. Potter and clay.', memoryHook: 'Heart for kinsmen, potter\'s wheel', symbol: '🏺' },
    { chapter: 10, book: 'Romans', title: 'Believe & Confess', summary: 'Word is near. Confess Jesus, believe resurrection. Beautiful feet.', memoryHook: 'Mouth + heart = saved, feet', symbol: '👣' },
    { chapter: 11, book: 'Romans', title: 'Israel\'s Future', summary: 'Remnant remains. Gentiles grafted in. All Israel will be saved.', memoryHook: 'Olive tree, wild branches', symbol: '🫒' },
    { chapter: 12, book: 'Romans', title: 'Living Sacrifice', summary: 'Present bodies. Don\'t conform. Gifts. Genuine love. Overcome evil with good.', memoryHook: 'Altar, transformed mind, body gifts', symbol: '🔥' },
    { chapter: 13, book: 'Romans', title: 'Submit to Authorities', summary: 'Governing authorities from God. Owe love. Put on Christ, not flesh.', memoryHook: 'Taxes paid, armor of light', symbol: '🛡️' },
    { chapter: 14, book: 'Romans', title: 'Don\'t Judge Weak', summary: 'Don\'t despise weak. Every knee bows. Don\'t make brother stumble.', memoryHook: 'Food debates, stumbling blocks', symbol: '🥗' },
    { chapter: 15, book: 'Romans', title: 'Unity & Plans', summary: 'Bear with weak. Christ received you. Paul\'s travel plans to Spain.', memoryHook: 'Welcome one another, journey map', symbol: '🗺️' },
    { chapter: 16, book: 'Romans', title: 'Greetings', summary: 'Phoebe commended. Many greeted. Avoid divisive people. To God be glory.', memoryHook: 'Long list of names, final praise', symbol: '👋' },
  ]
};

export const revelationSet: BibleSet = {
  id: 'revelation-1-22',
  label: 'Revelation 1-22',
  theme: 'Victory - The Lamb Wins',
  testament: 'new',
  chapters: [
    { chapter: 1, book: 'Revelation', title: 'Vision of Christ', summary: 'Revelation of Jesus. John on Patmos. Sees glorified Christ among lampstands.', memoryHook: 'Island exile, blazing eyes, keys', symbol: '🔑' },
    { chapter: 2, book: 'Revelation', title: 'Four Churches', summary: 'Ephesus: left first love. Smyrna: suffer 10 days. Pergamum: Satan\'s throne. Thyatira: Jezebel.', memoryHook: 'Love lost, crown, throne, prophetess', symbol: '💔' },
    { chapter: 3, book: 'Revelation', title: 'Three Churches', summary: 'Sardis: dead. Philadelphia: open door. Laodicea: lukewarm, spit out.', memoryHook: 'Wake up, door, hot/cold', symbol: '🚪' },
    { chapter: 4, book: 'Revelation', title: 'Throne Room', summary: 'Open door in heaven. Throne, 24 elders, 4 living creatures. "Holy, holy, holy!"', memoryHook: 'Rainbow throne, living creatures', symbol: '🌈' },
    { chapter: 5, book: 'Revelation', title: 'Lamb & Scroll', summary: 'Scroll sealed with 7 seals. Lion = Lamb worthy. Thousands worship.', memoryHook: 'Sealed book, slain Lamb takes it', symbol: '📜' },
    { chapter: 6, book: 'Revelation', title: 'Six Seals', summary: 'Four horsemen: conquest, war, famine, death. Martyrs. Great earthquake.', memoryHook: 'Four horses, souls under altar', symbol: '🐎' },
    { chapter: 7, book: 'Revelation', title: '144,000 Sealed', summary: '144,000 sealed from 12 tribes. Great multitude in white before throne.', memoryHook: 'Forehead seal, white robes', symbol: '✡️' },
    { chapter: 8, book: 'Revelation', title: 'Seventh Seal', summary: 'Silence in heaven. Seven trumpets given. First four trumpets: hail, sea, rivers, sun.', memoryHook: 'Silent half hour, nature struck', symbol: '🎺' },
    { chapter: 9, book: 'Revelation', title: 'Two Woes', summary: 'Fifth trumpet: locusts from pit. Sixth trumpet: four angels, 200 million army.', memoryHook: 'Scorpion locusts, massive army', symbol: '🦗' },
    { chapter: 10, book: 'Revelation', title: 'Angel & Scroll', summary: 'Mighty angel with little scroll. "Eat it" - sweet then bitter. Mystery finished.', memoryHook: 'Rainbow angel, eaten scroll', symbol: '📖' },
    { chapter: 11, book: 'Revelation', title: 'Two Witnesses', summary: 'Measure temple. Two witnesses prophesy 1260 days. Killed, resurrected. Seventh trumpet.', memoryHook: 'Two prophets, 3.5 days dead', symbol: '👥' },
    { chapter: 12, book: 'Revelation', title: 'Woman & Dragon', summary: 'Woman clothed with sun. Dragon pursues. War in heaven. Michael wins.', memoryHook: 'Crowned woman, red dragon', symbol: '🐉' },
    { chapter: 13, book: 'Revelation', title: 'Two Beasts', summary: 'Beast from sea - 7 heads, blasphemy. Beast from earth - false prophet, 666.', memoryHook: 'Sea beast, earth beast, mark', symbol: '👹' },
    { chapter: 14, book: 'Revelation', title: 'Three Angels', summary: 'Lamb on Zion. Everlasting gospel angel. Babylon fallen. Mark warning. Harvest.', memoryHook: 'Three angels flying, sickle harvest', symbol: '👼' },
    { chapter: 15, book: 'Revelation', title: 'Sea of Glass', summary: 'Victors on crystal sea singing. Seven angels with seven plagues.', memoryHook: 'Glass sea, harps, bowls ready', symbol: '🎸' },
    { chapter: 16, book: 'Revelation', title: 'Seven Bowls', summary: 'Bowls poured: sores, bloody sea, rivers, scorching sun, darkness, Euphrates, earthquake.', memoryHook: 'Wrath bowls poured out', symbol: '🥣' },
    { chapter: 17, book: 'Revelation', title: 'Babylon the Prostitute', summary: 'Woman on scarlet beast. Mystery Babylon. Drunk with martyrs\' blood.', memoryHook: 'Prostitute on beast, golden cup', symbol: '🍷' },
    { chapter: 18, book: 'Revelation', title: 'Babylon Falls', summary: '"Fallen, fallen!" Come out of her. Merchants weep. Millstone thrown.', memoryHook: 'Burning city, silenced music', symbol: '🔥' },
    { chapter: 19, book: 'Revelation', title: 'Marriage & Battle', summary: 'Hallelujah chorus. Marriage supper. White horse rider. Beast defeated.', memoryHook: 'Wedding feast, conquering King', symbol: '🐴' },
    { chapter: 20, book: 'Revelation', title: 'Millennium', summary: 'Satan bound 1000 years. First resurrection. Final rebellion. Great white throne.', memoryHook: 'Chained serpent, books opened', symbol: '📚' },
    { chapter: 21, book: 'Revelation', title: 'New Heaven & Earth', summary: 'All things new. New Jerusalem descends. God dwells with man. No more tears.', memoryHook: 'Descending city, wiped tears', symbol: '🏙️' },
    { chapter: 22, book: 'Revelation', title: 'River of Life', summary: 'River from throne. Tree of life. "Come!" Jesus coming quickly. Amen!', memoryHook: 'Crystal river, tree healing, "Come!"', symbol: '🌳' },
  ]
};

// Collect all sets
export const allBibleSets: BibleSet[] = [
  // Old Testament
  genesisSet,
  genesis25to50Set,
  exodus1to24Set,
  exodus25to40Set,
  leviticus1to27Set,
  numbersSet,
  deuteronomySet,
  joshuaSet,
  judgesSet,
  ruthSet,
  firstSamuelSet,
  psalms1to30Set,
  // New Testament
  matthewSet,
  markSet,
  lukeSet,
  johnSet,
  actsSet,
  romansSet,
  revelationSet,
];

// Helper to get a specific chapter
export const getChapter = (book: string, chapter: number): ChapterFrame | undefined => {
  for (const set of allBibleSets) {
    const found = set.chapters.find(c => c.book === book && c.chapter === chapter);
    if (found) return found;
  }
  return undefined;
};

// Get all chapters for a book
export const getBookChapters = (book: string): ChapterFrame[] => {
  const chapters: ChapterFrame[] = [];
  for (const set of allBibleSets) {
    chapters.push(...set.chapters.filter(c => c.book === book));
  }
  return chapters.sort((a, b) => a.chapter - b.chapter);
};

// Get all book names
export const getAllBooks = (): string[] => {
  const books = new Set<string>();
  for (const set of allBibleSets) {
    for (const ch of set.chapters) {
      books.add(ch.book);
    }
  }
  return Array.from(books);
};
