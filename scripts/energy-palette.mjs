// Keep the imported EnergyAI geometry in the portfolio's blue/graphite palette.
export function energyPalette(source) {
  return source.replace(/#[\da-f]{8}\b|#[\da-f]{6}\b/gi, hex => {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const lo = Math.min(...channels), hi = Math.max(...channels), light = (lo + hi) / 2;
    const saturation = light < .16 ? .16 : light < .38 ? .27 : .65;
    const chroma = (1 - Math.abs(2 * light - 1)) * saturation;
    const offset = light - chroma / 2;
    const rgb = [0, chroma / 3, chroma].map(c => Math.round((c + offset) * 255).toString(16).padStart(2, '0'));
    return '#' + rgb.join('') + hex.slice(7);
  });
}
