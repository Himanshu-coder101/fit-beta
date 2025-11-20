// lib/utils.js
export function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x))
}

export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
