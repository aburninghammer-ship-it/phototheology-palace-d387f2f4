import React from 'react';

// Feasts Room Method Flowchart
export function FeastsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="feast-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      <rect width="800" height="600" fill="#ECFDF5" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#065F46" fontSize="24" fontWeight="bold">
        Feasts Room: God's Prophetic Calendar
      </text>

      {/* The 7 Feasts */}
      <g transform="translate(50, 65)">
        <rect x="0" y="0" width="700" height="30" rx="8" fill="#059669" />
        <text x="350" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          THE SEVEN FEASTS OF LEVITICUS 23
        </text>
      </g>

      {/* Spring Feasts */}
      <g transform="translate(50, 105)">
        <rect x="0" y="0" width="340" height="200" rx="12" fill="white" stroke="#059669" strokeWidth="2" />
        <text x="170" y="25" textAnchor="middle" fill="#065F46" fontSize="13" fontWeight="bold">SPRING FEASTS (Fulfilled)</text>
        <text x="170" y="42" textAnchor="middle" fill="#059669" fontSize="10">Christ's First Coming</text>

        {[
          { feast: 'Passover', date: 'Nisan 14', fulfilled: 'Christ our Passover (1 Cor 5:7)', color: '#DC2626' },
          { feast: 'Unleavened Bread', date: 'Nisan 15-21', fulfilled: 'Sinless life & burial', color: '#F59E0B' },
          { feast: 'Firstfruits', date: 'Nisan 16', fulfilled: 'Resurrection (1 Cor 15:20)', color: '#10B981' },
          { feast: 'Pentecost', date: '50 days later', fulfilled: 'Holy Spirit poured out (Acts 2)', color: '#3B82F6' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${55 + i * 35})`}>
            <circle cx="10" cy="12" r="8" fill={item.color} />
            <text x="25" y="10" fill="#065F46" fontSize="9" fontWeight="bold">{item.feast}</text>
            <text x="25" y="22" fill="#047857" fontSize="8">{item.date} → {item.fulfilled}</text>
          </g>
        ))}
      </g>

      {/* Fall Feasts */}
      <g transform="translate(410, 105)">
        <rect x="0" y="0" width="340" height="200" rx="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
        <text x="170" y="25" textAnchor="middle" fill="#92400E" fontSize="13" fontWeight="bold">FALL FEASTS (Awaiting)</text>
        <text x="170" y="42" textAnchor="middle" fill="#B45309" fontSize="10">Christ's Second Coming</text>

        {[
          { feast: 'Trumpets', date: 'Tishri 1', fulfilled: 'Judgment announced / Warning', color: '#7C3AED' },
          { feast: 'Day of Atonement', date: 'Tishri 10', fulfilled: 'Final cleansing / Judgment', color: '#DC2626' },
          { feast: 'Tabernacles', date: 'Tishri 15-22', fulfilled: 'God dwells with us forever', color: '#059669' },
        ].map((item, i) => (
          <g key={i} transform={`translate(10, ${55 + i * 45})`}>
            <circle cx="10" cy="12" r="8" fill={item.color} />
            <text x="25" y="10" fill="#92400E" fontSize="9" fontWeight="bold">{item.feast}</text>
            <text x="25" y="22" fill="#B45309" fontSize="8">{item.date} → {item.fulfilled}</text>
          </g>
        ))}
      </g>

      {/* Timeline Visual */}
      <g transform="translate(50, 320)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
        <text x="350" y="20" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">
          Feast Timeline: Shadow → Fulfillment
        </text>

        <line x1="50" y1="55" x2="650" y2="55" stroke="#059669" strokeWidth="3" />
        {[
          { x: 80, label: 'Passover', year: '31 AD' },
          { x: 180, label: 'Unleavened', year: '31 AD' },
          { x: 280, label: 'Firstfruits', year: '31 AD' },
          { x: 380, label: 'Pentecost', year: '31 AD' },
          { x: 480, label: 'Trumpets', year: '1844?' },
          { x: 550, label: 'Atonement', year: '1844+' },
          { x: 620, label: 'Tabernacles', year: 'Return' },
        ].map((item, i) => (
          <g key={i}>
            <circle cx={item.x} cy="55" r="6" fill={i < 4 ? '#059669' : '#F59E0B'} />
            <text x={item.x} y="72" textAnchor="middle" fill="#065F46" fontSize="7">{item.label}</text>
          </g>
        ))}
      </g>

      {/* The Pattern */}
      <rect x="50" y="415" width="700" height="80" rx="12" fill="white" stroke="#059669" strokeWidth="2" />
      <text x="400" y="440" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        The Feast Pattern: Type → Antitype
      </text>
      <text x="400" y="462" textAnchor="middle" fill="#047857" fontSize="11">
        Spring feasts fulfilled at First Coming • Fall feasts fulfilled at Second Coming
      </text>
      <text x="400" y="482" textAnchor="middle" fill="#059669" fontSize="10" fontStyle="italic">
        "These are a shadow of things to come; but the body is of Christ" — Colossians 2:17
      </text>

      {/* Key Principle */}
      <rect x="50" y="510" width="700" height="75" rx="12" fill="url(#feast-grad)" />
      <text x="400" y="540" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        God's calendar is prophetic — every feast has a divine appointment
      </text>
      <text x="400" y="562" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        The feasts tell the story of salvation from Calvary to the New Jerusalem
      </text>
    </svg>
  );
}

// Feasts Room Concept Infographic
export function FeastsRoomConcept() {
  return (
    <svg viewBox="0 0 800 650" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="650" fill="#ECFDF5" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        Each Feast in Detail
      </text>

      {/* Feast Details Grid */}
      <g transform="translate(30, 50)">
        {[
          {
            name: 'PASSOVER',
            hebrew: 'Pesach',
            date: 'Nisan 14',
            ot: 'Lamb slain, blood on doorposts',
            nt: 'Christ crucified (exact day!)',
            color: '#DC2626'
          },
          {
            name: 'UNLEAVENED BREAD',
            hebrew: 'Matzot',
            date: 'Nisan 15-21',
            ot: '7 days without leaven',
            nt: 'Christ sinless, buried',
            color: '#F59E0B'
          },
          {
            name: 'FIRSTFRUITS',
            hebrew: 'Bikkurim',
            date: 'Nisan 16',
            ot: 'Wave offering of barley',
            nt: 'Christ resurrected (exact day!)',
            color: '#10B981'
          },
          {
            name: 'PENTECOST',
            hebrew: 'Shavuot',
            date: 'Sivan 6',
            ot: 'Law given, wheat harvest',
            nt: 'Spirit poured out (exact day!)',
            color: '#3B82F6'
          },
          {
            name: 'TRUMPETS',
            hebrew: 'Yom Teruah',
            date: 'Tishri 1',
            ot: 'Trumpet blast, wake up call',
            nt: 'Judgment hour, final warning',
            color: '#7C3AED'
          },
          {
            name: 'ATONEMENT',
            hebrew: 'Yom Kippur',
            date: 'Tishri 10',
            ot: 'High Priest enters Most Holy',
            nt: 'Christ cleanses sanctuary',
            color: '#DC2626'
          },
          {
            name: 'TABERNACLES',
            hebrew: 'Sukkot',
            date: 'Tishri 15-22',
            ot: 'Dwell in booths, harvest joy',
            nt: 'God dwells with His people',
            color: '#059669'
          },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 4) * 185}, ${Math.floor(i / 4) * 140})`}>
            <rect x="0" y="0" width="175" height="130" rx="10" fill="white" stroke={item.color} strokeWidth="2" />
            <rect x="0" y="0" width="175" height="28" rx="10 10 0 0" fill={item.color} />
            <text x="87" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">{item.name}</text>
            <text x="87" y="45" textAnchor="middle" fill={item.color} fontSize="9">{item.hebrew} • {item.date}</text>
            <text x="10" y="65" fill="#065F46" fontSize="8" fontWeight="bold">OT:</text>
            <text x="10" y="78" fill="#047857" fontSize="7">{item.ot}</text>
            <text x="10" y="98" fill="#065F46" fontSize="8" fontWeight="bold">NT:</text>
            <text x="10" y="111" fill="#047857" fontSize="7">{item.nt}</text>
          </g>
        ))}
      </g>

      {/* Sabbaths within Feasts */}
      <rect x="50" y="355" width="700" height="100" rx="12" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
      <text x="400" y="380" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        Special Sabbaths within the Feasts
      </text>
      <g transform="translate(70, 395)">
        {[
          'First day of Unleavened Bread = Sabbath',
          'Last day of Unleavened Bread = Sabbath',
          'Pentecost = Sabbath',
          'Trumpets = Sabbath',
          'Day of Atonement = Sabbath',
          'First day of Tabernacles = Sabbath',
          'Last great day = Sabbath',
        ].map((item, i) => (
          <text key={i} x={(i % 2) * 330} y={Math.floor(i / 2) * 18} fill="#047857" fontSize="9">
            • {item}
          </text>
        ))}
      </g>

      {/* Agricultural Connection */}
      <rect x="50" y="470" width="700" height="80" rx="12" fill="white" stroke="#059669" strokeWidth="2" />
      <text x="400" y="495" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">
        Agricultural Cycle = Spiritual Harvest
      </text>
      <text x="200" y="520" textAnchor="middle" fill="#047857" fontSize="10">🌾 Barley (Firstfruits)</text>
      <text x="400" y="520" textAnchor="middle" fill="#047857" fontSize="10">🌾 Wheat (Pentecost)</text>
      <text x="600" y="520" textAnchor="middle" fill="#047857" fontSize="10">🍇 Grapes/Olives (Tabernacles)</text>
      <text x="400" y="542" textAnchor="middle" fill="#059669" fontSize="9" fontStyle="italic">
        Physical harvest mirrors spiritual harvest of souls
      </text>

      {/* Deliverable */}
      <rect x="50" y="565" width="700" height="70" rx="12" fill="#059669" />
      <text x="400" y="595" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Deliverable: Complete Feast Chart with OT Shadow + NT Reality
      </text>
      <text x="400" y="618" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        Know each feast's date, meaning, and Christological fulfillment
      </text>
    </svg>
  );
}

// Feasts Room Example
export function FeastsRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#ECFDF5" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        Example: Passover → Christ's Crucifixion
      </text>

      {/* The Parallel */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="330" height="220" rx="12" fill="white" stroke="#059669" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#059669" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">OT PASSOVER (Exodus 12)</text>

        {[
          'Lamb selected on Nisan 10',
          'Lamb examined 4 days (10-14)',
          'Lamb slain at twilight Nisan 14',
          'Blood applied to doorposts',
          'No bone broken',
          'Lamb eaten with bitter herbs',
          'Death passed over Israel',
          'Deliverance from Egypt',
        ].map((item, i) => (
          <text key={i} x="20" y={55 + i * 22} fill="#047857" fontSize="10">• {item}</text>
        ))}
      </g>

      <g transform="translate(420, 55)">
        <rect x="0" y="0" width="330" height="220" rx="12" fill="white" stroke="#DC2626" strokeWidth="2" />
        <rect x="0" y="0" width="330" height="35" rx="12 12 0 0" fill="#DC2626" />
        <text x="165" y="24" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">NT FULFILLMENT (31 AD)</text>

        {[
          'Christ entered Jerusalem Nisan 10',
          'Christ examined 4 days (questioned)',
          'Christ crucified at 3pm Nisan 14',
          'Blood applied to believers\' hearts',
          'No bone broken (John 19:36)',
          'Christ is our Passover (1 Cor 5:7)',
          'Death passes over those in Christ',
          'Deliverance from sin',
        ].map((item, i) => (
          <text key={i} x="20" y={55 + i * 22} fill="#B91C1C" fontSize="10">• {item}</text>
        ))}
      </g>

      {/* Arrow */}
      <text x="395" y="165" textAnchor="middle" fontSize="30">→</text>

      {/* Timing Precision */}
      <rect x="50" y="290" width="700" height="100" rx="12" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
      <text x="400" y="315" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        Divine Timing Precision
      </text>
      <text x="400" y="340" textAnchor="middle" fill="#047857" fontSize="11">
        At the exact hour when thousands of Passover lambs were being slain in the temple...
      </text>
      <text x="400" y="360" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="bold">
        ...the TRUE Passover Lamb died on Calvary
      </text>
      <text x="400" y="382" textAnchor="middle" fill="#059669" fontSize="10" fontStyle="italic">
        "Christ our Passover is sacrificed for us" — 1 Corinthians 5:7
      </text>

      {/* What This Proves */}
      <rect x="50" y="405" width="700" height="130" rx="12" fill="#059669" />
      <text x="400" y="435" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Feast Room Insight: What Passover Proves
      </text>
      <text x="400" y="460" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        1. God planned salvation before Creation (1 Pet 1:20)
      </text>
      <text x="400" y="480" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        2. OT feasts are prophetic shadows with exact fulfillment dates
      </text>
      <text x="400" y="500" textAnchor="middle" fill="#A7F3D0" fontSize="11">
        3. If Spring feasts fulfilled exactly, Fall feasts will too!
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#D1FAE5" fontSize="10" fontStyle="italic">
        The feasts prove divine authorship of Scripture and God's control of history
      </text>
    </svg>
  );
}

export default {
  FeastsRoomFlowchart,
  FeastsRoomConcept,
  FeastsRoomExample
};
