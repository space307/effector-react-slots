import { createEvent } from 'effector';

import { makeCreateSlot } from './createSlot';
import { createLogger } from './logger';
import { ACTIONS } from './shared';

import type { SlotsApi, SlotName } from './shared';

export const createSlotFactory = <Id extends string>(slots: Record<SlotName, Id>) => {
  const api: SlotsApi<Id> = {
    [ACTIONS.HIDE]: createEvent(),
    [ACTIONS.REMOVE]: createEvent(),
    [ACTIONS.SET]: createEvent(),
    [ACTIONS.SHOW]: createEvent(),
  };

  return {
    api: {
      ...api,
      [ACTIONS.ATTACH_LOGGER]: createLogger({
        slots,
        api,
      }),
    },
    createSlot: makeCreateSlot<Id>(api),
  };
};
