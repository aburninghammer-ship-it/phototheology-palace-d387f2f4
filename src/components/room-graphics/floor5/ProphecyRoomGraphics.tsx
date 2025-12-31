import React from 'react';

// Prophecy Room Method Flowchart
export function ProphecyRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="proph-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
      </defs>

      <rect width="800" height="550" fill="#F5F3FF" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#5B21B6" fontSize="24" fontWeight="bold">
        Prophecy Room: Understanding Biblical Predictions
      </text>

      {/* Prophecy Categories */}
      <g transform="translate(50, 70)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <text x="350" y="25" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
          Types of Biblical Prophecy
        </text>

        {[
          { type: 'Messianic', desc: 'About Christ', example: 'Isaiah 53, Psalm 22', color: '#DC2626' },
          { type: 'National', desc: 'About Israel/Nations', example: 'Jeremiah 25, Daniel 2', color: '#2563EB' },
          { type: 'Apocalyptic', desc: 'End Times', example: 'Daniel 7-12, Revelation', color: '#7C3AED' },
          { type: 'Conditional', desc: 'If/Then Promises', example: 'Deuteronomy 28', color: '#059669' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 175 + 10}, 40)`}>
            <rect x="0" y="0" width="165" height="70" rx="8" fill="#F5F3FF" stroke={item.color} strokeWidth="2" />
            <text x="82" y="20" textAnchor="middle" fill={item.color} fontSize="11" fontWeight="bold">{item.type}</text>
            <text x="82" y="38" textAnchor="middle" fill="#5B21B6" fontSize="9">{item.desc}</text>
            <text x="82" y="55" textAnchor="middle" fill="#7C3AED" fontSize="8" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* Interpretation Method */}
      <rect x="50" y="210" width="700" height="150" rx="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
      <text x="400" y="235" textAnchor="middle" fill="#5B21B6" fontSize="16" fontWeight="bold">
        The Prophecy Interpretation Method
      </text>

      <g transform="translate(70, 255)">
        {[
          { step: '1', title: 'Context', desc: 'Who wrote? To whom? When?' },
          { step: '2', title: 'Language', desc: 'Literal or symbolic?' },
          { step: '3', title: 'Time Markers', desc: 'Near or far fulfillment?' },
          { step: '4', title: 'NT Interpretation', desc: 'How do apostles apply it?' },
          { step: '5', title: 'Christ Center', desc: 'How does it point to Jesus?' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 130}, 0)`}>
            <circle cx="25" cy="25" r="22" fill="url(#proph-grad)" />
            <text x="25" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="65" y="20" fill="#5B21B6" fontSize="10" fontWeight="bold">{item.title}</text>
            <text x="65" y="38" fill="#7C3AED" fontSize="8">{item.desc}</text>
          </g>
        ))}
      </g>

      <text x="400" y="340" textAnchor="middle" fill="#5B21B6" fontSize="11" fontStyle="italic">
        "No prophecy of Scripture is of private interpretation" — 2 Peter 1:20
      </text>

      {/* Day-Year Principle */}
      <rect x="50" y="370" width="340" height="90" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
      <text x="220" y="395" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">Day-Year Principle</text>
      <text x="220" y="415" textAnchor="middle" fill="#7C3AED" fontSize="10">Numbers 14:34, Ezekiel 4:6</text>
      <text x="220" y="435" textAnchor="middle" fill="#5B21B6" fontSize="10">"A day for a year"</text>
      <text x="220" y="455" textAnchor="middle" fill="#7C3AED" fontSize="9">2300 days = 2300 years</text>

      {/* Repeat & Enlarge */}
      <rect x="410" y="370" width="340" height="90" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
      <text x="580" y="395" textAnchor="middle" fill="#5B21B6" fontSize="12" fontWeight="bold">Repeat & Enlarge Principle</text>
      <text x="580" y="415" textAnchor="middle" fill="#7C3AED" fontSize="10">Daniel 2 → 7 → 8 → 11</text>
      <text x="580" y="435" textAnchor="middle" fill="#5B21B6" fontSize="10">Same prophecy, more detail</text>
      <text x="580" y="455" textAnchor="middle" fill="#7C3AED" fontSize="9">Each vision adds new elements</text>

      {/* Key Principle */}
      <rect x="50" y="480" width="700" height="55" rx="12" fill="#7C3AED" />
      <text x="400" y="510" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        "Prophecy is history written in advance — study both together"
      </text>
      <text x="400" y="528" textAnchor="middle" fill="#DDD6FE" fontSize="11">
        Fulfilled prophecy proves divine authorship; unfulfilled awaits its time
      </text>
    </svg>
  );
}

// Prophecy Room Concept Infographic
export function ProphecyRoomConcept() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F5F3FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold">
        Major Prophetic Frameworks
      </text>

      {/* Daniel's Image */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="220" height="250" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#7C3AED" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Daniel 2: The Image</text>

        {[
          { part: 'Gold Head', kingdom: 'Babylon', period: '605-539 BC', color: '#FBBF24' },
          { part: 'Silver Chest', kingdom: 'Medo-Persia', period: '539-331 BC', color: '#9CA3AF' },
          { part: 'Bronze Waist', kingdom: 'Greece', period: '331-168 BC', color: '#B45309' },
          { part: 'Iron Legs', kingdom: 'Rome', period: '168 BC-476 AD', color: '#374151' },
          { part: 'Iron/Clay Feet', kingdom: 'Divided Europe', period: '476 AD-Now', color: '#78716C' },
          { part: 'Stone', kingdom: 'God\'s Kingdom', period: 'Future', color: '#3B82F6' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${45 + i * 33})`}>
            <rect x="0" y="0" width="200" height="28" rx="4" fill={item.color} fillOpacity="0.2" />
            <circle cx="12" cy="14" r="8" fill={item.color} />
            <text x="30" y="12" fill="#5B21B6" fontSize="9" fontWeight="bold">{item.part}</text>
            <text x="30" y="24" fill="#7C3AED" fontSize="8">{item.kingdom} ({item.period})</text>
          </g>
        ))}
      </g>

      {/* 70 Weeks */}
      <g transform="translate(290, 55)">
        <rect x="0" y="0" width="220" height="250" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#7C3AED" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Daniel 9: 70 Weeks</text>

        <text x="110" y="55" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">70 weeks = 490 years</text>
        <text x="110" y="72" textAnchor="middle" fill="#7C3AED" fontSize="9">Start: 457 BC (Ezra 7)</text>

        {[
          { weeks: '7 weeks', years: '49 years', event: 'Jerusalem rebuilt' },
          { weeks: '62 weeks', years: '434 years', event: 'To Messiah' },
          { weeks: '1 week', years: '7 years', event: 'Christ\'s ministry' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${85 + i * 45})`}>
            <rect x="0" y="0" width="200" height="40" rx="6" fill="#EDE9FE" />
            <text x="100" y="15" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">{item.weeks} = {item.years}</text>
            <text x="100" y="32" textAnchor="middle" fill="#7C3AED" fontSize="9">{item.event}</text>
          </g>
        ))}

        <text x="110" y="235" textAnchor="middle" fill="#5B21B6" fontSize="9" fontWeight="bold">End: 34 AD (Stephen martyred)</text>
      </g>

      {/* 2300 Days */}
      <g transform="translate(530, 55)">
        <rect x="0" y="0" width="220" height="250" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill="#7C3AED" />
        <text x="110" y="24" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Daniel 8: 2300 Days</text>

        <text x="110" y="60" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">"2300 days, then sanctuary cleansed"</text>

        <rect x="10" y="75" width="200" height="80" rx="6" fill="#EDE9FE" />
        <text x="110" y="95" textAnchor="middle" fill="#5B21B6" fontSize="10">2300 days = 2300 years</text>
        <text x="110" y="115" textAnchor="middle" fill="#7C3AED" fontSize="9">Start: 457 BC</text>
        <text x="110" y="135" textAnchor="middle" fill="#7C3AED" fontSize="9">End: 1844 AD</text>

        <rect x="10" y="165" width="200" height="70" rx="6" fill="#DDD6FE" />
        <text x="110" y="185" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">Significance:</text>
        <text x="110" y="205" textAnchor="middle" fill="#7C3AED" fontSize="9">Heavenly sanctuary cleansing</text>
        <text x="110" y="220" textAnchor="middle" fill="#7C3AED" fontSize="9">Pre-advent judgment begins</text>
      </g>

      {/* Prophetic Symbols Key */}
      <rect x="50" y="320" width="700" height="130" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
      <text x="400" y="345" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
        Common Prophetic Symbols
      </text>

      <g transform="translate(60, 360)">
        {[
          { symbol: 'Beast', meaning: 'Kingdom/Power', ref: 'Dan 7:17' },
          { symbol: 'Horn', meaning: 'King/Power', ref: 'Dan 8:21' },
          { symbol: 'Water', meaning: 'Peoples/Nations', ref: 'Rev 17:15' },
          { symbol: 'Woman', meaning: 'Church', ref: 'Jer 6:2' },
          { symbol: 'Day', meaning: 'Year', ref: 'Num 14:34' },
          { symbol: 'Wind', meaning: 'War/Strife', ref: 'Jer 49:36' },
          { symbol: 'Mountain', meaning: 'Kingdom', ref: 'Dan 2:35' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 4) * 170}, ${Math.floor(i / 4) * 45})`}>
            <rect x="0" y="0" width="160" height="38" rx="6" fill="#F5F3FF" />
            <text x="80" y="15" textAnchor="middle" fill="#5B21B6" fontSize="10" fontWeight="bold">{item.symbol} = {item.meaning}</text>
            <text x="80" y="30" textAnchor="middle" fill="#7C3AED" fontSize="8">{item.ref}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="465" width="700" height="120" rx="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
      <text x="400" y="490" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
        Prophecy Room Deliverable: Prophetic Timeline
      </text>
      <text x="400" y="515" textAnchor="middle" fill="#7C3AED" fontSize="11">
        Daniel 2, 7, 8, 9, 11 harmonized with Revelation
      </text>
      <text x="400" y="540" textAnchor="middle" fill="#7C3AED" fontSize="11">
        Track: Empire → Date → Prophecy → Fulfillment
      </text>
      <text x="400" y="565" textAnchor="middle" fill="#5B21B6" fontSize="10" fontStyle="italic">
        "We have a more sure word of prophecy" — 2 Peter 1:19
      </text>
    </svg>
  );
}

// Prophecy Room Example
export function ProphecyRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#F5F3FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#5B21B6" fontSize="22" fontWeight="bold">
        Example: Isaiah 53 — Messianic Prophecy
      </text>

      {/* The Prophecy */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="340" height="240" rx="12" fill="white" stroke="#7C3AED" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#7C3AED" />
        <text x="170" y="24" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Isaiah 53 (Written ~700 BC)</text>

        {[
          { verse: 'v.3', text: '"Despised and rejected"' },
          { verse: 'v.4', text: '"Bore our griefs, carried sorrows"' },
          { verse: 'v.5', text: '"Wounded for our transgressions"' },
          { verse: 'v.6', text: '"LORD laid on him our iniquity"' },
          { verse: 'v.7', text: '"As a lamb to the slaughter"' },
          { verse: 'v.9', text: '"With the rich in his death"' },
          { verse: 'v.10', text: '"He shall see his seed, prolong days"' },
          { verse: 'v.12', text: '"Numbered with transgressors"' },
        ].map((item, i) => (
          <text key={i} x="20" y={55 + i * 25} fill="#5B21B6" fontSize="10">
            <tspan fontWeight="bold" fill="#7C3AED">{item.verse}:</tspan> {item.text}
          </text>
        ))}
      </g>

      {/* The Fulfillment */}
      <g transform="translate(410, 55)">
        <rect x="0" y="0" width="340" height="240" rx="12" fill="white" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#DC2626" />
        <text x="170" y="24" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Fulfilled in Christ (31 AD)</text>

        {[
          { ref: 'John 1:11', text: 'His own received him not' },
          { ref: 'Matt 8:17', text: 'Himself took our infirmities' },
          { ref: '1 Pet 2:24', text: 'By whose stripes healed' },
          { ref: '2 Cor 5:21', text: 'Made him sin for us' },
          { ref: 'John 1:29', text: 'Lamb of God' },
          { ref: 'Matt 27:57-60', text: 'Joseph\'s tomb' },
          { ref: 'Acts 2:24', text: 'God raised him up' },
          { ref: 'Luke 22:37', text: 'Reckoned with transgressors' },
        ].map((item, i) => (
          <text key={i} x="20" y={55 + i * 25} fill="#B91C1C" fontSize="10">
            <tspan fontWeight="bold" fill="#DC2626">{item.ref}:</tspan> {item.text}
          </text>
        ))}
      </g>

      {/* Statistical Analysis */}
      <rect x="50" y="310" width="700" height="100" rx="12" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
      <text x="400" y="335" textAnchor="middle" fill="#5B21B6" fontSize="14" fontWeight="bold">
        Probability Analysis
      </text>
      <text x="400" y="360" textAnchor="middle" fill="#7C3AED" fontSize="11">
        Isaiah 53 contains 12+ specific predictions about the Messiah
      </text>
      <text x="400" y="380" textAnchor="middle" fill="#7C3AED" fontSize="11">
        Probability of one person fulfilling all by chance: 1 in 10^17 (100 quadrillion)
      </text>
      <text x="400" y="400" textAnchor="middle" fill="#5B21B6" fontSize="11" fontWeight="bold">
        Mathematical proof of divine authorship and Jesus as Messiah
      </text>

      {/* Application */}
      <rect x="50" y="425" width="700" height="110" rx="12" fill="#7C3AED" />
      <text x="400" y="455" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Prophecy Room Insight
      </text>
      <text x="400" y="480" textAnchor="middle" fill="#DDD6FE" fontSize="12">
        Isaiah 53 was written 700 years before Christ — no human could guess these details
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#DDD6FE" fontSize="12">
        Fulfilled prophecy = God's signature, proving Jesus is the promised Messiah
      </text>
      <text x="400" y="528" textAnchor="middle" fill="#C4B5FD" fontSize="10" fontStyle="italic">
        "Search the scriptures... they testify of me" — John 5:39
      </text>
    </svg>
  );
}

export default {
  ProphecyRoomFlowchart,
  ProphecyRoomConcept,
  ProphecyRoomExample
};
