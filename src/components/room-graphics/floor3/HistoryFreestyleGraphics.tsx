import React from 'react';

// History Freestyle Room Method Flowchart
export function HistoryFreestyleFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78716C" />
          <stop offset="100%" stopColor="#57534E" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="#FAF5F0" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#44403C" fontSize="24" fontWeight="bold">
        History Freestyle: His Story in History
      </text>

      {/* Flow: History → Principle → Scripture */}
      <g transform="translate(50, 70)">
        {/* Historical Event */}
        <circle cx="120" cy="100" r="80" fill="url(#hf-grad)" />
        <text x="120" y="85" textAnchor="middle" fill="white" fontSize="36">📜</text>
        <text x="120" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">HISTORY</text>
        <text x="120" y="135" textAnchor="middle" fill="#D6D3D1" fontSize="11">An Event/Era</text>

        {/* Arrow */}
        <path d="M210 100 L290 100" stroke="#78716C" strokeWidth="4" fill="none" markerEnd="url(#arrow-hf)" />
        <defs>
          <marker id="arrow-hf" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#78716C" />
          </marker>
        </defs>

        {/* Principle Circle */}
        <circle cx="380" cy="100" r="80" fill="#F59E0B" />
        <text x="380" y="85" textAnchor="middle" fill="white" fontSize="36">⚖️</text>
        <text x="380" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">PRINCIPLE</text>
        <text x="380" y="135" textAnchor="middle" fill="#FEF3C7" fontSize="11">What Truth?</text>

        {/* Arrow */}
        <path d="M470 100 L550 100" stroke="#78716C" strokeWidth="4" fill="none" markerEnd="url(#arrow-hf)" />

        {/* Scripture Circle */}
        <circle cx="640" cy="100" r="80" fill="#3B82F6" />
        <text x="640" y="85" textAnchor="middle" fill="white" fontSize="36">📖</text>
        <text x="640" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SCRIPTURE</text>
        <text x="640" y="135" textAnchor="middle" fill="#BFDBFE" fontSize="11">Bible Parallel</text>
      </g>

      {/* Method Steps */}
      <rect x="50" y="220" width="700" height="130" rx="12" fill="white" stroke="#78716C" strokeWidth="2" />
      <text x="400" y="250" textAnchor="middle" fill="#44403C" fontSize="16" fontWeight="bold">
        The History Freestyle Method
      </text>

      <g transform="translate(70, 270)">
        {[
          { step: '1', text: 'Select: Choose a historical event or era', icon: '🏛️' },
          { step: '2', text: 'Study: What happened? Why? What resulted?', icon: '🔍' },
          { step: '3', text: 'Extract: What spiritual principle is illustrated?', icon: '💎' },
          { step: '4', text: 'Connect: Find Scripture that teaches the same', icon: '🔗' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <circle cx="20" cy="25" r="20" fill="#78716C" />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="20" y="55" textAnchor="middle" fontSize="18">{item.icon}</text>
            <text x="20" y="75" textAnchor="middle" fill="#44403C" fontSize="9">{item.text}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="370" width="700" height="110" rx="12" fill="#F5F5F4" stroke="#78716C" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#44403C" fontSize="16" fontWeight="bold">
        The Great Controversy Lens
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#57534E" fontSize="13">
        "These things happened to them as examples and were written for our instruction" (1 Cor 10:11)
      </text>
      <text x="400" y="450" textAnchor="middle" fill="#57534E" fontSize="12">
        History is not random — God is working out His purposes through nations and events.
      </text>
      <text x="400" y="470" textAnchor="middle" fill="#44403C" fontSize="11" fontStyle="italic">
        Every rise and fall of empires illustrates eternal principles.
      </text>
    </svg>
  );
}

// History Freestyle Room Concept Infographic
export function HistoryFreestyleConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#FAF5F0" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#44403C" fontSize="22" fontWeight="bold">
        Historical Categories → Scripture Principles
      </text>

      {/* Categories */}
      <g transform="translate(50, 55)">
        {[
          { cat: 'Empire Falls', icon: '🏚️', event: 'Rome, Babylon, Greece', principle: 'Pride goes before destruction (Prov 16:18)' },
          { cat: 'Persecution', icon: '⚔️', event: 'Early Church, Reformation', principle: 'The blood of martyrs is seed (Rev 12:11)' },
          { cat: 'Reformation', icon: '📜', event: 'Luther, Calvin, Wesley', principle: 'Truth will not be silenced (Isa 55:11)' },
          { cat: 'Inventions', icon: '💡', event: 'Printing Press, Radio', principle: 'Gospel to every nation (Matt 24:14)' },
          { cat: 'Wars', icon: '🔥', event: 'World Wars, Crusades', principle: 'Wars and rumors of wars (Matt 24:6)' },
          { cat: 'Revival', icon: '🔥', event: 'Great Awakening, Welsh', principle: 'If my people pray... (2 Chr 7:14)' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 120})`}>
            <rect x="0" y="0" width="220" height="110" rx="12" fill="white" stroke="#78716C" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fontSize="24">{item.icon}</text>
            <text x="110" y="50" textAnchor="middle" fill="#44403C" fontSize="12" fontWeight="bold">{item.cat}</text>
            <text x="110" y="68" textAnchor="middle" fill="#57534E" fontSize="9">{item.event}</text>
            <text x="110" y="90" textAnchor="middle" fill="#78716C" fontSize="8" fontStyle="italic">→ {item.principle}</text>
          </g>
        ))}
      </g>

      {/* Historical Eras */}
      <rect x="50" y="310" width="700" height="120" rx="12" fill="white" stroke="#78716C" strokeWidth="2" />
      <text x="400" y="340" textAnchor="middle" fill="#44403C" fontSize="16" fontWeight="bold">
        Key Historical Eras to Study
      </text>

      <g transform="translate(70, 360)">
        {[
          { era: 'Early Church', time: '31-313 AD' },
          { era: 'Dark Ages', time: '538-1798 AD' },
          { era: 'Reformation', time: '1517+' },
          { era: 'Great Awakening', time: '1730-1770' },
          { era: 'Advent Movement', time: '1840s' },
          { era: 'Modern Era', time: '1900-Now' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 110}, 0)`}>
            <rect x="0" y="0" width="100" height="50" rx="8" fill="#F5F5F4" stroke="#A8A29E" strokeWidth="1" />
            <text x="50" y="20" textAnchor="middle" fill="#44403C" fontSize="10" fontWeight="bold">{item.era}</text>
            <text x="50" y="38" textAnchor="middle" fill="#78716C" fontSize="9">{item.time}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#78716C" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: History-to-Scripture Connection Card
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#D6D3D1" fontSize="13">
        Historical Event + What Happened + Spiritual Principle + Scripture Parallel
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#D6D3D1" fontSize="11">
        Build a library of historical illustrations for teaching
      </text>
    </svg>
  );
}

// History Freestyle Room Example
export function HistoryFreestyleExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#FAF5F0" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#44403C" fontSize="22" fontWeight="bold">
        Example: The Fall of Rome → Babylon's Fall
      </text>

      {/* Historical Event */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="110" rx="12" fill="white" stroke="#78716C" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#78716C" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Historical Event: The Fall of Rome (476 AD)
        </text>

        <text x="30" y="60" fill="#44403C" fontSize="11">
          <tspan fontWeight="bold">What happened:</tspan> The "eternal city" fell to barbarian tribes after centuries of decline.
        </text>
        <text x="30" y="80" fill="#57534E" fontSize="11">
          <tspan fontWeight="bold">Causes:</tspan> Moral decay, political corruption, overextension, economic collapse, military weakness.
        </text>
        <text x="30" y="100" fill="#57534E" fontSize="11">
          <tspan fontWeight="bold">Result:</tspan> Europe fragmented into the nations that exist today; Dark Ages began.
        </text>
      </g>

      {/* Spiritual Principle */}
      <g transform="translate(50, 175)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#F59E0B" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Extracted Principle
        </text>

        <text x="30" y="60" fill="#92400E" fontSize="12">
          "Pride and moral decay precede the fall of nations. No empire is 'too big to fail.'"
        </text>
        <text x="30" y="77" fill="#78350F" fontSize="10" fontStyle="italic">
          God is sovereign over nations — He raises them up and brings them down according to His purposes.
        </text>
      </g>

      {/* Scripture Parallel */}
      <g transform="translate(50, 265)">
        <rect x="0" y="0" width="700" height="140" rx="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#3B82F6" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Scripture Parallels
        </text>

        <g transform="translate(20, 45)">
          <text x="10" y="10" fill="#1E40AF" fontSize="11" fontWeight="bold">Daniel 2:40-43 — The Iron Kingdom</text>
          <text x="20" y="28" fill="#1D4ED8" fontSize="10">"The kingdom shall be divided... partly strong, partly broken."</text>

          <text x="10" y="50" fill="#1E40AF" fontSize="11" fontWeight="bold">Daniel 5:26-28 — Belshazzar's Feast</text>
          <text x="20" y="68" fill="#1D4ED8" fontSize="10">"God has numbered your kingdom and finished it... You have been weighed and found wanting."</text>

          <text x="10" y="90" fill="#1E40AF" fontSize="11" fontWeight="bold">Proverbs 14:34</text>
          <text x="20" y="108" fill="#1D4ED8" fontSize="10">"Righteousness exalts a nation, but sin is a reproach to any people."</text>
        </g>
      </g>

      {/* Connection Synthesis */}
      <g transform="translate(50, 415)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Teaching Connection
        </text>

        <text x="30" y="55" fill="#065F46" fontSize="11">
          "Rome fell exactly as Daniel prophesied — iron mixed with clay, never united again.
        </text>
        <text x="30" y="73" fill="#065F46" fontSize="11">
          This proves: (1) God knows the future, (2) Nations are accountable to Him, (3) Pride precedes judgment."
        </text>
        <text x="30" y="93" fill="#047857" fontSize="10" fontStyle="italic">
          Application: What we see happening in modern nations follows the same pattern. History repeats its warnings.
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="525" width="700" height="60" rx="12" fill="#78716C" />
      <text x="400" y="552" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        History + Principle + Scripture = Powerful Teaching Illustration
      </text>
      <text x="400" y="572" textAnchor="middle" fill="#D6D3D1" fontSize="11">
        "Those who don't learn from history are doomed to repeat it — but Scripture helps us see the pattern."
      </text>
    </svg>
  );
}

export default {
  HistoryFreestyleFlowchart,
  HistoryFreestyleConcept,
  HistoryFreestyleExample
};
