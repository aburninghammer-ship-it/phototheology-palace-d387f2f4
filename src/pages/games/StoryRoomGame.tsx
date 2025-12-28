import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ArrowLeft, CheckCircle, XCircle, Library, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { StoryLibrary } from "@/components/story-room/StoryLibrary";
// Story Library with 300+ stories across 12 books

const storyQuizzes = [
  // === CLASSIC STORIES ===
  {
    story: "Joseph's Journey",
    sequence: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    correct: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    book: "Genesis 37-50"
  },
  {
    story: "David and Goliath",
    sequence: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    correct: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    book: "1 Samuel 17"
  },
  {
    story: "Daniel's Trial",
    sequence: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    correct: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    book: "Daniel 1-7"
  },
  {
    story: "Exodus Journey",
    sequence: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    correct: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    book: "Exodus 3-40"
  },
  {
    story: "Christ's Passion",
    sequence: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    correct: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    book: "Matthew 26-28"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 1: GENESIS MYSTERIES ===
  {
    story: "Tamar's Deception of Judah",
    sequence: ["Widowed Twice by Er and Onan", "Denied to Shelah", "Disguised as Harlot at Enaim", "Takes Judah's Signet and Staff", "Proven More Righteous"],
    correct: ["Widowed Twice by Er and Onan", "Denied to Shelah", "Disguised as Harlot at Enaim", "Takes Judah's Signet and Staff", "Proven More Righteous"],
    book: "Genesis 38"
  },
  {
    story: "Dinah and the Shechemites",
    sequence: ["Dinah Visits Canaanite Women", "Shechem Defiles Her", "Marriage Proposal Made", "Circumcision Demanded", "Simeon and Levi's Revenge"],
    correct: ["Dinah Visits Canaanite Women", "Shechem Defiles Her", "Marriage Proposal Made", "Circumcision Demanded", "Simeon and Levi's Revenge"],
    book: "Genesis 34"
  },
  {
    story: "The Tower of Babel",
    sequence: ["One Language on Earth", "Settled in Shinar", "Built City and Tower", "Lord Came Down to See", "Languages Confused", "People Scattered"],
    correct: ["One Language on Earth", "Settled in Shinar", "Built City and Tower", "Lord Came Down to See", "Languages Confused", "People Scattered"],
    book: "Genesis 11:1-9"
  },
  {
    story: "Lot's Wife Looks Back",
    sequence: ["Angels Arrive in Sodom", "Mob Surrounds House", "Family Warned to Flee", "Fire Rains from Heaven", "Wife Looks Back", "Becomes Pillar of Salt"],
    correct: ["Angels Arrive in Sodom", "Mob Surrounds House", "Family Warned to Flee", "Fire Rains from Heaven", "Wife Looks Back", "Becomes Pillar of Salt"],
    book: "Genesis 19"
  },
  {
    story: "Jacob Wrestles the Angel",
    sequence: ["Sent Family Across Jabbok", "Left Alone at Night", "Wrestled Until Daybreak", "Hip Socket Touched", "Blessed and Renamed Israel"],
    correct: ["Sent Family Across Jabbok", "Left Alone at Night", "Wrestled Until Daybreak", "Hip Socket Touched", "Blessed and Renamed Israel"],
    book: "Genesis 32:22-32"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 2: JUDGES & WARRIORS ===
  {
    story: "Ehud the Left-Handed Judge",
    sequence: ["Israel Oppressed by Moab", "Ehud Makes Double-Edged Dagger", "Brings Tribute to Eglon", "Claims Secret Message", "Stabs Fat King", "Escapes Through Porch"],
    correct: ["Israel Oppressed by Moab", "Ehud Makes Double-Edged Dagger", "Brings Tribute to Eglon", "Claims Secret Message", "Stabs Fat King", "Escapes Through Porch"],
    book: "Judges 3:12-30"
  },
  {
    story: "Jael Kills Sisera",
    sequence: ["Sisera Flees Battle", "Jael Invites Him to Tent", "Gives Him Milk and Blanket", "Sisera Falls Asleep", "Drives Tent Peg Through Temple"],
    correct: ["Sisera Flees Battle", "Jael Invites Him to Tent", "Gives Him Milk and Blanket", "Sisera Falls Asleep", "Drives Tent Peg Through Temple"],
    book: "Judges 4:17-22"
  },
  {
    story: "Gideon's Fleece Test",
    sequence: ["Angel Appears at Winepress", "Gideon Asks for Sign", "Fleece Wet, Ground Dry", "Fleece Dry, Ground Wet", "Army Reduced to 300", "Torches in Jars Victory"],
    correct: ["Angel Appears at Winepress", "Gideon Asks for Sign", "Fleece Wet, Ground Dry", "Fleece Dry, Ground Wet", "Army Reduced to 300", "Torches in Jars Victory"],
    book: "Judges 6-7"
  },
  {
    story: "Jephthah's Tragic Vow",
    sequence: ["Outcast Son Returns", "Made Leader Against Ammon", "Vows First Thing That Greets Him", "Defeats Ammonites", "Daughter Comes Out Dancing", "Keeps His Vow"],
    correct: ["Outcast Son Returns", "Made Leader Against Ammon", "Vows First Thing That Greets Him", "Defeats Ammonites", "Daughter Comes Out Dancing", "Keeps His Vow"],
    book: "Judges 11"
  },
  {
    story: "Samson and the Foxes",
    sequence: ["Wife Given to Another", "Catches 300 Foxes", "Ties Tails with Torches", "Burns Philistine Fields", "Philistines Burn Wife", "Samson's Great Slaughter"],
    correct: ["Wife Given to Another", "Catches 300 Foxes", "Ties Tails with Torches", "Burns Philistine Fields", "Philistines Burn Wife", "Samson's Great Slaughter"],
    book: "Judges 15:1-8"
  },
  {
    story: "The Levite's Concubine",
    sequence: ["Concubine Flees to Bethlehem", "Levite Retrieves Her", "Stops in Gibeah", "Wicked Men Surround House", "Concubine Abused All Night", "Israel Wars Against Benjamin"],
    correct: ["Concubine Flees to Bethlehem", "Levite Retrieves Her", "Stops in Gibeah", "Wicked Men Surround House", "Concubine Abused All Night", "Israel Wars Against Benjamin"],
    book: "Judges 19-21"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 3: KINGS & PROPHETS ===
  {
    story: "Elijah and the Widow's Oil",
    sequence: ["Widow Has Only Oil and Flour", "Prophet Asks for Bread First", "Promise of Provision", "Jar Never Runs Empty", "Son Dies and Is Raised"],
    correct: ["Widow Has Only Oil and Flour", "Prophet Asks for Bread First", "Promise of Provision", "Jar Never Runs Empty", "Son Dies and Is Raised"],
    book: "1 Kings 17:8-24"
  },
  {
    story: "Elisha and the Bears",
    sequence: ["Elisha Travels to Bethel", "Youths Mock His Baldness", "Cursed in Name of Lord", "Two She-Bears Emerge", "Forty-Two Youths Mauled"],
    correct: ["Elisha Travels to Bethel", "Youths Mock His Baldness", "Cursed in Name of Lord", "Two She-Bears Emerge", "Forty-Two Youths Mauled"],
    book: "2 Kings 2:23-25"
  },
  {
    story: "Naaman the Leper",
    sequence: ["Servant Girl Mentions Prophet", "Naaman Brings Gifts to Israel", "Told to Wash in Jordan", "Angry at Simple Instruction", "Washes Seven Times", "Skin Like Child's"],
    correct: ["Servant Girl Mentions Prophet", "Naaman Brings Gifts to Israel", "Told to Wash in Jordan", "Angry at Simple Instruction", "Washes Seven Times", "Skin Like Child's"],
    book: "2 Kings 5"
  },
  {
    story: "The Floating Axe Head",
    sequence: ["Prophets Building by Jordan", "Borrowed Axe Falls in Water", "Elisha Asks Where It Fell", "Throws Stick in River", "Iron Floats to Surface"],
    correct: ["Prophets Building by Jordan", "Borrowed Axe Falls in Water", "Elisha Asks Where It Fell", "Throws Stick in River", "Iron Floats to Surface"],
    book: "2 Kings 6:1-7"
  },
  {
    story: "Elisha's Bones Raise the Dead",
    sequence: ["Elisha Dies and Is Buried", "Moabite Raiders Attack", "Funeral Party Sees Raiders", "Body Thrown in Elisha's Tomb", "Corpse Touches Bones", "Man Revives and Stands"],
    correct: ["Elisha Dies and Is Buried", "Moabite Raiders Attack", "Funeral Party Sees Raiders", "Body Thrown in Elisha's Tomb", "Corpse Touches Bones", "Man Revives and Stands"],
    book: "2 Kings 13:20-21"
  },
  {
    story: "Micaiah vs. 400 Prophets",
    sequence: ["Ahab Wants to Attack Ramoth", "400 Prophets Say Go", "Micaiah Summoned Reluctantly", "Tells of Lying Spirit Vision", "Zedekiah Slaps Micaiah", "Ahab Dies in Battle"],
    correct: ["Ahab Wants to Attack Ramoth", "400 Prophets Say Go", "Micaiah Summoned Reluctantly", "Tells of Lying Spirit Vision", "Zedekiah Slaps Micaiah", "Ahab Dies in Battle"],
    book: "1 Kings 22"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 4: STRANGE MIRACLES ===
  {
    story: "The Sun Stands Still",
    sequence: ["Israel Fights Amorites", "Joshua Commands Sun to Stop", "Moon Halts Over Aijalon", "Day Prolonged for Victory", "Hailstones Kill More Than Swords"],
    correct: ["Israel Fights Amorites", "Joshua Commands Sun to Stop", "Moon Halts Over Aijalon", "Day Prolonged for Victory", "Hailstones Kill More Than Swords"],
    book: "Joshua 10:1-14"
  },
  {
    story: "Balaam's Talking Donkey",
    sequence: ["Balak Summons Balaam to Curse", "Angel Blocks the Road", "Donkey Sees Angel, Swerves", "Balaam Beats Donkey Three Times", "Donkey Speaks to Balaam", "Balaam's Eyes Opened"],
    correct: ["Balak Summons Balaam to Curse", "Angel Blocks the Road", "Donkey Sees Angel, Swerves", "Balaam Beats Donkey Three Times", "Donkey Speaks to Balaam", "Balaam's Eyes Opened"],
    book: "Numbers 22"
  },
  {
    story: "The Bronze Serpent",
    sequence: ["Israel Complains in Wilderness", "Fiery Serpents Sent", "Many Bitten and Die", "Moses Intercedes", "Bronze Serpent on Pole", "Those Who Look Are Healed"],
    correct: ["Israel Complains in Wilderness", "Fiery Serpents Sent", "Many Bitten and Die", "Moses Intercedes", "Bronze Serpent on Pole", "Those Who Look Are Healed"],
    book: "Numbers 21:4-9"
  },
  {
    story: "Elijah's Chariot of Fire",
    sequence: ["Elijah Knows Departure Near", "Strikes Jordan with Cloak", "Waters Part for Crossing", "Asks Elisha's Request", "Whirlwind Approaches", "Chariot of Fire Separates Them"],
    correct: ["Elijah Knows Departure Near", "Strikes Jordan with Cloak", "Waters Part for Crossing", "Asks Elisha's Request", "Whirlwind Approaches", "Chariot of Fire Separates Them"],
    book: "2 Kings 2:1-12"
  },
  {
    story: "Shadow Goes Backward",
    sequence: ["Hezekiah Deathly Ill", "Isaiah Pronounces Death", "King Prays Facing Wall", "God Adds Fifteen Years", "Sign Requested", "Shadow Retreats Ten Steps"],
    correct: ["Hezekiah Deathly Ill", "Isaiah Pronounces Death", "King Prays Facing Wall", "God Adds Fifteen Years", "Sign Requested", "Shadow Retreats Ten Steps"],
    book: "2 Kings 20:1-11"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 5: WOMEN OF FAITH ===
  {
    story: "Rahab Hides the Spies",
    sequence: ["Two Spies Enter Jericho", "Hide in Rahab's House", "King's Men Come Searching", "Rahab Lies About Their Departure", "Lowers Them by Scarlet Cord", "Family Saved When Walls Fall"],
    correct: ["Two Spies Enter Jericho", "Hide in Rahab's House", "King's Men Come Searching", "Rahab Lies About Their Departure", "Lowers Them by Scarlet Cord", "Family Saved When Walls Fall"],
    book: "Joshua 2, 6"
  },
  {
    story: "Abigail Stops David's Wrath",
    sequence: ["David's Men Request Food", "Nabal Refuses Insulting", "David Vows to Kill All Males", "Abigail Gathers Provisions", "Intercepts David on Road", "David Blesses Her Wisdom"],
    correct: ["David's Men Request Food", "Nabal Refuses Insulting", "David Vows to Kill All Males", "Abigail Gathers Provisions", "Intercepts David on Road", "David Blesses Her Wisdom"],
    book: "1 Samuel 25"
  },
  {
    story: "The Wise Woman of Abel",
    sequence: ["Sheba's Rebellion Against David", "Joab Besieges Abel Beth Maacah", "Wise Woman Calls from Wall", "Negotiates for City's Life", "Citizens Behead Sheba", "City Spared from Destruction"],
    correct: ["Sheba's Rebellion Against David", "Joab Besieges Abel Beth Maacah", "Wise Woman Calls from Wall", "Negotiates for City's Life", "Citizens Behead Sheba", "City Spared from Destruction"],
    book: "2 Samuel 20:14-22"
  },
  {
    story: "The Shunammite's Faith",
    sequence: ["Wealthy Woman Hosts Elisha", "Builds Prophet's Chamber", "Promised a Son", "Son Dies Suddenly", "Rides to Find Elisha", "Elisha Raises Boy from Dead"],
    correct: ["Wealthy Woman Hosts Elisha", "Builds Prophet's Chamber", "Promised a Son", "Son Dies Suddenly", "Rides to Find Elisha", "Elisha Raises Boy from Dead"],
    book: "2 Kings 4:8-37"
  },
  {
    story: "Rizpah Guards the Dead",
    sequence: ["Famine Lasts Three Years", "Saul's Descendants Given to Gibeonites", "Seven Sons Hanged", "Rizpah Spreads Sackcloth on Rock", "Guards Bodies from Birds and Beasts", "David Gives Proper Burial"],
    correct: ["Famine Lasts Three Years", "Saul's Descendants Given to Gibeonites", "Seven Sons Hanged", "Rizpah Spreads Sackcloth on Rock", "Guards Bodies from Birds and Beasts", "David Gives Proper Burial"],
    book: "2 Samuel 21:1-14"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 6: PROPHETIC ACTS ===
  {
    story: "Isaiah Walks Naked",
    sequence: ["God Commands Isaiah", "Removes Sackcloth and Sandals", "Walks Naked Three Years", "Sign Against Egypt and Cush", "Predicts Their Captivity"],
    correct: ["God Commands Isaiah", "Removes Sackcloth and Sandals", "Walks Naked Three Years", "Sign Against Egypt and Cush", "Predicts Their Captivity"],
    book: "Isaiah 20"
  },
  {
    story: "Ezekiel's Siege Brick",
    sequence: ["Commanded to Take Clay Brick", "Draws Jerusalem on It", "Builds Miniature Siege Works", "Lies on Left Side 390 Days", "Lies on Right Side 40 Days", "Cooks Food over Dung"],
    correct: ["Commanded to Take Clay Brick", "Draws Jerusalem on It", "Builds Miniature Siege Works", "Lies on Left Side 390 Days", "Lies on Right Side 40 Days", "Cooks Food over Dung"],
    book: "Ezekiel 4"
  },
  {
    story: "Hosea Marries a Prostitute",
    sequence: ["God Commands Marriage to Gomer", "First Child Named Jezreel", "Daughter Named Lo-Ruhamah", "Son Named Lo-Ammi", "Gomer Returns to Prostitution", "Hosea Buys Her Back"],
    correct: ["God Commands Marriage to Gomer", "First Child Named Jezreel", "Daughter Named Lo-Ruhamah", "Son Named Lo-Ammi", "Gomer Returns to Prostitution", "Hosea Buys Her Back"],
    book: "Hosea 1-3"
  },
  {
    story: "Jeremiah's Linen Belt",
    sequence: ["Buys Linen Waistband", "Wears It Without Washing", "Told to Hide at Euphrates", "Returns After Many Days", "Belt Ruined and Useless", "Represents Judah's Pride"],
    correct: ["Buys Linen Waistband", "Wears It Without Washing", "Told to Hide at Euphrates", "Returns After Many Days", "Belt Ruined and Useless", "Represents Judah's Pride"],
    book: "Jeremiah 13:1-11"
  },
  {
    story: "Ezekiel's Wife Dies",
    sequence: ["God Warns Wife Will Die", "Told Not to Mourn", "No Tears or Funeral Bread", "Wife Dies That Evening", "People Ask Why No Mourning", "Sign of Temple's Destruction"],
    correct: ["God Warns Wife Will Die", "Told Not to Mourn", "No Tears or Funeral Bread", "Wife Dies That Evening", "People Ask Why No Mourning", "Sign of Temple's Destruction"],
    book: "Ezekiel 24:15-27"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 7: NEW TESTAMENT MYSTERIES ===
  {
    story: "Ananias and Sapphira",
    sequence: ["Sell Property for Church", "Keep Back Part of Price", "Lie About Full Donation", "Ananias Falls Dead", "Sapphira Arrives Three Hours Later", "She Also Falls Dead"],
    correct: ["Sell Property for Church", "Keep Back Part of Price", "Lie About Full Donation", "Ananias Falls Dead", "Sapphira Arrives Three Hours Later", "She Also Falls Dead"],
    book: "Acts 5:1-11"
  },
  {
    story: "Eutychus Falls from Window",
    sequence: ["Paul Preaches Until Midnight", "Young Man Sits in Window", "Overcome by Sleep", "Falls from Third Story", "Taken Up Dead", "Paul Embraces Him and He Lives"],
    correct: ["Paul Preaches Until Midnight", "Young Man Sits in Window", "Overcome by Sleep", "Falls from Third Story", "Taken Up Dead", "Paul Embraces Him and He Lives"],
    book: "Acts 20:7-12"
  },
  {
    story: "The Seven Sons of Sceva",
    sequence: ["Jewish Exorcists Use Jesus' Name", "Evil Spirit Questions Them", "Spirit Says I Know Jesus and Paul", "Possessed Man Attacks All Seven", "They Flee Naked and Wounded", "Fear Falls on Ephesus"],
    correct: ["Jewish Exorcists Use Jesus' Name", "Evil Spirit Questions Them", "Spirit Says I Know Jesus and Paul", "Possessed Man Attacks All Seven", "They Flee Naked and Wounded", "Fear Falls on Ephesus"],
    book: "Acts 19:13-20"
  },
  {
    story: "Paul Bitten by Viper",
    sequence: ["Shipwrecked on Malta", "Gathering Sticks for Fire", "Viper Fastens on Hand", "Islanders Expect Him to Die", "Paul Shakes It Off Unharmed", "They Call Him a God"],
    correct: ["Shipwrecked on Malta", "Gathering Sticks for Fire", "Viper Fastens on Hand", "Islanders Expect Him to Die", "Paul Shakes It Off Unharmed", "They Call Him a God"],
    book: "Acts 28:1-6"
  },
  {
    story: "The Daughter of Herodias Dances",
    sequence: ["Herod's Birthday Feast", "Daughter Dances for Guests", "Herod Offers Up to Half Kingdom", "Mother Suggests John's Head", "Girl Requests Head on Platter", "John the Baptist Beheaded"],
    correct: ["Herod's Birthday Feast", "Daughter Dances for Guests", "Herod Offers Up to Half Kingdom", "Mother Suggests John's Head", "Girl Requests Head on Platter", "John the Baptist Beheaded"],
    book: "Mark 6:21-28"
  },

  // === OBSCURE BIBLE STORIES - VOLUME 8: DARK CHAPTERS ===
  {
    story: "Absalom's Rebellion",
    sequence: ["Absalom Steals Hearts of Israel", "Declares Himself King in Hebron", "David Flees Jerusalem", "Ahithophel's Counsel Rejected", "Battle in Forest of Ephraim", "Absalom Caught in Oak Tree"],
    correct: ["Absalom Steals Hearts of Israel", "Declares Himself King in Hebron", "David Flees Jerusalem", "Ahithophel's Counsel Rejected", "Battle in Forest of Ephraim", "Absalom Caught in Oak Tree"],
    book: "2 Samuel 15-18"
  },
  {
    story: "Athaliah the Usurper",
    sequence: ["Ahaziah Dies in Battle", "Athaliah Kills Royal Family", "Baby Joash Hidden in Temple", "Six Years of Wicked Rule", "Jehoiada Reveals Hidden King", "Athaliah Executed at Gate"],
    correct: ["Ahaziah Dies in Battle", "Athaliah Kills Royal Family", "Baby Joash Hidden in Temple", "Six Years of Wicked Rule", "Jehoiada Reveals Hidden King", "Athaliah Executed at Gate"],
    book: "2 Kings 11"
  },
  {
    story: "Jezebel's End",
    sequence: ["Jehu Comes to Jezreel", "Jezebel Paints Her Face", "Looks Down from Window", "Eunuchs Throw Her Down", "Dogs Eat Her Flesh", "Only Skull and Hands Remain"],
    correct: ["Jehu Comes to Jezreel", "Jezebel Paints Her Face", "Looks Down from Window", "Eunuchs Throw Her Down", "Dogs Eat Her Flesh", "Only Skull and Hands Remain"],
    book: "2 Kings 9:30-37"
  },
  {
    story: "The Cannibalism of Samaria",
    sequence: ["Ben-Hadad Besieges Samaria", "Famine Grows Severe", "Woman Cries to King", "Two Mothers Made Pact", "One Son Already Eaten", "King Tears His Robes"],
    correct: ["Ben-Hadad Besieges Samaria", "Famine Grows Severe", "Woman Cries to King", "Two Mothers Made Pact", "One Son Already Eaten", "King Tears His Robes"],
    book: "2 Kings 6:24-30"
  },
  {
    story: "Judas Iscariot's End",
    sequence: ["Betrays Jesus for 30 Silver", "Leads Soldiers to Garden", "Kisses Jesus as Signal", "Filled with Remorse", "Returns Money to Priests", "Hangs Himself"],
    correct: ["Betrays Jesus for 30 Silver", "Leads Soldiers to Garden", "Kisses Jesus as Signal", "Filled with Remorse", "Returns Money to Priests", "Hangs Himself"],
    book: "Matthew 26-27"
  },

  // === BONUS OBSCURE STORIES ===
  {
    story: "Achan's Hidden Sin",
    sequence: ["Jericho Falls to Israel", "Achan Takes Devoted Things", "Israel Defeated at Ai", "Lots Cast to Find Guilty", "Achan Confesses Theft", "Stoned in Valley of Achor"],
    correct: ["Jericho Falls to Israel", "Achan Takes Devoted Things", "Israel Defeated at Ai", "Lots Cast to Find Guilty", "Achan Confesses Theft", "Stoned in Valley of Achor"],
    book: "Joshua 7"
  },
  {
    story: "Uzzah Touches the Ark",
    sequence: ["David Brings Ark from Abinadab", "Ark Placed on New Cart", "Oxen Stumble at Threshing Floor", "Uzzah Reaches Out to Steady", "God Strikes Uzzah Dead", "David Afraid to Continue"],
    correct: ["David Brings Ark from Abinadab", "Ark Placed on New Cart", "Oxen Stumble at Threshing Floor", "Uzzah Reaches Out to Steady", "God Strikes Uzzah Dead", "David Afraid to Continue"],
    book: "2 Samuel 6:1-11"
  },
  {
    story: "Gehazi's Greed",
    sequence: ["Naaman Healed of Leprosy", "Elisha Refuses Payment", "Gehazi Runs After Naaman", "Lies About Needing Silver", "Returns with Clothing and Talents", "Struck with Naaman's Leprosy"],
    correct: ["Naaman Healed of Leprosy", "Elisha Refuses Payment", "Gehazi Runs After Naaman", "Lies About Needing Silver", "Returns with Clothing and Talents", "Struck with Naaman's Leprosy"],
    book: "2 Kings 5:20-27"
  },
  {
    story: "The Witch of Endor",
    sequence: ["Saul Faces Philistine Army", "God Does Not Answer Him", "Seeks Woman with Familiar Spirit", "Samuel's Spirit Appears", "Prophesies Saul's Death", "Saul Falls Terrified"],
    correct: ["Saul Faces Philistine Army", "God Does Not Answer Him", "Seeks Woman with Familiar Spirit", "Samuel's Spirit Appears", "Prophesies Saul's Death", "Saul Falls Terrified"],
    book: "1 Samuel 28"
  },
  {
    story: "Adonijah's Failed Coup",
    sequence: ["Adonijah Declares Himself King", "Sacrifices at En Rogel", "Nathan and Bathsheba Inform David", "Solomon Anointed at Gihon", "Guests Flee in Terror", "Adonijah Grasps Altar Horns"],
    correct: ["Adonijah Declares Himself King", "Sacrifices at En Rogel", "Nathan and Bathsheba Inform David", "Solomon Anointed at Gihon", "Guests Flee in Terror", "Adonijah Grasps Altar Horns"],
    book: "1 Kings 1"
  },
  {
    story: "Zimri's Seven-Day Reign",
    sequence: ["Zimri Kills King Elah", "Destroys House of Baasha", "Israel Proclaims Omri King", "Omri Besieges Tirzah", "Zimri Burns Palace on Himself", "Dies After Only Seven Days"],
    correct: ["Zimri Kills King Elah", "Destroys House of Baasha", "Israel Proclaims Omri King", "Omri Besieges Tirzah", "Zimri Burns Palace on Himself", "Dies After Only Seven Days"],
    book: "1 Kings 16:8-20"
  },
  {
    story: "The Poisoned Stew",
    sequence: ["Famine in the Land", "Elisha's Students Cook Stew", "Someone Adds Wild Gourds", "Cry Out There Is Death in Pot", "Elisha Adds Flour", "Stew Becomes Harmless"],
    correct: ["Famine in the Land", "Elisha's Students Cook Stew", "Someone Adds Wild Gourds", "Cry Out There Is Death in Pot", "Elisha Adds Flour", "Stew Becomes Harmless"],
    book: "2 Kings 4:38-41"
  },
  {
    story: "Jonah and the Great Fish",
    sequence: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"],
    correct: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"],
    book: "Jonah 1-2"
  }
];

export default function StoryRoomGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  // Shuffle quiz order once on mount so stories appear in random order
  const [shuffledQuizzes] = useState(() => {
    const quizzes = [...storyQuizzes];
    for (let i = quizzes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quizzes[i], quizzes[j]] = [quizzes[j], quizzes[i]];
    }
    return quizzes;
  });
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Shuffle the scenes for the current quiz
    const scenes = [...shuffledQuizzes[currentQuiz].sequence];
    setAvailableScenes(shuffleArray(scenes));
    setUserSequence([]);
    setFeedback("");
  }, [currentQuiz, shuffledQuizzes]);

  // Save score when game completes
  useEffect(() => {
    if (isComplete && user && score > 0) {
      saveScore();
    }
  }, [isComplete, user, score]);

  const saveScore = async () => {
    if (!user) return;
    
    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "story_room",
        score: score,
        mode: "solo",
        metadata: {
          total_questions: shuffledQuizzes.length,
          completed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleSceneClick = (scene: string) => {
    setUserSequence([...userSequence, scene]);
    setAvailableScenes(availableScenes.filter(s => s !== scene));
  };

  const handleRemoveScene = (index: number) => {
    const scene = userSequence[index];
    setAvailableScenes([...availableScenes, scene]);
    setUserSequence(userSequence.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const quiz = shuffledQuizzes[currentQuiz];
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(quiz.correct);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("✓ Perfect! You've mastered this story sequence!");
      toast({
        title: "Correct!",
        description: "Story sequence completed perfectly!",
      });

      setTimeout(() => {
        if (currentQuiz < shuffledQuizzes.length - 1) {
          setCurrentQuiz(currentQuiz + 1);
        } else {
          setIsComplete(true);
        }
      }, 2000);
    } else {
      setFeedback("✗ Not quite right. Try again!");
      toast({
        title: "Try Again",
        description: "The sequence isn't quite right. Review the story!",
        variant: "destructive",
      });
    }
  };

  const quiz = shuffledQuizzes[currentQuiz];
  const progress = ((currentQuiz + 1) / shuffledQuizzes.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">Story Room Mastered!</CardTitle>
                <CardDescription>
                  You've completed all story sequences!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {score} / {shuffledQuizzes.length}
                </div>
                <p className="text-muted-foreground">
                  Stories memorized as vivid mental movies
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Games
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Play Again
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <GameLeaderboard gameType="story_room" currentScore={score} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Story Library
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Sequence Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library">
            <StoryLibrary />
          </TabsContent>

          <TabsContent value="game">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Floor 1 • Story Room (SR)</Badge>
                  <Badge variant="outline">
                    {currentQuiz + 1} / {shuffledQuizzes.length}
                  </Badge>
                </div>
                <CardTitle className="text-3xl">📚 Story Room Challenge</CardTitle>
                <CardDescription>
                  Arrange the story scenes in chronological order. Turn each story into a vivid mental movie!
                </CardDescription>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">{quiz.story}</CardTitle>
                <CardDescription>{quiz.book}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User's Sequence */}
                <div>
                  <h3 className="font-semibold mb-3">Your Story Sequence:</h3>
                  <div className="min-h-[120px] p-4 border-2 border-dashed rounded-lg bg-muted/50">
                    {userSequence.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Click scenes below to build your story sequence
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {userSequence.map((scene, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-background rounded-lg border"
                          >
                            <span className="flex items-center gap-3">
                              <Badge variant="outline">{index + 1}</Badge>
                              {scene}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveScene(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Scenes */}
                <div>
                  <h3 className="font-semibold mb-3">Available Scenes:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableScenes.map((scene) => (
                      <Button
                        key={scene}
                        variant="outline"
                        className="h-auto py-4 justify-start text-left"
                        onClick={() => handleSceneClick(scene)}
                      >
                        {scene}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className={`p-4 rounded-lg flex items-center gap-3 ${
                    feedback.includes("✓")
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {feedback.includes("✓") ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">{feedback}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={checkAnswer}
                  disabled={userSequence.length !== shuffledQuizzes[currentQuiz].sequence.length}
                  className="w-full"
                  size="lg"
                >
                  Check Sequence
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">💡 Story Room Tip:</h4>
                <p className="text-sm text-muted-foreground">
                  The Story Room trains you to memorize Bible stories as vivid mental movies. Each scene becomes a frame you can recall in order. This is the foundation for all other Palace methods!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
