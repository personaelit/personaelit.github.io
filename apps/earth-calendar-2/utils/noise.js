/**
 * 2D Value Noise
 * Self-contained noise generator for procedural effects
 */

/** @type {number[]} Permutation table (doubled to avoid wrapping) */
const perm = [];

/**
 * Initialize permutation table with a seed
 * @param {number} seed
 */
export function seedNoise(seed) {
    const p = new Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;

    // Fisher-Yates shuffle with seeded LCG
    let s = seed;
    for (let i = 255; i > 0; i--) {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        const j = ((s >>> 0) % (i + 1));
        [p[i], p[j]] = [p[j], p[i]];
    }

    perm.length = 512;
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

// Initialize with default seed
seedNoise(42);

/**
 * Quintic smoothstep (smootherstep)
 * @param {number} t
 * @returns {number}
 */
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Linear interpolation
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
function lerp(a, b, t) {
    return a + t * (b - a);
}

/**
 * Hash integer coordinates to a pseudo-random value in [0, 1]
 * @param {number} ix
 * @param {number} iy
 * @returns {number}
 */
function hash(ix, iy) {
    return perm[(perm[ix & 255] + iy) & 511] / 255;
}

/**
 * 2D value noise
 * @param {number} x
 * @param {number} y
 * @returns {number} Value in [0, 1]
 */
export function noise2D(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fade(x - ix);
    const fy = fade(y - iy);

    const v00 = hash(ix, iy);
    const v10 = hash(ix + 1, iy);
    const v01 = hash(ix, iy + 1);
    const v11 = hash(ix + 1, iy + 1);

    return lerp(
        lerp(v00, v10, fx),
        lerp(v01, v11, fx),
        fy
    );
}

/**
 * Fractal Brownian Motion (layered octaves of noise)
 * @param {number} x
 * @param {number} y
 * @param {number} octaves - Number of noise layers (3-5)
 * @param {number} lacunarity - Frequency multiplier per octave (typically 2.0)
 * @param {number} persistence - Amplitude multiplier per octave (typically 0.5)
 * @returns {number} Value in [0, 1]
 */
export function fbm(x, y, octaves, lacunarity, persistence) {
    let value = 0;
    let amplitude = 1;
    let maxAmplitude = 0;

    for (let i = 0; i < octaves; i++) {
        value += noise2D(x, y) * amplitude;
        maxAmplitude += amplitude;
        x *= lacunarity;
        y *= lacunarity;
        amplitude *= persistence;
    }

    return value / maxAmplitude;
}
