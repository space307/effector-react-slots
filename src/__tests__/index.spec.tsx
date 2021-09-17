import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { SLOTS, ComponentWithSlots, HEADING_TEXT, BUTTON_TEXT, Heading, Button, api } from './stub';

let container: HTMLElement;

beforeEach(() => {
  container = render(<ComponentWithSlots />).container;
});

test('Slots render [single]', () => {
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
  act(() => {
    api.set({ id: SLOTS.AWESOME, component: Button });
  });

  act(() => {
    api.set({ id: SLOTS.MAIN, component: Heading });
  });

  expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);
  expect(screen.getByRole('heading')).toHaveTextContent(HEADING_TEXT);

  act(() => {
    api.remove({ id: SLOTS.MAIN });
  });

  expect(screen.getByRole('button')).toHaveTextContent(BUTTON_TEXT);
  expect(screen.queryByText(HEADING_TEXT)).not.toBeInTheDocument();

  act(() => {
    api.remove({ id: SLOTS.MAIN });
  });

  expect(screen.queryByText(HEADING_TEXT)).not.toBeInTheDocument();
});
