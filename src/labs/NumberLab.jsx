import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Dices, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Sliders, 
  Hash, 
  Layers, 
  CheckCircle2, 
  Activity,
  History,
  Trash2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { 
  isPrime, 
  getPrimeFactorization, 
  getDivisors, 
  toRoman, 
  checkPerfectSquare, 
  checkPerfectCube 
} from '../utils/mathHelpers';

export default function NumberLab() {
  // Primary state: Value being analyzed
  const [val, setVal] = useState(12);

  // Counter Stepper settings
  const [step, setStep] = useState(1);
  const [allowNegative, setAllowNegative] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Random Generator Settings
  const [randomMin, setRandomMin] = useState(1);
  const [randomMax, setRandomMax] = useState(100);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [selectedFactorPair, setSelectedFactorPair] = useState(null);

  // Sound & alert status
  const [statusMessage, setStatusMessage] = useState('Explore numbers through stepping or random sampling');

  const isZero = val === 0;
  const isMinReached = !allowNegative && val <= 0;

  // Counter Actions
  const handleIncrement = () => {
    setVal(prev => prev + step);
    setClickCount(c => c + 1);
    setStatusMessage(`Added +${step} to value`);
  };

  const handleDecrement = () => {
    if (isMinReached) {
      setStatusMessage('Minimum limit reached (cannot go below 0)');
      return;
    }
    setVal(prev => {
      const next = prev - step;
      return !allowNegative && next < 0 ? 0 : next;
    });
    setClickCount(c => c + 1);
    setStatusMessage(`Subtracted -${step} from value`);
  };

  const handleReset = (target = 0) => {
    setVal(target);
    setClickCount(c => c + 1);
    setStatusMessage(`Reset value to ${target}`);
  };

  const handleMultiply = (mult) => {
    setVal(prev => prev * mult);
    setClickCount(c => c + 1);
    setStatusMessage(`Multiplied by ${mult}`);
  };

  const handleDivide = (div) => {
    setVal(prev => Math.floor(prev / div));
    setClickCount(c => c + 1);
    setStatusMessage(`Divided by ${div} (integer division)`);
  };

  // Random Generator Action
  const handleGenerateRandom = (customMin = null, customMax = null) => {
    const minVal = customMin !== null ? customMin : parseInt(randomMin, 10) || 1;
    const maxVal = customMax !== null ? customMax : parseInt(randomMax, 10) || 100;

    if (minVal >= maxVal) {
      setStatusMessage('⚠️ Min value must be less than Max value');
      return;
    }

    setIsRolling(true);

    const generated = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

    setTimeout(() => {
      setVal(generated);
      setIsRolling(false);
      setHistory(prev => [
        { id: Date.now(), val: generated, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        ...prev.slice(0, 14)
      ]);
      setStatusMessage(`Generated random number ${generated} between [${minVal}, ${maxVal}]`);
    }, 120);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(val.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Computed Properties for the current number
  const primeCheck = val > 1 && isPrime(val);
  const primeFactors = val > 1 ? getPrimeFactorization(val) : [];
  const divisors = val > 0 ? getDivisors(val) : [];
  const squareInfo = checkPerfectSquare(val);
  const cubeInfo = checkPerfectCube(val);
  const roman = toRoman(val);
  const isEven = val % 2 === 0;

  // Factor pairs for visual geometry
  const factorPairs = [];
  if (val > 0) {
    for (let i = 1; i * i <= val; i++) {
      if (val % i === 0) {
        factorPairs.push([i, val / i]);
      }
    }
  }

  // Active matrix grid dimensions (defaults to the most balanced factor pair or selected pair)
  const activePair = selectedFactorPair || (factorPairs.length > 0 ? factorPairs[factorPairs.length - 1] : [1, Math.max(1, Math.min(val, 100))]);

  return (
    <div className="lab-container">
      {/* Lab Header */}
      <div className="lab-header">
        <div className="lab-title-row">
          <span className="lab-badge">
            <Hash size={14} /> Lab 01 &bull; Arithmetic &amp; Number Sense
          </span>
          <span className="sub-tag">Fused Counter &amp; Stochastic Randomizer</span>
        </div>
        <h2>Number Sense &amp; Factorization Lab</h2>
        <p className="lab-desc">
          Step incrementally like a counter or roll randomly like dice to analyze any number. Discover parity, primes, factors, and visual dot geometry in real-time.
        </p>
      </div>

      <div className="number-lab-grid">
        {/* ================= LEFT CONTROLS PANEL ================= */}
        <div className="card control-deck-card">
          <div className="panel-tab-header">
            <h3>Interactive Number Controller</h3>
            <span className="badge-pill">Step &amp; Generate</span>
          </div>

          {/* Big Number Output Box */}
          <div className={`primary-display-box ${isRolling ? 'is-animating' : ''}`}>
            <div className="display-top-meta">
              <span className="tag-label">ANALYZING NUMBER (N)</span>
              <button 
                type="button" 
                onClick={handleCopy} 
                className="mini-copy-btn" 
                title="Copy number to clipboard"
              >
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="giant-number-value" key={val}>
              {val}
            </div>

            <div className="quick-tags-row">
              <span className={`pill-badge ${isEven ? 'pill-blue' : 'pill-purple'}`}>
                {val === 0 ? 'Zero (Even)' : isEven ? 'Even Number (2k)' : 'Odd Number (2k+1)'}
              </span>

              {val > 1 && (
                <span className={`pill-badge ${primeCheck ? 'pill-gold' : 'pill-slate'}`}>
                  {primeCheck ? '★ Prime Number' : 'Composite Number'}
                </span>
              )}

              {squareInfo.isSquare && (
                <span className="pill-badge pill-emerald">
                  Square ({squareInfo.root}²)
                </span>
              )}
            </div>
          </div>

          {/* Conditional Limit Notice */}
          {isMinReached && (
            <div className="limit-alert-banner">
              <AlertCircle size={16} />
              <span>Minimum bound reached (0). Decrement stopped to prevent negative numbers.</span>
            </div>
          )}

          {/* Counter Actions Section */}
          <div className="controller-sub-section">
            <div className="section-title-sm">
              <Layers size={14} /> Counter Controls (Deterministic Step)
            </div>

            <div className="primary-buttons-row">
              <button 
                type="button" 
                className="action-btn btn-minus" 
                onClick={handleDecrement}
                disabled={isMinReached}
                title={`Subtract ${step}`}
              >
                <Minus size={18} />
                <span>Decrement (-{step})</span>
              </button>

              <button 
                type="button" 
                className="action-btn btn-plus" 
                onClick={handleIncrement}
                title={`Add ${step}`}
              >
                <Plus size={18} />
                <span>Increment (+{step})</span>
              </button>
            </div>

            {/* Step Size Selector */}
            <div className="step-options-bar">
              <span className="step-bar-label">
                <Sliders size={13} /> Step:
              </span>
              {[1, 2, 5, 10, 25].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`step-chip ${step === s ? 'active' : ''}`}
                  onClick={() => setStep(s)}
                >
                  +{s}
                </button>
              ))}
            </div>

            {/* Arithmetic Fast Transforms */}
            <div className="math-transforms-row">
              <span className="label-dim">Quick Math:</span>
              <button type="button" className="pill-btn" onClick={() => handleMultiply(2)}>× 2 (Double)</button>
              <button type="button" className="pill-btn" onClick={() => handleDivide(2)}>÷ 2 (Half)</button>
              <button type="button" className="pill-btn" onClick={() => handleMultiply(10)}>× 10</button>
              <button type="button" className="pill-btn" onClick={() => handleReset(0)}>Reset (0)</button>
              <button type="button" className="pill-btn" onClick={() => handleReset(1)}>Reset (1)</button>
            </div>
          </div>

          {/* Random Number Generator Section */}
          <div className="controller-sub-section random-section-box">
            <div className="section-title-sm">
              <Dices size={14} /> Stochastic Random Generator (Monte Carlo Input)
            </div>

            <div className="range-inputs-row">
              <div className="range-input-item">
                <label htmlFor="minValInput">Min Range</label>
                <input 
                  id="minValInput"
                  type="number" 
                  value={randomMin} 
                  onChange={(e) => setRandomMin(e.target.value)} 
                />
              </div>
              <span className="range-sep">to</span>
              <div className="range-input-item">
                <label htmlFor="maxValInput">Max Range</label>
                <input 
                  id="maxValInput"
                  type="number" 
                  value={randomMax} 
                  onChange={(e) => setRandomMax(e.target.value)} 
                />
              </div>
              <button 
                type="button" 
                className="generate-random-btn" 
                onClick={() => handleGenerateRandom()}
              >
                <Dices size={17} />
                <span>Roll Random</span>
              </button>
            </div>

            {/* Preset Ranges */}
            <div className="presets-list">
              <span className="label-dim">Presets:</span>
              <button type="button" className="preset-pill" onClick={() => handleGenerateRandom(1, 10)}>1–10</button>
              <button type="button" className="preset-pill" onClick={() => handleGenerateRandom(1, 50)}>1–50</button>
              <button type="button" className="preset-pill" onClick={() => handleGenerateRandom(1, 100)}>1–100</button>
              <button type="button" className="preset-pill" onClick={() => handleGenerateRandom(1, 500)}>1–500</button>
              <button type="button" className="preset-pill" onClick={() => handleGenerateRandom(2, 12)}>🎲 2-12 (Dice Sum)</button>
            </div>

            {/* Recent History Roll Chips */}
            {history.length > 0 && (
              <div className="history-drawer">
                <div className="history-bar-header">
                  <span>
                    <History size={13} /> Roll History ({history.length})
                  </span>
                  <button 
                    type="button" 
                    className="clear-link" 
                    onClick={() => setHistory([])}
                  >
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
                <div className="history-pill-scroll">
                  {history.map((h, i) => (
                    <button
                      key={h.id}
                      type="button"
                      className={`history-roll-chip ${i === 0 ? 'chip-latest' : ''}`}
                      onClick={() => {
                        setVal(h.val);
                      }}
                      title={`Generated at ${h.time}`}
                    >
                      {h.val}
                      {i === 0 && <span className="latest-dot" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Component State Snapshot (From Counter project's inspector) */}
          <div className="state-inspector-box">
            <div className="inspector-head">
              <Activity size={13} /> Component State Snapshot
            </div>
            <div className="inspector-stats-grid">
              <div className="stat-node">
                <span className="k">N value:</span>
                <span className="v highlight">{val}</span>
              </div>
              <div className="stat-node">
                <span className="k">Step size:</span>
                <span className="v">{step}</span>
              </div>
              <div className="stat-node">
                <span className="k">Interactions:</span>
                <span className="v">{clickCount}</span>
              </div>
              <div className="stat-node">
                <span className="k">Status:</span>
                <span className="v text-truncate">{statusMessage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT MATHEMATICAL ANALYSIS PANEL ================= */}
        <div className="card math-analyzer-card">
          <div className="panel-tab-header">
            <h3>Real-time Mathematical Property Breakdown</h3>
            <span className="badge-pill pill-gold">Instant Evaluation</span>
          </div>

          {/* Cards Grid of Math Insights */}
          <div className="math-insights-grid">
            {/* Parity Card */}
            <div className="insight-card">
              <div className="insight-head">
                <span className="icon-wrap">⚖️</span>
                <h4>Parity &amp; Division</h4>
              </div>
              <div className="insight-body">
                <div className="formula-callout">
                  {val % 2 === 0 ? (
                    <>
                      <strong>{val} = 2 &times; {val / 2}</strong>
                      <p>Even number. Divisible by 2 with remainder 0.</p>
                    </>
                  ) : (
                    <>
                      <strong>{val} = 2 &times; {Math.floor(val / 2)} + 1</strong>
                      <p>Odd number. Leaves remainder 1 when divided by 2.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Prime & Factors Card */}
            <div className="insight-card">
              <div className="insight-head">
                <span className="icon-wrap">💎</span>
                <h4>Prime &amp; Factorization</h4>
              </div>
              <div className="insight-body">
                {val <= 1 ? (
                  <p className="insight-note">Neither prime nor composite by definition.</p>
                ) : primeCheck ? (
                  <div className="prime-certified-box">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <div>
                      <strong>Prime Number!</strong>
                      <p>Only divisible by 1 and itself ({val}). Cannot be broken into smaller integer products.</p>
                    </div>
                  </div>
                ) : (
                  <div className="factors-decomposition">
                    <div className="prime-formula">
                      {val} = {primeFactors.map((f, i) => (
                        <span key={f.prime}>
                          {i > 0 && ' × '}
                          {f.prime}
                          {f.exponent > 1 && <sup>{f.exponent}</sup>}
                        </span>
                      ))}
                    </div>
                    <p className="insight-note">
                      Fundamental Theorem of Arithmetic: Every integer &gt; 1 has a unique prime factorization.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divisors & Multiples Card */}
            <div className="insight-card">
              <div className="insight-head">
                <span className="icon-wrap">🔍</span>
                <h4>Divisors &bull; {divisors.length} Total</h4>
              </div>
              <div className="insight-body">
                <div className="divisors-pills-list">
                  {divisors.slice(0, 16).map(d => (
                    <button
                      key={d}
                      type="button"
                      className="div-pill"
                      onClick={() => {
                        const pair = factorPairs.find(p => p[0] === d || p[1] === d);
                        if (pair) setSelectedFactorPair(pair);
                      }}
                      title={`Factor: ${d}`}
                    >
                      {d}
                    </button>
                  ))}
                  {divisors.length > 16 && <span className="more-pill">+{divisors.length - 16} more</span>}
                </div>
                {factorPairs.length > 0 && (
                  <div className="factor-pairs-note">
                    Factor pairs: {factorPairs.map(([a, b], idx) => (
                      <span 
                        key={idx} 
                        className={`pair-tag ${(activePair[0] === a && activePair[1] === b) ? 'active' : ''}`}
                        onClick={() => setSelectedFactorPair([a, b])}
                      >
                        ({a} &times; {b})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Powers & Roots Card */}
            <div className="insight-card">
              <div className="insight-head">
                <span className="icon-wrap">📐</span>
                <h4>Powers &amp; Roots</h4>
              </div>
              <div className="insight-body">
                <div className="power-stats">
                  <div className="power-row">
                    <span className="p-key">Square (N²):</span>
                    <span className="p-val">{(val * val).toLocaleString()}</span>
                  </div>
                  <div className="power-row">
                    <span className="p-key">Cube (N³):</span>
                    <span className="p-val">{(val * val * val).toLocaleString()}</span>
                  </div>
                  <div className="power-row">
                    <span className="p-key">Square Root (√N):</span>
                    <span className="p-val">{Math.sqrt(Math.max(0, val)).toFixed(3)}</span>
                  </div>
                  <div className="power-row">
                    <span className="p-key">Binary (Base 2):</span>
                    <span className="p-val font-mono">{val >= 0 ? val.toString(2) : 'N/A'}</span>
                  </div>
                  <div className="power-row">
                    <span className="p-key">Roman Numeral:</span>
                    <span className="p-val">{roman}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Dot Array / Geometric Rectangle Model for Students */}
          <div className="visual-geometry-section">
            <div className="geometry-header">
              <div className="geom-title">
                <Lightbulb size={16} className="text-gold" />
                <h4>Visual Geometric Dot Array (Proof of Composite vs Prime)</h4>
              </div>
              <div className="geom-dimensions-badge">
                Showing: {activePair[0]} rows &times; {activePair[1]} columns = {val} dots
              </div>
            </div>

            <p className="geom-explanation">
              {primeCheck 
                ? 'Notice: A prime number can ONLY be arranged into a single line (1 row × N dots). It cannot form any smaller rectangular grid!'
                : `Composite numbers can form rectangles! Click factor pairs above to re-shape the ${val} dots into different grid dimensions.`
              }
            </p>

            <div className="dots-display-stage">
              {val > 200 ? (
                <div className="dots-overflow-notice">
                  <span>Showing scaled preview (N = {val} is too large for individual dot rendering, try N ≤ 144)</span>
                </div>
              ) : val <= 0 ? (
                <div className="dots-overflow-notice">
                  <span>Enter or step to a positive integer to render geometric dot array.</span>
                </div>
              ) : (
                <div 
                  className="dots-grid-container"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(activePair[1], 30)}, 1fr)`
                  }}
                >
                  {Array.from({ length: Math.min(val, 200) }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`dot-item ${primeCheck ? 'dot-prime' : 'dot-composite'}`}
                      title={`Dot #${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
