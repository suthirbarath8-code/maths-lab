// Mathematical Utilities for MathLab Studio (No Audio Engine)

/**
 * Check if a number is prime
 */
export function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Calculate prime factorization
 * Returns array of [prime, power] e.g. 12 -> [[2, 2], [3, 1]]
 */
export function getPrimeFactorization(n) {
  if (n <= 1) return [];
  let temp = Math.abs(Math.round(n));
  const factors = {};

  // Count factors of 2
  while (temp % 2 === 0) {
    factors[2] = (factors[2] || 0) + 1;
    temp /= 2;
  }

  // Count factors of odd numbers
  for (let d = 3; d * d <= temp; d += 2) {
    while (temp % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      temp /= d;
    }
  }

  if (temp > 2) {
    factors[temp] = (factors[temp] || 0) + 1;
  }

  return Object.entries(factors).map(([p, exp]) => ({
    prime: parseInt(p, 10),
    exponent: exp,
  }));
}

/**
 * Get all divisors of a number
 */
export function getDivisors(n) {
  if (n <= 0) return [];
  const val = Math.round(n);
  const divs = [];
  for (let i = 1; i * i <= val; i++) {
    if (val % i === 0) {
      divs.push(i);
      if (i * i !== val) {
        divs.push(val / i);
      }
    }
  }
  return divs.sort((a, b) => a - b);
}

/**
 * Convert number to Roman numerals (for 1 to 3999)
 */
export function toRoman(num) {
  if (num <= 0 || num > 3999) return 'N/A';
  const val = Math.floor(num);
  const romanMap = [
    { v: 1000, s: 'M' },
    { v: 900, s: 'CM' },
    { v: 500, s: 'D' },
    { v: 400, s: 'CD' },
    { v: 100, s: 'C' },
    { v: 90, s: 'XC' },
    { v: 50, s: 'L' },
    { v: 40, s: 'XL' },
    { v: 10, s: 'X' },
    { v: 9, s: 'IX' },
    { v: 5, s: 'V' },
    { v: 4, s: 'IV' },
    { v: 1, s: 'I' }
  ];
  let res = '';
  let curr = val;
  for (const { v, s } of romanMap) {
    while (curr >= v) {
      res += s;
      curr -= v;
    }
  }
  return res;
}

/**
 * Check if a number is a perfect square
 */
export function checkPerfectSquare(n) {
  if (n < 0) return { isSquare: false, root: null };
  const r = Math.round(Math.sqrt(n));
  return {
    isSquare: r * r === n,
    root: r
  };
}

/**
 * Check if a number is a perfect cube
 */
export function checkPerfectCube(n) {
  const r = Math.round(Math.cbrt(n));
  return {
    isCube: r * r * r === n,
    root: r
  };
}

/**
 * Generate Collatz sequence (Hailstone)
 */
export function getCollatzSequence(startNum, maxSteps = 200) {
  let curr = Math.max(1, Math.round(startNum));
  const sequence = [curr];
  while (curr !== 1 && sequence.length < maxSteps) {
    if (curr % 2 === 0) {
      curr = curr / 2;
    } else {
      curr = 3 * curr + 1;
    }
    sequence.push(curr);
  }
  return sequence;
}

/**
 * Generate Fibonacci sequence up to N terms
 */
export function getFibonacciSequence(terms = 15) {
  const seq = [0, 1];
  for (let i = 2; i < terms; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq.slice(0, terms);
}

/**
 * Descriptive Statistics helpers
 */
export function calculateStats(values) {
  if (!values || values.length === 0) {
    return { count: 0, mean: 0, median: 0, mode: 0, min: 0, max: 0, stdDev: 0 };
  }
  const count = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / count;

  // Median
  const mid = Math.floor(count / 2);
  const median = count % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const freq = {};
  let maxFreq = 0;
  let mode = sorted[0];
  for (const v of sorted) {
    freq[v] = (freq[v] || 0) + 1;
    if (freq[v] > maxFreq) {
      maxFreq = freq[v];
      mode = v;
    }
  }

  // Std dev
  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
  const stdDev = Math.sqrt(variance);

  return {
    count,
    sum,
    mean: Number(mean.toFixed(2)),
    median: Number(median.toFixed(2)),
    mode,
    min,
    max,
    stdDev: Number(stdDev.toFixed(2)),
    range: max - min
  };
}
