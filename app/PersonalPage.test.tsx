// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PersonalPage from './PersonalPage';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn(() => true);
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('personal identity card', () => {
  it('turns continuously by horizontal drag and supports arrow keys', async () => {
    await act(async () => root.render(<PersonalPage />));
    const stage = container.querySelector('.personal-card-stage') as HTMLElement;
    Object.defineProperty(stage, 'getBoundingClientRect', { value: () => ({ width: 400 }) });
    const pointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        clientX: { value: clientX },
        isPrimary: { value: true },
        pointerId: { value: 7 },
      });
      stage.dispatchEvent(event);
    };

    const keyboardControl = container.querySelector('.card-rotation-input') as HTMLInputElement;
    expect(keyboardControl.getAttribute('aria-label')).toContain('front');

    await act(async () => {
      pointer('pointerdown', 100);
      pointer('pointermove', 300);
      pointer('pointerup', 300);
    });
    expect(keyboardControl.getAttribute('aria-label')).toContain('back');

    await act(async () => keyboardControl.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })));
    expect(keyboardControl.getAttribute('aria-label')).toContain('front');
  });
});
