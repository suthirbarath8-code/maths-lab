import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';

export default function CheatSheetModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <BookOpen size={20} className="icon-primary" />
            <h3>Student Mathematical Reference Guide</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-content-scroll">
          <div className="cheat-section">
            <h4>1. Number Sense &amp; Parity</h4>
            <ul>
              <li><strong>Even Number:</strong> Any integer of the form <code>2k</code> (ends in 0, 2, 4, 6, 8).</li>
              <li><strong>Odd Number:</strong> Any integer of the form <code>2k + 1</code> (ends in 1, 3, 5, 7, 9).</li>
              <li><strong>Prime Number:</strong> An integer greater than 1 whose only divisors are 1 and itself (e.g. 2, 3, 5, 7, 11, 13...). Note: 2 is the only even prime!</li>
              <li><strong>Composite Number:</strong> A positive integer that can be formed by multiplying two smaller positive integers.</li>
            </ul>
          </div>

          <div className="cheat-section">
            <h4>2. Functions &amp; Graphs</h4>
            <ul>
              <li><strong>Linear:</strong> <code>f(x) = mx + c</code> where <code>m</code> is slope (rate of change) and <code>c</code> is the y-intercept.</li>
              <li><strong>Quadratic:</strong> <code>f(x) = ax² + bx + c</code>. Graph is a parabola. Vertex at <code>x = -b / (2a)</code>.</li>
              <li><strong>Discriminant (Δ):</strong> <code>Δ = b² - 4ac</code>. If Δ &gt; 0 (2 real roots); Δ = 0 (1 repeated root); Δ &lt; 0 (no real roots).</li>
            </ul>
          </div>

          <div className="cheat-section">
            <h4>3. Probability &amp; Statistics</h4>
            <ul>
              <li><strong>Theoretical Probability:</strong> <code>P(E) = (Favorable Outcomes) / (Total Possible Outcomes)</code>.</li>
              <li><strong>Law of Large Numbers:</strong> As the number of randomly generated trials increases, the experimental frequency approaches theoretical probability.</li>
              <li><strong>Mean (x̄):</strong> Sum of all items divided by count.</li>
              <li><strong>Median:</strong> The middle value when values are ordered.</li>
              <li><strong>Mode:</strong> The most frequently occurring value.</li>
            </ul>
          </div>

          <div className="cheat-section">
            <h4>4. Sequences &amp; Step Functions</h4>
            <ul>
              <li><strong>Arithmetic Progression:</strong> <code>aₙ = a₁ + (n - 1)d</code> &bull; Sum: <code>Sₙ = n/2 · (2a₁ + (n - 1)d)</code>.</li>
              <li><strong>Geometric Progression:</strong> <code>aₙ = a₁ · rⁿ⁻¹</code>.</li>
              <li><strong>Collatz Rule:</strong> If <code>n</code> is even &rarr; <code>n / 2</code>; if <code>n</code> is odd &rarr; <code>3n + 1</code>.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <span>Tip: Use keyboard shortcut <kbd>Esc</kbd> anytime to close this reference.</span>
          <button type="button" className="btn-done" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
