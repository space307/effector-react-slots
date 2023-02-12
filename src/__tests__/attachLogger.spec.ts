import { SLOTS } from './stub';

import { createSlotFactory } from '../index';
import { LOG_TITLE } from '../logger';

type SlotsKeys = keyof typeof SLOTS;

const SLOTS_NAMES = Object.entries(SLOTS).reduce(
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {} as Record<(typeof SLOTS)[SlotsKeys], SlotsKeys>,
);

describe('AttachLogger', () => {
  test('Basic', () => {
    const logger = jest.fn();
    const { createSlot, api } = createSlotFactory(SLOTS);

    createSlot(SLOTS.AWESOME);
    createSlot(SLOTS.MAIN);

    api.attachLogger({
      fn: logger,
    });

    api.set({ id: SLOTS.AWESOME, component: () => null });
    expect(logger).toBeCalledWith({
      message: `${LOG_TITLE} ${SLOTS_NAMES.awesome} -> set // ${SLOTS.AWESOME}`,
      meta: { action: 'set', slotId: SLOTS.AWESOME, slotName: SLOTS_NAMES.awesome },
    });

    api.hide({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${LOG_TITLE} ${SLOTS_NAMES.awesome} -> hide // ${SLOTS.AWESOME}`,
      meta: { action: 'hide', slotId: SLOTS.AWESOME, slotName: SLOTS_NAMES.awesome },
    });

    api.show({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${LOG_TITLE} ${SLOTS_NAMES.awesome} -> show // ${SLOTS.AWESOME}`,
      meta: { action: 'show', slotId: SLOTS.AWESOME, slotName: SLOTS_NAMES.awesome },
    });

    api.remove({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${LOG_TITLE} ${SLOTS_NAMES.awesome} -> remove // ${SLOTS.AWESOME}`,
      meta: { action: 'remove', slotId: SLOTS.AWESOME, slotName: SLOTS_NAMES.awesome },
    });

    api.hide({ id: SLOTS.MAIN });
    expect(logger).toBeCalledWith({
      message: `${LOG_TITLE} ${SLOTS_NAMES.main} -> hide // ${SLOTS.MAIN}`,
      meta: { action: 'hide', slotId: SLOTS.MAIN, slotName: SLOTS_NAMES.main },
    });

    expect(logger).toBeCalledTimes(5);
  });

  test('With watchable slots', () => {
    const logger = jest.fn();
    const { createSlot, api } = createSlotFactory(SLOTS);

    createSlot(SLOTS.AWESOME);
    createSlot(SLOTS.MAIN);

    api.attachLogger({
      fn: logger,
      watchList: [SLOTS.AWESOME],
    });

    api.set({ id: SLOTS.AWESOME, component: () => null });
    api.hide({ id: SLOTS.AWESOME });
    api.show({ id: SLOTS.AWESOME });
    api.remove({ id: SLOTS.AWESOME });
    api.hide({ id: SLOTS.MAIN });

    expect(logger).toBeCalledTimes(4);
  });

  test('With empty watchable slots', () => {
    const logger = jest.fn();
    const { createSlot, api } = createSlotFactory(SLOTS);

    createSlot(SLOTS.AWESOME);
    createSlot(SLOTS.MAIN);

    api.attachLogger({
      fn: logger,
      watchList: [],
    });

    api.set({ id: SLOTS.AWESOME, component: () => null });
    api.hide({ id: SLOTS.AWESOME });
    api.show({ id: SLOTS.AWESOME });
    api.remove({ id: SLOTS.AWESOME });
    api.hide({ id: SLOTS.MAIN });

    expect(logger).toBeCalledTimes(0);
  });
});
