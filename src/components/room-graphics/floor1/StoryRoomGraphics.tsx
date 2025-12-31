import React from 'react';

// Story Room Method Flowchart
export function StoryRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <filter id="sr-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" className="text-2xl font-bold" fill="#1E40AF">
        Story Room Method: Beat Mapping
      </text>

      {/* Step 1 */}
      <g filter="url(#sr-shadow)">
        <rect x="30" y="80" width="140" height="100" rx="12" fill="url(#sr-grad)" />
        <text x="100" y="115" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 1</text>
        <text x="100" y="140" textAnchor="middle" fill="white" fontSize="12">Read the</text>
        <text x="100" y="158" textAnchor="middle" fill="white" fontSize="12">Passage</text>
        <circle cx="100" cy="72" r="18" fill="#FCD34D" />
        <text x="100" y="77" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">📖</text>
      </g>

      {/* Arrow 1 */}
      <path d="M170 130 L200 130" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrowhead)" />
      <polygon points="200,125 210,130 200,135" fill="#3B82F6" />

      {/* Step 2 */}
      <g filter="url(#sr-shadow)">
        <rect x="210" y="80" width="140" height="100" rx="12" fill="url(#sr-grad)" />
        <text x="280" y="115" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 2</text>
        <text x="280" y="140" textAnchor="middle" fill="white" fontSize="12">Identify</text>
        <text x="280" y="158" textAnchor="middle" fill="white" fontSize="12">3-7 Beats</text>
        <circle cx="280" cy="72" r="18" fill="#FCD34D" />
        <text x="280" y="77" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">🎬</text>
      </g>

      {/* Arrow 2 */}
      <polygon points="350,125 360,130 350,135" fill="#3B82F6" />
      <path d="M350 130 L380 130" stroke="#3B82F6" strokeWidth="3" />

      {/* Step 3 */}
      <g filter="url(#sr-shadow)">
        <rect x="390" y="80" width="140" height="100" rx="12" fill="url(#sr-grad)" />
        <text x="460" y="115" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 3</text>
        <text x="460" y="140" textAnchor="middle" fill="white" fontSize="12">Name Each</text>
        <text x="460" y="158" textAnchor="middle" fill="white" fontSize="12">with Noun/Verb</text>
        <circle cx="460" cy="72" r="18" fill="#FCD34D" />
        <text x="460" y="77" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">✏️</text>
      </g>

      {/* Arrow 3 */}
      <polygon points="530,125 540,130 530,135" fill="#3B82F6" />
      <path d="M530 130 L560 130" stroke="#3B82F6" strokeWidth="3" />

      {/* Step 4 */}
      <g filter="url(#sr-shadow)">
        <rect x="570" y="80" width="140" height="100" rx="12" fill="url(#sr-grad)" />
        <text x="640" y="115" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 4</text>
        <text x="640" y="140" textAnchor="middle" fill="white" fontSize="12">Arrange with</text>
        <text x="640" y="158" textAnchor="middle" fill="white" fontSize="12">Arrows →</text>
        <circle cx="640" cy="72" r="18" fill="#FCD34D" />
        <text x="640" y="77" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">➡️</text>
      </g>

      {/* Curved arrow to step 5 */}
      <path d="M710 130 Q760 130 760 200 Q760 270 640 270" stroke="#3B82F6" strokeWidth="3" fill="none" />
      <polygon points="640,265 630,270 640,275" fill="#3B82F6" />

      {/* Step 5 */}
      <g filter="url(#sr-shadow)">
        <rect x="450" y="220" width="180" height="100" rx="12" fill="#16A34A" />
        <text x="540" y="255" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 5</text>
        <text x="540" y="280" textAnchor="middle" fill="white" fontSize="12">Test: Can you teach</text>
        <text x="540" y="298" textAnchor="middle" fill="white" fontSize="12">using only beats?</text>
        <circle cx="540" cy="212" r="18" fill="#FCD34D" />
        <text x="540" y="217" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">✓</text>
      </g>

      {/* Key Principles Box */}
      <rect x="30" y="350" width="740" height="130" rx="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
      <text x="50" y="380" fill="#1E40AF" fontWeight="bold" fontSize="16">🔑 Key Principles:</text>
      <text x="50" y="410" fill="#374151" fontSize="13">• Beats are like film shots—each freezes a distinct moment</text>
      <text x="50" y="435" fill="#374151" fontSize="13">• Use CONCRETE nouns (Altar, River) over abstractions (Crisis, Decision)</text>
      <text x="50" y="460" fill="#374151" fontSize="13">• Chronology is king—if you mix up order, you've failed</text>
      <text x="450" y="410" fill="#374151" fontSize="13">• Goal is MEMORABLE, not comprehensive</text>
      <text x="450" y="435" fill="#374151" fontSize="13">• 7+ beats = covering too much ground</text>
    </svg>
  );
}

// Story Room Concept Infographic
export function StoryRoomConcept() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="url(#sr-bg-grad)" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" className="text-2xl font-bold" fill="#1E40AF" fontSize="24" fontWeight="bold">
        What is a "Beat"?
      </text>

      {/* Beat Concept Circle */}
      <circle cx="150" cy="160" r="80" fill="#3B82F6" opacity="0.9" />
      <text x="150" y="145" textAnchor="middle" fill="white" fontWeight="bold" fontSize="18">BEAT</text>
      <text x="150" y="170" textAnchor="middle" fill="white" fontSize="12">= Major Plot</text>
      <text x="150" y="188" textAnchor="middle" fill="white" fontSize="12">Movement</text>

      {/* Film strip visualization */}
      <g transform="translate(280, 100)">
        <rect x="0" y="0" width="480" height="120" fill="#1F2937" rx="8" />
        {/* Sprocket holes top */}
        {[30, 110, 190, 270, 350, 430].map((x, i) => (
          <rect key={`top-${i}`} x={x} y="8" width="20" height="12" rx="2" fill="#374151" />
        ))}
        {/* Sprocket holes bottom */}
        {[30, 110, 190, 270, 350, 430].map((x, i) => (
          <rect key={`bot-${i}`} x={x} y="100" width="20" height="12" rx="2" fill="#374151" />
        ))}
        {/* Film frames */}
        {[20, 100, 180, 260, 340, 420].map((x, i) => (
          <g key={`frame-${i}`}>
            <rect x={x} y="25" width="60" height="70" fill="#FBBF24" rx="4" />
            <text x={x + 30} y="65" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="24">
              {['📖', '👔', '🕳️', '🐪', '🔒', '👑'][i]}
            </text>
          </g>
        ))}
        {/* Arrows between frames */}
        {[70, 150, 230, 310, 390].map((x, i) => (
          <text key={`arrow-${i}`} x={x + 10} y="65" fill="white" fontSize="20">→</text>
        ))}
      </g>

      {/* Labels below film strip */}
      <g transform="translate(300, 235)">
        {['Read', 'Coat', 'Pit', 'Caravan', 'Prison', 'Palace'].map((label, i) => (
          <text key={label} x={i * 80} y="0" textAnchor="middle" fill="#374151" fontSize="11" fontWeight="500">
            {label}
          </text>
        ))}
      </g>

      {/* Good vs Bad Examples */}
      <g transform="translate(50, 280)">
        <rect x="0" y="0" width="330" height="150" rx="12" fill="#D1FAE5" stroke="#16A34A" strokeWidth="2" />
        <text x="165" y="30" textAnchor="middle" fill="#166534" fontWeight="bold" fontSize="16">✅ Good Beat Names</text>
        <text x="20" y="60" fill="#166534" fontSize="13">• "Coat" — concrete, visual</text>
        <text x="20" y="85" fill="#166534" fontSize="13">• "Pit" — specific location</text>
        <text x="20" y="110" fill="#166534" fontSize="13">• "Waters Part" — action moment</text>
        <text x="20" y="135" fill="#166534" fontSize="13">• "Head Severed" — dramatic climax</text>
      </g>

      <g transform="translate(420, 280)">
        <rect x="0" y="0" width="330" height="150" rx="12" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
        <text x="165" y="30" textAnchor="middle" fill="#991B1B" fontWeight="bold" fontSize="16">❌ Bad Beat Names</text>
        <text x="20" y="60" fill="#991B1B" fontSize="13">• "Joseph's prideful dream" — too wordy</text>
        <text x="20" y="85" fill="#991B1B" fontSize="13">• "The crisis deepens" — abstract</text>
        <text x="20" y="110" fill="#991B1B" fontSize="13">• "God shows His grace" — interpretive</text>
        <text x="20" y="135" fill="#991B1B" fontSize="13">• Full sentences — defeats purpose</text>
      </g>
    </svg>
  );
}

// Story Room Example Illustration
export function StoryRoomExample() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sr-ex-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DBEAFE" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill="url(#sr-ex-grad)" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#1E40AF" fontSize="22" fontWeight="bold">
        Example: Genesis 37 (Joseph's Descent)
      </text>

      {/* Beat Timeline */}
      <line x1="60" y1="140" x2="740" y2="140" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />

      {/* Beat 1: Dream */}
      <g transform="translate(80, 80)">
        <circle cx="0" cy="60" r="35" fill="#3B82F6" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">💭</text>
        <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">DREAM</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 5-11</text>
      </g>

      {/* Arrow */}
      <text x="145" y="145" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>

      {/* Beat 2: Coat */}
      <g transform="translate(190, 80)">
        <circle cx="0" cy="60" r="35" fill="#3B82F6" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">👔</text>
        <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">COAT</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 3-4</text>
      </g>

      {/* Arrow */}
      <text x="255" y="145" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>

      {/* Beat 3: Pit */}
      <g transform="translate(300, 80)">
        <circle cx="0" cy="60" r="35" fill="#3B82F6" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">🕳️</text>
        <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">PIT</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 23-24</text>
      </g>

      {/* Arrow */}
      <text x="365" y="145" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>

      {/* Beat 4: Caravan */}
      <g transform="translate(410, 80)">
        <circle cx="0" cy="60" r="35" fill="#3B82F6" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">🐪</text>
        <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">CARAVAN</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 25-28</text>
      </g>

      {/* Arrow */}
      <text x="475" y="145" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>

      {/* Beat 5: Egypt */}
      <g transform="translate(520, 80)">
        <circle cx="0" cy="60" r="35" fill="#3B82F6" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">🏛️</text>
        <text x="0" y="120" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="14">EGYPT</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 36</text>
      </g>

      {/* Arrow */}
      <text x="585" y="145" fill="#3B82F6" fontSize="24" fontWeight="bold">→</text>

      {/* Beat 6: Potiphar */}
      <g transform="translate(630, 80)">
        <circle cx="0" cy="60" r="35" fill="#16A34A" />
        <text x="0" y="68" textAnchor="middle" fill="white" fontSize="28">🏠</text>
        <text x="0" y="120" textAnchor="middle" fill="#166534" fontWeight="bold" fontSize="14">POTIPHAR</text>
        <text x="0" y="140" textAnchor="middle" fill="#6B7280" fontSize="10">v. 36</text>
      </g>

      {/* Arc indicator */}
      <path d="M100 200 Q400 280 650 200" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8,4" />
      <text x="400" y="260" textAnchor="middle" fill="#B45309" fontSize="14" fontWeight="bold">
        The "Descent Arc" — From favorite son to slave
      </text>

      {/* Plot Summary Box */}
      <rect x="50" y="300" width="700" height="80" rx="12" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <text x="400" y="330" textAnchor="middle" fill="#1E40AF" fontWeight="bold" fontSize="16">
        📝 One-Line Plot Summary:
      </text>
      <text x="400" y="360" textAnchor="middle" fill="#374151" fontSize="14">
        "A favored son's dreams provoke brothers to violence, sending him from pit to slavery—
      </text>
      <text x="400" y="378" textAnchor="middle" fill="#374151" fontSize="14">
        but divine providence positions him for future exaltation."
      </text>

      {/* Deliverable Box */}
      <rect x="50" y="400" width="700" height="80" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="430" textAnchor="middle" fill="#92400E" fontWeight="bold" fontSize="16">
        🎯 Deliverable: Beat List + Plot Summary
      </text>
      <text x="400" y="455" textAnchor="middle" fill="#78350F" fontSize="14">
        Dream → Coat → Pit → Caravan → Egypt → Potiphar
      </text>
      <text x="400" y="475" textAnchor="middle" fill="#78350F" fontSize="12" fontStyle="italic">
        (6 beats capture the complete descent arc)
      </text>
    </svg>
  );
}

export default {
  StoryRoomFlowchart,
  StoryRoomConcept,
  StoryRoomExample
};
