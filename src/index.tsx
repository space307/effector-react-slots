import { createApi, createStore, createEvent, guard, sample, createEffect } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import type { ReactElement, ReactNode } from 'react';

type Logger = (_: string) => unknown;
type GetLogText<S, P> = (_: { eventName: S; slotId: P }) => string;
type Component<S> = (props: S) => ReactElement | null;
type SlotStore<S> = Readonly<{
  component: Component<S>;
  isVisible: boolean;
}>;

export const createSlotFactory = <Id extends string>(slots: Record<string, Id>) => {
  // $ of loggable slots ID
  const api = {
    hide: createEvent<Readonly<{ id: Id }>>(),
    remove: createEvent<Readonly<{ id: Id }>>(),
    set: createEvent<Readonly<{ id: Id; component: Component<any> }>>(),
    show: createEvent<Readonly<{ id: Id }>>(),
    attachLogger: createEvent(),
  };
  const getLogText: GetLogText<keyof typeof api, Id> = ({ eventName, slotId }) => {
    if (eventName === 'hide') {
      return `${slotId} slot content was hidden`;
    }

    if (eventName === 'remove') {
      return `${slotId} slot content was removed`;
    }

    return eventName === 'set' ? `${slotId} slot content was removed` : `${slotId} slot content was shown`;
  };
  type GetLogTextRequiredParameter = Parameters<typeof getLogText>[0];

  const logFx = createEffect<Logger>(() => console.info);

  guard({
    clock: [
      api.hide.map(({ id }) => ({
        slotId: id,
        eventName: 'hide',
      })),
      api.remove.map(({ id }) => ({
        slotId: id,
        eventName: 'remove',
      })),
      api.set.map(({ id }) => ({
        slotId: id,
        eventName: 'set',
      })),
      api.show.map(({ id }) => ({
        slotId: id,
        eventName: 'show',
      })),
    ],
    filter: (data): data is GetLogTextRequiredParameter => data !== null,
    target: logFx.prepend<GetLogTextRequiredParameter>(getLogText),
  });

  const createSlot = <P,>(id: Id) => {
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
