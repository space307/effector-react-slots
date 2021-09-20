import { createApi, createStore, createEvent, guard, sample } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import type { ReactElement } from 'react';

export type Component<S> = (props: S) => ReactElement | null;
export type SlotStore<S> = {
  readonly component: Component<S>;
};

export const createSlotFactory = <Id extends string>({ slots }: { readonly slots: Record<string, Id> }) => {
  const api = {
    remove: createEvent<{ readonly id: Id }>(),
    set: createEvent<{ readonly id: Id; readonly component: Component<any> }>(),
  };

  const createSlot = <P,>({ id }: { readonly id: Id }) => {
    const $slot = createStore<SlotStore<P>>({ component: () => null });

    const slotApi = createApi($slot, {
      remove: (state) => ({ ...state, component: $slot.defaultState.component }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
    });

    const isSlotEventCalling = (payload: { readonly id: Id }) => payload.id === id;

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

    const Slot = (props: P = {} as P) => {
      const Component = useStoreMap({
        store: $slot,
        fn: ({ component }) => component,
        keys: [],
      });

      return <Component {...props} />;
    };

    return {
      Slot,
      /**
       * @deprecated Looks like useless data
       */
      $slot,
    };
  };

  return {
    api,
    createSlot,
  };
};
