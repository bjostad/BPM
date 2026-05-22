export function getBpmColor(bpm) {
  // Base colors
  const green = { r: 16, g: 185, b: 129 };
  const white = { r: 255, g: 255, b: 255 };
  const red = { r: 239, g: 68, b: 68 };

  let startColor, endColor, percentage;

  if (bpm <= 100) {
    // 50 BPM is our min for full green, 100 is white
    startColor = green;
    endColor = white;
    const clampedBpm = Math.max(50, bpm);
    percentage = (clampedBpm - 50) / 50; // 0 at 50, 1 at 100
  } else {
    // 100 is white, 180 is full red
    startColor = white;
    endColor = red;
    const clampedBpm = Math.min(180, bpm);
    percentage = (clampedBpm - 100) / 80; // 0 at 100, 1 at 180
  }

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * percentage);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * percentage);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * percentage);

  return `rgb(${r}, ${g}, ${b})`;
}

export function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}
