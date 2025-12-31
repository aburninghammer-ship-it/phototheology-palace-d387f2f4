import React from 'react';

// Translation Room Method Flowchart
export function TranslationRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tr-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="#FDF2F8" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#9D174D" fontSize="24" fontWeight="bold">
        Translation Room: Words → Pictures
      </text>

      {/* Three Levels */}
      <rect x="50" y="70" width="700" height="150" rx="12" fill="white" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="100" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
        Three Translation Levels
      </text>

      {/* Level 1: Verse → Icon */}
      <g transform="translate(70, 115)">
        <rect x="0" y="0" width="200" height="85" rx="10" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="13" fontWeight="bold">Level 1: Verse → Icon</text>
        <text x="100" y="50" textAnchor="middle" fill="#BE185D" fontSize="11">Single verse becomes</text>
        <text x="100" y="68" textAnchor="middle" fill="#BE185D" fontSize="11">one symbolic image</text>
      </g>

      {/* Level 2: Passage → Comic */}
      <g transform="translate(300, 115)">
        <rect x="0" y="0" width="200" height="85" rx="10" fill="#FBCFE8" stroke="#EC4899" strokeWidth="2" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="13" fontWeight="bold">Level 2: Passage → Comic</text>
        <text x="100" y="50" textAnchor="middle" fill="#BE185D" fontSize="11">Pericope becomes</text>
        <text x="100" y="68" textAnchor="middle" fill="#BE185D" fontSize="11">3-panel comic strip</text>
      </g>

      {/* Level 3: Book → Mural */}
      <g transform="translate(530, 115)">
        <rect x="0" y="0" width="200" height="85" rx="10" fill="#F9A8D4" stroke="#EC4899" strokeWidth="2" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="13" fontWeight="bold">Level 3: Book → Mural</text>
        <text x="100" y="50" textAnchor="middle" fill="#BE185D" fontSize="11">Entire book becomes</text>
        <text x="100" y="68" textAnchor="middle" fill="#BE185D" fontSize="11">panoramic scene</text>
      </g>

      {/* Method Steps */}
      <g transform="translate(50, 240)">
        {[
          { step: 1, icon: '🔍', title: 'Find', desc: 'Central visual element' },
          { step: 2, icon: '📐', title: 'Choose', desc: 'Level (Icon/Comic/Mural)' },
          { step: 3, icon: '✏️', title: 'Sketch', desc: 'Concrete objects' },
          { step: 4, icon: '✓', title: 'Test', desc: 'Does it capture essence?' },
        ].map((item, i) => (
          <g key={i}>
            <rect x={i * 175} y="0" width="165" height="80" rx="10" fill="url(#tr-grad)" />
            <text x={i * 175 + 82} y="28" textAnchor="middle" fill="white" fontSize="18">{item.icon}</text>
            <text x={i * 175 + 82} y="50" textAnchor="middle" fill="white" fontWeight="bold" fontSize="12">{item.title}</text>
            <text x={i * 175 + 82} y="68" textAnchor="middle" fill="#FCE7F3" fontSize="10">{item.desc}</text>
            {i < 3 && <polygon points={`${i * 175 + 170},40 ${i * 175 + 180},40 ${i * 175 + 180},35 ${i * 175 + 190},45 ${i * 175 + 180},55 ${i * 175 + 180},50 ${i * 175 + 170},50`} fill="#EC4899" />}
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="340" width="700" height="90" rx="12" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="375" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
        🔑 Key Principle: Images stick 6x better than words
      </text>
      <text x="400" y="405" textAnchor="middle" fill="#BE185D" fontSize="13">
        The brain processes visuals 60,000x faster than text. Visual translations create neural shortcuts.
      </text>
    </svg>
  );
}

// Translation Room Concept Infographic
export function TranslationRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#FDF2F8" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold">
        Visual Translation: Abstract → Concrete
      </text>

      {/* Before/After comparison */}
      <g transform="translate(50, 60)">
        {/* Abstract (Before) */}
        <rect x="0" y="0" width="320" height="180" rx="12" fill="white" stroke="#D1D5DB" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#6B7280" fontSize="14" fontWeight="bold">❌ Abstract Text</text>
        <rect x="20" y="50" width="280" height="110" rx="8" fill="#F3F4F6" />
        <text x="160" y="80" textAnchor="middle" fill="#374151" fontSize="12">"Your word is a lamp to my feet</text>
        <text x="160" y="100" textAnchor="middle" fill="#374151" fontSize="12">and a light to my path."</text>
        <text x="160" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="11">— Psalm 119:105</text>
        <text x="160" y="150" textAnchor="middle" fill="#6B7280" fontSize="10" fontStyle="italic">Words only</text>
      </g>

      <g transform="translate(430, 60)">
        {/* Concrete (After) */}
        <rect x="0" y="0" width="320" height="180" rx="12" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
        <text x="160" y="30" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">✅ Visual Translation</text>
        <rect x="20" y="50" width="280" height="110" rx="8" fill="#1F2937" />
        {/* Dark path with glowing scroll */}
        <rect x="30" y="130" width="260" height="20" fill="#374151" />
        <ellipse cx="160" cy="100" rx="30" ry="40" fill="#FCD34D" opacity="0.4" />
        <rect x="145" y="85" width="30" height="40" fill="#FEF3C7" rx="3" />
        <text x="160" y="112" textAnchor="middle" fill="#92400E" fontSize="8">📜</text>
        <text x="160" y="150" textAnchor="middle" fill="#F9A8D4" fontSize="10">Glowing scroll on dark path</text>
      </g>

      {/* The three levels explained */}
      <rect x="50" y="260" width="700" height="220" rx="12" fill="white" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="290" textAnchor="middle" fill="#9D174D" fontSize="16" fontWeight="bold">
        Three Scales of Visual Translation
      </text>

      {/* Level 1 */}
      <g transform="translate(70, 310)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="#FCE7F3" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">VERSE → ICON</text>
        <rect x="20" y="40" width="160" height="70" fill="white" rx="6" stroke="#EC4899" />
        <text x="100" y="80" textAnchor="middle" fontSize="36">🕯️</text>
        <text x="100" y="130" textAnchor="middle" fill="#BE185D" fontSize="10">Ps 119:105 = Glowing lamp</text>
      </g>

      {/* Level 2 */}
      <g transform="translate(300, 310)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="#FBCFE8" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">PASSAGE → COMIC</text>
        <g transform="translate(15, 40)">
          <rect x="0" y="0" width="55" height="70" fill="white" rx="4" stroke="#EC4899" />
          <text x="27" y="45" textAnchor="middle" fontSize="20">🚶</text>
          <rect x="58" y="0" width="55" height="70" fill="white" rx="4" stroke="#EC4899" />
          <text x="85" y="45" textAnchor="middle" fontSize="20">🐷</text>
          <rect x="116" y="0" width="55" height="70" fill="white" rx="4" stroke="#EC4899" />
          <text x="143" y="45" textAnchor="middle" fontSize="20">🫂</text>
        </g>
        <text x="100" y="130" textAnchor="middle" fill="#BE185D" fontSize="10">Luke 15: Leave→Pigs→Embrace</text>
      </g>

      {/* Level 3 */}
      <g transform="translate(530, 310)">
        <rect x="0" y="0" width="200" height="150" rx="10" fill="#F9A8D4" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="12" fontWeight="bold">BOOK → MURAL</text>
        <rect x="15" y="40" width="170" height="70" fill="white" rx="6" stroke="#EC4899" />
        <text x="40" y="80" textAnchor="middle" fontSize="18">⛓️</text>
        <text x="90" y="80" textAnchor="middle" fontSize="18">🌊</text>
        <text x="140" y="80" textAnchor="middle" fontSize="18">⛺</text>
        <text x="100" y="130" textAnchor="middle" fill="#BE185D" fontSize="10">Exodus: Slavery→Sea→Sinai</text>
      </g>
    </svg>
  );
}

// Translation Room Example
export function TranslationRoomExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#FDF2F8" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#9D174D" fontSize="22" fontWeight="bold">
        Example: Prodigal Son (Luke 15) as 3-Panel Comic
      </text>

      {/* Comic Strip */}
      <rect x="50" y="55" width="700" height="250" fill="#1F2937" rx="12" />

      {/* Panel 1 */}
      <g transform="translate(70, 75)">
        <rect x="0" y="0" width="200" height="210" fill="white" rx="8" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">Panel 1: DEPARTURE</text>
        <rect x="15" y="35" width="170" height="130" fill="#DBEAFE" rx="6" />
        {/* House and son walking away */}
        <text x="50" y="100" fontSize="40">🏠</text>
        <text x="120" y="100" fontSize="30">🚶‍♂️</text>
        <text x="145" y="90" fontSize="20">💰</text>
        <path d="M100 120 L160 120" stroke="#374151" strokeWidth="2" strokeDasharray="5,3" />
        <text x="100" y="190" textAnchor="middle" fill="#1E40AF" fontSize="11">"Give me my share..."</text>
        <text x="100" y="205" textAnchor="middle" fill="#6B7280" fontSize="10">v. 12-13</text>
      </g>

      {/* Panel 2 */}
      <g transform="translate(300, 75)">
        <rect x="0" y="0" width="200" height="210" fill="white" rx="8" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">Panel 2: DISGRACE</text>
        <rect x="15" y="35" width="170" height="130" fill="#FEF3C7" rx="6" />
        {/* Pigpen scene */}
        <text x="60" y="100" fontSize="25">🐷</text>
        <text x="100" y="100" fontSize="35">😢</text>
        <text x="140" y="100" fontSize="25">🐷</text>
        <rect x="40" y="115" width="120" height="10" fill="#92400E" rx="2" />
        <text x="100" y="190" textAnchor="middle" fill="#92400E" fontSize="11">"He longed to fill his stomach"</text>
        <text x="100" y="205" textAnchor="middle" fill="#6B7280" fontSize="10">v. 14-16</text>
      </g>

      {/* Panel 3 */}
      <g transform="translate(530, 75)">
        <rect x="0" y="0" width="200" height="210" fill="white" rx="8" />
        <text x="100" y="25" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">Panel 3: EMBRACE</text>
        <rect x="15" y="35" width="170" height="130" fill="#D1FAE5" rx="6" />
        {/* Father running */}
        <text x="60" y="100" fontSize="40">👨</text>
        <text x="110" y="115" fontSize="30">🏃</text>
        <text x="145" y="100" fontSize="35">🫂</text>
        <text x="100" y="190" textAnchor="middle" fill="#166534" fontSize="11">"Father ran and embraced him"</text>
        <text x="100" y="205" textAnchor="middle" fill="#6B7280" fontSize="10">v. 20</text>
      </g>

      {/* Analysis */}
      <rect x="50" y="320" width="700" height="100" rx="12" fill="white" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="350" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
        🎨 Visual Elements That Stick
      </text>
      <g transform="translate(70, 365)">
        <text x="0" y="15" fill="#BE185D" fontSize="12">• Money bag = greed/inheritance</text>
        <text x="0" y="35" fill="#BE185D" fontSize="12">• Pigs = Jewish rock-bottom</text>
        <text x="300" y="15" fill="#BE185D" fontSize="12">• Father RUNNING = undignified love</text>
        <text x="300" y="35" fill="#BE185D" fontSize="12">• Embrace = reconciliation</text>
      </g>

      {/* Deliverable */}
      <rect x="50" y="435" width="700" height="100" rx="12" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2" />
      <text x="400" y="465" textAnchor="middle" fill="#9D174D" fontSize="14" fontWeight="bold">
        📋 Deliverable: Sketch OR Description
      </text>
      <text x="400" y="490" textAnchor="middle" fill="#BE185D" fontSize="12">
        You don't need to be an artist! Stick figures work perfectly.
      </text>
      <text x="400" y="515" textAnchor="middle" fill="#BE185D" fontSize="12">
        The goal is MEMORABLE visual translation, not artistic beauty.
      </text>
    </svg>
  );
}

export default {
  TranslationRoomFlowchart,
  TranslationRoomConcept,
  TranslationRoomExample
};
