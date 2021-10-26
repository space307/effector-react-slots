import { SLOTS } from './stub';

import { createSlotFactory } from '../index';

// slotApi.attachLogger();
// slotApi.attachLogger({
//   watchList: [SLOTS.MAIN, SLOTS.WITH_FALLBACK],
//   fn: ({ meta: { slotId } }) => console.info(slotId),
// });
// slotApi.attachLogger({
//   watchList: [SLOTS.MAIN, SLOTS.WITH_FALLBACK],
// });
// slotApi.attachLogger({
//   fn: ({ meta: { slotId } }) => console.info(slotId),
// });

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
      message: `${SLOTS.AWESOME} slot content was set`,
      meta: { action: 'set', slotId: 'awesome' },
    });

    api.hide({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${SLOTS.AWESOME} slot content was hidden`,
      meta: { action: 'hide', slotId: SLOTS.AWESOME },
    });

    api.show({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${SLOTS.AWESOME} slot content was shown`,
      meta: { action: 'show', slotId: SLOTS.AWESOME },
    });

    api.remove({ id: SLOTS.AWESOME });
    expect(logger).toBeCalledWith({
      message: `${SLOTS.AWESOME} slot content was removed`,
      meta: { action: 'remove', slotId: SLOTS.AWESOME },
    });

    api.hide({ id: SLOTS.MAIN });
    expect(logger).toBeCalledWith({
      message: `${SLOTS.MAIN} slot content was hidden`,
      meta: { action: 'hide', slotId: SLOTS.MAIN },
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
