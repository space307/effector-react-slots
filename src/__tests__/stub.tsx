import React from 'react';
import { useStoreMap } from 'effector-react';

import { createSlotFactory } from '../index';

export const SLOTS = {
  MAIN: 'main',
  AWESOME: 'awesome',
};

const { createSlot, api: slotApi } = createSlotFactory({ slots: SLOTS });

const mainSlot = createSlot({ id: SLOTS.MAIN });
const awesomeSlot = createSlot({ id: SLOTS.AWESOME });

const MainSlot = () => {
  const Component = useStoreMap({
    store: mainSlot.$slot,
    fn: ({ component }) => component,
    keys: [],
  });

  return <Component />;
};
const AwesomeSlot = () => {
  const Component = useStoreMap({
    store: awesomeSlot.$slot,
    fn: ({ component }) => component,
    keys: [],
  });

  return <Component />;
};

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
