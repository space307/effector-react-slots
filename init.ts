import { createSlotFactory } from './createSlotFactory';

export const SLOT_ID = {
  FOO: 'zs0-V3W',
  BAR: 'NU9pRpa',
} as const;

export const { api, createSlot } = createSlotFactory({ slots: SLOT_ID });
