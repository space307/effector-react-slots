import React from 'react';

import { createSlotFactory } from '../index';

export const SLOTS = {
  MAIN: 'main',
  AWESOME: 'awesome',
  WITH_FALLBACK: 'withFallback',
} as const;

export const FALLBACK_TEXT = 'this fallback content will be rendered when no content is provided';
export const NOT_FALLBACK_TEXT = 'Not fallback text';

const { createSlot, api: slotApi } = createSlotFactory(SLOTS);

slotApi.attachLogger();

const { Slot: MainSlot } = createSlot(SLOTS.MAIN);
const { Slot: AwesomeSlot } = createSlot(SLOTS.AWESOME);
const { Slot: SlotWithFallback } = createSlot<{ readonly text: string }>(SLOTS.WITH_FALLBACK);

export const ComponentWithSlots = () => (
  <>
    <MainSlot />
    <AwesomeSlot />
  </>
);
export const ComponentWithFallbackSlot = () => (
  <>
    <SlotWithFallback text={NOT_FALLBACK_TEXT}>{FALLBACK_TEXT}</SlotWithFallback>
  </>
);

export const BUTTON_TEXT = 'Button';
export const HEADING_TEXT = 'Heading';

export const Button = () => <button>{BUTTON_TEXT}</button>;
export const Heading = () => <h1>{HEADING_TEXT}</h1>;
export const Div = ({ text }: { readonly text: string }) => <div>{text}</div>;
export const api = slotApi;
