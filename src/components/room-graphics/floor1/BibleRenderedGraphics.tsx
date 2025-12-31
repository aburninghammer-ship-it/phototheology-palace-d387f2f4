import React from 'react';

// Bible Rendered Method Flowchart
export function BibleRenderedFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="br-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="#ECFDF5" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#065F46" fontSize="24" fontWeight="bold">
        Bible Rendered: 51-Frame Compression
      </text>

      {/* The Formula */}
      <rect x="100" y="70" width="600" height="80" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="100" textAnchor="middle" fill="#065F46" fontSize="18" fontWeight="bold">
        1,189 chapters ÷ 24 chapters/block = ~51 glyphs
      </text>
      <text x="400" y="130" textAnchor="middle" fill="#047857" fontSize="14">
        One symbol per 24-chapter block compresses the ENTIRE Bible into your palm
      </text>

      {/* Step Flow */}
      <g transform="translate(50, 180)">
        {/* Step 1 */}
        <rect x="0" y="0" width="220" height="90" rx="12" fill="url(#br-grad)" />
        <text x="110" y="30" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 1: Divide</text>
        <text x="110" y="55" textAnchor="middle" fill="white" fontSize="12">Split Bible into</text>
        <text x="110" y="75" textAnchor="middle" fill="white" fontSize="12">24-chapter blocks</text>

        {/* Arrow */}
        <polygon points="230,45 245,45 245,35 265,50 245,65 245,55 230,55" fill="#10B981" />

        {/* Step 2 */}
        <rect x="275" y="0" width="220" height="90" rx="12" fill="url(#br-grad)" />
        <text x="385" y="30" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 2: Read</text>
        <text x="385" y="55" textAnchor="middle" fill="white" fontSize="12">Review entire block</text>
        <text x="385" y="75" textAnchor="middle" fill="white" fontSize="12">for central movement</text>

        {/* Arrow */}
        <polygon points="505,45 520,45 520,35 540,50 520,65 520,55 505,55" fill="#10B981" />

        {/* Step 3 */}
        <rect x="550" y="0" width="200" height="90" rx="12" fill="url(#br-grad)" />
        <text x="650" y="30" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 3: Assign</text>
        <text x="650" y="55" textAnchor="middle" fill="white" fontSize="12">Choose ONE simple</text>
        <text x="650" y="75" textAnchor="middle" fill="white" fontSize="12">glyph: /, ×, ↑, →</text>
      </g>

      {/* Glyph Examples */}
      <rect x="50" y="290" width="700" height="140" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="320" textAnchor="middle" fill="#065F46" fontSize="16" fontWeight="bold">
        Sample Glyph System
      </text>

      <g transform="translate(70, 340)">
        {[
          { glyph: '/', meaning: 'Division', example: 'Gen 1-24' },
          { glyph: '×', meaning: 'Conflict/Cross', example: 'Gospels' },
          { glyph: '↑', meaning: 'Ascent/Rise', example: 'Ex 1-24' },
          { glyph: '→', meaning: 'Movement/Mission', example: 'Acts' },
          { glyph: '○', meaning: 'Completion', example: 'Revelation' },
          { glyph: '+', meaning: 'Addition/Growth', example: 'Numbers' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 110}, 0)`}>
            <circle cx="30" cy="20" r="25" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
            <text x="30" y="28" textAnchor="middle" fill="#065F46" fontSize="24" fontWeight="bold">{item.glyph}</text>
            <text x="30" y="60" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">{item.meaning}</text>
            <text x="30" y="75" textAnchor="middle" fill="#6B7280" fontSize="9">{item.example}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// Bible Rendered Concept Infographic
export function BibleRenderedConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#ECFDF5" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        The Entire Bible at a Glance
      </text>

      {/* Visual of Bible blocks */}
      <rect x="50" y="60" width="700" height="180" fill="white" rx="12" stroke="#10B981" strokeWidth="2" />

      {/* Block visualization */}
      <text x="400" y="90" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        Bible broken into 24-chapter blocks (~51 total)
      </text>

      {/* Genesis to Revelation blocks */}
      <g transform="translate(70, 110)">
        {Array.from({ length: 17 }, (_, i) => (
          <g key={i}>
            <rect x={i * 38} y="0" width="35" height="50" rx="4" fill={i < 16 ? '#D1FAE5' : '#10B981'} stroke="#10B981" strokeWidth="1" />
            <text x={i * 38 + 17} y="30" textAnchor="middle" fill="#065F46" fontSize="16" fontWeight="bold">
              {['/', '↗', '↑', '→', '∿', '+', '⚖', '↓', '↑', '✝', '⟳', '→', '∧', '⇑', '○', '+', '∞'][i]}
            </text>
          </g>
        ))}
        <text x="320" y="70" textAnchor="middle" fill="#6B7280" fontSize="11">...51 glyphs total...</text>
      </g>

      {/* Block detail */}
      <g transform="translate(70, 180)">
        <rect x="0" y="0" width="180" height="35" fill="#FEF3C7" rx="4" stroke="#F59E0B" strokeWidth="1" />
        <text x="90" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Gen 1-24 = /</text>
        <rect x="190" y="0" width="180" height="35" fill="#FEF3C7" rx="4" stroke="#F59E0B" strokeWidth="1" />
        <text x="280" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Gen 25-50 = SEED</text>
        <rect x="380" y="0" width="180" height="35" fill="#FEF3C7" rx="4" stroke="#F59E0B" strokeWidth="1" />
        <text x="470" y="23" textAnchor="middle" fill="#92400E" fontSize="11">Ex 1-24 = ↑</text>
      </g>

      {/* Why this works */}
      <rect x="50" y="260" width="340" height="120" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
      <text x="220" y="290" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">🧠 Cognitive Benefit</text>
      <text x="70" y="320" fill="#047857" fontSize="12">51 items is within the brain's</text>
      <text x="70" y="340" fill="#047857" fontSize="12">chunking limit. You can hold</text>
      <text x="70" y="360" fill="#047857" fontSize="12">the ENTIRE Bible in working memory.</text>

      {/* The deliverable */}
      <rect x="410" y="260" width="340" height="120" rx="12" fill="white" stroke="#10B981" strokeWidth="2" />
      <text x="580" y="290" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">📋 Deliverable</text>
      <text x="430" y="315" fill="#047857" fontSize="11" fontFamily="monospace">Gen 1-24 = / → Divisions emerge</text>
      <text x="430" y="335" fill="#047857" fontSize="11" fontFamily="monospace">Gen 25-50 = SEED → Promise line</text>
      <text x="430" y="355" fill="#047857" fontSize="11" fontFamily="monospace">Ex 1-24 = ↑ → Ascent from slavery</text>
      <text x="430" y="375" fill="#6B7280" fontSize="10" fontStyle="italic">Block → Glyph → Brief explanation</text>

      {/* Pitfalls */}
      <rect x="50" y="400" width="700" height="80" rx="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
      <text x="400" y="428" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">⚠️ Pitfalls</text>
      <text x="70" y="455" fill="#B91C1C" fontSize="12">• Over-explaining the glyph (keep to 1-2 sentences)</text>
      <text x="70" y="475" fill="#B91C1C" fontSize="12">• Using more than 1 glyph per block</text>
      <text x="430" y="455" fill="#B91C1C" fontSize="12">• Changing your glyph system midstream</text>
      <text x="430" y="475" fill="#B91C1C" fontSize="12">• Trying to capture EVERYTHING in one glyph</text>
    </svg>
  );
}

// Bible Rendered Example
export function BibleRenderedExample() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="550" fill="#ECFDF5" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#065F46" fontSize="22" fontWeight="bold">
        Example: Complete 51-Frame Legend
      </text>

      {/* Legend Grid */}
      <g transform="translate(30, 55)">
        {[
          { block: 'Gen 1-24', glyph: '/', note: 'Divisions: light/dark, land/sea, nations' },
          { block: 'Gen 25-50', glyph: 'SEED', note: 'Patriarchs carry the promise' },
          { block: 'Ex 1-24', glyph: '↑', note: 'Ascent from slavery to Sinai' },
          { block: 'Ex 25-Lev 16', glyph: '⛺', note: 'Tabernacle built, worship begins' },
          { block: 'Lev 17-Num 16', glyph: '⚖', note: 'Laws, holiness, order' },
          { block: 'Num 17-Deut 16', glyph: '🏜️', note: 'Wilderness wandering' },
          { block: 'Deut 17-Josh 16', glyph: '🗡️', note: 'Conquest begins' },
          { block: 'Josh 17-1Sam 7', glyph: '⟳', note: 'Cycles of judges' },
          { block: '1Sam 8-2Sam 7', glyph: '👑', note: 'Kingdom established' },
          { block: '2Sam 8-1Ki 7', glyph: '🏛️', note: 'Temple building' },
          { block: '1Ki 8-2Ki 7', glyph: '↓', note: 'Decline begins' },
          { block: '2Ki 8-1Ch 16', glyph: '💔', note: 'Division, exile' },
          { block: 'Psalms', glyph: '🎵', note: 'Songs of every emotion' },
          { block: 'Prophets', glyph: '📢', note: 'Warning and hope' },
          { block: 'Gospels', glyph: '✝', note: 'Christ comes' },
          { block: 'Acts', glyph: '↑→', note: 'Up (ascension) then out (mission)' },
          { block: 'Epistles', glyph: '✉️', note: 'Letters to churches' },
          { block: 'Revelation', glyph: '○+', note: 'Full circle: Eden restored' },
        ].map((item, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <g key={i} transform={`translate(${col * 250}, ${row * 75})`}>
              <rect x="0" y="0" width="240" height="65" rx="8" fill="white" stroke="#10B981" strokeWidth="1" />
              <circle cx="35" cy="32" r="22" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
              <text x="35" y="40" textAnchor="middle" fill="#065F46" fontSize="18" fontWeight="bold">{item.glyph}</text>
              <text x="70" y="25" fill="#065F46" fontSize="11" fontWeight="bold">{item.block}</text>
              <text x="70" y="45" fill="#047857" fontSize="10">{item.note}</text>
            </g>
          );
        })}
      </g>

      {/* Usage tip */}
      <rect x="50" y="495" width="700" height="40" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="520" textAnchor="middle" fill="#92400E" fontSize="13" fontWeight="bold">
        💡 Practice: Close your eyes and walk through all 51 glyphs from memory
      </text>
    </svg>
  );
}

export default {
  BibleRenderedFlowchart,
  BibleRenderedConcept,
  BibleRenderedExample
};
