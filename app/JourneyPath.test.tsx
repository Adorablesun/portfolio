// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import JourneyPath from './JourneyPath';

let root: Root;
let container: HTMLDivElement;
let routeTop = 0;
let reduce = false;
const scroll = vi.fn();
const ids = ['beginnings', 'secondary', 'now', 'internship', 'future', 'immersive', 'ai', 'leadership'];
beforeEach(() => {
  vi.useFakeTimers();
  routeTop = 0;
  reduce = false;
  scroll.mockReset();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('matchMedia', () => ({ matches: reduce, addEventListener() {}, removeEventListener() {} }));
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: Promise.resolve() } });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  HTMLElement.prototype.scrollIntoView = scroll;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const i = ids.indexOf(this.closest('li')?.id || '');
    const top = this.classList.contains('journey-route') ? routeTop : routeTop + 200 + (i < 0 ? 8 : i) * 300;
    const height = this.classList.contains('journey-route') ? 3000 : 42;
    return { top, left: 100, width: 500, height, bottom: top + height, right: 600, x: 100, y: top, toJSON() {} };
  });
  Object.assign(SVGElement.prototype, {
    getTotalLength: () => 2400,
    getPointAtLength: (distance: number) => ({ x: 20, y: 221 + distance }),
  });
  history.replaceState(null, '', '/');
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const render = async () => {
  await act(async () => { root.render(<JourneyPath />); });
  await act(async () => { vi.advanceTimersByTime(20); });
};
const click = async (label: string) => {
  await act(async () => { (container.querySelector(`[aria-label="${label}"]`) as HTMLButtonElement).click(); });
};

it('jumps to a clicked milestone, reveals it, focuses its heading, and makes it linkable', async () => {
  await render();
  await click('Explore UI / UX design');
  expect(window.location.hash).toBe('#future');
  expect(document.activeElement?.textContent).toBe('UI / UX design');
  expect(container.querySelector('#future')?.classList.contains('is-visible')).toBe(true);
  expect(scroll).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'center' });
});
it('updates the navigator while scrolling and disables Next at the final milestone', async () => {
  await render();
  expect(container.querySelector('.journey-dock')).not.toBeNull();
  await act(async () => { routeTop = -1930; window.dispatchEvent(new Event('scroll')); vi.advanceTimersByTime(20); });
  expect(container.querySelector('.journey-dock-heading strong')?.textContent).toBe('Creative technology & leadership');
  expect((container.querySelector('[aria-label="Next milestone"]') as HTMLButtonElement).disabled).toBe(true);
  await click('Previous milestone');
  expect(window.location.hash).toBe('#ai');
});
it('provides instant navigation with reduced motion and a working restart', async () => {
  reduce = true;
  await render();
  await click('Explore Immersive AR / VR');
  expect(scroll).toHaveBeenLastCalledWith({ behavior: 'instant', block: 'center' });
  await act(async () => { (container.querySelector('.journey-restart') as HTMLButtonElement).click(); });
  expect(window.location.hash).toBe('#beginnings');
  expect(document.activeElement?.textContent).toBe('SJK(C) Kong Hoe');
});
