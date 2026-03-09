/**
 * Linear interpolation function
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} progress - Progress value between 0 and 1
 * @returns {number} Interpolated value
 */
export function lerp(start, end, progress) {
  return start + (end - start) * progress;
}
