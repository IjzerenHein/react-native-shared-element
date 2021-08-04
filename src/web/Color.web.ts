export type Color = number[];

export function parseColor(color: string | Color): Color {
  if (Array.isArray(color)) return color;
  let cache;
  const p = parseInt;
  color = color.replace(/\s/g, ""); // Remove all spaces

  // Checks for 6 digit hex and converts string to integer
  if ((cache = /#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(color)))
    return [p(cache[1], 16), p(cache[2], 16), p(cache[3], 16), 1];
  // Checks for 3 digit hex and converts string to integer
  else if ((cache = /#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(color)))
    return [
      p(cache[1], 16) * 17,
      p(cache[2], 16) * 17,
      p(cache[3], 16) * 17,
      1,
    ];
  // Checks for rgba and converts string to
  // integer/float using unary + operator to save bytes
  else if (
    (cache = /rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(color))
  )
    return [+cache[1], +cache[2], +cache[3], +cache[4]];
  // Checks for rgb and converts string to
  // integer/float using unary + operator to save bytes
  else if ((cache = /rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(color)))
    return [+cache[1], +cache[2], +cache[3], 1];
  // Otherwise throw an exception to make debugging easier
  else throw new Error(color + " is not supported by parseColor");
}

export function formatColor(color: Color): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
}

export function interpolateColor(
  color1: Color,
  color2: Color,
  position: number
): Color {
  return color1.map((c, i) => c + (color2[i] - c) * position);
}
