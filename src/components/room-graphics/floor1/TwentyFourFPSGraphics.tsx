import React from 'react';

// 24FPS Room Method Flowchart
export function TwentyFourFPSFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fps-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="#FFFBEB" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#92400E" fontSize="24" fontWeight="bold">
        24FPS Method: Visual GPS for the Bible
      </text>

      {/* Step Flow */}
      <g transform="translate(50, 80)">
        {/* Step 1 */}
        <rect x="0" y="0" width="160" height="100" rx="12" fill="url(#fps-grad)" />
        <text x="80" y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 1</text>
        <text x="80" y="58" textAnchor="middle" fill="white" fontSize="12">Read the</text>
        <text x="80" y="75" textAnchor="middle" fill="white" fontSize="12">Chapter</text>
        <text x="80" y="95" textAnchor="middle" fill="#FEF3C7" fontSize="20">📖</text>

        {/* Arrow */}
        <path d="M170 50 L195 50" stroke="#F59E0B" strokeWidth="3" />
        <polygon points="195,45 205,50 195,55" fill="#F59E0B" />

        {/* Step 2 */}
        <rect x="210" y="0" width="160" height="100" rx="12" fill="url(#fps-grad)" />
        <text x="290" y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 2</text>
        <text x="290" y="58" textAnchor="middle" fill="white" fontSize="12">Find MOST</text>
        <text x="290" y="75" textAnchor="middle" fill="white" fontSize="12">MEMORABLE Element</text>
        <text x="290" y="95" textAnchor="middle" fill="#FEF3C7" fontSize="20">🎯</text>

        {/* Arrow */}
        <path d="M380 50 L405 50" stroke="#F59E0B" strokeWidth="3" />
        <polygon points="405,45 415,50 405,55" fill="#F59E0B" />

        {/* Step 3 */}
        <rect x="420" y="0" width="160" height="100" rx="12" fill="url(#fps-grad)" />
        <text x="500" y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 3</text>
        <text x="500" y="58" textAnchor="middle" fill="white" fontSize="12">Convert to</text>
        <text x="500" y="75" textAnchor="middle" fill="white" fontSize="12">CONCRETE Visual</text>
        <text x="500" y="95" textAnchor="middle" fill="#FEF3C7" fontSize="20">🎨</text>

        {/* Arrow */}
        <path d="M590 50 L615 50" stroke="#F59E0B" strokeWidth="3" />
        <polygon points="615,45 625,50 615,55" fill="#F59E0B" />

        {/* Step 4 */}
        <rect x="630" y="0" width="120" height="100" rx="12" fill="#16A34A" />
        <text x="690" y="35" textAnchor="middle" fill="white" fontWeight="bold" fontSize="14">STEP 4</text>
        <text x="690" y="58" textAnchor="middle" fill="white" fontSize="12">TEST:</text>
        <text x="690" y="75" textAnchor="middle" fill="white" fontSize="12">Instant Recall?</text>
        <text x="690" y="95" textAnchor="middle" fill="#D1FAE5" fontSize="20">✓</text>
      </g>

      {/* Key Principle Box */}
      <rect x="50" y="200" width="700" height="80" rx="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="230" textAnchor="middle" fill="#92400E" fontSize="16" fontWeight="bold">
        🔑 The Secret: ONE striking image per chapter
      </text>
      <text x="400" y="255" textAnchor="middle" fill="#78350F" fontSize="13">
        Prefer quirky over dignified. Memory hooks need to be WEIRD to stick.
      </text>
      <text x="400" y="275" textAnchor="middle" fill="#78350F" fontSize="13">
        This is about FINDABILITY, not theological depth.
      </text>

      {/* Good vs Bad */}
      <g transform="translate(50, 300)">
        <rect x="0" y="0" width="340" height="130" rx="12" fill="#D1FAE5" stroke="#16A34A" strokeWidth="2" />
        <text x="170" y="28" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">✅ Good Images</text>
        <text x="20" y="55" fill="#166534" fontSize="12">• Birthday Cake Earth (Gen 1)</text>
        <text x="20" y="75" fill="#166534" fontSize="12">• Snake + Apple + Clock (Gen 3)</text>
        <text x="20" y="95" fill="#166534" fontSize="12">• Knife Suspended Over Altar (Gen 22)</text>
        <text x="20" y="115" fill="#166534" fontSize="12">• Burning Bush (Ex 3)</text>
      </g>

      <g transform="translate(410, 300)">
        <rect x="0" y="0" width="340" height="130" rx="12" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
        <text x="170" y="28" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">❌ Bad Images</text>
        <text x="20" y="55" fill="#991B1B" fontSize="12">• "The Creation Story" (descriptive title)</text>
        <text x="20" y="75" fill="#991B1B" fontSize="12">• "Grace" or "Redemption" (abstract)</text>
        <text x="20" y="95" fill="#991B1B" fontSize="12">• Multi-scene panoramas (too complex)</text>
        <text x="20" y="115" fill="#991B1B" fontSize="12">• Same image for multiple chapters</text>
      </g>
    </svg>
  );
}

// 24FPS Room Concept Infographic
export function TwentyFourFPSConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#FFFBEB" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold">
        Why 24FPS? Film Frame Memory System
      </text>

      {/* Film Strip */}
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="700" height="120" fill="#1F2937" rx="8" />
        {/* Sprocket holes */}
        {[30, 130, 230, 330, 430, 530, 630].map((x, i) => (
          <React.Fragment key={i}>
            <rect x={x} y="8" width="20" height="10" rx="2" fill="#374151" />
            <rect x={x} y="102" width="20" height="10" rx="2" fill="#374151" />
          </React.Fragment>
        ))}
        {/* Film frames - Genesis chapters */}
        <g transform="translate(20, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🎂</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 1</text>
        </g>
        <g transform="translate(110, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🌳</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 2</text>
        </g>
        <g transform="translate(200, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🐍</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 3</text>
        </g>
        <g transform="translate(290, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🩸</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 4</text>
        </g>
        <g transform="translate(380, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">📜</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 5</text>
        </g>
        <g transform="translate(470, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🚢</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 6-8</text>
        </g>
        <g transform="translate(560, 25)">
          <rect x="0" y="0" width="80" height="70" fill="#FBBF24" rx="4" />
          <text x="40" y="35" textAnchor="middle" fontSize="28">🌈</text>
          <text x="40" y="60" textAnchor="middle" fill="#78350F" fontSize="9" fontWeight="bold">Gen 9</text>
        </g>
      </g>

      {/* 1189 chapters concept */}
      <rect x="50" y="200" width="700" height="100" rx="12" fill="white" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="235" textAnchor="middle" fill="#92400E" fontSize="18" fontWeight="bold">
        The Bible has 1,189 chapters
      </text>
      <text x="400" y="265" textAnchor="middle" fill="#78350F" fontSize="14">
        If you can assign ONE visual image to each chapter, you create a mental
      </text>
      <text x="400" y="285" textAnchor="middle" fill="#78350F" fontSize="14">
        GPS that lets you FIND any passage instantly by its image.
      </text>

      {/* Why quirky works */}
      <g transform="translate(50, 320)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <text x="170" y="30" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">🧠 Why Quirky Works</text>
        <text x="20" y="60" fill="#78350F" fontSize="12">The brain flags UNUSUAL images</text>
        <text x="20" y="80" fill="#78350F" fontSize="12">as worth remembering.</text>
        <text x="20" y="110" fill="#78350F" fontSize="12">"Birthday Cake Earth" is weird</text>
        <text x="20" y="130" fill="#78350F" fontSize="12">enough that your brain WON'T</text>
        <text x="20" y="150" fill="#78350F" fontSize="12">let you forget it.</text>
      </g>

      {/* Deliverable */}
      <g transform="translate(410, 320)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="#D1FAE5" stroke="#16A34A" strokeWidth="2" />
        <text x="170" y="30" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">📋 Deliverable Format</text>
        <text x="20" y="60" fill="#166534" fontSize="12" fontFamily="monospace">Gen 1 = Birthday Cake Earth</text>
        <text x="20" y="80" fill="#166534" fontSize="12" fontFamily="monospace">Gen 2 = Garden + 4 Rivers</text>
        <text x="20" y="100" fill="#166534" fontSize="12" fontFamily="monospace">Gen 3 = Snake + Apple + Clock</text>
        <text x="20" y="120" fill="#166534" fontSize="12" fontFamily="monospace">Gen 4 = Blood Crying from Ground</text>
        <text x="20" y="145" fill="#166534" fontSize="11" fontStyle="italic">Chapter → Image table</text>
      </g>
    </svg>
  );
}

// 24FPS Room Example
export function TwentyFourFPSExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="600" fill="#FFFBEB" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#92400E" fontSize="22" fontWeight="bold">
        Example: Genesis Visual Gallery (First 24 Chapters)
      </text>

      {/* Grid of chapter images - 6x4 grid */}
      {[
        { ch: 1, img: '🎂', label: 'Birthday Cake Earth' },
        { ch: 2, img: '🌳', label: 'Garden + Rivers' },
        { ch: 3, img: '🐍', label: 'Snake + Apple' },
        { ch: 4, img: '🩸', label: 'Blood Crying' },
        { ch: 5, img: '📜', label: 'Genealogy Scroll' },
        { ch: 6, img: '📐', label: 'Ark Blueprint' },
        { ch: 7, img: '🌧️', label: 'Rain 40 Days' },
        { ch: 8, img: '🕊️', label: 'Dove + Olive' },
        { ch: 9, img: '🌈', label: 'Rainbow Covenant' },
        { ch: 10, img: '🗺️', label: 'Nations Map' },
        { ch: 11, img: '🗼', label: 'Tower Crumbling' },
        { ch: 12, img: '🏕️', label: 'Abram\'s Tent' },
        { ch: 13, img: '🧭', label: 'Lot Choosing' },
        { ch: 14, img: '⚔️', label: 'Battle + Bread' },
        { ch: 15, img: '⭐', label: 'Stars Promise' },
        { ch: 16, img: '👁️', label: 'Hagar\'s Well' },
        { ch: 17, img: '✂️', label: 'Circumcision' },
        { ch: 18, img: '🍞', label: 'Three Visitors' },
        { ch: 19, img: '🧂', label: 'Salt Pillar' },
        { ch: 20, img: '👑', label: 'King\'s Dream' },
        { ch: 21, img: '👶', label: 'Isaac Laughing' },
        { ch: 22, img: '🗡️', label: 'Knife + Altar' },
        { ch: 23, img: '⚰️', label: 'Cave Purchased' },
        { ch: 24, img: '💍', label: 'Camel + Ring' },
      ].map((item, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = 55 + col * 120;
        const y = 60 + row * 130;
        return (
          <g key={item.ch} transform={`translate(${x}, ${y})`}>
            <rect x="0" y="0" width="110" height="110" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <rect x="5" y="5" width="100" height="70" rx="6" fill="white" />
            <text x="55" y="50" textAnchor="middle" fontSize="32">{item.img}</text>
            <text x="55" y="90" textAnchor="middle" fill="#92400E" fontSize="10" fontWeight="bold">Ch. {item.ch}</text>
            <text x="55" y="105" textAnchor="middle" fill="#78350F" fontSize="8">{item.label}</text>
          </g>
        );
      })}

      {/* Bottom tip */}
      <rect x="50" y="545" width="700" height="40" rx="10" fill="#D1FAE5" stroke="#16A34A" strokeWidth="2" />
      <text x="400" y="570" textAnchor="middle" fill="#166534" fontSize="13" fontWeight="bold">
        💡 Test yourself: Cover labels. Can you recall each chapter from the image alone?
      </text>
    </svg>
  );
}

export default {
  TwentyFourFPSFlowchart,
  TwentyFourFPSConcept,
  TwentyFourFPSExample
};
