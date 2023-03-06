export function increment(value: number, incr = 1) {
  return value + incr;
}

// Recursively calculates a^m mod n
export function modpow(a: number, m: number, n: number): number {
  if (m === 0) {
    return 1;
  } else if (m % 2 === 0) {
    return (modpow(a, m / 2, n) * modpow(a, m / 2, n)) % n;
  } else {
    return (a * modpow(a, (m - 1) / 2, n) * modpow(a, (m - 1) / 2, n)) % n;
  }
}

// Find a witness for Miller Rabin prime test:
// Let p be an odd integer, and b & d two integers such that p = 2b^d + 1. Let a
// such that a < p, a is a witness for Miller's test if:
// - a^d mod p != 1
// - a^(2^r)d mod p != -1 for r < b (integer)
// If a is a Miller's witness for p, then p is not prime.
function millerWitness(a: number, b: number, d: number, p: number): boolean {
  let x = modpow(a, d, p);
  if (x === 1) {
    return false;
  }

  for (let i = 0; i < b; i++) {
    if (x === p - 1) {
      return false;
    } else {
      x = modpow(x, 2, p);
    }
  }

  return true;
}

function pickLargeNumber(low: number, up: number): number {
  return Math.floor((up - low + 1) * Math.random()) + low;
}

export function isMillerPrime(p: number, k: number) {
  if (p === 2) {
    return true;
  }

  if (p % 2 === 0 || p <= 1) {
    return false;
  }

  let b = 0;
  let d = p - 1;

  while (d % 2 === 0) {
    d /= 2;
    b += 1;
  }

  let a = 0;

  for (let i = 0; i < k; i++) {
    a = pickLargeNumber(2, p - 1);
    if (millerWitness(a, b, d, p)) {
      return false;
    }
  }
  return true;
}
