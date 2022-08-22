import { createApi, createStore, guard, sample } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import { ACTIONS } from './shared';

import type { ReactNode } from 'react';
import type { Component, SlotsApi } from './shared';

type SlotStore<S> = Readonly<{
  component: Component<S>;
  isVisible: boolean;
}>;

type SlotProps<P> = P & { readonly children?: ReactNode };

const makeCreateSlot =
  <Id extends string>(api: SlotsApi<Id>) =>
  <P,>(id: Id) => {
    const $slot = createStore<SlotStore<P>>({
      component: () => null,
      isVisible: true,
    });

    const slotApi = createApi($slot, {
      hide: (state) => (state.isVisible ? { component: state.component, isVisible: false } : undefined),
      remove: ({ isVisible }) => ({
        component: $slot.defaultState.component,
        isVisible,
      }),
      set: ({ isVisible }, payload: Component<P>) => ({ component: payload, isVisible }),
      show: (state) => (state.isVisible ? undefined : { component: state.component, isVisible: true }),
    });

    const isSlotEventCalling = (payload: Readonly<{ id: Id }>) => payload.id === id;

    guard({
      clock: api[ACTIONS.HIDE],
      filter: isSlotEventCalling,
      target: slotApi[ACTIONS.HIDE],
    });

    guard({
      clock: api[ACTIONS.REMOVE],
      filter: isSlotEventCalling,
      target: slotApi[ACTIONS.REMOVE],
    });

    sample({
      clock: guard({
        clock: api[ACTIONS.SET],
        filter: isSlotEventCalling,
      }),
      fn: ({ component }) => component,
      target: slotApi[ACTIONS.SET],
    });

    guard({
      clock: api[ACTIONS.SHOW],
      filter: isSlotEventCalling,
      target: slotApi[ACTIONS.SHOW],
    });

    const Slot = (props: SlotProps<P> = {} as P) =>
      useStoreMap({
        store: $slot,
        fn: ({ component: Component, isVisible }) => {
          if (!isVisible) {
            return null;
          }

          return $slot.defaultState.component === Component ? <>{props.children}</> : <Component {...props} />;
        },
        keys: [props],
      });

    return {
      Slot,
    };
  };

export { makeCreateSlot };
