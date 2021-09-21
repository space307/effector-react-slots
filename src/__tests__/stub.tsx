import React from 'react';

import { createSlotFactory } from '../index';

export const SLOTS = {
  MAIN: 'main',
  AWESOME: 'awesome',
} as const;

const { createSlot, api: slotApi } = createSlotFactory(SLOTS);

const { Slot: MainSlot } = createSlot(SLOTS.MAIN);
const { Slot: AwesomeSlot } = createSlot(SLOTS.AWESOME);

export const ComponentWithSlots = () => (
  <>
    <MainSlot />
    <AwesomeSlot />
  </>
);

export const BUTTON_TEXT = 'Button';
export const HEADING_TEXT = 'Heading';

export const Button = () => <button>{BUTTON_TEXT}</button>;
export const Heading = () => <h1>{HEADING_TEXT}</h1>;
export const api = slotApi;
