import React from 'react';

import { createSlotFactory } from '../index';

export const SLOTS = {
  MAIN: 'main',
  AWESOME: 'awesome',
};

const { createSlot, api: slotApi } = createSlotFactory({ slots: SLOTS });

const { Slot: MainSlot } = createSlot({ id: SLOTS.MAIN });
const { Slot: AwesomeSlot } = createSlot({ id: SLOTS.AWESOME });

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
