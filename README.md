# 🧮 MathLab Studio &bull; Experimental Mathematics Platform for Students

> An interactive, visual mathematics laboratory combining deterministic step-counter dynamics with stochastic random sampling, built with **React**, **Vite**, and **100% Poppins typography** in an **exclusive Navy aesthetic**.

---

## 🌟 Genesis: Combining Counter Application & Random Number Generator

MathLab Studio unifies the core mechanisms of two standalone projects:
1. **Counter Application (`F:\counter application`)**:
   - Deterministic stepping ($+1, -1, +5, \times 2, \div 2$), bounds checking, state snapshot inspection, and milestone indicators.
2. **Random Number Generator (`F:\w8`)**:
   - Stochastic uniform sampling across customizable $[min, max]$ intervals, preset ranges, animated rolls, roll history memory, and the signature **Navy Indigo** palette and background.

### Why this combination makes learning math easy for students:
Abstract mathematics becomes intuitive when students can **experiment**. Stepping through values sequentially (discrete calculus, sequences, step functions) alongside generating random trials (Monte Carlo simulation, empirical probability, testing algebraic hypotheses) empowers students to develop direct mathematical intuition through play.

---

## 🔬 5 Interactive Educational Math Labs

### 1. 🔢 Number Sense & Factorization Lab
- **Interactive Controls:** Increment/decrement with custom step size or roll random integers across custom domains.
- **Parity Analyzer:** Real-time even/odd determination with formal proofs ($2k$ vs $2k + 1$).
- **Prime & Factorization Engine:** Instant prime detection with prime factor decomposition trees (e.g., $120 = 2^3 \times 3 \times 5$).
- **Geometric Dot Array Matrix:** Visual proof of prime vs composite numbers. Prime numbers can only form a single straight line, while composites re-orient into clickable 2D rectangular factor grids ($w \times h$).
- **Power & Base Insights:** Square root ($\sqrt{n}$), cube root, square, binary, and Roman numerals.

### 2. 📈 Interactive Function Studio & Cartesian Grapher
- **Live SVG Vector Graph:** Dynamic Cartesian coordinate plane with labeled axes, grid lines, and interactive function curves.
- **Parameter Steppers:** Adjust coefficients $a, b, c$ using Counter buttons and immediately observe the parabola or line transform.
- **Hypothesis Testing (Random $x$):** Press "🎲 Random Test $x$" to compute $f(x)$ with full step-by-step arithmetic shown.
- **Supported Functions:** Quadratic ($ax^2 + bx + c$), Linear ($mx + c$), Trigonometric ($A \sin(\omega x)$), Absolute Value ($a|x - h|$), and Cubic.

### 3. 🎲 Probability & Monte Carlo Simulator
- **Experiments:** 2 Dice Sum ($2-12$), Single Die ($1-6$), Coin Flips ($0/1$), and Custom $[A, B]$ intervals.
- **Batch Step Counters:** Run $+1$ trial, $+10$, $+50$, $+100$, or $+500$ Monte Carlo trials at once.
- **Live Frequency Histogram:** Animated histogram comparing experimental percentages against theoretical target benchmarks. Students visually witness the **Law of Large Numbers**.
- **Real-time Statistics:** Sample Size ($N$), Experimental Mean ($\bar{x}$), Theoretical Expected Value ($E[X]$), Median, Mode, Range, and Standard Deviation ($\sigma$).

### 4. ⚡ Step Sequences & Hailstone Dynamics
- **3n + 1 Collatz (Hailstone) Conjecture:** Pick any seed or roll a random seed. Step forward or auto-play while the counter tracks steps and peak altitude until crashing into the $4 \to 2 \to 1$ loop.
- **Arithmetic Progression (A.P.):** Custom $a_1$, step difference $d$, and term count $n$ with live $a_n$ and sum $S_n$ accumulators.
- **Geometric Progression (G.P.):** Custom $a_1$, ratio $r$, and term count $n$ showing exponential growth.
- **Fibonacci & Golden Ratio:** Sequence generator calculating consecutive ratios converging to $\phi \approx 1.618033...$.

### 5. 🏆 Student Math Gym & Challenge Arena
- **Procedural Quiz Engine:** Generates unlimited random questions across 3 difficulty tiers (Explorer, Scholar, Master).
- **Gamified Counters:** Real-time points scoreboard, streak counter, and bonus multipliers.
- **Pedagogical Support:** Hints on demand, friendly explanations, and instant step-by-step solutions.

---

## 🎨 Design & Typography

- **100% Poppins Typography:** Google Font **Poppins** (weights 300 to 800) is enforced across all headings, badges, formulas, buttons, and tables.
- **Exclusively Navy Theme:** Deep mathematical navy background (`background-image.jpg` with navy ambient glow) and translucent glassmorphism cards styled in `#101f33`, `#172d4c`, and `#1f3c64` with `#60a5fa` accents.
- **Keyboard Shortcuts:**
  - `1` - `5`: Switch between labs
  - `?` or `h`: Open Student Formula Reference Sheet
  - `Esc`: Close modals

---

## 🚀 Getting Started

```bash
# Navigate to project directory
cd f:\maths

# Install dependencies (if needed)
npm install

# Start local development server
npm run dev

# Or build for production
npm run build
npm run preview
```

---

## 🐙 Pushing to GitHub

A `.gitignore` file is included to prevent large or sensitive files (`node_modules`, `dist`, `.env`) from being committed:

```bash
cd f:\maths

# Initialize git repository (if not already initialized)
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: initial commit of MathLab Studio"

# Link to your GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to GitHub
git push -u origin main
```
