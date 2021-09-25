import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

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

describe("Test 'em all", () => {
  test('Slots render [single]', () => {
    let container = render(<ComponentWithSlots />).container;

    expect(container.firstChild).toBeNull();

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
    });

    expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Button });
    });

    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);

    act(() => {
      api.remove({ id: SLOTS.MAIN });
    });

    expect(container.firstChild).toBeNull();
  });

  test('Slots render [multiple]', () => {
    let container = render(<ComponentWithSlots />).container;

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
      api.set({ id: SLOTS.AWESOME, component: Button });
    });

    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);
    expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);

    act(() => {
      api.remove({ id: SLOTS.MAIN });
    });

    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);
    expect(container.firstChild?.nodeName).toBe('BUTTON');
    expect(screen.queryByText(HEADING_TEXT)).not.toBeInTheDocument();

    act(() => {
      api.remove({ id: SLOTS.AWESOME });
    });

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();
  });

  test('Slots render [hide and show]', () => {
    render(<ComponentWithSlots />).container;

    act(() => {
      api.set({ id: SLOTS.MAIN, component: Heading });
      api.set({ id: SLOTS.AWESOME, component: Button });
    });

    expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);
    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);

    act(() => {
      api.hide({ id: SLOTS.MAIN });
    });

    expect(screen.queryByText(HEADING_TEXT)).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);

    act(() => {
      api.hide({ id: SLOTS.AWESOME });
    });

    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();

    act(() => {
      api.show({ id: SLOTS.MAIN });
    });

    expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);
    expect(screen.queryByText(BUTTON_TEXT)).not.toBeInTheDocument();

    act(() => {
      api.show({ id: SLOTS.AWESOME });
    });

    expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);
    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);
  });

  test('Slot with fallback', () => {
    let container = render(<ComponentWithFallbackSlot />).container;

    expect(screen.queryByText(FALLBACK_TEXT)).toBeInTheDocument();

    act(() => {
      api.set({ id: SLOTS.WITH_FALLBACK, component: Div });
    });

    expect(screen.queryByText(NOT_FALLBACK_TEXT)).toBeInTheDocument();

    act(() => {
      api.set({ id: SLOTS.WITH_FALLBACK, component: () => null });
    });

    expect(container.firstChild?.textContent).toBeUndefined();

    act(() => {
      api.remove({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)).toBeInTheDocument();

    act(() => {
      api.hide({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)).not.toBeInTheDocument();

    act(() => {
      api.show({ id: SLOTS.WITH_FALLBACK });
    });

    expect(screen.queryByText(FALLBACK_TEXT)).toBeInTheDocument();
  });
});
