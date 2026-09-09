import { describe, expect, it } from 'vitest';
import { buildJourneyPath, distanceAtY } from './journey-path';

describe('scroll route geometry', () => {
  it('connects actual milestone positions with vertically monotonic curves', () => {
    expect(buildJourneyPath([{ x: 90, y: 20 }, { x: 160, y: 220 }, { x: 90, y: 540 }])).toBe('M 90 20 C 90 120, 160 120, 160 220 C 160 380, 90 380, 90 540');
    expect(buildJourneyPath([])).toBe('');
  });
  it('clamps before the start and after the future endpoint', () => {
    const pointAt = (distance: number) => ({ x: 0, y: distance + 50 });
    expect(distanceAtY(1000, -200, pointAt)).toBe(0);
    expect(distanceAtY(1000, 1200, pointAt)).toBe(1000);
    expect(distanceAtY(0, 200, pointAt)).toBe(0);
  });
  it('follows viewport height rather than assuming path length equals vertical distance', () => {
    const pointAt = (distance: number) => ({ x: Math.sin(distance), y: 50 + (distance / 1000) ** 2 * 2000 });
    expect(distanceAtY(1000, 550, pointAt)).toBeCloseTo(500, 1);
    expect(distanceAtY(1000, 175, pointAt)).toBeCloseTo(250, 1);
  });
});
