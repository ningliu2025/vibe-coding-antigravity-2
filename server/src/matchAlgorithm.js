/**
 * Simple Soundex implementation for phonetic comparison
 */
function soundex(name) {
  const s = name.toUpperCase();
  const codes = {
    B: 1, F: 1, P: 1, V: 1,
    C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
    D: 3, T: 3,
    L: 4,
    M: 5, N: 5,
    R: 6
  };
  
  let r = s[0];
  let prevCode = codes[s[0]] || 0;
  
  for (let i = 1; i < s.length; i++) {
    const code = codes[s[i]] || 0;
    if (code > 0 && code !== prevCode) {
      r += code;
      prevCode = code;
    }
  }
  
  return (r + "0000").substring(0, 4);
}

/**
 * Calculate match score between two names
 */
function calculateMatch(name1, name2) {
  if (!name1 || !name2) return { score: 0, details: [] };

  let score = 50; // Base score
  const details = [];

  // 1. Phonetic Harmony (Soundex)
  const s1 = soundex(name1);
  const s2 = soundex(name2);
  
  if (s1 === s2) {
    score += 20;
    details.push("Perfect phonetic match!");
  } else if (s1[0] === s2[0]) {
    score += 10;
    details.push("Share the same initial sound.");
  }

  // 2. Length Harmony
  const lenDiff = Math.abs(name1.length - name2.length);
  if (lenDiff === 0) {
    score += 10;
    details.push("Perfect length symmetry.");
  } else if (lenDiff <= 2) {
    score += 5;
    details.push("Balanced name lengths.");
  }

  // 3. Vowel Harmony (Simple check for shared vowels)
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const v1 = new Set(name1.toLowerCase().split('').filter(c => vowels.includes(c)));
  const v2 = new Set(name2.toLowerCase().split('').filter(c => vowels.includes(c)));
  
  const sharedVowels = [...v1].filter(v => v2.has(v));
  if (sharedVowels.length > 0) {
    score += 5 * sharedVowels.length;
    details.push(`Share vowels: ${sharedVowels.join(', ').toUpperCase()}`);
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  // Add a random "Mystical" factor for fun variation if score is generic
  if (details.length < 2) {
      const mystical = Math.floor(Math.random() * 15);
      score += mystical;
      details.push("Mystical alignment detected.");
  }

  return { score, details };
}

module.exports = { calculateMatch };
