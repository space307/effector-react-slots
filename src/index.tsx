import { createApi, createStore, createEvent, guard, sample, createEffect } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import type { ReactElement, ReactNode } from 'react';

type Component<S> = (props: S) => ReactElement | null;
type SlotStore<S> = Readonly<{
  component: Component<S>;
  isVisible: boolean;
  shouldLog: boolean;
}>;
type LogFx<S> = (
  eventName: S,
  config?: {
    readonly logger?: (_: string) => unknown;
  },
) => void;

export const createSlotFactory = <Id extends string>(slots: Record<string, Id>) => {
  const api = {
    hide: createEvent<Readonly<{ id: Id }>>(),
    remove: createEvent<Readonly<{ id: Id }>>(),
    set: createEvent<Readonly<{ id: Id; component: Component<any> }>>(),
    show: createEvent<Readonly<{ id: Id }>>(),
  };

  const createSlot = <P,>(id: Id) => {
    const $slot = createStore<SlotStore<P>>({
      component: () => null,
      isVisible: true,
      shouldLog: false,
    });

    const slotApi = createApi($slot, {
      hide: (state) => (!state.isVisible ? undefined : { ...state, isVisible: false }),
      remove: (state) => ({
        ...state,
        component: $slot.defaultState.component,
      }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
      show: (state) => (state.isVisible ? undefined : { ...state, isVisible: true }),
      attachLogger: (state) => (state.shouldLog === true ? undefined : { ...state, shouldLog: true }),
    });

    type SlotPublicApi = Exclude<keyof typeof slotApi, 'attachLogger'>;

    const logFx = createEffect<LogFx<SlotPublicApi>>((eventName, config) => {
      const logger = config?.logger || console.info;

      switch (eventName) {
        case 'hide':
          logger(`${id} slot content was hidden`);
          break;
        case 'remove':
          logger(`${id} slot content was removed`);
          break;
        case 'set':
          logger(`${id} slot content was set`);
          break;
        case 'show':
          logger(`${id} slot content was shown`);
          break;
      }
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

    guard({
      clock: sample({
        clock: [
          slotApi.hide.map<SlotPublicApi>(() => 'hide'),
          slotApi.remove.map<SlotPublicApi>(() => 'remove'),
          slotApi.set.map<SlotPublicApi>(() => 'set'),
          slotApi.show.map<SlotPublicApi>(() => 'show'),
        ],
        source: $slot,
        fn: ({ shouldLog }, eventName) => (shouldLog ? eventName : null),
      }),
      filter: (eventName): eventName is SlotPublicApi => eventName !== null,
      target: logFx,
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

  return {
    api,
    createSlot,
  };
};
