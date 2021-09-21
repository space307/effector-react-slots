import { createApi, createStore, createEvent, guard, sample } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import type { ReactElement } from 'react';

type Component<S> = (props: S) => ReactElement | null;
type SlotStore<S> = Readonly<{
  component: Component<S>;
  isVisible: boolean;
}>;

export const createSlotFactory = <Id extends string>(slots: Record<string, Id>) => {
  const api = {
    hide: createEvent<Readonly<{ id: Id }>>(),
    remove: createEvent<Readonly<{ id: Id }>>(),
    set: createEvent<Readonly<{ id: Id; component: Component<any> }>>(),
    show: createEvent<Readonly<{ id: Id }>>(),
  };

  const createSlot = <P,>(id: Id) => {
    const $slot = createStore<SlotStore<P>>({ component: () => null, isVisible: true });

    const slotApi = createApi($slot, {
      hide: (state) => (!state.isVisible ? undefined : { ...state, isVisible: false }),
      remove: (state) => ({ ...state, component: $slot.defaultState.component }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
      show: (state) => (state.isVisible ? undefined : { ...state, isVisible: true }),
    });

    const isSlotEventCalling = (payload: Readonly<{ id: Id }>) => payload.id === id;

    guard({
      clock: api.hide,
      filter: isSlotEventCalling,
      target: slotApi.hide,
    });

    guard({
      clock: api.remove,
      filter: isSlotEventCalling,
      target: slotApi.remove,
    });

    sample({
      clock: guard({
        clock: api.set,
        filter: isSlotEventCalling,
      }),
      fn: ({ component }) => component,
      target: slotApi.set,
    });

    guard({
      clock: api.show,
      filter: isSlotEventCalling,
      target: slotApi.show,
    });

    const Slot = (props: P = {} as P) =>
      useStoreMap({
        store: $slot,
        fn: ({ component: Component, isVisible }) => (isVisible ? <Component {...props} /> : null),
        keys: [],
      });

    return {
      Slot,
    };
  };

  return {
    api,
    createSlot,
  };
};
