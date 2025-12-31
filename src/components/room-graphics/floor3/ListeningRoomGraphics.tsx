import React from 'react';

// Listening Room Method Flowchart
export function ListeningRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="#EEF2FF" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#3730A3" fontSize="24" fontWeight="bold">
        Listening Room: Hearing God's Voice
      </text>

      {/* Listening Flow */}
      <g transform="translate(50, 70)">
        {/* Silence */}
        <circle cx="120" cy="100" r="80" fill="url(#lr-grad)" />
        <text x="120" y="85" textAnchor="middle" fill="white" fontSize="36">🤫</text>
        <text x="120" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SILENCE</text>
        <text x="120" y="135" textAnchor="middle" fill="#C7D2FE" fontSize="11">Still the noise</text>

        {/* Arrow */}
        <path d="M210 100 L290 100" stroke="#6366F1" strokeWidth="4" fill="none" markerEnd="url(#arrow-lr)" />
        <defs>
          <marker id="arrow-lr" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#6366F1" />
          </marker>
        </defs>

        {/* Scripture */}
        <circle cx="380" cy="100" r="80" fill="#3B82F6" />
        <text x="380" y="85" textAnchor="middle" fill="white" fontSize="36">📖</text>
        <text x="380" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SCRIPTURE</text>
        <text x="380" y="135" textAnchor="middle" fill="#BFDBFE" fontSize="11">Read slowly</text>

        {/* Arrow */}
        <path d="M470 100 L550 100" stroke="#6366F1" strokeWidth="4" fill="none" markerEnd="url(#arrow-lr)" />

        {/* Hear */}
        <circle cx="640" cy="100" r="80" fill="#10B981" />
        <text x="640" y="85" textAnchor="middle" fill="white" fontSize="36">👂</text>
        <text x="640" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">HEAR</text>
        <text x="640" y="135" textAnchor="middle" fill="#A7F3D0" fontSize="11">God speaks</text>
      </g>

      {/* Method Steps */}
      <rect x="50" y="220" width="700" height="130" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="250" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
        The Listening Room Method (Lectio Divina Style)
      </text>

      <g transform="translate(70, 270)">
        {[
          { step: '1', text: 'Lectio: Read the passage slowly, aloud if possible', icon: '📜' },
          { step: '2', text: 'Meditatio: What word or phrase stands out?', icon: '💭' },
          { step: '3', text: 'Oratio: Respond in prayer to what you heard', icon: '🙏' },
          { step: '4', text: 'Contemplatio: Rest in God\'s presence silently', icon: '✨' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <circle cx="20" cy="25" r="20" fill="#6366F1" />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="20" y="55" textAnchor="middle" fontSize="18">{item.icon}</text>
            <text x="20" y="75" textAnchor="middle" fill="#3730A3" fontSize="9">{item.text}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="370" width="700" height="110" rx="12" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
        The Elijah Principle
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#4338CA" fontSize="13">
        "The LORD was not in the wind... not in the earthquake... not in the fire...
      </text>
      <text x="400" y="445" textAnchor="middle" fill="#4338CA" fontSize="13">
        but in the still small voice" (1 Kings 19:11-12)
      </text>
      <text x="400" y="470" textAnchor="middle" fill="#3730A3" fontSize="11" fontStyle="italic">
        God's voice requires quietness to hear. Slow down. Stop talking. Listen.
      </text>
    </svg>
  );
}

// Listening Room Concept Infographic
export function ListeningRoomConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#EEF2FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold">
        How God Speaks
      </text>

      {/* Ways God Speaks */}
      <g transform="translate(50, 55)">
        {[
          { way: 'Scripture', icon: '📖', desc: 'The written Word — primary and foundational', key: 'Tests all others' },
          { way: 'Holy Spirit', icon: '🕊️', desc: 'Illumination, conviction, guidance', key: 'Never contradicts Word' },
          { way: 'Conscience', icon: '❤️', desc: 'Inner moral compass trained by Word', key: 'Must be calibrated' },
          { way: 'Counsel', icon: '👥', desc: 'Wisdom from mature believers', key: 'Confirms, doesn\'t replace' },
          { way: 'Circumstances', icon: '🚪', desc: 'Doors open/close providentially', key: 'Interpreted carefully' },
          { way: 'Creation', icon: '🌿', desc: 'General revelation of God\'s nature', key: 'Points to Creator' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 120})`}>
            <rect x="0" y="0" width="220" height="110" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
            <text x="110" y="30" textAnchor="middle" fontSize="24">{item.icon}</text>
            <text x="110" y="50" textAnchor="middle" fill="#3730A3" fontSize="12" fontWeight="bold">{item.way}</text>
            <text x="110" y="70" textAnchor="middle" fill="#4338CA" fontSize="9">{item.desc}</text>
            <text x="110" y="95" textAnchor="middle" fill="#6366F1" fontSize="8" fontStyle="italic">Key: {item.key}</text>
          </g>
        ))}
      </g>

      {/* Listening Postures */}
      <rect x="50" y="310" width="700" height="120" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
      <text x="400" y="340" textAnchor="middle" fill="#3730A3" fontSize="16" fontWeight="bold">
        Listening Postures
      </text>

      <g transform="translate(70, 360)">
        {[
          { posture: 'Expectant', icon: '👀', desc: 'Believing God will speak' },
          { posture: 'Humble', icon: '🙇', desc: 'Ready to obey what I hear' },
          { posture: 'Patient', icon: '⏳', desc: 'Willing to wait for clarity' },
          { posture: 'Attentive', icon: '👂', desc: 'Focused, not distracted' },
          { posture: 'Tested', icon: '⚖️', desc: 'Checking against Scripture' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 130}, 0)`}>
            <rect x="0" y="0" width="120" height="55" rx="8" fill="#E0E7FF" />
            <text x="60" y="20" textAnchor="middle" fontSize="18">{item.icon}</text>
            <text x="60" y="35" textAnchor="middle" fill="#3730A3" fontSize="10" fontWeight="bold">{item.posture}</text>
            <text x="60" y="48" textAnchor="middle" fill="#4338CA" fontSize="8">{item.desc}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#6366F1" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Listening Journal
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#C7D2FE" fontSize="13">
        Date + Passage + What Stood Out + What I Sensed God Saying + My Response
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        Track God's voice over time — see patterns of His guidance
      </text>
    </svg>
  );
}

// Listening Room Example
export function ListeningRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#EEF2FF" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#3730A3" fontSize="22" fontWeight="bold">
        Example: Listening to Psalm 23
      </text>

      {/* Setting */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="70" rx="12" fill="white" stroke="#6366F1" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#6366F1" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Setting the Stage
        </text>

        <text x="30" y="55" fill="#3730A3" fontSize="11">
          <tspan fontWeight="bold">Time:</tspan> Early morning, quiet space. <tspan fontWeight="bold">Passage:</tspan> Psalm 23. <tspan fontWeight="bold">Goal:</tspan> Not information — communion.
        </text>
      </g>

      {/* Lectio */}
      <g transform="translate(50, 135)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="100" height="80" rx="12 0 0 12" fill="#3B82F6" />
        <text x="50" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">LECTIO</text>
        <text x="50" y="55" textAnchor="middle" fill="#BFDBFE" fontSize="9">Read</text>

        <text x="120" y="35" fill="#1E40AF" fontSize="11" fontStyle="italic">
          "The LORD is my shepherd; I shall not want. He maketh me to lie down
        </text>
        <text x="120" y="55" fill="#1E40AF" fontSize="11" fontStyle="italic">
          in green pastures: he leadeth me beside the still waters..."
        </text>
        <text x="120" y="75" fill="#1D4ED8" fontSize="10">
          (Read slowly, perhaps 3 times. Let it sink in.)
        </text>
      </g>

      {/* Meditatio */}
      <g transform="translate(50, 225)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <rect x="0" y="0" width="100" height="80" rx="12 0 0 12" fill="#F59E0B" />
        <text x="50" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">MEDITATIO</text>
        <text x="50" y="55" textAnchor="middle" fill="#FEF3C7" fontSize="9">Reflect</text>

        <text x="120" y="30" fill="#92400E" fontSize="11" fontWeight="bold">What stands out: "He maketh me to lie down"</text>
        <text x="120" y="50" fill="#78350F" fontSize="10">
          The word "maketh" — sometimes God has to make me rest. I don't do it willingly.
        </text>
        <text x="120" y="70" fill="#78350F" fontSize="10">
          Why am I so resistant to rest? Is there something I'm avoiding in stillness?
        </text>
      </g>

      {/* Oratio */}
      <g transform="translate(50, 315)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
        <rect x="0" y="0" width="100" height="80" rx="12 0 0 12" fill="#EC4899" />
        <text x="50" y="35" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">ORATIO</text>
        <text x="50" y="55" textAnchor="middle" fill="#FBCFE8" fontSize="9">Respond</text>

        <text x="120" y="30" fill="#9D174D" fontSize="11" fontWeight="bold">Prayer response:</text>
        <text x="120" y="50" fill="#BE185D" fontSize="10" fontStyle="italic">
          "Lord, I confess I've been running from rest. I'm afraid of what I'll feel in the quiet.
        </text>
        <text x="120" y="70" fill="#BE185D" fontSize="10" fontStyle="italic">
          Help me trust You enough to lie down. Make me rest if I won't choose it."
        </text>
      </g>

      {/* Contemplatio */}
      <g transform="translate(50, 405)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
        <rect x="0" y="0" width="120" height="80" rx="12 0 0 12" fill="#10B981" />
        <text x="60" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CONTEMPLATIO</text>
        <text x="60" y="50" textAnchor="middle" fill="#A7F3D0" fontSize="9">Rest</text>

        <text x="140" y="30" fill="#065F46" fontSize="11" fontWeight="bold">Resting in God's presence:</text>
        <text x="140" y="50" fill="#047857" fontSize="10">
          5-10 minutes of silence. Not analyzing. Not asking. Just being with the Shepherd.
        </text>
        <text x="140" y="70" fill="#047857" fontSize="10">
          Visualize the green pasture. Feel His presence. Let the truth settle: "He is with me."
        </text>
      </g>

      {/* Journal Entry */}
      <rect x="50" y="495" width="700" height="90" rx="12" fill="#6366F1" />
      <text x="400" y="520" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        Sample Journal Entry
      </text>
      <text x="400" y="545" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        "Today God highlighted my resistance to rest. He's been 'making' me slow down through
      </text>
      <text x="400" y="565" textAnchor="middle" fill="#C7D2FE" fontSize="11">
        circumstances I've resented. I'm choosing to see His love in the forced stillness."
      </text>
    </svg>
  );
}

export default {
  ListeningRoomFlowchart,
  ListeningRoomConcept,
  ListeningRoomExample
};
