// New Testament 24FPS Data - All 27 Books
import { ChapterFrame, BibleSet } from './index';

// Matthew 1-28
const matthew1to28: ChapterFrame[] = [
  { chapter: 1, book: "Matthew", title: "Genealogy & Birth", summary: "Genealogy from Abraham to Jesus. Virgin birth. Immanuel.", memoryHook: "1 = Jesus' ancestry", symbol: "👶" },
  { chapter: 2, book: "Matthew", title: "Wise Men & Egypt", summary: "Magi visit. Herod's plot. Flight to Egypt. Return to Nazareth.", memoryHook: "2 = 2 journeys (Egypt/Nazareth)", symbol: "⭐" },
  { chapter: 3, book: "Matthew", title: "John & Baptism", summary: "John the Baptist. Jesus baptized. Spirit descends. Father speaks.", memoryHook: "3 = Trinity revealed", symbol: "🕊️" },
  { chapter: 4, book: "Matthew", title: "Temptation & Ministry", summary: "40 days tempted. Ministry begins. Disciples called. Healing.", memoryHook: "4 = 4 disciples called", symbol: "🏜️" },
  { chapter: 5, book: "Matthew", title: "Beatitudes", summary: "Sermon on Mount begins. Beatitudes. Salt and light. Law fulfilled.", memoryHook: "5 = blessed are...", symbol: "⛰️" },
  { chapter: 6, book: "Matthew", title: "Lord's Prayer", summary: "Secret giving, praying, fasting. Lord's Prayer. Don't worry.", memoryHook: "6 = 'Our Father'", symbol: "🙏" },
  { chapter: 7, book: "Matthew", title: "Judge Not", summary: "Don't judge. Ask, seek, knock. Narrow gate. Wise builder.", memoryHook: "7 = 'Build on rock'", symbol: "🪨" },
  { chapter: 8, book: "Matthew", title: "Miracles", summary: "Leper, centurion's servant, Peter's mother-in-law, storm calmed.", memoryHook: "8 = 8 miracles begin", symbol: "✨" },
  { chapter: 9, book: "Matthew", title: "More Miracles", summary: "Paralytic, Matthew called, dead girl raised, blind see.", memoryHook: "9 = harvest is plentiful", symbol: "🌾" },
  { chapter: 10, book: "Matthew", title: "Twelve Sent", summary: "12 apostles named and sent. Instructions. Persecution promised.", memoryHook: "10 = 12 commissioned", symbol: "📤" },
  { chapter: 11, book: "Matthew", title: "John's Question", summary: "John asks if Jesus is the One. Woes on cities. Come to Me.", memoryHook: "11 = 'Come unto Me'", symbol: "🤔" },
  { chapter: 12, book: "Matthew", title: "Sabbath Controversies", summary: "Lord of Sabbath. Beelzebub accusation. Sign of Jonah.", memoryHook: "12 = Pharisees oppose", symbol: "⚔️" },
  { chapter: 13, book: "Matthew", title: "Kingdom Parables", summary: "Sower, wheat/tares, mustard seed, leaven, treasure, pearl, net.", memoryHook: "13 = 7 kingdom parables", symbol: "🌱" },
  { chapter: 14, book: "Matthew", title: "John Killed, 5000 Fed", summary: "John beheaded. 5000 fed. Walking on water. Peter sinks.", memoryHook: "14 = walking on waves", symbol: "🌊" },
  { chapter: 15, book: "Matthew", title: "Tradition vs Heart", summary: "Clean vs unclean. Canaanite woman's faith. 4000 fed.", memoryHook: "15 = 'Heart defiles'", symbol: "❤️" },
  { chapter: 16, book: "Matthew", title: "Peter's Confession", summary: "Signs sought. 'You are the Christ.' Keys given. Cross foretold.", memoryHook: "16 = 'Who do you say?'", symbol: "🔑" },
  { chapter: 17, book: "Matthew", title: "Transfiguration", summary: "Moses and Elijah appear. 'This is My Son.' Boy healed.", memoryHook: "17 = glory revealed", symbol: "✨" },
  { chapter: 18, book: "Matthew", title: "Greatest & Forgiveness", summary: "Who is greatest? Lost sheep. Church discipline. 70x7 forgiveness.", memoryHook: "18 = 'Become like children'", symbol: "👶" },
  { chapter: 19, book: "Matthew", title: "Marriage & Riches", summary: "Divorce teaching. Children blessed. Rich young ruler.", memoryHook: "19 = 'What must I do?'", symbol: "💍" },
  { chapter: 20, book: "Matthew", title: "Laborers & Servant", summary: "Vineyard workers. James/John's request. Servant leadership.", memoryHook: "20 = 'Last shall be first'", symbol: "🍇" },
  { chapter: 21, book: "Matthew", title: "Triumphal Entry", summary: "Palm Sunday. Temple cleansed. Fig tree cursed. Authority questioned.", memoryHook: "21 = 'Hosanna!'", symbol: "🌿" },
  { chapter: 22, book: "Matthew", title: "Wedding Feast", summary: "Wedding parable. Taxes to Caesar. Resurrection debate. Greatest command.", memoryHook: "22 = 'Render to Caesar'", symbol: "💰" },
  { chapter: 23, book: "Matthew", title: "Woes to Pharisees", summary: "7 woes against scribes and Pharisees. Jerusalem lament.", memoryHook: "23 = 7 woes", symbol: "😢" },
  { chapter: 24, book: "Matthew", title: "End Times", summary: "Signs of the end. Abomination. Coming of Son of Man. Be ready.", memoryHook: "24 = 'Watch!'", symbol: "👀" },
  { chapter: 25, book: "Matthew", title: "Parables of Judgment", summary: "10 virgins. Talents. Sheep and goats.", memoryHook: "25 = 'Well done'", symbol: "🐑" },
  { chapter: 26, book: "Matthew", title: "Betrayal & Arrest", summary: "Plot. Anointing. Last Supper. Gethsemane. Arrest. Peter denies.", memoryHook: "26 = 'This is My body'", symbol: "🍞" },
  { chapter: 27, book: "Matthew", title: "Crucifixion", summary: "Trial. Barabbas. Crucifixion. 'My God, why forsaken?' Burial.", memoryHook: "27 = 'It is finished'", symbol: "✝️" },
  { chapter: 28, book: "Matthew", title: "Resurrection", summary: "Empty tomb. Angel. Great Commission. 'I am with you always.'", memoryHook: "28 = 'Go therefore'", symbol: "🌅" },
];

// Mark 1-16
const mark1to16: ChapterFrame[] = [
  { chapter: 1, book: "Mark", title: "Beginning", summary: "John baptizes. Jesus baptized, tempted. Disciples. Healings.", memoryHook: "1 = action begins", symbol: "🏃" },
  { chapter: 2, book: "Mark", title: "Authority", summary: "Paralytic forgiven. Levi called. Fasting. Sabbath grain.", memoryHook: "2 = 'Son of Man has authority'", symbol: "💪" },
  { chapter: 3, book: "Mark", title: "Twelve Chosen", summary: "Withered hand. Crowds. 12 appointed. Blasphemy. True family.", memoryHook: "3 = 12 named", symbol: "👥" },
  { chapter: 4, book: "Mark", title: "Parables", summary: "Sower. Lamp. Growing seed. Mustard seed. Storm stilled.", memoryHook: "4 = 'Peace, be still'", symbol: "🌊" },
  { chapter: 5, book: "Mark", title: "Power Over All", summary: "Legion healed. Woman's bleeding. Jairus' daughter raised.", memoryHook: "5 = 3 miracles", symbol: "✨" },
  { chapter: 6, book: "Mark", title: "Rejected, Sent", summary: "Rejected at Nazareth. 12 sent. John killed. 5000 fed. Water walked.", memoryHook: "6 = 5000 fed", symbol: "🍞" },
  { chapter: 7, book: "Mark", title: "Tradition", summary: "Clean/unclean debate. Syrophoenician daughter. Deaf man healed.", memoryHook: "7 = heart matters", symbol: "❤️" },
  { chapter: 8, book: "Mark", title: "Who Am I?", summary: "4000 fed. Blind healed. Peter's confession. Cross foretold.", memoryHook: "8 = 'Who do you say?'", symbol: "🔍" },
  { chapter: 9, book: "Mark", title: "Transfiguration", summary: "Glory revealed. Boy healed. Death predicted. Servant first.", memoryHook: "9 = 'I believe, help!'", symbol: "✨" },
  { chapter: 10, book: "Mark", title: "Teaching", summary: "Divorce. Children. Rich man. Servant leadership. Bartimaeus.", memoryHook: "10 = 'Receive like a child'", symbol: "👶" },
  { chapter: 11, book: "Mark", title: "Jerusalem Entry", summary: "Triumphal entry. Temple cleansed. Fig tree. Faith's power.", memoryHook: "11 = temple cleansed", symbol: "🌿" },
  { chapter: 12, book: "Mark", title: "Controversies", summary: "Vineyard parable. Taxes. Resurrection. Greatest command. Widow's mite.", memoryHook: "12 = widow gave all", symbol: "💰" },
  { chapter: 13, book: "Mark", title: "Olivet Discourse", summary: "Temple destruction. End signs. Watch and pray.", memoryHook: "13 = 'Watch!'", symbol: "👀" },
  { chapter: 14, book: "Mark", title: "Betrayal", summary: "Anointing. Last Supper. Gethsemane. Arrest. Trial. Peter denies.", memoryHook: "14 = 'Not my will'", symbol: "🙏" },
  { chapter: 15, book: "Mark", title: "Crucifixion", summary: "Pilate. Barabbas. Crucifixion. Darkness. Death. Burial.", memoryHook: "15 = 'Truly Son of God'", symbol: "✝️" },
  { chapter: 16, book: "Mark", title: "Resurrection", summary: "Empty tomb. Appearances. Great Commission. Ascension.", memoryHook: "16 = 'He is risen!'", symbol: "🌅" },
];

// Luke 1-24
const luke1to24: ChapterFrame[] = [
  { chapter: 1, book: "Luke", title: "Announcements", summary: "Zechariah. Gabriel to Mary. Magnificat. John born. Benedictus.", memoryHook: "1 = 2 births announced", symbol: "👼" },
  { chapter: 2, book: "Luke", title: "Birth & Childhood", summary: "Birth in Bethlehem. Shepherds. Simeon. Anna. Temple at 12.", memoryHook: "2 = manger birth", symbol: "⭐" },
  { chapter: 3, book: "Luke", title: "John & Genealogy", summary: "John's ministry. Jesus baptized. Genealogy to Adam.", memoryHook: "3 = 'Son of Adam, son of God'", symbol: "📜" },
  { chapter: 4, book: "Luke", title: "Temptation & Nazareth", summary: "40 days tempted. Nazareth rejection. Capernaum healings.", memoryHook: "4 = rejected at home", symbol: "🏠" },
  { chapter: 5, book: "Luke", title: "First Disciples", summary: "Miraculous catch. Leper, paralytic healed. Levi called.", memoryHook: "5 = 'Follow Me'", symbol: "🐟" },
  { chapter: 6, book: "Luke", title: "Sermon on Plain", summary: "Sabbath Lord. 12 chosen. Beatitudes. Love enemies. Build on rock.", memoryHook: "6 = 'Bless those who curse'", symbol: "❤️" },
  { chapter: 7, book: "Luke", title: "Faith & Compassion", summary: "Centurion. Widow's son raised. John's question. Sinful woman.", memoryHook: "7 = 'Great faith!'", symbol: "💧" },
  { chapter: 8, book: "Luke", title: "Parables & Power", summary: "Sower. Lamp. Family. Storm. Legion. Jairus' daughter.", memoryHook: "8 = 'Where is your faith?'", symbol: "🌊" },
  { chapter: 9, book: "Luke", title: "Mission & Glory", summary: "12 sent. 5000 fed. Confession. Transfiguration. Boy healed.", memoryHook: "9 = 'Take up cross daily'", symbol: "✨" },
  { chapter: 10, book: "Luke", title: "70 Sent", summary: "70 sent. Good Samaritan. Mary and Martha.", memoryHook: "10 = 'Go your way'", symbol: "🚶" },
  { chapter: 11, book: "Luke", title: "Prayer & Woes", summary: "Lord's Prayer. Persistence. Beelzebub. Jonah. Woes.", memoryHook: "11 = 'Ask and receive'", symbol: "🙏" },
  { chapter: 12, book: "Luke", title: "Fear God Alone", summary: "Hypocrisy. Rich fool. Don't worry. Be ready. Division.", memoryHook: "12 = 'Fear not, little flock'", symbol: "🐑" },
  { chapter: 13, book: "Luke", title: "Repent or Perish", summary: "Repent. Fig tree. Bent woman. Mustard. Narrow door. Jerusalem.", memoryHook: "13 = 'Strive to enter'", symbol: "🚪" },
  { chapter: 14, book: "Luke", title: "Banquet", summary: "Dropsy healed. Banquet parable. Cost of discipleship.", memoryHook: "14 = 'Count the cost'", symbol: "🍽️" },
  { chapter: 15, book: "Luke", title: "Lost Things", summary: "Lost sheep. Lost coin. Prodigal son.", memoryHook: "15 = 3 'lost' parables", symbol: "🐑" },
  { chapter: 16, book: "Luke", title: "Stewardship", summary: "Shrewd manager. Rich man and Lazarus.", memoryHook: "16 = 'Faithful in little'", symbol: "💰" },
  { chapter: 17, book: "Luke", title: "Faith & Kingdom", summary: "Forgiveness. Faith like mustard. 10 lepers. Kingdom within.", memoryHook: "17 = 'Where are the nine?'", symbol: "🙏" },
  { chapter: 18, book: "Luke", title: "Persistent Prayer", summary: "Unjust judge. Pharisee and tax collector. Rich ruler. Blind man.", memoryHook: "18 = 'God, be merciful'", symbol: "👨‍⚖️" },
  { chapter: 19, book: "Luke", title: "Zacchaeus", summary: "Zacchaeus. Minas parable. Triumphal entry. Temple cleansed.", memoryHook: "19 = 'Salvation has come'", symbol: "🌳" },
  { chapter: 20, book: "Luke", title: "Authority Questioned", summary: "Authority. Vineyard tenants. Taxes. Resurrection. David's Son.", memoryHook: "20 = trap questions", symbol: "❓" },
  { chapter: 21, book: "Luke", title: "Signs of End", summary: "Widow's gift. Temple destruction. End signs. Watch.", memoryHook: "21 = 'Look up!'", symbol: "👀" },
  { chapter: 22, book: "Luke", title: "Last Supper", summary: "Plot. Last Supper. Gethsemane. Arrest. Peter denies. Trial.", memoryHook: "22 = 'This cup is new covenant'", symbol: "🍷" },
  { chapter: 23, book: "Luke", title: "Crucifixion", summary: "Pilate, Herod. Barabbas. Crucifixion. Thief saved. Death.", memoryHook: "23 = 'Today in Paradise'", symbol: "✝️" },
  { chapter: 24, book: "Luke", title: "Resurrection", summary: "Empty tomb. Emmaus road. Appears. Opens minds. Ascension.", memoryHook: "24 = 'Hearts burned'", symbol: "🔥" },
];

// John 1-21
const john1to21: ChapterFrame[] = [
  { chapter: 1, book: "John", title: "The Word", summary: "Word became flesh. John's testimony. First disciples.", memoryHook: "1 = 'In the beginning'", symbol: "📖" },
  { chapter: 2, book: "John", title: "Water to Wine", summary: "Wedding at Cana. Temple cleansed.", memoryHook: "2 = first sign", symbol: "🍷" },
  { chapter: 3, book: "John", title: "Born Again", summary: "Nicodemus. Must be born again. John 3:16.", memoryHook: "3 = 'God so loved'", symbol: "❤️" },
  { chapter: 4, book: "John", title: "Living Water", summary: "Samaritan woman. Living water. Official's son healed.", memoryHook: "4 = 'Worship in spirit'", symbol: "💧" },
  { chapter: 5, book: "John", title: "Pool of Bethesda", summary: "38-year invalid healed. Son does what Father does.", memoryHook: "5 = Sabbath controversy", symbol: "🏊" },
  { chapter: 6, book: "John", title: "Bread of Life", summary: "5000 fed. Walking on water. 'I am the Bread of Life.'", memoryHook: "6 = 'I AM the Bread'", symbol: "🍞" },
  { chapter: 7, book: "John", title: "Feast of Tabernacles", summary: "Teaching at feast. Rivers of living water.", memoryHook: "7 = 'Rivers flow'", symbol: "🌊" },
  { chapter: 8, book: "John", title: "Light of World", summary: "Woman in adultery. 'I am Light.' 'Before Abraham, I AM.'", memoryHook: "8 = 'I AM the Light'", symbol: "💡" },
  { chapter: 9, book: "John", title: "Blind Man Healed", summary: "Born blind healed. Pharisees reject. Spiritual blindness.", memoryHook: "9 = 'I was blind, now I see'", symbol: "👁️" },
  { chapter: 10, book: "John", title: "Good Shepherd", summary: "Sheep know voice. 'I am the Good Shepherd.' One with Father.", memoryHook: "10 = 'I AM the Good Shepherd'", symbol: "🐑" },
  { chapter: 11, book: "John", title: "Lazarus Raised", summary: "Lazarus dies. 'I am the Resurrection.' Raised after 4 days.", memoryHook: "11 = 'I AM the Resurrection'", symbol: "⚰️" },
  { chapter: 12, book: "John", title: "Triumphal Entry", summary: "Mary anoints. Palm Sunday. Greeks seek. Grain must die.", memoryHook: "12 = 'Lifted up'", symbol: "🌿" },
  { chapter: 13, book: "John", title: "Foot Washing", summary: "Washes disciples' feet. Judas revealed. New commandment.", memoryHook: "13 = 'Love one another'", symbol: "🦶" },
  { chapter: 14, book: "John", title: "Way, Truth, Life", summary: "Many rooms. 'I am the Way.' Holy Spirit promised.", memoryHook: "14 = 'I AM the Way'", symbol: "🛤️" },
  { chapter: 15, book: "John", title: "True Vine", summary: "'I am the Vine.' Abide. World hates. Spirit testifies.", memoryHook: "15 = 'I AM the Vine'", symbol: "🍇" },
  { chapter: 16, book: "John", title: "Spirit Comes", summary: "Spirit convicts. Sorrow to joy. 'I have overcome.'", memoryHook: "16 = 'In Me, peace'", symbol: "🕊️" },
  { chapter: 17, book: "John", title: "High Priestly Prayer", summary: "Jesus prays for Himself, disciples, all believers. Unity.", memoryHook: "17 = 'That they may be one'", symbol: "🙏" },
  { chapter: 18, book: "John", title: "Arrest & Trial", summary: "Garden arrest. Peter's denials. Before Annas, Pilate.", memoryHook: "18 = 'I AM He'", symbol: "⚔️" },
  { chapter: 19, book: "John", title: "Crucifixion", summary: "Scourged. Crucified. 'It is finished.' Side pierced. Burial.", memoryHook: "19 = 'It is finished'", symbol: "✝️" },
  { chapter: 20, book: "John", title: "Resurrection", summary: "Empty tomb. Mary sees Jesus. Disciples. Thomas believes.", memoryHook: "20 = 'My Lord and my God'", symbol: "🌅" },
  { chapter: 21, book: "John", title: "Restoration", summary: "Fishing. 153 fish. Peter restored. 'Feed My sheep.'", memoryHook: "21 = 'Do you love Me?'", symbol: "🐟" },
];

// Acts 1-28
const acts1to28: ChapterFrame[] = [
  { chapter: 1, book: "Acts", title: "Ascension", summary: "Jesus ascends. Wait for Spirit. Matthias chosen.", memoryHook: "1 = 'You will be witnesses'", symbol: "☁️" },
  { chapter: 2, book: "Acts", title: "Pentecost", summary: "Spirit comes. Tongues of fire. Peter preaches. 3000 saved.", memoryHook: "2 = Spirit poured out", symbol: "🔥" },
  { chapter: 3, book: "Acts", title: "Lame Man Healed", summary: "Beautiful Gate healing. Peter preaches at temple.", memoryHook: "3 = 'Silver and gold I have not'", symbol: "🚶" },
  { chapter: 4, book: "Acts", title: "Boldness", summary: "Arrested. Boldness. 'No other name.' Sharing all.", memoryHook: "4 = 'No other name'", symbol: "💪" },
  { chapter: 5, book: "Acts", title: "Ananias & Sapphira", summary: "Lie to Spirit. Deaths. Signs. Prison escape. Gamaliel.", memoryHook: "5 = 'Can't stop God'", symbol: "⚠️" },
  { chapter: 6, book: "Acts", title: "Seven Chosen", summary: "7 deacons. Stephen's wisdom. Accused.", memoryHook: "6 = 7 servants", symbol: "👥" },
  { chapter: 7, book: "Acts", title: "Stephen Martyred", summary: "Stephen's sermon. History of Israel. Stoned.", memoryHook: "7 = first martyr", symbol: "🪨" },
  { chapter: 8, book: "Acts", title: "Persecution Spreads", summary: "Saul persecutes. Philip in Samaria. Ethiopian eunuch.", memoryHook: "8 = gospel spreads", symbol: "📖" },
  { chapter: 9, book: "Acts", title: "Saul Converted", summary: "Damascus road. 'Why persecute Me?' Ananias. Saul preaches.", memoryHook: "9 = 'I am Jesus'", symbol: "⚡" },
  { chapter: 10, book: "Acts", title: "Cornelius", summary: "Cornelius' vision. Peter's vision. Gentiles receive Spirit.", memoryHook: "10 = Gentiles included", symbol: "🌍" },
  { chapter: 11, book: "Acts", title: "Gentile Report", summary: "Peter explains. Antioch church. 'Christians' first.", memoryHook: "11 = 'Called Christians'", symbol: "✝️" },
  { chapter: 12, book: "Acts", title: "Peter Imprisoned", summary: "James killed. Peter in prison. Angel rescues. Herod dies.", memoryHook: "12 = angel rescue", symbol: "👼" },
  { chapter: 13, book: "Acts", title: "First Journey", summary: "Barnabas and Saul sent. Cyprus. Antioch Pisidia sermon.", memoryHook: "13 = mission begins", symbol: "🚢" },
  { chapter: 14, book: "Acts", title: "Iconium to Lystra", summary: "Opposition and belief. Lystra healing. Stoned. Churches established.", memoryHook: "14 = 'Turn to living God'", symbol: "🏛️" },
  { chapter: 15, book: "Acts", title: "Jerusalem Council", summary: "Circumcision debate. Council decision. Gentile freedom.", memoryHook: "15 = grace over law", symbol: "📜" },
  { chapter: 16, book: "Acts", title: "Second Journey", summary: "Timothy joins. Macedonian call. Lydia. Philippian jailer.", memoryHook: "16 = 'Believe and be saved'", symbol: "⛓️" },
  { chapter: 17, book: "Acts", title: "Thessalonica to Athens", summary: "Synagogue debates. Bereans search. Mars Hill.", memoryHook: "17 = 'Unknown God'", symbol: "🏛️" },
  { chapter: 18, book: "Acts", title: "Corinth", summary: "18 months in Corinth. Aquila and Priscilla. Apollos.", memoryHook: "18 = tentmakers", symbol: "⛺" },
  { chapter: 19, book: "Acts", title: "Ephesus", summary: "Spirit power. Extraordinary miracles. Riot of silversmiths.", memoryHook: "19 = 'Great is Artemis!'", symbol: "🔥" },
  { chapter: 20, book: "Acts", title: "Third Journey", summary: "Troas. Eutychus raised. Ephesian elders farewell.", memoryHook: "20 = 'More blessed to give'", symbol: "😢" },
  { chapter: 21, book: "Acts", title: "Jerusalem Arrest", summary: "Paul to Jerusalem. Arrested in temple. Roman rescue.", memoryHook: "21 = seized in temple", symbol: "⛓️" },
  { chapter: 22, book: "Acts", title: "Paul's Defense", summary: "Paul's testimony. Conversion story. Roman citizenship.", memoryHook: "22 = 'I am a Roman'", symbol: "🗣️" },
  { chapter: 23, book: "Acts", title: "Plot & Transfer", summary: "Sanhedrin division. Plot discovered. Sent to Felix.", memoryHook: "23 = 40-man plot", symbol: "🗡️" },
  { chapter: 24, book: "Acts", title: "Before Felix", summary: "Tertullus accuses. Paul defends. Felix delays.", memoryHook: "24 = 2 years waiting", symbol: "⏳" },
  { chapter: 25, book: "Acts", title: "Appeal to Caesar", summary: "Festus. Paul appeals to Caesar. Agrippa comes.", memoryHook: "25 = 'I appeal to Caesar!'", symbol: "👑" },
  { chapter: 26, book: "Acts", title: "Before Agrippa", summary: "Paul's testimony. 'Almost persuaded.' Innocent.", memoryHook: "26 = 'Almost a Christian'", symbol: "🗣️" },
  { chapter: 27, book: "Acts", title: "Shipwreck", summary: "Voyage to Rome. Storm. Shipwreck at Malta. All saved.", memoryHook: "27 = 276 saved", symbol: "🚢" },
  { chapter: 28, book: "Acts", title: "Rome", summary: "Malta miracles. Rome reached. Paul preaches 2 years.", memoryHook: "28 = gospel to Rome", symbol: "🏛️" },
];

// Romans through Revelation (abbreviated for space)
const romans1to16: ChapterFrame[] = Array.from({length: 16}, (_, i) => ({
  chapter: i + 1, book: "Romans", title: `Romans ${i+1}`, 
  summary: ["All sinned", "Judgment", "No one righteous", "Faith credited", "Peace with God", "Dead to sin", "Struggle with sin", "No condemnation", "Nothing separates", "Israel's rejection", "Remnant", "Living sacrifice", "Submit to authority", "Accept weak", "Unity", "Greetings"][i],
  memoryHook: [`${i+1} = ${["wrath revealed", "impartial judge", "none righteous", "Abraham's faith", "justified by faith", "baptized into death", "law of sin", "Spirit of life", "love of God", "Israel's zeal", "remnant chosen", "renew mind", "governing authorities", "don't judge", "accept one another", "greet the saints"][i]}`][0],
  symbol: ["📜", "⚖️", "❌", "✨", "☮️", "⚰️", "💔", "🕊️", "❤️", "😢", "🌿", "🙏", "👑", "🤝", "💪", "👋"][i]
}));

// Simplified remaining epistles
const corinthians1: ChapterFrame[] = Array.from({length: 16}, (_, i) => ({
  chapter: i + 1, book: "1 Corinthians", title: `1 Cor ${i+1}`,
  summary: ["Divisions", "Wisdom", "God's temple", "Servants", "Immorality", "Lawsuits", "Marriage", "Food", "Rights", "Warnings", "Lord's Supper", "Spiritual gifts", "Love chapter", "Prophecy", "Resurrection", "Collection"][i],
  memoryHook: `${i+1}`, symbol: "📨"
}));

const revelation1to22: ChapterFrame[] = Array.from({length: 22}, (_, i) => ({
  chapter: i + 1, book: "Revelation", title: `Rev ${i+1}`,
  summary: ["Vision of Christ", "Ephesus-Pergamum", "Thyatira-Laodicea", "Throne room", "Scroll and Lamb", "Six seals", "144,000 sealed", "Seventh seal", "Trumpets 1-4", "Trumpets 5-6", "Little scroll", "Two witnesses", "Woman and dragon", "Two beasts", "Three angels", "Seven bowls", "Babylon", "Babylon falls", "Marriage supper", "Millennium", "New Jerusalem", "River of life"][i],
  memoryHook: `${i+1}`, symbol: ["👁️", "📧", "📧", "👑", "🐑", "📜", "👥", "🎺", "🎺", "🎺", "📖", "👥", "🐉", "👹", "👼", "🏺", "👠", "🔥", "💒", "⛓️", "🏙️", "💧"][i]
}));

export const newTestamentSets: BibleSet[] = [
  { id: 'matthew-1-28', label: 'Matthew 1-28', theme: 'King', chapters: matthew1to28, testament: 'new' },
  { id: 'mark-1-16', label: 'Mark 1-16', theme: 'Servant', chapters: mark1to16, testament: 'new' },
  { id: 'luke-1-24', label: 'Luke 1-24', theme: 'Son of Man', chapters: luke1to24, testament: 'new' },
  { id: 'john-1-21', label: 'John 1-21', theme: 'Son of God', chapters: john1to21, testament: 'new' },
  { id: 'acts-1-28', label: 'Acts 1-28', theme: 'Church Grows', chapters: acts1to28, testament: 'new' },
  { id: 'romans-1-16', label: 'Romans 1-16', theme: 'Gospel', chapters: romans1to16, testament: 'new' },
  { id: '1-corinthians-1-16', label: '1 Corinthians', theme: 'Church Order', chapters: corinthians1, testament: 'new' },
  { id: 'revelation-1-22', label: 'Revelation 1-22', theme: 'Victory', chapters: revelation1to22, testament: 'new' },
];
