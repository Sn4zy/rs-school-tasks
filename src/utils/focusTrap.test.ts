import { describe, expect, it, vi } from 'vitest';
import { getFocusableElements, trapTabKey } from './focusTrap';

describe('focusTrap', () => {
  it('returns focusable elements inside a container', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button type="button">First</button>
      <input type="text" />
      <button type="button" disabled>Disabled</button>
    `;

    const focusable = getFocusableElements(container);

    expect(focusable).toHaveLength(2);
    expect(focusable[0].textContent).toBe('First');
  });

  it('traps focus on the last element when tabbing forward', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button type="button">First</button>
      <button type="button">Last</button>
    `;
    document.body.append(container);

    const [firstButton, lastButton] = getFocusableElements(container);
    lastButton.focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    trapTabKey(event, container);

    expect(preventDefault).toHaveBeenCalled();
    expect(document.activeElement).toBe(firstButton);

    container.remove();
  });
});
