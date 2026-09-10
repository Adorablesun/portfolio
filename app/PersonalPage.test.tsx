// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import PersonalPage from './PersonalPage';

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('personal identity card', () => {
  it('turns to its reverse and back from either face', async () => {
    await act(async () => root.render(<PersonalPage />));
    const card = container.querySelector('.personal-card') as HTMLElement;
    const front = container.querySelector('[aria-label="Turn identity card to the back"]') as HTMLButtonElement;
    const rear = container.querySelector('[aria-label="Turn identity card to the front"]') as HTMLButtonElement;

    expect(card.classList.contains('is-flipped')).toBe(false);
    expect(front.tabIndex).toBe(0);
    expect(rear.tabIndex).toBe(-1);

    await act(async () => front.click());
    expect(card.classList.contains('is-flipped')).toBe(true);
    expect(front.tabIndex).toBe(-1);
    expect(rear.tabIndex).toBe(0);

    await act(async () => rear.click());
    expect(card.classList.contains('is-flipped')).toBe(false);
  });
});
