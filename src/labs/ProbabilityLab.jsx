import React, { useState, useMemo } from 'react';
import { 
  Dices, 
  RotateCcw, 
  BarChart2, 
  Play, 
  Sparkles, 
  Layers, 
  Plus, 
  History, 
  Trash2,
  TrendingUp,
  Info
} from 'lucide-react';
import { calculateStats } from '../utils/mathHelpers';

export default function ProbabilityLab() {
  // Experiment mode: '2dice' (Sum of 2 dice 2-12), '1die' (1-6), 'coins' (Heads/Tails 0/1), 'custom' (Min to Max)
  const [experimentMode, setExperimentMode] = useState('2dice');

  // Custom min/max range
  const [customMin, setCustomMin] = useState(1);
  const [customMax, setCustomMax] = useState(10);

  // Stored samples array
  const [rolls, setRolls] = useState([]);
  const [latestRoll, setLatestRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  // Theoretical probability distributions
  const theoretical = useMemo(() => {
    if (experimentMode === '2dice') {
      // 36 total outcomes: 2:1/36, 3:2/36, 4:3/36, 5:4/36, 6:5/36, 7:6/36, 8:5/36, 9:4/36, 10:3/36, 11:2/36, 12:1/36
      const map = {};
      const ways = { 2:1, 3:2, 4:3, 5:4, 6:5, 7:6, 8:5, 9:4, 10:3, 11:2, 12:1 };
      for (let s = 2; s <= 12; s++) {
        map[s] = (ways[s] / 36);
      }
      return { keys: [2,3,4,5,6,7,8,9,10,11,12], prob: map, expected: 7.0 };
    } else if (experimentMode === '1die') {
      const map = {};
      for (let s = 1; s <= 6; s++) {
        map[s] = 1 / 6;
      }
      return { keys: [1,2,3,4,5,6], prob: map, expected: 3.5 };
    } else if (experimentMode === 'coins') {
      // 0 = Tails, 1 = Heads
      return { keys: [0, 1], prob: { 0: 0.5, 1: 0.5 }, expected: 0.5 };
    } else {
      const min = parseInt(customMin, 10) || 1;
      const max = parseInt(customMax, 10) || 10;
      const count = max - min + 1;
      const keys = [];
      const map = {};
      for (let i = min; i <= max; i++) {
        keys.push(i);
        map[i] = count > 0 ? 1 / count : 0;
      }
      return { keys, prob: map, expected: (min + max) / 2 };
    }
  }, [experimentMode, customMin, customMax]);

  // Roll generator helper
  const generateSingleOutcome = () => {
    if (experimentMode === '2dice') {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      return { val: d1 + d2, details: `[${d1} + ${d2}]` };
    } else if (experimentMode === '1die') {
      const d = Math.floor(Math.random() * 6) + 1;
      return { val: d, details: `Die: ${d}` };
    } else if (experimentMode === 'coins') {
      const flip = Math.random() < 0.5 ? 1 : 0;
      return { val: flip, details: flip === 1 ? 'Heads' : 'Tails' };
    } else {
      const min = parseInt(customMin, 10) || 1;
      const max = parseInt(customMax, 10) || 10;
      const v = Math.floor(Math.random() * (max - min + 1)) + min;
      return { val: v, details: `Value: ${v}` };
    }
  };

  // Run rolls (step by 1 or batch step by N)
  const addRolls = (count = 1) => {
    setIsRolling(true);

    const newOutcomes = [];
    let last = null;
    for (let i = 0; i < count; i++) {
      const outcome = generateSingleOutcome();
      newOutcomes.push(outcome.val);
      last = outcome;
    }

    setTimeout(() => {
      setLatestRoll(last);
      setRolls(prev => [...prev, ...newOutcomes]);
      setIsRolling(false);
    }, count > 1 ? 80 : 120);
  };

  const handleReset = () => {
    setRolls([]);
    setLatestRoll(null);
  };

  // Frequency mapping of observed rolls
  const frequencyMap = useMemo(() => {
    const map = {};
    for (const k of theoretical.keys) {
      map[k] = 0;
    }
    for (const val of rolls) {
      if (map[val] !== undefined) {
        map[val] += 1;
      }
    }
    return map;
  }, [rolls, theoretical]);

  // Find highest frequency to scale histogram bars
  const maxFreq = Math.max(1, ...Object.values(frequencyMap));

  // Compute live statistics
  const stats = useMemo(() => calculateStats(rolls), [rolls]);

  return (
    <div className="lab-container">
      {/* Lab Header */}
      <div className="lab-header">
        <div className="lab-title-row">
          <span className="lab-badge">
            <BarChart2 size={14} /> Lab 03 &bull; Probability &amp; Monte Carlo
          </span>
          <span className="sub-tag">Law of Large Numbers Visualizer</span>
        </div>
        <h2>Stochastic Experiments &amp; Frequency Distribution</h2>
        <p className="lab-desc">
          Combine random trial generators with step counters. Watch experimental outcomes converge toward theoretical probability distributions as your sample size grows.
        </p>
      </div>

      {/* Mode Navigation */}
      <div className="func-types-nav">
        {[
          { id: '2dice', label: '🎲 Two Dice Sum (2–12 Bell Distribution)' },
          { id: '1die', label: '🎲 Single Die (1–6 Uniform Distribution)' },
          { id: 'coins', label: '🪙 Coin Flip (Heads: 1, Tails: 0)' },
          { id: 'custom', label: '⚙️ Custom Range Sampling [Min, Max]' }
        ].map(m => (
          <button
            key={m.id}
            type="button"
            className={`func-tab-btn ${experimentMode === m.id ? 'active' : ''}`}
            onClick={() => {
              setExperimentMode(m.id);
              handleReset();
            }}
          >
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <div className="probability-grid">
        {/* ================= LEFT CONTROLS ================= */}
        <div className="card control-deck-card">
          <div className="panel-tab-header">
            <h3>Trial Generator &amp; Counter</h3>
            <button type="button" className="mini-reset-btn" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Latest Outcome Visual */}
          <div className={`primary-display-box ${isRolling ? 'is-animating' : ''}`}>
            <span className="tag-label">LATEST OUTCOME</span>
            <div className="giant-number-value">
              {latestRoll !== null ? latestRoll.val : '—'}
            </div>
            <div className="quick-tags-row">
              {latestRoll !== null ? (
                <span className="pill-badge pill-gold">
                  {latestRoll.details}
                </span>
              ) : (
                <span className="pill-badge pill-slate">No trials recorded yet</span>
              )}
            </div>
          </div>

          {/* Custom range config if selected */}
          {experimentMode === 'custom' && (
            <div className="custom-range-inputs">
              <label>Min: <input type="number" value={customMin} onChange={e => setCustomMin(e.target.value)} /></label>
              <label>Max: <input type="number" value={customMax} onChange={e => setCustomMax(e.target.value)} /></label>
            </div>
          )}

          {/* Stepping & Batch Trial Buttons */}
          <div className="controller-sub-section">
            <div className="section-title-sm">
              <Layers size={14} /> Trial Step Counters
            </div>

            <div className="primary-buttons-row">
              <button 
                type="button" 
                className="action-btn btn-plus" 
                onClick={() => addRolls(1)}
              >
                <Dices size={18} />
                <span>Roll Single Trial (+1)</span>
              </button>
            </div>

            {/* Batch Step Buttons */}
            <div className="batch-buttons-grid">
              <button type="button" className="batch-pill-btn" onClick={() => addRolls(10)}>
                +10 Trials
              </button>
              <button type="button" className="batch-pill-btn" onClick={() => addRolls(50)}>
                +50 Trials
              </button>
              <button type="button" className="batch-pill-btn" onClick={() => addRolls(100)}>
                +100 Trials
              </button>
              <button type="button" className="batch-pill-btn" onClick={() => addRolls(500)}>
                +500 (Monte Carlo)
              </button>
            </div>
          </div>

          {/* Real-time Descriptive Statistics */}
          <div className="state-inspector-box">
            <div className="inspector-head">
              <TrendingUp size={13} /> Experimental Sample Statistics
            </div>
            <div className="inspector-stats-grid">
              <div className="stat-node">
                <span className="k">Sample Size (N):</span>
                <span className="v highlight">{stats.count}</span>
              </div>
              <div className="stat-node">
                <span className="k">Exp. Mean (x̄):</span>
                <span className="v highlight-x">{stats.mean}</span>
              </div>
              <div className="stat-node">
                <span className="k">Theoretical E[X]:</span>
                <span className="v">{theoretical.expected}</span>
              </div>
              <div className="stat-node">
                <span className="k">Median:</span>
                <span className="v">{stats.median}</span>
              </div>
              <div className="stat-node">
                <span className="k">Mode (Most frequent):</span>
                <span className="v">{stats.mode}</span>
              </div>
              <div className="stat-node">
                <span className="k">Std. Dev (σ):</span>
                <span className="v">{stats.stdDev}</span>
              </div>
            </div>
          </div>

          {/* Pedagogical explanation callout */}
          <div className="pedagogy-card">
            <div className="pedagogy-head">
              <Info size={14} className="text-primary" />
              <span>Student Observation Tip:</span>
            </div>
            <p>
              Notice how the experimental mean <strong>({stats.mean})</strong> gets closer and closer to the theoretical expected value <strong>({theoretical.expected})</strong> as you add more trials! This is the fundamental <em>Law of Large Numbers</em>.
            </p>
          </div>
        </div>

        {/* ================= RIGHT LIVE FREQUENCY HISTOGRAM ================= */}
        <div className="card histogram-card">
          <div className="panel-tab-header">
            <h3>Live Frequency Histogram vs. Theoretical Probability</h3>
            <span className="badge-pill pill-gold">{stats.count} Trials Recorded</span>
          </div>

          {/* Histogram Container */}
          <div className="histogram-visual-area">
            {rolls.length === 0 ? (
              <div className="empty-histogram-placeholder">
                <Dices size={44} className="icon-dim" />
                <h4>No Data Points Yet</h4>
                <p>Click "Roll Single Trial" or batch run "+50 Trials" to populate the distribution curve.</p>
              </div>
            ) : (
              <div className="bars-flex-container">
                {theoretical.keys.map(k => {
                  const count = frequencyMap[k] || 0;
                  const experimentalPercent = stats.count > 0 ? (count / stats.count) * 100 : 0;
                  const theoreticalPercent = (theoretical.prob[k] || 0) * 100;
                  const barHeightPercent = (count / maxFreq) * 100;

                  return (
                    <div key={k} className="histogram-bar-column">
                      {/* Tooltip on top of bar */}
                      <div className="bar-count-tooltip">
                        <span className="count-num">{count}</span>
                        <span className="percent-num">{experimentalPercent.toFixed(1)}%</span>
                      </div>

                      {/* Bar graphical container */}
                      <div className="bar-track">
                        {/* Theoretical target line indicator */}
                        <div 
                          className="theoretical-marker"
                          style={{
                            bottom: `${Math.min(100, (theoreticalPercent / (theoretical.keys.length > 2 ? 20 : 60)) * 100)}%`
                          }}
                          title={`Expected: ${theoreticalPercent.toFixed(1)}%`}
                        />

                        {/* Animated experimental bar */}
                        <div 
                          className="bar-fill" 
                          style={{ height: `${Math.max(4, barHeightPercent)}%` }}
                        />
                      </div>

                      {/* X-axis label */}
                      <div className="bar-x-label">
                        {experimentMode === 'coins' ? (k === 1 ? 'Heads (1)' : 'Tails (0)') : k}
                      </div>

                      <div className="bar-theo-sub">
                        Target: {theoreticalPercent.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="histogram-legend">
            <div className="legend-item">
              <span className="legend-color-box exp-color" />
              <span>Observed Experimental Frequency (%)</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker-line" />
              <span>Theoretical Target Probability Benchmark</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
