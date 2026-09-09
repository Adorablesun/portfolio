export type JourneyPoint = { x: number; y: number };
export type ScrollMotion = { position: number; proximity: number };

/** Smooth, vertically monotonic route through the measured milestone centres. */
export function buildJourneyPath(points: JourneyPoint[]) {
  if (!points.length) return '';
  const first = points[0];
  let path = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const point = points[i];
    const middle = (previous.y + point.y) / 2;
    path += ` C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
  }
  return path;
}

/** Find the distance on a monotonic path whose point follows the reading line. */
export function distanceAtY(
  length: number,
  targetY: number,
  pointAt: (distance: number) => JourneyPoint,
) {
  if (length <= 0 || targetY <= pointAt(0).y) return 0;
  if (targetY >= pointAt(length).y) return length;
  let low = 0;
  let high = length;
  for (let i = 0; i < 15; i++) {
    const middle = (low + high) / 2;
    if (pointAt(middle).y < targetY) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

/** Normalised motion values for an element moving through the viewport. */
export function scrollMotion(
  elementCenter: number,
  viewportHeight: number,
): ScrollMotion {
  if (viewportHeight <= 0) return { position: 0, proximity: 1 };
  const position = Math.max(
    -1,
    Math.min(
      1,
      (elementCenter - viewportHeight * 0.5) / (viewportHeight * 0.62),
    ),
  );
  return { position, proximity: 1 - Math.abs(position) };
}
