import React from 'react';

// Nature Freestyle Room Method Flowchart
export function NatureFreestyleFlowchart() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="nf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>

      <rect width="800" height="500" fill="#F0FDF4" rx="16" />

      <text x="400" y="40" textAnchor="middle" fill="#166534" fontSize="24" fontWeight="bold">
        Nature Freestyle: God's Second Book
      </text>

      {/* Nature → Scripture Connection Flow */}
      <g transform="translate(50, 70)">
        {/* Nature Circle */}
        <circle cx="120" cy="100" r="80" fill="url(#nf-grad)" />
        <text x="120" y="85" textAnchor="middle" fill="white" fontSize="40">🌿</text>
        <text x="120" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">NATURE</text>
        <text x="120" y="135" textAnchor="middle" fill="#BBF7D0" fontSize="11">Observe Creation</text>

        {/* Arrow */}
        <path d="M210 100 L290 100" stroke="#22C55E" strokeWidth="4" fill="none" markerEnd="url(#arrow-nf)" />
        <defs>
          <marker id="arrow-nf" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
          </marker>
        </defs>

        {/* Question Circle */}
        <circle cx="380" cy="100" r="80" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
        <text x="380" y="85" textAnchor="middle" fill="#92400E" fontSize="40">❓</text>
        <text x="380" y="115" textAnchor="middle" fill="#92400E" fontSize="14" fontWeight="bold">ASK</text>
        <text x="380" y="135" textAnchor="middle" fill="#B45309" fontSize="11">"What does this teach?"</text>

        {/* Arrow */}
        <path d="M470 100 L550 100" stroke="#22C55E" strokeWidth="4" fill="none" markerEnd="url(#arrow-nf)" />

        {/* Scripture Circle */}
        <circle cx="640" cy="100" r="80" fill="#3B82F6" />
        <text x="640" y="85" textAnchor="middle" fill="white" fontSize="40">📖</text>
        <text x="640" y="115" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">SCRIPTURE</text>
        <text x="640" y="135" textAnchor="middle" fill="#BFDBFE" fontSize="11">Find Bible Parallel</text>
      </g>

      {/* Method Steps */}
      <rect x="50" y="220" width="700" height="130" rx="12" fill="white" stroke="#22C55E" strokeWidth="2" />
      <text x="400" y="250" textAnchor="middle" fill="#166534" fontSize="16" fontWeight="bold">
        The Nature Freestyle Method
      </text>

      <g transform="translate(70, 270)">
        {[
          { step: '1', text: 'See: Notice something in nature', icon: '👁️' },
          { step: '2', text: 'Wonder: Ask what spiritual truth it illustrates', icon: '🤔' },
          { step: '3', text: 'Search: Find Scripture that uses this image', icon: '🔍' },
          { step: '4', text: 'Connect: Build the metaphor bridge', icon: '🌉' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <circle cx="20" cy="25" r="20" fill="#22C55E" />
            <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{item.step}</text>
            <text x="20" y="55" textAnchor="middle" fontSize="18">{item.icon}</text>
            <text x="20" y="75" textAnchor="middle" fill="#166534" fontSize="9">{item.text}</text>
          </g>
        ))}
      </g>

      {/* Key Principle */}
      <rect x="50" y="370" width="700" height="110" rx="12" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" />
      <text x="400" y="400" textAnchor="middle" fill="#166534" fontSize="16" fontWeight="bold">
        The Two Books Principle
      </text>
      <text x="400" y="425" textAnchor="middle" fill="#15803D" fontSize="13">
        "The heavens declare the glory of God" (Psalm 19:1)
      </text>
      <text x="400" y="450" textAnchor="middle" fill="#15803D" fontSize="12">
        Nature is God's object lesson book — every created thing carries spiritual truth.
      </text>
      <text x="400" y="470" textAnchor="middle" fill="#166534" fontSize="11" fontStyle="italic">
        Jesus taught with lilies, birds, seeds, and storms. So can you.
      </text>
    </svg>
  );
}

// Nature Freestyle Room Concept Infographic
export function NatureFreestyleConcept() {
  return (
    <svg viewBox="0 0 800 550" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="550" fill="#F0FDF4" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#166534" fontSize="22" fontWeight="bold">
        Nature's Sermon Categories
      </text>

      {/* Categories Grid */}
      <g transform="translate(50, 55)">
        {[
          { cat: 'Plants', icon: '🌱', examples: 'Seeds, vines, fig trees, mustard, wheat/tares', truth: 'Growth, fruitfulness, spiritual life' },
          { cat: 'Animals', icon: '🦅', examples: 'Eagle, lion, lamb, serpent, dove', truth: 'Characteristics, behaviors, nature of Christ/Satan' },
          { cat: 'Elements', icon: '💧', examples: 'Water, fire, wind, rocks, mountains', truth: 'Holy Spirit, judgment, stability, kingdoms' },
          { cat: 'Cycles', icon: '🌅', examples: 'Seasons, day/night, birth/death', truth: 'Spiritual seasons, light vs darkness' },
          { cat: 'Heavens', icon: '⭐', examples: 'Sun, moon, stars, clouds, rain', truth: 'Christ, church, saints, blessing' },
          { cat: 'Process', icon: '🦋', examples: 'Metamorphosis, germination, decay', truth: 'Transformation, resurrection, sin' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${(i % 3) * 235}, ${Math.floor(i / 3) * 130})`}>
            <rect x="0" y="0" width="220" height="120" rx="12" fill="white" stroke="#22C55E" strokeWidth="2" />
            <text x="110" y="35" textAnchor="middle" fontSize="28">{item.icon}</text>
            <text x="110" y="55" textAnchor="middle" fill="#166534" fontSize="14" fontWeight="bold">{item.cat}</text>
            <text x="110" y="75" textAnchor="middle" fill="#15803D" fontSize="9">{item.examples}</text>
            <text x="110" y="100" textAnchor="middle" fill="#047857" fontSize="9" fontStyle="italic">→ {item.truth}</text>
          </g>
        ))}
      </g>

      {/* Jesus' Example */}
      <rect x="50" y="330" width="700" height="100" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
      <text x="400" y="360" textAnchor="middle" fill="#92400E" fontSize="16" fontWeight="bold">
        Jesus' Nature Teaching Examples
      </text>
      <g transform="translate(70, 375)">
        {[
          { nature: 'Lilies', lesson: '"Consider the lilies" → God's provision' },
          { nature: 'Sparrows', lesson: '"Two sparrows for a penny" → Your value to God' },
          { nature: 'Wheat', lesson: '"Unless a grain of wheat falls and dies" → Resurrection' },
          { nature: 'Storms', lesson: '"Peace, be still" → Christ's authority over chaos' },
        ].map((item, i) => (
          <g key={i} transform={`translate(${i * 165}, 0)`}>
            <text x="80" y="15" textAnchor="middle" fill="#78350F" fontSize="11" fontWeight="bold">{item.nature}</text>
            <text x="80" y="35" textAnchor="middle" fill="#92400E" fontSize="9">{item.lesson}</text>
          </g>
        ))}
      </g>

      {/* Deliverable */}
      <rect x="50" y="450" width="700" height="80" rx="12" fill="#22C55E" />
      <text x="400" y="480" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        Deliverable: Nature Lesson Journal
      </text>
      <text x="400" y="505" textAnchor="middle" fill="#BBF7D0" fontSize="13">
        Nature Observation + Question + Scripture + Spiritual Application
      </text>
      <text x="400" y="525" textAnchor="middle" fill="#BBF7D0" fontSize="11">
        Build your personal library of nature-to-Scripture connections
      </text>
    </svg>
  );
}

// Nature Freestyle Room Example
export function NatureFreestyleExample() {
  return (
    <svg viewBox="0 0 800 600" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="600" fill="#F0FDF4" rx="16" />

      <text x="400" y="35" textAnchor="middle" fill="#166534" fontSize="22" fontWeight="bold">
        Example: The Eagle (Isaiah 40:31)
      </text>

      {/* Nature Observation */}
      <g transform="translate(50, 55)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="white" stroke="#22C55E" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#22C55E" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 1: Nature Observation
        </text>
        <text x="50" y="30" fontSize="40">🦅</text>

        <text x="30" y="65" fill="#166534" fontSize="12" fontWeight="bold">What I noticed:</text>
        <text x="30" y="85" fill="#15803D" fontSize="11">• Eagles soar without flapping — they ride thermal currents</text>
        <text x="30" y="102" fill="#15803D" fontSize="11">• They can fly for hours expending almost no energy</text>
        <text x="30" y="119" fill="#15803D" fontSize="11">• They wait for the right wind before taking off</text>
      </g>

      {/* Spiritual Question */}
      <g transform="translate(50, 185)">
        <rect x="0" y="0" width="700" height="80" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#F59E0B" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 2: Ask the Spiritual Question
        </text>

        <text x="30" y="60" fill="#92400E" fontSize="13">
          "What does eagle flight teach about spiritual strength? Why not run or walk first?"
        </text>
      </g>

      {/* Scripture Connection */}
      <g transform="translate(50, 275)">
        <rect x="0" y="0" width="700" height="120" rx="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#3B82F6" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 3: Scripture Connection
        </text>

        <text x="30" y="60" fill="#1E40AF" fontSize="12" fontWeight="bold">Isaiah 40:31</text>
        <text x="30" y="80" fill="#1D4ED8" fontSize="11" fontStyle="italic">
          "They that wait upon the LORD shall renew their strength; they shall mount up
        </text>
        <text x="30" y="97" fill="#1D4ED8" fontSize="11" fontStyle="italic">
          with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
        </text>
      </g>

      {/* Spiritual Application */}
      <g transform="translate(50, 405)">
        <rect x="0" y="0" width="700" height="140" rx="12" fill="white" stroke="#22C55E" strokeWidth="2" />
        <rect x="0" y="0" width="700" height="35" rx="12 12 0 0" fill="#22C55E" />
        <text x="350" y="24" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Step 4: Build the Metaphor Bridge
        </text>

        <text x="30" y="60" fill="#166534" fontSize="11">
          <tspan fontWeight="bold">Waiting = Rising on thermals:</tspan> Eagles don't generate their own lift — they wait for wind currents.
        </text>
        <text x="30" y="80" fill="#166534" fontSize="11">
          <tspan fontWeight="bold">Waiting on God = Rising on His Spirit:</tspan> We don't generate our own strength — we wait for His power.
        </text>
        <text x="30" y="100" fill="#166534" fontSize="11">
          <tspan fontWeight="bold">Order matters:</tspan> Soaring (highest) → Running → Walking. Spirit-empowered life enables ALL levels.
        </text>
        <text x="30" y="125" fill="#15803D" fontSize="11" fontStyle="italic">
          Nature Lesson: "Stop flapping! Wait for the wind of the Spirit, then soar."
        </text>
      </g>

      {/* Summary */}
      <rect x="50" y="555" width="700" height="30" rx="8" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2" />
      <text x="400" y="575" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">
        One eagle observation = One sermon illustration = One memorable truth
      </text>
    </svg>
  );
}

export default {
  NatureFreestyleFlowchart,
  NatureFreestyleConcept,
  NatureFreestyleExample
};
