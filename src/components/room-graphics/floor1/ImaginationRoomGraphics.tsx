import React from 'react';

// Imagination Room Method Flowchart
export function ImaginationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <filter id="ir-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="#FAF5FF" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#6D28D9" fontSize="24" fontWeight="bold">
        Imagination Room: Immersive Experience Method
      </text>

      {/* Central Scene Circle */}
      <circle cx="400" cy="200" r="100" fill="url(#ir-grad)" filter="url(#ir-glow)" />
      <text x="400" y="190" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">STEP INTO</text>
      <text x="400" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">THE SCENE</text>
      <text x="400" y="240" textAnchor="middle" fill="#E9D5FF" fontSize="12">Close your eyes</text>

      {/* 5 Senses radiating out */}
      {/* Sight - Top */}
      <g transform="translate(400, 50)">
        <circle cx="0" cy="0" r="35" fill="#F59E0B" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24">👀</text>
        <text x="0" y="55" textAnchor="middle" fill="#92400E" fontSize="12" fontWeight="bold">SEE</text>
        <text x="0" y="70" textAnchor="middle" fill="#78350F" fontSize="10">What colors, shapes?</text>
      </g>
      <line x1="400" y1="100" x2="400" y2="85" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,2" />

      {/* Sound - Right */}
      <g transform="translate(550, 200)">
        <circle cx="0" cy="0" r="35" fill="#3B82F6" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24">👂</text>
        <text x="55" y="5" textAnchor="start" fill="#1E40AF" fontSize="12" fontWeight="bold">HEAR</text>
        <text x="55" y="20" textAnchor="start" fill="#1D4ED8" fontSize="10">Crowds? Wind?</text>
      </g>
      <line x1="500" y1="200" x2="515" y2="200" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4,2" />

      {/* Touch - Bottom Right */}
      <g transform="translate(490, 320)">
        <circle cx="0" cy="0" r="35" fill="#10B981" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24">🤲</text>
        <text x="0" y="55" textAnchor="middle" fill="#065F46" fontSize="12" fontWeight="bold">TOUCH</text>
        <text x="0" y="70" textAnchor="middle" fill="#047857" fontSize="10">Rough? Smooth?</text>
      </g>
      <line x1="450" y1="280" x2="465" y2="295" stroke="#10B981" strokeWidth="2" strokeDasharray="4,2" />

      {/* Smell - Bottom Left */}
      <g transform="translate(310, 320)">
        <circle cx="0" cy="0" r="35" fill="#EC4899" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24">👃</text>
        <text x="0" y="55" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">SMELL</text>
        <text x="0" y="70" textAnchor="middle" fill="#BE185D" fontSize="10">Incense? Earth?</text>
      </g>
      <line x1="350" y1="280" x2="335" y2="295" stroke="#EC4899" strokeWidth="2" strokeDasharray="4,2" />

      {/* Taste - Left */}
      <g transform="translate(250, 200)">
        <circle cx="0" cy="0" r="35" fill="#EF4444" />
        <text x="0" y="8" textAnchor="middle" fill="white" fontSize="24">👅</text>
        <text x="-55" y="5" textAnchor="end" fill="#991B1B" fontSize="12" fontWeight="bold">TASTE</text>
        <text x="-55" y="20" textAnchor="end" fill="#B91C1C" fontSize="10">Salt? Bread?</text>
      </g>
      <line x1="300" y1="200" x2="285" y2="200" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2" />

      {/* Output Section */}
      <rect x="50" y="380" width="700" height="50" rx="10" fill="#E9D5FF" stroke="#8B5CF6" strokeWidth="2" />
      <text x="400" y="412" textAnchor="middle" fill="#6D28D9" fontSize="14" fontWeight="bold">
        📝 Output: Sensory paragraph + One sentence of personal resonance
      </text>
    </svg>
  );
}

// Imagination Room Concept Infographic
export function ImaginationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-scene" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="#FAF5FF" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#6D28D9" fontSize="22" fontWeight="bold">
        From Information to Experience
      </text>

      {/* Left: Plain Text */}
      <g transform="translate(50, 70)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="white" stroke="#D1D5DB" strokeWidth="2" />
        <text x="150" y="30" textAnchor="middle" fill="#6B7280" fontSize="16" fontWeight="bold">❌ Information Only</text>
        <text x="20" y="65" fill="#374151" fontSize="12">"Jesus calmed the storm.</text>
        <text x="20" y="85" fill="#374151" fontSize="12">The disciples were afraid.</text>
        <text x="20" y="105" fill="#374151" fontSize="12">Jesus rebuked the wind.</text>
        <text x="20" y="125" fill="#374151" fontSize="12">There was a great calm."</text>
        <text x="150" y="160" textAnchor="middle" fill="#9CA3AF" fontSize="11" fontStyle="italic">Facts without feeling</text>
      </g>

      {/* Arrow */}
      <text x="400" y="160" textAnchor="middle" fill="#8B5CF6" fontSize="36">⟹</text>

      {/* Right: Immersive Experience */}
      <g transform="translate(450, 70)">
        <rect x="0" y="0" width="300" height="180" rx="12" fill="url(#ir-scene)" />
        <text x="150" y="30" textAnchor="middle" fill="#E9D5FF" fontSize="16" fontWeight="bold">✅ Lived Experience</text>
        <text x="20" y="60" fill="#C4B5FD" fontSize="11">👀 Black waves rising like walls</text>
        <text x="20" y="80" fill="#C4B5FD" fontSize="11">👂 Thunder cracking, disciples screaming</text>
        <text x="20" y="100" fill="#C4B5FD" fontSize="11">🤲 Splintering wood, cold spray</text>
        <text x="20" y="120" fill="#C4B5FD" fontSize="11">👃 Salt and fear in the air</text>
        <text x="20" y="140" fill="#C4B5FD" fontSize="11">👅 Copper taste of panic</text>
        <text x="150" y="168" textAnchor="middle" fill="#A78BFA" fontSize="11" fontStyle="italic">You were THERE</text>
      </g>

      {/* Why It Works Section */}
      <rect x="50" y="270" width="700" height="100" rx="12" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="2" />
      <text x="400" y="300" textAnchor="middle" fill="#6D28D9" fontSize="16" fontWeight="bold">
        🧠 Why This Works: Episodic Memory
      </text>
      <text x="400" y="330" textAnchor="middle" fill="#4C1D95" fontSize="13">
        Experiences are remembered 6x better than facts. When you FEEL the story,
      </text>
      <text x="400" y="350" textAnchor="middle" fill="#4C1D95" fontSize="13">
        it moves from short-term to long-term memory. Your emotions become anchors.
      </text>

      {/* Pitfalls */}
      <rect x="50" y="390" width="340" height="90" rx="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
      <text x="220" y="420" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">⚠️ Pitfalls to Avoid</text>
      <text x="70" y="445" fill="#B91C1C" fontSize="11">• Adding details Scripture doesn't give</text>
      <text x="70" y="465" fill="#B91C1C" fontSize="11">• Making it about YOUR creativity, not the text</text>

      {/* Personal Resonance */}
      <rect x="410" y="390" width="340" height="90" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
      <text x="580" y="420" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">🔗 Personal Resonance</text>
      <text x="430" y="445" fill="#047857" fontSize="11">Ask: "When have I felt like this?"</text>
      <text x="430" y="465" fill="#047857" fontSize="11">Connect the scene to YOUR story</text>
    </svg>
  );
}

// Imagination Room Example
export function ImaginationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ir-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="ir-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#312E81" />
        </linearGradient>
      </defs>

      {/* Scene Background */}
      <rect width="800" height="250" fill="url(#ir-sky)" rx="16 16 0 0" />
      <rect y="250" width="800" height="300" fill="#FAF5FF" rx="0 0 16 16" />

      {/* Scene Title */}
      <text x="400" y="35" textAnchor="middle" fill="#E9D5FF" fontSize="20" fontWeight="bold">
        Example: Red Sea Crossing (Exodus 14)
      </text>

      {/* Water Walls */}
      <path d="M50 240 Q100 100 150 240" fill="url(#ir-water)" opacity="0.8" />
      <path d="M650 240 Q700 100 750 240" fill="url(#ir-water)" opacity="0.8" />

      {/* Dry Path */}
      <rect x="200" y="180" width="400" height="60" fill="#C2B280" rx="4" />

      {/* People crossing */}
      <text x="300" y="220" fontSize="20">🚶</text>
      <text x="350" y="215" fontSize="18">🚶</text>
      <text x="400" y="220" fontSize="20">🚶</text>
      <text x="450" y="215" fontSize="18">🚶</text>
      <text x="500" y="220" fontSize="20">🚶</text>

      {/* Sensory Details Panel */}
      <rect x="40" y="270" width="720" height="260" rx="12" fill="white" stroke="#8B5CF6" strokeWidth="2" />

      {/* Section Title */}
      <text x="400" y="300" textAnchor="middle" fill="#6D28D9" fontSize="16" fontWeight="bold">
        🎭 Sensory Immersion
      </text>

      {/* 5 Senses Grid */}
      <g transform="translate(60, 320)">
        {/* Sight */}
        <rect x="0" y="0" width="130" height="80" rx="8" fill="#FEF3C7" />
        <text x="65" y="25" textAnchor="middle" fill="#92400E" fontSize="20">👀</text>
        <text x="65" y="48" textAnchor="middle" fill="#78350F" fontSize="10" fontWeight="bold">SIGHT</text>
        <text x="65" y="62" textAnchor="middle" fill="#78350F" fontSize="9">Towering walls of water</text>
        <text x="65" y="74" textAnchor="middle" fill="#78350F" fontSize="9">Fish suspended in blue</text>

        {/* Sound */}
        <rect x="145" y="0" width="130" height="80" rx="8" fill="#DBEAFE" />
        <text x="210" y="25" textAnchor="middle" fill="#1E40AF" fontSize="20">👂</text>
        <text x="210" y="48" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold">SOUND</text>
        <text x="210" y="62" textAnchor="middle" fill="#1D4ED8" fontSize="9">Roar of held-back water</text>
        <text x="210" y="74" textAnchor="middle" fill="#1D4ED8" fontSize="9">Children crying, oxen lowing</text>

        {/* Touch */}
        <rect x="290" y="0" width="130" height="80" rx="8" fill="#D1FAE5" />
        <text x="355" y="25" textAnchor="middle" fill="#065F46" fontSize="20">🤲</text>
        <text x="355" y="48" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">TOUCH</text>
        <text x="355" y="62" textAnchor="middle" fill="#047857" fontSize="9">Cold mist on face</text>
        <text x="355" y="74" textAnchor="middle" fill="#047857" fontSize="9">Sand under bare feet</text>

        {/* Smell */}
        <rect x="435" y="0" width="130" height="80" rx="8" fill="#FCE7F3" />
        <text x="500" y="25" textAnchor="middle" fill="#9D174D" fontSize="20">👃</text>
        <text x="500" y="48" textAnchor="middle" fill="#BE185D" fontSize="10" fontWeight="bold">SMELL</text>
        <text x="500" y="62" textAnchor="middle" fill="#BE185D" fontSize="9">Salt and seaweed</text>
        <text x="500" y="74" textAnchor="middle" fill="#BE185D" fontSize="9">Fear-sweat in the crowd</text>

        {/* Taste */}
        <rect x="580" y="0" width="130" height="80" rx="8" fill="#FEE2E2" />
        <text x="645" y="25" textAnchor="middle" fill="#991B1B" fontSize="20">👅</text>
        <text x="645" y="48" textAnchor="middle" fill="#B91C1C" fontSize="10" fontWeight="bold">TASTE</text>
        <text x="645" y="62" textAnchor="middle" fill="#B91C1C" fontSize="9">Salt spray on lips</text>
        <text x="645" y="74" textAnchor="middle" fill="#B91C1C" fontSize="9">Metallic taste of terror</text>
      </g>

      {/* Personal Resonance */}
      <rect x="60" y="420" width="680" height="90" rx="10" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
      <text x="400" y="448" textAnchor="middle" fill="#6D28D9" fontSize="14" fontWeight="bold">
        🔗 Personal Resonance:
      </text>
      <text x="400" y="475" textAnchor="middle" fill="#4C1D95" fontSize="12" fontStyle="italic">
        "I felt like this when I left my old life behind—terrified of the unknown ahead,
      </text>
      <text x="400" y="495" textAnchor="middle" fill="#4C1D95" fontSize="12" fontStyle="italic">
        but walls of chaos were being held back by invisible hands. God made a way."
      </text>
    </svg>
  );
}

export default {
  ImaginationRoomFlowchart,
  ImaginationRoomConcept,
  ImaginationRoomExample
};
