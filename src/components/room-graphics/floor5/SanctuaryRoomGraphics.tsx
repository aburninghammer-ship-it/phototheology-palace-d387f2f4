import React from 'react';

// Sanctuary Room Method Flowchart
export function SanctuaryRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sanc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      <rect width="800" height="550" fill="#EFF6FF" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="24" fontWeight="bold">
        Sanctuary Room: The Gospel in Architecture
      </text>

      {/* Tabernacle Layout */}
      <g transform="translate(150, 70)">
        {/* Outer Court */}
        <rect x="0" y="0" width="500" height="200" rx="8" fill="none" stroke="#92400E" strokeWidth="3" />
        <text x="250" y="-10" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">OUTER COURT (Earth)</text>

        {/* Altar */}
        <rect x="30" y="120" width="60" height="50" fill="#7C2D12" rx="4" />
        <text x="60" y="150" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Altar</text>
        <text x="60" y="185" textAnchor="middle" fill="#92400E" fontSize="8">Cross</text>

        {/* Laver */}
        <ellipse cx="150" cy="145" rx="30" ry="20" fill="#60A5FA" />
        <text x="150" y="150" textAnchor="middle" fill="#1E40AF" fontSize="9" fontWeight="bold">Laver</text>
        <text x="150" y="185" textAnchor="middle" fill="#1E40AF" fontSize="8">Baptism</text>

        {/* Holy Place */}
        <rect x="220" y="30" width="150" height="140" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" rx="4" />
        <text x="295" y="20" textAnchor="middle" fill="#D97706" fontSize="11" fontWeight="bold">HOLY PLACE</text>

        {/* Candlestick */}
        <circle cx="250" cy="100" r="20" fill="#FBBF24" />
        <text x="250" y="105" textAnchor="middle" fill="#92400E" fontSize="8" fontWeight="bold">Light</text>
        <text x="250" y="145" textAnchor="middle" fill="#D97706" fontSize="7">Holy Spirit</text>

        {/* Table */}
        <rect x="310" y="55" width="40" height="30" fill="#78350F" rx="3" />
        <text x="330" y="73" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">Bread</text>
        <text x="330" y="95" textAnchor="middle" fill="#D97706" fontSize="7">Word</text>

        {/* Altar of Incense */}
        <rect x="280" y="130" width="30" height="30" fill="#D97706" rx="3" />
        <text x="295" y="148" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">Incense</text>
        <text x="295" y="175" textAnchor="middle" fill="#D97706" fontSize="7">Prayer</text>

        {/* Most Holy */}
        <rect x="380" y="30" width="110" height="140" fill="url(#sanc-grad)" rx="4" />
        <text x="435" y="20" textAnchor="middle" fill="#1E40AF" fontSize="10" fontWeight="bold">MOST HOLY</text>

        {/* Ark */}
        <rect x="400" y="70" width="70" height="45" fill="#FBBF24" stroke="#92400E" strokeWidth="2" rx="3" />
        <text x="435" y="95" textAnchor="middle" fill="#92400E" fontSize="8" fontWeight="bold">ARK</text>
        <text x="435" y="140" textAnchor="middle" fill="white" fontSize="8">God's Presence</text>
      </g>

      {/* Journey Explanation */}
      <rect x="50" y="290" width="700" height="100" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="315" textAnchor="middle" fill="#1E40AF" fontSize="14" fontWeight="bold">
        The Sanctuary Path: Our Journey to God
      </text>

      <g transform="translate(70, 330)">
        {[
          { step: 'Gate', meaning: 'Jesus (John 10:9)', color: '#7C2D12' },
          { step: 'Altar', meaning: 'Cross (Heb 9:22)', color: '#DC2626' },
          { step: 'Laver', meaning: 'Baptism (Titus 3:5)', color: '#3B82F6' },
          { step: 'Table', meaning: 'Word (John 6:35)', color: '#78350F' },
          { step: 'Lamp', meaning: 'Spirit (Rev 4:5)', color: '#FBBF24' },
          { step: 'Incense', meaning: 'Prayer (Rev 8:4)', color: '#D97706' },
          { step: 'Ark', meaning: 'Presence (Heb 9:24)', color: '#1D4ED8' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 95}, 0)`}>
            <circle cx="15" cy="15" r="12" fill={item.color} />
            <text x="15" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{i + 1}</text>
            <text x="50" y="12" textAnchor="middle" fill="#1E40AF" fontSize="9" fontWeight="bold">{item.step}</text>
            <text x="50" y="28" textAnchor="middle" fill="#3B82F6" fontSize="7">{item.meaning}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="410" width="700" height="60" rx="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="440" textAnchor="middle" fill="#1E40AF" fontSize="14" fontWeight="bold">
        Key Insight: The Sanctuary is a 3D Gospel Map
      </text>
      <text x="400" y="460" textAnchor="middle" fill="#3B82F6" fontSize="11">
        Every piece of furniture reveals how sinners approach a Holy God through Christ
      </text>

      {/* Summary */}
      <rect x="50" y="485" width="700" height="50" rx="12" fill="#3B82F6" />
      <text x="400" y="515" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        "The path to God's presence is paved with the gospel of Christ"
      </text>
    </svg>
  );
}

// Sanctuary Room Concept Infographic
export function SanctuaryRoomConcept() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#EFF6FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold">
        Sanctuary Symbols Decoded
      </text>

      {/* Three Compartments */}
      <g transform="translate(50, 55)">
        {[
          {
            name: 'Outer Court',
            realm: 'Body / Earth',
            items: ['Altar = Sacrifice', 'Laver = Cleansing'],
            color: '#92400E',
            bgColor: '#FEF3C7'
          },
          {
            name: 'Holy Place',
            realm: 'Soul / Church',
            items: ['Table = Communion', 'Lamp = Illumination', 'Incense = Intercession'],
            color: '#D97706',
            bgColor: '#FEF3C7'
          },
          {
            name: 'Most Holy',
            realm: 'Spirit / Heaven',
            items: ['Ark = God\'s Throne', 'Mercy Seat = Grace', 'Law = Standard'],
            color: '#1D4ED8',
            bgColor: '#DBEAFE'
          },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 235}, 0)`}>
            <rect x="0" y="0" width="220" height="180" rx="12" fill={item.bgColor} stroke={item.color} strokeWidth="2" />
            <rect x="0" y="0" width="220" height="35" rx="12 12 0 0" fill={item.color} />
            <text x="110" y="24" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{item.name}</text>
            <text x="110" y="55" textAnchor="middle" fill={item.color} fontSize="10" fontStyle="italic">{item.realm}</text>
            {item.items.map((subItem, j) => (
              <text key={j} x="110" y={80 + j * 25} textAnchor="middle" fill={item.color} fontSize="10">
                • {subItem}
              </text>
            ))}
          </g>
        ))}
      </g>

      {/* Christ in Each Item */}
      <rect x="50" y="250" width="700" height="170" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="275" textAnchor="middle" fill="#1E40AF" fontSize="14" fontWeight="bold">
        Christ in Every Sanctuary Item
      </text>

      <g transform="translate(60, 290)">
        {[
          { item: 'Gate', christ: 'I am the Door', ref: 'John 10:9' },
          { item: 'Altar', christ: 'Lamb of God', ref: 'John 1:29' },
          { item: 'Laver', christ: 'Fountain opened', ref: 'Zech 13:1' },
          { item: 'Table', christ: 'Bread of Life', ref: 'John 6:35' },
          { item: 'Lamp', christ: 'Light of World', ref: 'John 8:12' },
          { item: 'Incense', christ: 'Our Intercessor', ref: 'Heb 7:25' },
          { item: 'Ark', christ: 'God with us', ref: 'Matt 1:23' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 4) * 170}, ${Math.floor(i / 4) * 65})`}>
            <rect x="0" y="0" width="160" height="55" rx="8" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1" />
            <text x="80" y="18" textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold">{item.item}</text>
            <text x="80" y="35" textAnchor="middle" fill="#3B82F6" fontSize="9">{item.christ}</text>
            <text x="80" y="48" textAnchor="middle" fill="#60A5FA" fontSize="8">{item.ref}</text>
          </g>
        ))}
      </g>

      {/* Daily/Yearly Services */}
      <g transform="translate(50, 435)">
        <rect x="0" y="0" width="340" height="80" rx="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
        <text x="170" y="25" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">Daily Service (Tamid)</text>
        <text x="170" y="45" textAnchor="middle" fill="#3B82F6" fontSize="10">Morning & Evening sacrifice</text>
        <text x="170" y="62" textAnchor="middle" fill="#3B82F6" fontSize="10">= Christ's continuous intercession</text>

        <rect x="360" y="0" width="340" height="80" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
        <text x="530" y="25" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">Yearly Service (Yom Kippur)</text>
        <text x="530" y="45" textAnchor="middle" fill="#D97706" fontSize="10">Day of Atonement</text>
        <text x="530" y="62" textAnchor="middle" fill="#D97706" fontSize="10">= Final judgment & cleansing</text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="530" width="700" height="55" rx="12" fill="#3B82F6" />
      <text x="400" y="555" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Deliverable: Complete Sanctuary Symbol Chart
      </text>
      <text x="400" y="575" textAnchor="middle" fill="#BFDBFE" fontSize="11">
        Every item + OT shadow + NT fulfillment + Personal application
      </text>
    </svg>
  );
}

// Sanctuary Room Example
export function SanctuaryRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#EFF6FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold">
        Example: The Altar of Burnt Offering
      </text>

      {/* Altar Details */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="330" height="220" rx="12" fill="white" stroke="#7C2D12" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#7C2D12" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">OT Shadow: Bronze Altar</text>

        <text x="20" y="60" fill="#7C2D12" fontSize="11" fontWeight="bold">Physical Description:</text>
        <text x="20" y="80" fill="#92400E" fontSize="10">• Made of acacia wood, overlaid with bronze</text>
        <text x="20" y="98" fill="#92400E" fontSize="10">• 5 cubits square, 3 cubits high</text>
        <text x="20" y="116" fill="#92400E" fontSize="10">• Four horns on corners</text>
        <text x="20" y="134" fill="#92400E" fontSize="10">• Fire never to go out (Lev 6:13)</text>

        <text x="20" y="160" fill="#7C2D12" fontSize="11" fontWeight="bold">Function:</text>
        <text x="20" y="180" fill="#92400E" fontSize="10">• First piece encountered after gate</text>
        <text x="20" y="198" fill="#92400E" fontSize="10">• Where blood was shed for sin</text>
        <text x="20" y="216" fill="#92400E" fontSize="10">• Required before approaching God</text>
      </g>

      <g transform="translate(420, 55)">
        <rect x="0" y="0" width="330" height="220" rx="12" fill="white" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#DC2626" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">NT Fulfillment: The Cross</text>

        <text x="20" y="60" fill="#DC2626" fontSize="11" fontWeight="bold">Christ as Altar & Sacrifice:</text>
        <text x="20" y="80" fill="#B91C1C" fontSize="10">• "Behold the Lamb of God" (John 1:29)</text>
        <text x="20" y="98" fill="#B91C1C" fontSize="10">• "Once for all" sacrifice (Heb 10:10)</text>
        <text x="20" y="116" fill="#B91C1C" fontSize="10">• Blood shed at Calvary</text>
        <text x="20" y="134" fill="#B91C1C" fontSize="10">• Required before approaching God</text>

        <text x="20" y="160" fill="#DC2626" fontSize="11" fontWeight="bold">The Upgrade:</text>
        <text x="20" y="180" fill="#B91C1C" fontSize="10">• Bronze altar = temporary covering</text>
        <text x="20" y="198" fill="#B91C1C" fontSize="10">• Cross = permanent removal of sin</text>
        <text x="20" y="216" fill="#B91C1C" fontSize="10">• "It is finished!" (John 19:30)</text>
      </g>

      {/* Connection Arrow */}
      <text x="390" y="165" textAnchor="middle" fontSize="30">→</text>

      {/* Key Teachings */}
      <rect x="50" y="290" width="700" height="130" rx="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="315" textAnchor="middle" fill="#1E40AF" fontSize="14" fontWeight="bold">
        Sanctuary Insights from the Altar
      </text>

      <g transform="translate(70, 330)">
        {[
          { lesson: 'Location First', insight: 'No bypassing the altar — no salvation without the Cross' },
          { lesson: 'Fire Never Out', insight: 'Christ\'s sacrifice effective continuously (Heb 7:25)' },
          { lesson: 'Blood Required', insight: '"Without shedding of blood is no remission" (Heb 9:22)' },
          { lesson: 'Four Horns', insight: 'Salvation to four corners of earth (Rev 7:1)' },
        ].map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 25})`}>
            <text x="0" fill="#1E40AF" fontSize="11" fontWeight="bold">• {item.lesson}:</text>
            <text x="130" fill="#3B82F6" fontSize="10">{item.insight}</text>
          </g>
        ))}
      </g>

      {/* Personal Application */}
      <rect x="50" y="435" width="700" height="100" rx="12" fill="#3B82F6" />
      <text x="400" y="465" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Personal Application: Have You Been to the Altar?
      </text>
      <text x="400" y="490" textAnchor="middle" fill="#BFDBFE" fontSize="12">
        The altar asks: Have you accepted Christ's sacrifice for YOUR sin?
      </text>
      <text x="400" y="512" textAnchor="middle" fill="#BFDBFE" fontSize="11">
        No one approaches God's presence without first coming to the altar of Calvary
      </text>
      <text x="400" y="530" textAnchor="middle" fill="#93C5FD" fontSize="10" fontStyle="italic">
        "The way into the holiest is through His blood" — Hebrews 10:19
      </text>
    </svg>
  );
}

export default {
  SanctuaryRoomFlowchart,
  SanctuaryRoomConcept,
  SanctuaryRoomExample
};
