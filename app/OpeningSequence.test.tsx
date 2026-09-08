// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OpeningSequence from './OpeningSequence';

const scene = vi.hoisted(() => ({ dispose: vi.fn(), create: vi.fn() }));
vi.mock('./opening-scene', () => ({ createOpeningScene: scene.create }));

let container: HTMLDivElement;
let root: Root;
let motion = false;
let listeners: Set<() => void>;

beforeEach(() => {
  vi.useFakeTimers();
  motion = false;
  listeners = new Set();
  scene.dispose.mockReset();
  scene.create.mockReset().mockReturnValue(scene.dispose);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({
    get matches() { return motion; },
    addEventListener: (_name: string, handler: () => void) => listeners.add(handler),
    removeEventListener: (_name: string, handler: () => void) => listeners.delete(handler),
  }) });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  window.history.replaceState(null, '', '/');
  document.body.style.overflow = 'auto';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
});
const render = async () => { await act(async () => { root.render(<OpeningSequence />); }); };
const dialog = () => container.querySelector('dialog');
const click = async (selector: string) => {
  await act(async () => { (container.querySelector(selector) as HTMLButtonElement).click(); });
};

describe('portfolio opening', () => {
  it('auto-finishes at 5.5 seconds and releases the scene and scroll lock', async () => {
    await render();
    expect(dialog()?.open).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    await act(async () => { vi.advanceTimersByTime(5499); });
    expect(dialog()).not.toBeNull();
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
    expect(scene.dispose).toHaveBeenCalledTimes(1);
  });
  it('can skip immediately, replay, and exit with the native cancel event', async () => {
    await render();
    await click('.opening-skip');
    expect(dialog()).toBeNull();
    await click('.intro-replay');
    expect(dialog()?.open).toBe(true);
    await act(async () => { dialog()?.dispatchEvent(new Event('cancel')); });
    expect(dialog()).toBeNull();
    expect(scene.dispose).toHaveBeenCalledTimes(2);
  });
  it('does not block direct section links, but allows replay', async () => {
    window.history.replaceState(null, '', '/#work');
    await render();
    expect(dialog()).toBeNull();
    expect(scene.create).not.toHaveBeenCalled();
    await click('.intro-replay');
    expect(dialog()?.open).toBe(true);
  });
  it('skips reduced-motion visitors without loading WebGL', async () => {
    motion = true;
    await render();
    expect(dialog()).toBeNull();
    expect(container.querySelector('button')).toBeNull();
    expect(scene.create).not.toHaveBeenCalled();
  });
  it('closes when reduced motion is enabled and does not restart when disabled', async () => {
    await render();
    await act(async () => { motion = true; listeners.forEach(fn => fn()); });
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
    await act(async () => { motion = false; listeners.forEach(fn => fn()); });
    expect(dialog()).toBeNull();
  });
  it('keeps skip and auto-finish available when WebGL fails', async () => {
    scene.create.mockImplementation(() => { throw new Error('WebGL unavailable'); });
    await render();
    expect(container.querySelector('.opening-stage')?.getAttribute('data-fallback')).toBe('true');
    await act(async () => { vi.advanceTimersByTime(5500); });
    expect(dialog()).toBeNull();
    expect(document.body.style.overflow).toBe('auto');
  });
});
