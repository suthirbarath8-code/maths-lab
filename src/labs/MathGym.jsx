import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Dices, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  HelpCircle, 
  Zap, 
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { isPrime } from '../utils/mathHelpers';

export default function MathGym() {
  // Counters for score, streak, and level
  const [level, setLevel] = useState(1); // 1 to 3
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  // Current random question
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Generate a random math challenge based on level
  const generateNewQuestion = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setShowHint(false);

    const questionTypes = ['prime', 'function', 'arithmetic', 'divisibility', 'parity'];
    const chosenType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let q = {};

    if (chosenType === 'prime') {
      const candidates = level === 1 
        ? [7, 9, 11, 15, 17, 21, 23, 27] 
        : level === 2 
        ? [31, 33, 37, 49, 51, 53, 57, 59] 
        : [73, 77, 79, 87, 89, 91, 97];
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      const prime = isPrime(target);

      q = {
        title: 'Prime Number Verification',
        text: `Is the integer ${target} a prime number or a composite number?`,
        options: ['Prime Number (Only divisible by 1 and itself)', 'Composite Number (Has other factors)'],
        correctIndex: prime ? 0 : 1,
        hint: `Check if ${target} is divisible by small primes like 2, 3, 5, or 7.`,
        explanation: prime 
          ? `Correct! ${target} cannot be divided evenly by any number other than 1 and ${target}.` 
          : `Correct! ${target} is composite because it has other divisors.`
      };
    } else if (chosenType === 'function') {
      const a = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const b = Math.floor(Math.random() * 6) - 2; // -2 to 3
      const x = Math.floor(Math.random() * 5) + 1; // 1 to 5
      const ans = a * x + b;

      // Distractors
      const d1 = ans + 2;
      const d2 = ans - 2;
      const d3 = ans + 4;
      const opts = [ans, d1, d2, d3].sort(() => Math.random() - 0.5);

      q = {
        title: 'Function Evaluation f(x)',
        text: `Given the linear function f(x) = ${a}x ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}, what is f(${x})?`,
        options: opts.map(o => `f(${x}) = ${o}`),
        correctIndex: opts.indexOf(ans),
        hint: `Substitute x = ${x} into ${a}(${x}) ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)}.`,
        explanation: `Step-by-step: f(${x}) = ${a}(${x}) ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${a * x} ${b >= 0 ? '+ ' + b : '- ' + Math.abs(b)} = ${ans}.`
      };
    } else if (chosenType === 'arithmetic') {
      const n1 = Math.floor(Math.random() * (level * 15)) + 8;
      const n2 = Math.floor(Math.random() * 12) + 2;
      const ans = n1 * n2;
      const d1 = ans + n2;
      const d2 = ans - n2;
      const d3 = ans + 10;
      const opts = [ans, d1, d2, d3].sort(() => Math.random() - 0.5);

      q = {
        title: 'Mental Math Multiplication',
        text: `What is ${n1} &times; ${n2}?`,
        options: opts.map(o => `${o}`),
        correctIndex: opts.indexOf(ans),
        hint: `Break ${n1} into convenient parts: e.g. (${Math.floor(n1 / 10) * 10} + ${n1 % 10}) &times; ${n2}.`,
        explanation: `${n1} &times; ${n2} = ${ans}.`
      };
    } else if (chosenType === 'divisibility') {
      const base = Math.floor(Math.random() * 50) + 10;
      const num = base * 3 + (Math.random() < 0.5 ? 0 : 1);
      const isDiv = num % 3 === 0;

      q = {
        title: 'Divisibility Rule of 3',
        text: `Is the number ${num} evenly divisible by 3?`,
        options: ['Yes, it is divisible by 3', 'No, it has a remainder'],
        correctIndex: isDiv ? 0 : 1,
        hint: 'Divisibility rule for 3: Sum the digits! If the sum is divisible by 3, the entire number is.',
        explanation: `Sum of digits of ${num}: ${num.toString().split('').join(' + ')} = ${num.toString().split('').reduce((a, b) => parseInt(a, 10) + parseInt(b, 10), 0)}. Since that is ${isDiv ? '' : 'not '}divisible by 3, ${num} is ${isDiv ? '' : 'not '}divisible by 3.`
      };
    } else {
      const n = Math.floor(Math.random() * 100) + 1;
      const isEven = n % 2 === 0;

      q = {
        title: 'Parity Concept',
        text: `Is ${n} Even or Odd?`,
        options: ['Even (Form: 2k)', 'Odd (Form: 2k + 1)'],
        correctIndex: isEven ? 0 : 1,
        hint: `Look at the last digit: ${n % 10}.`,
        explanation: `${n} ends in ${n % 10}, making it ${isEven ? 'Even' : 'Odd'}.`
      };
    }

    setQuestion(q);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [level]);

  // Handle Option Click
  const handleSelect = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);
    setTotalAnswered(t => t + 1);

    if (idx === question.correctIndex) {
      setScore(s => s + 10 * level);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleResetGame = () => {
    setScore(0);
    setStreak(0);
    setTotalAnswered(0);
    generateNewQuestion();
  };

  return (
    <div className="lab-container">
      {/* Header */}
      <div className="lab-header">
        <div className="lab-title-row">
          <span className="lab-badge">
            <Trophy size={14} /> Lab 05 &bull; Student Math Gym
          </span>
          <span className="sub-tag">Randomized Practice &amp; Streak Counter</span>
        </div>
        <h2>Adaptive Mathematical Challenge Arena</h2>
        <p className="lab-desc">
          Test your math instincts with procedural challenges generated on the fly. Track your score counter, build answering streaks, and master key concepts.
        </p>
      </div>

      <div className="math-gym-grid">
        {/* ================= LEFT SCOREBOARD ================= */}
        <div className="card control-deck-card">
          <div className="panel-tab-header">
            <h3>Player Scoreboard</h3>
            <button type="button" className="mini-reset-btn" onClick={handleResetGame}>
              <RotateCcw size={13} /> Reset Scores
            </button>
          </div>

          {/* Primary Score Counter */}
          <div className="primary-display-box">
            <span className="tag-label">POINTS EARNED</span>
            <div className="giant-number-value" key={score}>
              {score}
            </div>
            <div className="quick-tags-row">
              <span className="pill-badge pill-gold">
                <Flame size={14} className="icon-primary" /> Streak: {streak} in a row
              </span>
            </div>
          </div>

          {/* Difficulty Level Stepper Counter */}
          <div className="controller-sub-section">
            <div className="section-title-sm">
              <Award size={14} /> Difficulty Tier (Counter Stepper)
            </div>
            <div className="difficulty-stepper-row">
              {[
                { lvl: 1, label: 'Tier 1 &bull; Explorer' },
                { lvl: 2, label: 'Tier 2 &bull; Scholar' },
                { lvl: 3, label: 'Tier 3 &bull; Master' }
              ].map(item => (
                <button
                  key={item.lvl}
                  type="button"
                  className={`diff-tier-chip ${level === item.lvl ? 'active' : ''}`}
                  onClick={() => {
                    setLevel(item.lvl);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accuracy & Game Stats */}
          <div className="state-inspector-box">
            <div className="inspector-head">
              <Zap size={13} /> Performance Stats
            </div>
            <div className="inspector-stats-grid">
              <div className="stat-node">
                <span className="k">Questions:</span>
                <span className="v highlight">{totalAnswered}</span>
              </div>
              <div className="stat-node">
                <span className="k">Active Level:</span>
                <span className="v">Tier {level}</span>
              </div>
              <div className="stat-node">
                <span className="k">Multiplier:</span>
                <span className="v">{level}x pts</span>
              </div>
              <div className="stat-node">
                <span className="k">Bonus:</span>
                <span className="v">{streak >= 3 ? '🔥 2x Active' : 'Normal'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT QUESTION CARD ================= */}
        <div className="card question-stage-card">
          {question && (
            <>
              <div className="panel-tab-header">
                <h3>{question.title}</h3>
                <span className="badge-pill pill-gold">Question #{totalAnswered + 1}</span>
              </div>

              <div className="question-prompt-box">
                <p className="question-text" dangerouslySetInnerHTML={{ __html: question.text }} />
              </div>

              {/* Multiple Choice Options */}
              <div className="options-grid">
                {question.options.map((opt, idx) => {
                  let statusClass = '';
                  if (isSubmitted) {
                    if (idx === question.correctIndex) {
                      statusClass = 'option-correct';
                    } else if (idx === selectedOption) {
                      statusClass = 'option-wrong';
                    } else {
                      statusClass = 'option-faded';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`quiz-option-btn ${statusClass}`}
                      onClick={() => handleSelect(idx)}
                      disabled={isSubmitted}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span className="option-label" dangerouslySetInnerHTML={{ __html: opt }} />
                      {isSubmitted && idx === question.correctIndex && (
                        <CheckCircle size={18} className="option-icon-correct" />
                      )}
                      {isSubmitted && idx === selectedOption && idx !== question.correctIndex && (
                        <XCircle size={18} className="option-icon-wrong" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Educational Explanation */}
              {isSubmitted && (
                <div className={`feedback-explanation-box ${selectedOption === question.correctIndex ? 'success-box' : 'review-box'}`}>
                  <div className="feedback-head">
                    {selectedOption === question.correctIndex ? (
                      <>
                        <Sparkles size={18} className="text-emerald" />
                        <strong>Excellent! That's correct.</strong>
                      </>
                    ) : (
                      <>
                        <HelpCircle size={18} className="text-primary" />
                        <strong>Nice effort! Here's how to solve it:</strong>
                      </>
                    )}
                  </div>
                  <p className="feedback-body" dangerouslySetInnerHTML={{ __html: question.explanation }} />

                  <div className="next-action-row">
                    <button 
                      type="button" 
                      className="next-question-btn" 
                      onClick={() => {
                        generateNewQuestion();
                      }}
                    >
                      <span>Next Random Challenge</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Hint Accordion */}
              {!isSubmitted && (
                <div className="hint-container">
                  <button 
                    type="button" 
                    className="hint-toggle-btn" 
                    onClick={() => setShowHint(!showHint)}
                  >
                    <HelpCircle size={14} />
                    <span>{showHint ? 'Hide Helpful Hint' : 'Need a hint? Click here'}</span>
                  </button>
                  {showHint && (
                    <div className="hint-callout">
                      💡 {question.hint}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
