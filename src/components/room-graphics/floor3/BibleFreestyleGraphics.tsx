import React from 'react';

// Bible Freestyle Room Method Flowchart
export function BibleFreestyleFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="#EFF6FF" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="24" fontWeight="bold">
        Bible Freestyle: Spontaneous Scripture Connection
      </text>

      {/* Flow: Verse → Meditation → Expansion */}
      <g transform="translate(50, 70)">
        {/* Starting Verse */}
        <circle cx="120" cy="100" r="80" fill="url(#bf-grad)" />
        <text x="120" y="85" textAnchor="middle" fill="white" fontSize="36">📖</text>
        <text x="120" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ANY VERSE</text>
        <text x="120" y="135" textAnchor="middle" fill="#BFDBFE" fontSize="11">Start Point</text>

        {/* Arrow */}
        <path d="M210 100 L290 100" stroke="#3B82F6" strokeWidth="4" fill="none" markerEnd="url(#arrow-bf)" />
        <defs>
          <marker id="arrow-bf" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
          </marker>
        </defs>

        {/* Free Association */}
        <circle cx="380" cy="100" r="80" fill="#A855F7" />
        <text x="380" y="85" textAnchor="middle" fill="white" fontSize="36">💭</text>
        <text x="380" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">FREE FLOW</text>
        <text x="380" y="135" textAnchor="middle" fill="#E9D5FF" fontSize="11">Associations</text>

        {/* Arrow */}
        <path d="M470 100 L550 100" stroke="#3B82F6" strokeWidth="4" fill="none" markerEnd="url(#arrow-bf)" />

        {/* Connected Insights */}
        <circle cx="640" cy="100" r="80" fill="#10B981" />
        <text x="640" y="85" textAnchor="middle" fill="white" fontSize="36">✨</text>
        <text x="640" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">INSIGHT</text>
        <text x="640" y="135" textAnchor="middle" fill="#A7F3D0" fontSize="11">New Truth</text>
      </g>

      {/* Method Steps */}
      <rect x="50" y="220" width="700" height="130" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="250" textAnchor="middle" fill="#1E40AF" fontSize="16" fontWeight="bold">
        The Bible Freestyle Method
      </text>

      <g transform="translate(70, 270)">
        {[
          { step: '1', text: 'Land: Pick any verse as starting point', icon: '🎯' },
          { step: '2', text: 'Launch: What word, phrase, or idea jumps out?', icon: '🚀' },
          { step: '3', text: 'Link: Where else does this appear in Scripture?', icon: '🔗' },
          { step: '4', text: 'Land: What new insight emerges?', icon: '💡' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <circle cx="20" cy="25" r="20" fill="#3B82F6" />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="20" y="55" textAnchor="middle" fontSize="18">{item.icon}</text>
            <text x="20" y="75" textAnchor="middle" fill="#1E40AF" fontSize="9">{item.text}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="370" width="700" height="110" rx="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#1E40AF" fontSize="16" fontWeight="bold">
        The Meditation Principle
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#1D4ED8" fontSize="13">
        "His delight is in the law of the LORD; and in his law doth he meditate day and night" (Ps 1:2)
      </text>
      <text x="400" y="450" textAnchor="middle" fill="#2563EB" fontSize="12">
        Meditation = chewing, turning over, following threads wherever they lead
      </text>
      <text x="400" y="470" textAnchor="middle" fill="#1E40AF" fontSize="11" fontStyle="italic">
        Bible Freestyle is structured spontaneity — free but fruitful exploration
      </text>
    </svg>
  );
}

// Bible Freestyle Room Concept Infographic
export function BibleFreestyleConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#EFF6FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold">
        Freestyle Connection Types
      </text>

      {/* Connection Types */}
      <g transform="translate(50, 55)">
        {[
          { type: 'Word Link', icon: '📝', desc: 'Same word appears elsewhere', example: '"Light" → Gen 1:3 → John 1:4 → 1 John 1:5' },
          { type: 'Theme Link', icon: '🎭', desc: 'Same concept different words', example: '"Seed" → Promise → Abraham → Christ (Gal 3:16)' },
          { type: 'Character Link', icon: '👤', desc: 'Same person appears elsewhere', example: 'Moses → Exodus → Hebrews → Transfiguration' },
          { type: 'Type Link', icon: '🔄', desc: 'OT shadows NT reality', example: 'Tabernacle → Hebrews → Heaven\'s sanctuary' },
          { type: 'Emotion Link', icon: '❤️', desc: 'Same feeling/experience', example: 'David\'s fear → My fear → God\'s faithfulness' },
          { type: 'Number Link', icon: '🔢', desc: 'Significant numbers connect', example: '40 days: Noah, Moses, Elijah, Jesus' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 120})`}>
            <rect x="0" y="0" width="220" height="110" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fontSize="24">{item.icon}</text>
            <text x="110" y="50" textAnchor="middle" fill="#1E40AF" fontSize="12" fontWeight="bold">{item.type}</text>
            <text x="110" y="68" textAnchor="middle" fill="#2563EB" fontSize="9">{item.desc}</text>
            <text x="110" y="90" textAnchor="middle" fill="#3B82F6" fontSize="8" fontStyle="italic">{item.example}</text>
          </g>
        ))}
      </g>

      {/* Freestyle Rules */}
      <rect x="50" y="310" width="700" height="120" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="340" textAnchor="middle" fill="#92400E" fontSize="16" fontWeight="bold">
        Freestyle Guardrails
      </text>

      <g transform="translate(70, 355)">
        <text x="0" y="0" fill="#78350F" fontSize="11">✓ Follow connections that make sense contextually</text>
        <text x="0" y="18" fill="#78350F" fontSize="11">✓ Check cross-references to validate links</text>
        <text x="0" y="36" fill="#78350F" fontSize="11">✓ Let Scripture interpret Scripture — don't force meaning</text>
        <text x="350" y="0" fill="#78350F" fontSize="11">✗ Don't invent connections that aren't there</text>
        <text x="350" y="18" fill="#78350F" fontSize="11">✗ Don't ignore context for clever links</text>
        <text x="350" y="36" fill="#78350F" fontSize="11">✗ Don't chase rabbit trails endlessly</text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#3B82F6" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Freestyle Chain Document
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#BFDBFE" fontSize="13">
        Starting Verse → Connection Type → Linked Verses → Final Insight
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#BFDBFE" fontSize="11">
        Record chains for future teaching and personal reference
      </text>
    </svg>
  );
}

// Bible Freestyle Room Example
export function BibleFreestyleExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#EFF6FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold">
        Example: "Bread" Freestyle Chain
      </text>

      {/* Starting Point */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#3B82F6" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Starting Point: John 6:35
        </text>

        <text x="30" y="60" fill="#1E40AF" fontSize="12" fontStyle="italic">
          "I am the bread of life: he that cometh to me shall never hunger..."
        </text>
        <text x="30" y="77" fill="#2563EB" fontSize="10">
          <tspan fontWeight="bold">Word that jumps out:</tspan> "Bread" — why bread specifically?
        </text>
      </g>

      {/* Chain Links */}
      <g transform="translate(50, 145)">
        <rect x="0" y="0" width="700" height="280" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#A855F7" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Freestyle Chain: Following "Bread"
        </text>

        {[
          { num: '1', ref: 'Exodus 16:4', text: 'Manna from heaven', insight: 'God provides daily bread' },
          { num: '2', ref: 'Deuteronomy 8:3', text: '"Not by bread alone"', insight: 'Word of God sustains' },
          { num: '3', ref: 'Matthew 4:4', text: 'Jesus quotes Deut 8:3', insight: 'He IS the Word' },
          { num: '4', ref: 'John 6:32-33', text: 'True bread from heaven', insight: 'Manna pointed to Jesus' },
          { num: '5', ref: 'Matthew 26:26', text: '"This is my body"', insight: 'Communion = taking Him in' },
          { num: '6', ref: 'Revelation 2:17', text: 'Hidden manna', insight: 'Eternal sustenance promised' },
        ].map((link, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 75 + 45})`}>
            <rect x="0" y="0" width="220" height="65" rx="8" fill={i % 2 === 0 ? '#DBEAFE' : '#EDE9FE'} />
            <circle cx="20" cy="15" r="12" fill={i % 2 === 0 ? '#3B82F6' : '#A855F7'} />
            <text x="20" y="19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{link.num}</text>
            <text x="130" y="15" textAnchor="middle" fill="#1E3A5F" fontSize="10" fontWeight="bold">{link.ref}</text>
            <text x="110" y="33" textAnchor="middle" fill="#374151" fontSize="9">{link.text}</text>
            <text x="110" y="52" textAnchor="middle" fill="#6B21A8" fontSize="8" fontStyle="italic">→ {link.insight}</text>
          </g>
        ))}
      </g>

      {/* Final Insight */}
      <g transform="translate(50, 435)">
        <rect x="0" y="0" width="700" height="100" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#10B981" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Final Landing: The Bread Thread
        </text>

        <text x="30" y="55" fill="#065F46" fontSize="11">
          <tspan fontWeight="bold">Chain Synthesis:</tspan> Manna → Word → Jesus → Communion → Eternal Life
        </text>
        <text x="30" y="75" fill="#065F46" fontSize="11">
          <tspan fontWeight="bold">Insight:</tspan> Jesus is the fulfillment of every "bread" promise — He is daily provision,
        </text>
        <text x="30" y="92" fill="#047857" fontSize="11">
          spiritual sustenance, and eternal life. Taking communion = taking in the Word made flesh.
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="545" width="700" height="40" rx="8" fill="#3B82F6" />
      <text x="400" y="570" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
        One word ("bread") → 6 passages → 1 unified teaching = Bible Freestyle success
      </text>
    </svg>
  );
}

export default {
  BibleFreestyleFlowchart,
  BibleFreestyleConcept,
  BibleFreestyleExample
};
