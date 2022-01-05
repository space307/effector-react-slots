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

export const makeCreateSlot =
  <Id extends string>(api: SlotsApi<Id>) =>
  <P,>(id: Id) => {
    const $slot = createStore<SlotStore<P>>({
      component: () => null,
      isVisible: true,
    });

    const slotApi = createApi($slot, {
      hide: (state) => (!state.isVisible ? undefined : { ...state, isVisible: false }),
      remove: (state) => ({
        ...state,
        component: $slot.defaultState.component,
      }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
      show: (state) => (state.isVisible ? undefined : { ...state, isVisible: true }),
    });

    const isSlotEventCalling = (payload: Readonly<{ id: Id }>) => payload.id === id;

    guard({
      clock: api[ACTIONS.HIDE],
      filter: isSlotEventCalling,
      target: slotApi.hide,
    });

    guard({
      clock: api[ACTIONS.REMOVE],
      filter: isSlotEventCalling,
      target: slotApi.remove,
    });

    sample({
      clock: guard({
        clock: api[ACTIONS.SET],
        filter: isSlotEventCalling,
      }),
      fn: ({ component }) => component,
      target: slotApi.set,
    });

    guard({
      clock: api[ACTIONS.SHOW],
      filter: isSlotEventCalling,
      target: slotApi.show,
    });

    const Slot = (props: P & { readonly children?: ReactNode } = {} as P) =>
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
