import React from 'react';

// Gems Room Method Flowchart
export function GemsRoomFlowchart() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        <filter id="gem-sparkle">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width="800" height="450" fill="#ECFEFF" rx="16" />

      {/* Title */}
      <text x="400" y="40" textAnchor="middle" fill="#0E7490" fontSize="24" fontWeight="bold">
        Gems Room: Mining Rare Biblical Truths
      </text>

      {/* Central Diamond */}
      <g transform="translate(400, 180)" filter="url(#gem-sparkle)">
        <polygon points="0,-60 50,0 0,60 -50,0" fill="url(#gem-grad)" stroke="#0891B2" strokeWidth="2" />
        <polygon points="0,-60 50,0 0,20 -50,0" fill="#67E8F9" opacity="0.5" />
        <text x="0" y="10" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">💎</text>
      </g>

      {/* Incoming Verses */}
      <g transform="translate(100, 120)">
        <rect x="0" y="0" width="120" height="60" rx="10" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
        <text x="60" y="25" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Verse A</text>
        <text x="60" y="45" textAnchor="middle" fill="#0891B2" fontSize="10">Ex 12:6</text>
      </g>
      <path d="M220 150 L340 180" stroke="#06B6D4" strokeWidth="2" markerEnd="url(#arrow)" />

      <g transform="translate(100, 200)">
        <rect x="0" y="0" width="120" height="60" rx="10" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
        <text x="60" y="25" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Verse B</text>
        <text x="60" y="45" textAnchor="middle" fill="#0891B2" fontSize="10">Jn 19:14</text>
      </g>
      <path d="M220 230 L340 190" stroke="#06B6D4" strokeWidth="2" />

      <g transform="translate(580, 120)">
        <rect x="0" y="0" width="120" height="60" rx="10" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
        <text x="60" y="25" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Verse C</text>
        <text x="60" y="45" textAnchor="middle" fill="#0891B2" fontSize="10">1 Cor 5:7</text>
      </g>
      <path d="M580 150 L460 180" stroke="#06B6D4" strokeWidth="2" />

      <g transform="translate(580, 200)">
        <rect x="0" y="0" width="120" height="60" rx="10" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
        <text x="60" y="25" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Verse D</text>
        <text x="60" y="45" textAnchor="middle" fill="#0891B2" fontSize="10">(optional)</text>
      </g>
      <path d="M580 230 L460 190" stroke="#06B6D4" strokeWidth="2" />

      {/* Output */}
      <path d="M400 245 L400 290" stroke="#06B6D4" strokeWidth="3" />
      <polygon points="395,285 400,300 405,285" fill="#06B6D4" />

      <rect x="250" y="305" width="300" height="70" rx="12" fill="#0E7490" />
      <text x="400" y="335" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">💎 RARE TRUTH EMERGES</text>
      <text x="400" y="358" textAnchor="middle" fill="#A5F3FC" fontSize="12">Beautiful insight from combination</text>

      {/* Method Steps */}
      <rect x="50" y="390" width="700" height="45" rx="10" fill="white" stroke="#06B6D4" strokeWidth="2" />
      <text x="400" y="420" textAnchor="middle" fill="#0E7490" fontSize="13">
        1. Select 2-4 unrelated verses → 2. Place side by side → 3. Ask: What insight emerges? → 4. Crystallize truth
      </text>
    </svg>
  );
}

// Gems Room Concept Infographic
export function GemsRoomConcept() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="500" fill="#ECFEFF" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#0E7490" fontSize="22" fontWeight="bold">
        How Gems Work: Cross-Textual Illumination
      </text>

      {/* The Mining Metaphor */}
      <rect x="50" y="55" width="700" height="120" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
      <text x="100" y="90" fill="#0E7490" fontSize="40">⛏️</text>
      <text x="160" y="100" fill="#0E7490" fontSize="16" fontWeight="bold">Mining Scripture</text>
      <text x="160" y="125" fill="#0891B2" fontSize="13">Individual verses are like ore—valuable but unrefined.</text>
      <text x="160" y="145" fill="#0891B2" fontSize="13">When you COMBINE verses from different contexts, rare gems emerge.</text>

      {/* Example Gem */}
      <rect x="50" y="190" width="700" height="180" rx="12" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="2" />
      <text x="400" y="220" textAnchor="middle" fill="#0E7490" fontSize="16" fontWeight="bold">
        💎 Example Gem: The Passover Timing
      </text>

      {/* Verse 1 */}
      <g transform="translate(70, 240)">
        <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#06B6D4" />
        <text x="100" y="20" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">Exodus 12:6</text>
        <text x="100" y="38" textAnchor="middle" fill="#0891B2" fontSize="10">"Kill it at twilight"</text>
        <text x="100" y="52" textAnchor="middle" fill="#6B7280" fontSize="9">(Passover lamb timing)</text>
      </g>

      {/* Plus sign */}
      <text x="290" y="280" fill="#06B6D4" fontSize="28" fontWeight="bold">+</text>

      {/* Verse 2 */}
      <g transform="translate(310, 240)">
        <rect x="0" y="0" width="200" height="60" rx="8" fill="white" stroke="#06B6D4" />
        <text x="100" y="20" textAnchor="middle" fill="#0E7490" fontSize="11" fontWeight="bold">John 19:14</text>
        <text x="100" y="38" textAnchor="middle" fill="#0891B2" fontSize="10">"About the sixth hour"</text>
        <text x="100" y="52" textAnchor="middle" fill="#6B7280" fontSize="9">(Jesus before Pilate)</text>
      </g>

      {/* Equals sign */}
      <text x="530" y="280" fill="#06B6D4" fontSize="28" fontWeight="bold">=</text>

      {/* Result */}
      <g transform="translate(560, 240)">
        <rect x="0" y="0" width="170" height="60" rx="8" fill="#0E7490" />
        <text x="85" y="25" textAnchor="middle" fill="white" fontSize="18">💎</text>
        <text x="85" y="50" textAnchor="middle" fill="#A5F3FC" fontSize="10">Exact moment match!</text>
      </g>

      {/* Insight */}
      <rect x="70" y="315" width="660" height="40" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="342" textAnchor="middle" fill="#92400E" fontSize="13" fontWeight="bold">
        💡 Gem: Jesus died at the EXACT moment Passover lambs were being slain across Israel!
      </text>

      {/* Gem Card Format */}
      <rect x="50" y="390" width="700" height="90" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
      <text x="400" y="420" textAnchor="middle" fill="#0E7490" fontSize="14" fontWeight="bold">
        📋 Gem Card Format
      </text>
      <text x="80" y="450" fill="#0891B2" fontSize="12">Combined Texts: [Ex 12:6 + Jn 19:14]</text>
      <text x="350" y="450" fill="#0891B2" fontSize="12">Rare Truth: [Timing synchrony]</text>
      <text x="580" y="450" fill="#0891B2" fontSize="12">Use-Case: [Easter sermon]</text>
    </svg>
  );
}

// Gems Room Example
export function GemsRoomExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="800" height="600" fill="#ECFEFF" rx="16" />

      {/* Title */}
      <text x="400" y="35" textAnchor="middle" fill="#0E7490" fontSize="22" fontWeight="bold">
        Gem Examples: Rare Truths from Combined Texts
      </text>

      {/* Gem 1 */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#06B6D4" />
        <text x="170" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">💎 Gem 1: Virgin Birth Thread</text>

        <text x="20" y="60" fill="#0E7490" fontSize="11" fontWeight="bold">Texts Combined:</text>
        <text x="20" y="80" fill="#0891B2" fontSize="10">• Gen 3:15 — "seed of the woman"</text>
        <text x="20" y="95" fill="#0891B2" fontSize="10">• Gal 4:4 — "born of a woman"</text>
        <text x="20" y="110" fill="#0891B2" fontSize="10">• Rev 12:5 — "male child"</text>

        <text x="20" y="135" fill="#0E7490" fontSize="11" fontWeight="bold">Rare Truth:</text>
        <text x="20" y="150" fill="#065F46" fontSize="10">Virgin birth thread across redemptive history</text>
      </g>

      {/* Gem 2 */}
      <g transform="translate(410, 55)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#06B6D4" />
        <text x="170" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">💎 Gem 2: Three Days Pattern</text>

        <text x="20" y="60" fill="#0E7490" fontSize="11" fontWeight="bold">Texts Combined:</text>
        <text x="20" y="80" fill="#0891B2" fontSize="10">• Gen 22:4 — Abraham saw place on 3rd day</text>
        <text x="20" y="95" fill="#0891B2" fontSize="10">• Jonah 1:17 — 3 days in fish</text>
        <text x="20" y="110" fill="#0891B2" fontSize="10">• Matt 12:40 — 3 days in earth</text>

        <text x="20" y="135" fill="#0E7490" fontSize="11" fontWeight="bold">Rare Truth:</text>
        <text x="20" y="150" fill="#065F46" fontSize="10">"Third day" = God's resurrection signature</text>
      </g>

      {/* Gem 3 */}
      <g transform="translate(50, 235)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#06B6D4" />
        <text x="170" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">💎 Gem 3: Rock Struck Once</text>

        <text x="20" y="60" fill="#0E7490" fontSize="11" fontWeight="bold">Texts Combined:</text>
        <text x="20" y="80" fill="#0891B2" fontSize="10">• Ex 17:6 — "Strike the rock" (Horeb)</text>
        <text x="20" y="95" fill="#0891B2" fontSize="10">• Num 20:8 — "Speak to the rock" (Kadesh)</text>
        <text x="20" y="110" fill="#0891B2" fontSize="10">• 1 Cor 10:4 — "That Rock was Christ"</text>

        <text x="20" y="135" fill="#0E7490" fontSize="11" fontWeight="bold">Rare Truth:</text>
        <text x="20" y="150" fill="#065F46" fontSize="10">Christ struck ONCE (Calvary); Moses' error = re-striking</text>
      </g>

      {/* Gem 4 */}
      <g transform="translate(410, 235)">
        <rect x="0" y="0" width="340" height="160" rx="12" fill="white" stroke="#06B6D4" strokeWidth="2" />
        <rect x="0" y="0" width="340" height="35" rx="12 12 0 0" fill="#06B6D4" />
        <text x="170" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">💎 Gem 4: Veil & Handwriting</text>

        <text x="20" y="60" fill="#0E7490" fontSize="11" fontWeight="bold">Texts Combined:</text>
        <text x="20" y="80" fill="#0891B2" fontSize="10">• Dan 5:5 — Hand writes on wall (Belshazzar)</text>
        <text x="20" y="95" fill="#0891B2" fontSize="10">• Matt 27:51 — Veil torn top to bottom</text>
        <text x="20" y="110" fill="#0891B2" fontSize="10">• MS 101, 1897 (EGW connection)</text>

        <text x="20" y="135" fill="#0E7490" fontSize="11" fontWeight="bold">Rare Truth:</text>
        <text x="20" y="150" fill="#065F46" fontSize="10">Same hand that wrote doom tore the veil!</text>
      </g>

      {/* Pitfalls */}
      <rect x="50" y="415" width="700" height="80" rx="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" />
      <text x="400" y="445" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">⚠️ Pitfalls to Avoid</text>
      <text x="80" y="475" fill="#B91C1C" fontSize="12">• Forced connections that Scripture doesn't support</text>
      <text x="450" y="475" fill="#B91C1C" fontSize="12">• Trivia instead of theology</text>

      {/* Call to action */}
      <rect x="50" y="510" width="700" height="70" rx="12" fill="#D1FAE5" stroke="#10B981" strokeWidth="2" />
      <text x="400" y="540" textAnchor="middle" fill="#065F46" fontSize="14" fontWeight="bold">
        🔍 Your Turn: Find 2-4 verses that seem unrelated...
      </text>
      <text x="400" y="565" textAnchor="middle" fill="#047857" fontSize="13">
        Place them side by side and ask: "What beautiful truth emerges?"
      </text>
    </svg>
  );
}

export default {
  GemsRoomFlowchart,
  GemsRoomConcept,
  GemsRoomExample
};
