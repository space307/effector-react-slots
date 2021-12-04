import { render, screen, act } from '@testing-library/react';
import React from 'react';

import {
  SLOTS,
  ComponentWithSlots,
  ComponentWithFallbackSlot,
  HEADING_TEXT,
  BUTTON_TEXT,
  Heading,
  Button,
  Div,
  api,
  FALLBACK_TEXT,
  NOT_FALLBACK_TEXT,
} from './stub';

describe('Test rendering', () => {
  test('Slots render [single]', () => {
    let { container } = render(<ComponentWithSlots />);

    expect(container.firstChild).toBeNull();

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
    });

    expect(screen.getByRole('heading').textContent).toBe(HEADING_TEXT);

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Button });
    });

    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);

    act(() => {
      api.remove({ id: SLOTS.MAIN });
    });

    expect(container.firstChild).toBeNull();
  });

  test('Slots render [multiple]', () => {
    let { container } = render(<ComponentWithSlots />);

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
      api.set({ id: SLOTS.AWESOME, component: Button });
    });

    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);
    expect(screen.getByRole('heading').textContent).toBe(HEADING_TEXT);

    act(() => {
      api.remove({ id: SLOTS.MAIN });
    });

    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);
    expect(container.firstChild?.nodeName).toBe('BUTTON');

    expect(screen.queryByText(HEADING_TEXT)).toBe(null);

    act(() => {
      api.remove({ id: SLOTS.AWESOME });
    });

    expect(screen.queryByText(BUTTON_TEXT)).toBe(null);
  });

  test('Slots render [hide and show]', () => {
    render(<ComponentWithSlots />);

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
      api.set({ id: SLOTS.AWESOME, component: Button });
    });

    expect(screen.getByRole('heading').textContent).toBe(HEADING_TEXT);
    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);

    act(() => {
      api.hide({ id: SLOTS.MAIN });
    });

    expect(screen.queryByText(HEADING_TEXT)).toBe(null);
    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);

    act(() => {
      api.hide({ id: SLOTS.AWESOME });
    });

    expect(screen.queryByText(BUTTON_TEXT)).toBe(null);

    act(() => {
      api.show({ id: SLOTS.MAIN });
    });

    expect(screen.getByRole('heading').textContent).toBe(HEADING_TEXT);
    expect(screen.queryByText(BUTTON_TEXT)).toBe(null);

    act(() => {
      api.show({ id: SLOTS.AWESOME });
    });

    expect(screen.getByRole('heading').textContent).toBe(HEADING_TEXT);
    expect(screen.getByRole('button').textContent).toBe(BUTTON_TEXT);
  });

  test('Slot with fallback', () => {
    let { container } = render(<ComponentWithFallbackSlot />);

    expect(screen.queryByText(FALLBACK_TEXT)?.textContent).toBe(FALLBACK_TEXT);

    act(() => {
      api.set({ id: SLOTS.WITH_FALLBACK, component: Div });
    });

    expect(screen.queryByText(NOT_FALLBACK_TEXT)?.textContent).toBe(NOT_FALLBACK_TEXT);

    act(() => {
      api.set({ id: SLOTS.WITH_FALLBACK, component: () => null });
    });

    expect(container.firstChild?.textContent).toBeUndefined();

    act(() => {
      api.remove({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)?.textContent).toBe(FALLBACK_TEXT);

    act(() => {
      api.hide({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)).toBe(null);

    act(() => {
      api.show({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)?.textContent).toBe(FALLBACK_TEXT);
  });
});
