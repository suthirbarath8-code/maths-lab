import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  RotateCcw, 
  Play, 
  Pause, 
  Dices, 
  ChevronRight, 
  Plus, 
  Minus, 
  Sliders, 
  Sparkles, 
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { getCollatzSequence, getFibonacciSequence } from '../utils/mathHelpers';

export default function SequenceLab() {
  // Sequence Type: 'collatz', 'ap', 'gp', 'fib'
  const [seqType, setSeqType] = useState('collatz');

  // Collatz state
  const [collatzStart, setCollatzStart] = useState(27);
  const [collatzHistory, setCollatzHistory] = useState([27]);
  const [collatzStepIndex, setCollatzStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Arithmetic Progression state
  const [apStart, setApStart] = useState(3);
  const [apDiff, setApDiff] = useState(4);
  const [apTermCount, setApTermCount] = useState(10);

  // Geometric Progression state
  const [gpStart, setGpStart] = useState(2);
  const [gpRatio, setGpRatio] = useState(2);
  const [gpTermCount, setGpTermCount] = useState(8);

  // Fibonacci state
  const [fibTerms, setFibTerms] = useState(12);

  // Auto-play timer for Collatz
  useEffect(() => {
    let timer = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCollatzHistory(prev => {
          const current = prev[prev.length - 1];
          if (current === 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          const next = current % 2 === 0 ? current / 2 : 3 * current + 1;
          return [...prev, next];
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Collatz manual single step
  const handleCollatzStep = () => {
    const current = collatzHistory[collatzHistory.length - 1];
    if (current === 1) {
      return;
    }
    const next = current % 2 === 0 ? current / 2 : 3 * current + 1;
    setCollatzHistory(prev => [...prev, next]);
  };

  // Collatz reset
  const handleCollatzReset = (newSeed = null) => {
    setIsAutoPlaying(false);
    const seed = newSeed !== null ? newSeed : collatzStart;
    setCollatzStart(seed);
    setCollatzHistory([seed]);
  };

  // Roll random seed for Collatz
  const handleCollatzRandomSeed = () => {
    const rand = Math.floor(Math.random() * 90) + 10;
    handleCollatzReset(rand);
  };

  // Generate entire pre-calculated collatz sequence for comparison
  const fullCollatzSequence = getCollatzSequence(collatzStart, 300);
  const collatzPeak = Math.max(...collatzHistory);
  const currentCollatzVal = collatzHistory[collatzHistory.length - 1];
  const isCollatzFinished = currentCollatzVal === 1;

  // Pre-calculate AP terms
  const apTerms = [];
  let apSum = 0;
  for (let n = 1; n <= apTermCount; n++) {
    const term = apStart + (n - 1) * apDiff;
    apSum += term;
    apTerms.push({ n, term, sum: apSum });
  }

  // Pre-calculate GP terms
  const gpTerms = [];
  let gpSum = 0;
  for (let n = 1; n <= gpTermCount; n++) {
    const term = gpStart * Math.pow(gpRatio, n - 1);
    gpSum += term;
    gpTerms.push({ n, term, sum: gpSum });
  }

  // Fibonacci
  const fibSeq = getFibonacciSequence(fibTerms);

  return (
    <div className="lab-container">
      {/* Header */}
      <div className="lab-header">
        <div className="lab-title-row">
          <span className="lab-badge">
            <GitCommit size={14} /> Lab 04 &bull; Step Sequences &amp; Chaos
          </span>
          <span className="sub-tag">Recursive Discrete Functions</span>
        </div>
        <h2>Sequences, Series &amp; Hailstone Dynamics</h2>
        <p className="lab-desc">
          Witness recursive stepping in action. Explore the famous 3n + 1 Collatz conjecture, investigate Arithmetic &amp; Geometric progressions, and watch Fibonacci approach the Golden Ratio φ.
        </p>
      </div>

      {/* Nav Tabs */}
      <div className="func-types-nav">
        {[
          { id: 'collatz', label: '⚡ 3n + 1 Collatz (Hailstone Conjecture)' },
          { id: 'ap', label: '➕ Arithmetic Progression: aₙ = a₁ + (n-1)d' },
          { id: 'gp', label: '✖️ Geometric Progression: aₙ = a₁ · rⁿ⁻¹' },
          { id: 'fib', label: '🐚 Fibonacci & Golden Ratio (φ ≈ 1.618)' }
        ].map(s => (
          <button
            key={s.id}
            type="button"
            className={`func-tab-btn ${seqType === s.id ? 'active' : ''}`}
            onClick={() => setSeqType(s.id)}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ================= COLLATZ CONJECTURE SECTION ================= */}
      {seqType === 'collatz' && (
        <div className="sequence-stage-grid">
          {/* Controls Deck */}
          <div className="card control-deck-card">
            <div className="panel-tab-header">
              <h3>Hailstone Seed &amp; Stepper</h3>
              <div className="header-actions">
                <button type="button" className="mini-roll-btn" onClick={handleCollatzRandomSeed}>
                  <Dices size={13} /> Random Seed
                </button>
                <button type="button" className="mini-reset-btn" onClick={() => handleCollatzReset()}>
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>

            {/* Current Value Box */}
            <div className="primary-display-box">
              <span className="tag-label">CURRENT HAILSTONE VALUE</span>
              <div className="giant-number-value" key={currentCollatzVal}>
                {currentCollatzVal}
              </div>
              <div className="quick-tags-row">
                <span className={`pill-badge ${currentCollatzVal % 2 === 0 ? 'pill-blue' : 'pill-purple'}`}>
                  {currentCollatzVal % 2 === 0 ? 'Even: Next = n ÷ 2' : 'Odd: Next = 3n + 1'}
                </span>
                {isCollatzFinished && (
                  <span className="pill-badge pill-gold">
                    ★ Reached 1! (4-2-1 Loop)
                  </span>
                )}
              </div>
            </div>

            {/* Seed Counter Stepper */}
            <div className="controller-sub-section">
              <div className="seed-picker-row">
                <label>Starting Seed (a₁):</label>
                <div className="stepper-bundle">
                  <button 
                    type="button" 
                    className="stepper-btn" 
                    onClick={() => handleCollatzReset(Math.max(2, collatzStart - 1))}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="param-value-tag">{collatzStart}</span>
                  <button 
                    type="button" 
                    className="stepper-btn" 
                    onClick={() => handleCollatzReset(collatzStart + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="primary-buttons-row">
                <button 
                  type="button" 
                  className="action-btn btn-plus" 
                  onClick={handleCollatzStep}
                  disabled={isCollatzFinished || isAutoPlaying}
                >
                  <ChevronRight size={18} />
                  <span>Step Forward (+1)</span>
                </button>

                <button 
                  type="button" 
                  className={`action-btn ${isAutoPlaying ? 'btn-pause' : 'btn-play'}`}
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  disabled={isCollatzFinished}
                >
                  {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isAutoPlaying ? 'Pause Simulation' : 'Auto Play'}</span>
                </button>
              </div>
            </div>

            {/* Sequence Metrics */}
            <div className="state-inspector-box">
              <div className="inspector-head">
                <Activity size={13} /> Hailstone Trajectory Metrics
              </div>
              <div className="inspector-stats-grid">
                <div className="stat-node">
                  <span className="k">Steps Elapsed:</span>
                  <span className="v highlight">{collatzHistory.length - 1}</span>
                </div>
                <div className="stat-node">
                  <span className="k">Peak Altitude:</span>
                  <span className="v highlight-x">{collatzPeak}</span>
                </div>
                <div className="stat-node">
                  <span className="k">Total Stopping Time:</span>
                  <span className="v">{fullCollatzSequence.length - 1} steps</span>
                </div>
                <div className="stat-node">
                  <span className="k">Rule Applied:</span>
                  <span className="v font-mono">{currentCollatzVal % 2 === 0 ? 'n / 2' : '3n + 1'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Hailstone Path Graph & Sequence Stream */}
          <div className="card sequence-visual-card">
            <div className="panel-tab-header">
              <h3>Hailstone Trajectory Path</h3>
              <span className="badge-pill pill-gold">{collatzHistory.length} Terms Recorded</span>
            </div>

            {/* Sparkline Visual Path */}
            <div className="hailstone-chart-area">
              <svg 
                className="hailstone-svg" 
                viewBox="0 0 540 220" 
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Horizontal guide at 1 */}
                <line x1="20" y1="200" x2="520" y2="200" stroke="var(--color-axis)" strokeDasharray="3 3" opacity="0.4" />
                <text x="525" y="204" className="axis-mini" fill="currentColor">1</text>

                {/* Draw connecting polyline */}
                {collatzHistory.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={collatzHistory.map((val, idx) => {
                      const x = 30 + (idx / Math.max(collatzHistory.length - 1, 1)) * 470;
                      const y = 200 - (val / collatzPeak) * 170;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Point nodes */}
                {collatzHistory.map((val, idx) => {
                  const x = 30 + (idx / Math.max(collatzHistory.length - 1, 1)) * 470;
                  const y = 200 - (val / collatzPeak) * 170;
                  const isLast = idx === collatzHistory.length - 1;
                  return (
                    <g key={idx}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r={isLast ? "7" : "3.5"} 
                        className={isLast ? "hailstone-node-active" : "hailstone-node"} 
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Sequence Pills Horizontal Flow */}
            <div className="terms-stream-box">
              <div className="stream-caption">Hailstone Step Log (from seed {collatzStart} to 1):</div>
              <div className="terms-stream-flow">
                {collatzHistory.map((v, i) => (
                  <div key={i} className={`term-capsule ${i === collatzHistory.length - 1 ? 'capsule-active' : ''}`}>
                    <span className="step-idx">#{i}</span>
                    <span className="val-text">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ARITHMETIC PROGRESSION (AP) ================= */}
      {seqType === 'ap' && (
        <div className="card full-width-card">
          <div className="panel-tab-header">
            <h3>Arithmetic Progression Studio (Constant Difference Stepper)</h3>
            <span className="badge-pill">Formula: aₙ = a₁ + (n - 1)d</span>
          </div>

          <div className="progression-config-row">
            <div className="config-item">
              <label>First Term (a₁):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setApStart(a => a - 1)}><Minus size={14}/></button>
                <span className="param-value-tag">{apStart}</span>
                <button type="button" className="stepper-btn" onClick={() => setApStart(a => a + 1)}><Plus size={14}/></button>
              </div>
            </div>

            <div className="config-item">
              <label>Common Difference (d):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setApDiff(d => d - 1)}><Minus size={14}/></button>
                <span className="param-value-tag">{apDiff}</span>
                <button type="button" className="stepper-btn" onClick={() => setApDiff(d => d + 1)}><Plus size={14}/></button>
              </div>
            </div>

            <div className="config-item">
              <label>Number of Terms (n):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setApTermCount(n => Math.max(3, n - 1))}><Minus size={14}/></button>
                <span className="param-value-tag">{apTermCount}</span>
                <button type="button" className="stepper-btn" onClick={() => setApTermCount(n => Math.min(25, n + 1))}><Plus size={14}/></button>
              </div>
            </div>
          </div>

          {/* Table of Terms & Partial Sums */}
          <div className="progression-table-container">
            <table className="prog-table">
              <thead>
                <tr>
                  <th>Term Index (n)</th>
                  <th>Formula Calculation</th>
                  <th>Value (aₙ)</th>
                  <th>Accumulated Sum (Sₙ)</th>
                </tr>
              </thead>
              <tbody>
                {apTerms.map(row => (
                  <tr key={row.n}>
                    <td><span className="n-badge">n = {row.n}</span></td>
                    <td className="font-mono">{apStart} + ({row.n} - 1) &times; ({apDiff})</td>
                    <td className="font-bold highlight-val">{row.term}</td>
                    <td className="sum-val">{row.sum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= GEOMETRIC PROGRESSION (GP) ================= */}
      {seqType === 'gp' && (
        <div className="card full-width-card">
          <div className="panel-tab-header">
            <h3>Geometric Progression Studio (Exponential Multiplier)</h3>
            <span className="badge-pill">Formula: aₙ = a₁ · rⁿ⁻¹</span>
          </div>

          <div className="progression-config-row">
            <div className="config-item">
              <label>First Term (a₁):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setGpStart(a => a - 1)}><Minus size={14}/></button>
                <span className="param-value-tag">{gpStart}</span>
                <button type="button" className="stepper-btn" onClick={() => setGpStart(a => a + 1)}><Plus size={14}/></button>
              </div>
            </div>

            <div className="config-item">
              <label>Common Ratio (r):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setGpRatio(r => Math.max(1, r - 1))}><Minus size={14}/></button>
                <span className="param-value-tag">{gpRatio}</span>
                <button type="button" className="stepper-btn" onClick={() => setGpRatio(r => Math.min(5, r + 1))}><Plus size={14}/></button>
              </div>
            </div>

            <div className="config-item">
              <label>Number of Terms (n):</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setGpTermCount(n => Math.max(3, n - 1))}><Minus size={14}/></button>
                <span className="param-value-tag">{gpTermCount}</span>
                <button type="button" className="stepper-btn" onClick={() => setGpTermCount(n => Math.min(14, n + 1))}><Plus size={14}/></button>
              </div>
            </div>
          </div>

          {/* Table of GP */}
          <div className="progression-table-container">
            <table className="prog-table">
              <thead>
                <tr>
                  <th>Term Index (n)</th>
                  <th>Formula Calculation</th>
                  <th>Value (aₙ)</th>
                  <th>Accumulated Sum (Sₙ)</th>
                </tr>
              </thead>
              <tbody>
                {gpTerms.map(row => (
                  <tr key={row.n}>
                    <td><span className="n-badge">n = {row.n}</span></td>
                    <td className="font-mono">{gpStart} &times; ({gpRatio})<sup>{row.n - 1}</sup></td>
                    <td className="font-bold highlight-val">{row.term.toLocaleString()}</td>
                    <td className="sum-val">{row.sum.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= FIBONACCI & GOLDEN RATIO ================= */}
      {seqType === 'fib' && (
        <div className="card full-width-card">
          <div className="panel-tab-header">
            <h3>Fibonacci Sequence &bull; Convergence to the Golden Ratio (φ &asymp; 1.618033...)</h3>
            <span className="badge-pill">Fₙ = Fₙ₋₁ + Fₙ₋₂</span>
          </div>

          <div className="progression-config-row">
            <div className="config-item">
              <label>Sequence Terms to Display:</label>
              <div className="stepper-bundle">
                <button type="button" className="stepper-btn" onClick={() => setFibTerms(t => Math.max(5, t - 1))}><Minus size={14}/></button>
                <span className="param-value-tag">{fibTerms}</span>
                <button type="button" className="stepper-btn" onClick={() => setFibTerms(t => Math.min(22, t + 1))}><Plus size={14}/></button>
              </div>
            </div>
          </div>

          <div className="fib-grid-display">
            {fibSeq.map((val, idx) => {
              const prev = idx > 1 ? fibSeq[idx - 1] : null;
              const ratio = prev && prev > 0 ? (val / prev).toFixed(6) : null;
              return (
                <div key={idx} className="fib-card-item">
                  <div className="fib-sub">Term #{idx}</div>
                  <div className="fib-val">{val}</div>
                  {ratio && (
                    <div className="fib-ratio">
                      F_{idx} / F_{idx - 1} = <strong>{ratio}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
