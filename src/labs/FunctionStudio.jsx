import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  Dices, 
  RotateCcw, 
  TrendingUp, 
  Layers, 
  HelpCircle,
  Eye,
  Sliders,
  ChevronRight
} from 'lucide-react';

export default function FunctionStudio() {
  // Function types: linear, quadratic, cubic, sin, abs
  const [funcType, setFuncType] = useState('quadratic');

  // Coefficients managed via Counter Steppers
  const [paramA, setParamA] = useState(1);
  const [paramB, setParamB] = useState(0);
  const [paramC, setParamC] = useState(-4);

  // Tested X-value (can be stepped or randomized)
  const [testX, setTestX] = useState(2);
  const [randomStepCount, setRandomStepCount] = useState(0);

  // Evaluate f(x)
  const evaluate = (x) => {
    switch (funcType) {
      case 'linear':
        return paramA * x + paramB;
      case 'quadratic':
        return paramA * Math.pow(x, 2) + paramB * x + paramC;
      case 'cubic':
        return paramA * Math.pow(x, 3) + paramB * Math.pow(x, 2) + paramC * x;
      case 'sin':
        return paramA * Math.sin(paramB * x + paramC);
      case 'abs':
        return paramA * Math.abs(x - paramB) + paramC;
      default:
        return x;
    }
  };

  const currentY = evaluate(testX);

  // Generate random X to test student hypothesis
  const handleRandomX = () => {
    const rand = Math.floor(Math.random() * 17) - 8; // -8 to +8
    setTestX(rand);
    setRandomStepCount(c => c + 1);
  };

  const stepX = (delta) => {
    setTestX(x => Math.max(-10, Math.min(10, x + delta)));
  };

  // Adjust parameters
  const adjustParam = (setter, curr, delta) => {
    setter(curr + delta);
  };

  const resetParams = () => {
    if (funcType === 'quadratic') {
      setParamA(1);
      setParamB(0);
      setParamC(-4);
    } else if (funcType === 'linear') {
      setParamA(2);
      setParamB(1);
      setParamC(0);
    } else if (funcType === 'sin') {
      setParamA(3);
      setParamB(1);
      setParamC(0);
    } else {
      setParamA(1);
      setParamB(0);
      setParamC(0);
    }
    setTestX(2);
  };

  // SVG coordinate transformation
  // Domain: X from -8 to 8, Y from -12 to 12
  const svgWidth = 480;
  const svgHeight = 360;
  const domainMinX = -8;
  const domainMaxX = 8;
  const domainMinY = -12;
  const domainMaxY = 12;

  const toSvgX = (x) => ((x - domainMinX) / (domainMaxX - domainMinX)) * svgWidth;
  const toSvgY = (y) => svgHeight - ((y - domainMinY) / (domainMaxY - domainMinY)) * svgHeight;

  // Generate SVG curve path
  const curvePath = useMemo(() => {
    const points = [];
    const stepSize = 0.2;
    for (let x = domainMinX; x <= domainMaxX; x += stepSize) {
      const y = evaluate(x);
      // clamp extreme numbers for drawing
      if (!isNaN(y) && isFinite(y)) {
        points.push(`${toSvgX(x)},${toSvgY(y)}`);
      }
    }
    return points.length > 0 ? `M ${points.join(' L ')}` : '';
  }, [funcType, paramA, paramB, paramC]);

  // Quadratic specific insights (Vertex, Discriminant, Roots)
  const quadraticInsights = useMemo(() => {
    if (funcType !== 'quadratic') return null;
    const a = paramA;
    const b = paramB;
    const c = paramC;
    const discriminant = b * b - 4 * a * c;
    const vertexX = a !== 0 ? -b / (2 * a) : 0;
    const vertexY = evaluate(vertexX);

    let rootsDesc = '';
    if (discriminant > 0) {
      const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      rootsDesc = `Two Real Roots: x = ${r1.toFixed(2)}, x = ${r2.toFixed(2)}`;
    } else if (discriminant === 0) {
      const r = -b / (2 * a);
      rootsDesc = `One Repeated Root: x = ${r.toFixed(2)}`;
    } else {
      rootsDesc = 'No Real Roots (Curve does not intersect X-axis)';
    }

    return {
      discriminant,
      vertexX: Number(vertexX.toFixed(2)),
      vertexY: Number(vertexY.toFixed(2)),
      rootsDesc,
      direction: a > 0 ? 'Opens Upward (Convex minimum)' : a < 0 ? 'Opens Downward (Concave maximum)' : 'Degenerates to Linear line'
    };
  }, [funcType, paramA, paramB, paramC]);

  // Table of integer values
  const tableValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(x => ({
    x,
    y: evaluate(x)
  }));

  // Human readable formula string
  const formulaString = useMemo(() => {
    switch (funcType) {
      case 'linear':
        return `f(x) = ${paramA}x ${paramB >= 0 ? '+ ' + paramB : '- ' + Math.abs(paramB)}`;
      case 'quadratic': {
        const signB = paramB >= 0 ? `+ ${paramB}x` : `- ${Math.abs(paramB)}x`;
        const signC = paramC >= 0 ? `+ ${paramC}` : `- ${Math.abs(paramC)}`;
        return `f(x) = ${paramA}x² ${paramB !== 0 ? signB : ''} ${paramC !== 0 ? signC : ''}`;
      }
      case 'sin':
        return `f(x) = ${paramA} · sin(${paramB}x ${paramC >= 0 ? '+ ' + paramC : '- ' + Math.abs(paramC)})`;
      case 'abs':
        return `f(x) = ${paramA}|x ${paramB >= 0 ? '- ' + paramB : '+ ' + Math.abs(paramB)}| ${paramC >= 0 ? '+ ' + paramC : '- ' + Math.abs(paramC)}`;
      case 'cubic':
        return `f(x) = ${paramA}x³ ${paramB >= 0 ? '+ ' + paramB : '- ' + Math.abs(paramB)}x² + ${paramC}x`;
      default:
        return 'f(x)';
    }
  }, [funcType, paramA, paramB, paramC]);

  return (
    <div className="lab-container">
      {/* Lab Header */}
      <div className="lab-header">
        <div className="lab-title-row">
          <span className="lab-badge">
            <TrendingUp size={14} /> Lab 02 &bull; Interactive Function Studio
          </span>
          <span className="sub-tag">Visual Cartesian Grapher &amp; Algebraic Simulator</span>
        </div>
        <h2>Experimental Function &amp; Coordinate Studio</h2>
        <p className="lab-desc">
          Morph algebraic curves in real time by stepping function coefficients with counter buttons. Test random inputs to verify mathematical predictions instantly.
        </p>
      </div>

      {/* Function Type Selector Tabs */}
      <div className="func-types-nav">
        {[
          { id: 'quadratic', label: 'Quadratic: f(x) = ax² + bx + c', icon: '∪' },
          { id: 'linear', label: 'Linear: f(x) = mx + c', icon: '/' },
          { id: 'sin', label: 'Trigonometric: A·sin(ωx)', icon: '~' },
          { id: 'abs', label: 'Absolute Value: a|x-h|', icon: 'V' },
          { id: 'cubic', label: 'Cubic: ax³ + bx² + cx', icon: 'S' }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`func-tab-btn ${funcType === t.id ? 'active' : ''}`}
            onClick={() => {
              setFuncType(t.id);
              resetParams();
            }}
          >
            <span className="func-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="function-studio-grid">
        {/* ================= LEFT CONTROLS & STEPPERS ================= */}
        <div className="card func-controls-card">
          <div className="panel-tab-header">
            <h3>Coefficient Steppers</h3>
            <button type="button" className="mini-reset-btn" onClick={resetParams}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Active Formula Banner */}
          <div className="formula-display-banner">
            <span className="banner-sub">ACTIVE MATHEMATICAL FUNCTION</span>
            <div className="banner-formula">{formulaString}</div>
          </div>

          {/* Parameter A Controller */}
          <div className="param-counter-row">
            <div className="param-meta">
              <span className="param-symbol">a</span>
              <span className="param-desc">
                {funcType === 'quadratic' ? 'Curvature / Direction' : funcType === 'linear' ? 'Slope (m)' : 'Amplitude'}
              </span>
            </div>
            <div className="stepper-bundle">
              <button 
                type="button" 
                className="stepper-btn" 
                onClick={() => adjustParam(setParamA, paramA, -1)}
              >
                <Minus size={14} />
              </button>
              <span className="param-value-tag">{paramA}</span>
              <button 
                type="button" 
                className="stepper-btn" 
                onClick={() => adjustParam(setParamA, paramA, 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Parameter B Controller */}
          <div className="param-counter-row">
            <div className="param-meta">
              <span className="param-symbol">b</span>
              <span className="param-desc">
                {funcType === 'quadratic' ? 'Linear term coefficient' : funcType === 'linear' ? 'Y-intercept (c)' : 'Frequency (ω)'}
              </span>
            </div>
            <div className="stepper-bundle">
              <button 
                type="button" 
                className="stepper-btn" 
                onClick={() => adjustParam(setParamB, paramB, -1)}
              >
                <Minus size={14} />
              </button>
              <span className="param-value-tag">{paramB}</span>
              <button 
                type="button" 
                className="stepper-btn" 
                onClick={() => adjustParam(setParamB, paramB, 1)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Parameter C Controller */}
          {funcType !== 'linear' && (
            <div className="param-counter-row">
              <div className="param-meta">
                <span className="param-symbol">c</span>
                <span className="param-desc">
                  {funcType === 'quadratic' ? 'Constant (Vertical shift)' : 'Phase / Offset'}
                </span>
              </div>
              <div className="stepper-bundle">
                <button 
                  type="button" 
                  className="stepper-btn" 
                  onClick={() => adjustParam(setParamC, paramC, -1)}
                >
                  <Minus size={14} />
                </button>
                <span className="param-value-tag">{paramC}</span>
                <button 
                  type="button" 
                  className="stepper-btn" 
                  onClick={() => adjustParam(setParamC, paramC, 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Tested Input X Controller (Stepping + Random Generator) */}
          <div className="tested-input-box">
            <div className="tested-head">
              <div className="tested-title">
                <Sliders size={14} /> Input Variable (x) Evaluation
              </div>
              <button 
                type="button" 
                className="random-x-pill" 
                onClick={handleRandomX} 
                title="Pick random test x between -8 and +8"
              >
                <Dices size={14} />
                <span>🎲 Random Test x</span>
              </button>
            </div>

            <div className="x-stepper-row">
              <button type="button" className="step-circle-btn" onClick={() => stepX(-1)}>
                <Minus size={16} />
              </button>
              <div className="evaluated-pair-display">
                <div className="pair-item">
                  <span className="k">Input x:</span>
                  <span className="v highlight-x">{testX}</span>
                </div>
                <div className="pair-arrow">
                  <ChevronRight size={18} />
                </div>
                <div className="pair-item">
                  <span className="k">Output f(x):</span>
                  <span className="v highlight-y">{Number(currentY.toFixed(2))}</span>
                </div>
              </div>
              <button type="button" className="step-circle-btn" onClick={() => stepX(1)}>
                <Plus size={16} />
              </button>
            </div>

            {/* Arithmetic Evaluation Breakdown */}
            <div className="calculation-breakdown">
              <span className="calc-label">Step-by-Step Arithmetic:</span>
              <p className="calc-expr">
                {funcType === 'quadratic' && (
                  `${paramA}(${testX})² + (${paramB})(${testX}) + (${paramC}) = ${paramA * testX * testX} + (${paramB * testX}) + (${paramC}) = ${Number(currentY.toFixed(2))}`
                )}
                {funcType === 'linear' && (
                  `${paramA}(${testX}) + (${paramB}) = ${paramA * testX} + (${paramB}) = ${Number(currentY.toFixed(2))}`
                )}
                {funcType === 'sin' && (
                  `${paramA} · sin(${paramB * testX + paramC} rad) = ${Number(currentY.toFixed(2))}`
                )}
                {funcType === 'abs' && (
                  `${paramA} · |${testX - paramB}| + (${paramC}) = ${Number(currentY.toFixed(2))}`
                )}
                {funcType === 'cubic' && (
                  `${paramA}(${testX})³ + ${paramB}(${testX})² + ${paramC}(${testX}) = ${Number(currentY.toFixed(2))}`
                )}
              </p>
            </div>
          </div>

          {/* Quadratic Key Properties Card */}
          {quadraticInsights && (
            <div className="insights-summary-callout">
              <div className="summary-title">Parabola Properties</div>
              <div className="properties-matrix">
                <div>
                  <span className="prop-k">Vertex (h, k):</span>
                  <strong className="prop-v">({quadraticInsights.vertexX}, {quadraticInsights.vertexY})</strong>
                </div>
                <div>
                  <span className="prop-k">Discriminant (Δ):</span>
                  <strong className="prop-v">{quadraticInsights.discriminant}</strong>
                </div>
                <div className="prop-full">
                  <span className="prop-k">Roots:</span>
                  <span className="prop-text">{quadraticInsights.rootsDesc}</span>
                </div>
                <div className="prop-full">
                  <span className="prop-k">Behavior:</span>
                  <span className="prop-text">{quadraticInsights.direction}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT INTERACTIVE GRAPH & TABLE ================= */}
        <div className="card graph-stage-card">
          <div className="panel-tab-header">
            <h3>Cartesian Coordinate Plane</h3>
            <span className="badge-pill">Dynamic Vector Plot</span>
          </div>

          {/* SVG Canvas Plotter */}
          <div className="svg-plot-wrapper">
            <svg 
              className="function-svg" 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background grid lines */}
              <g className="grid-lines" opacity="0.15" stroke="currentColor">
                {[-6, -4, -2, 2, 4, 6].map(gx => (
                  <line 
                    key={`gx-${gx}`} 
                    x1={toSvgX(gx)} 
                    y1={0} 
                    x2={toSvgX(gx)} 
                    y2={svgHeight} 
                  />
                ))}
                {[-8, -4, 4, 8].map(gy => (
                  <line 
                    key={`gy-${gy}`} 
                    x1={0} 
                    y1={toSvgY(gy)} 
                    x2={svgWidth} 
                    y2={toSvgY(gy)} 
                  />
                ))}
              </g>

              {/* Main Axes */}
              {/* X-Axis */}
              <line 
                x1={0} 
                y1={toSvgY(0)} 
                x2={svgWidth} 
                y2={toSvgY(0)} 
                stroke="var(--color-axis)" 
                strokeWidth="2" 
              />
              {/* Y-Axis */}
              <line 
                x1={toSvgX(0)} 
                y1={0} 
                x2={toSvgX(0)} 
                y2={svgHeight} 
                stroke="var(--color-axis)" 
                strokeWidth="2" 
              />

              {/* Axis labels & ticks */}
              {[-6, -4, -2, 2, 4, 6].map(t => (
                <text 
                  key={`tx-${t}`} 
                  x={toSvgX(t)} 
                  y={toSvgY(0) + 14} 
                  className="axis-number" 
                  textAnchor="middle"
                >
                  {t}
                </text>
              ))}
              {[-8, -4, 4, 8].map(t => (
                <text 
                  key={`ty-${t}`} 
                  x={toSvgX(0) - 8} 
                  y={toSvgY(t) + 4} 
                  className="axis-number" 
                  textAnchor="end"
                >
                  {t}
                </text>
              ))}

              {/* Rendered Function Curve Path */}
              <path 
                d={curvePath} 
                fill="none" 
                stroke="var(--color-curve)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Highlight Tested Point (x, f(x)) */}
              {toSvgY(currentY) >= 0 && toSvgY(currentY) <= svgHeight && (
                <g className="tested-point-group">
                  {/* Dotted guideline down to X axis */}
                  <line 
                    x1={toSvgX(testX)} 
                    y1={toSvgY(currentY)} 
                    x2={toSvgX(testX)} 
                    y2={toSvgY(0)} 
                    stroke="var(--color-primary)" 
                    strokeDasharray="4 3" 
                    strokeWidth="1.5" 
                  />
                  {/* Dotted guideline over to Y axis */}
                  <line 
                    x1={toSvgX(testX)} 
                    y1={toSvgY(currentY)} 
                    x2={toSvgX(0)} 
                    y2={toSvgY(currentY)} 
                    stroke="var(--color-primary)" 
                    strokeDasharray="4 3" 
                    strokeWidth="1.5" 
                  />
                  {/* Glowing Point Marker */}
                  <circle 
                    cx={toSvgX(testX)} 
                    cy={toSvgY(currentY)} 
                    r="8" 
                    className="point-pulse-outer" 
                  />
                  <circle 
                    cx={toSvgX(testX)} 
                    cy={toSvgY(currentY)} 
                    r="5" 
                    className="point-center" 
                  />
                  {/* Coordinate Label */}
                  <text 
                    x={toSvgX(testX) + 10} 
                    y={toSvgY(currentY) - 10} 
                    className="point-label"
                  >
                    ({testX}, {currentY.toFixed(1)})
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Quick Value Exploration Table */}
          <div className="table-preview-section">
            <div className="table-caption">
              <span>Quick Function Table: x &isin; [-4, 4] (Click any row to test)</span>
            </div>
            <div className="mini-values-table">
              {tableValues.map(item => (
                <button
                  key={item.x}
                  type="button"
                  className={`table-cell-pill ${testX === item.x ? 'selected' : ''}`}
                  onClick={() => {
                    setTestX(item.x);
                  }}
                >
                  <span className="tx">x = {item.x}</span>
                  <span className="ty">y = {Number(item.y.toFixed(1))}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
