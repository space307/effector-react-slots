import { createApi, createStore, createEvent, guard, sample, createEffect } from 'effector';
import { useStoreMap } from 'effector-react';
import React from 'react';

import type { ReactElement, ReactNode } from 'react';

const ACTIONS = {
  HIDE: 'hide',
  REMOVE: 'remove',
  SET: 'set',
  SHOW: 'show',
  ATTACH_LOGGER: 'attachLogger',
} as const;

type Logger<S, P> = (
  _: string,
  meta: {
    readonly action: P;
    readonly slotId: S;
  },
) => unknown;
type GetLogText<S, P> = (_: { action: S; slotId: P }) => string;
type Component<S> = (props: S) => ReactElement | null;
type SlotStore<S> = Readonly<{
  component: Component<S>;
  isVisible: boolean;
}>;
type Config<S, P> = {
  readonly logger?: {
    readonly fn: Logger<S, P>;
  };
};

// todo: add an ability to setup list of watchable slots
export const createSlotFactory = <Id extends string>(
  slots: Record<string, Id>,
  config?: Config<Id, Exclude<typeof ACTIONS[keyof typeof ACTIONS], 'attachLogger'>>,
) => {
  const attachLogger = createEvent();
  const $shouldLog = createStore<boolean>(false).on(attachLogger, () => true);

  const api = {
    [ACTIONS.HIDE]: createEvent<Readonly<{ id: Id }>>(),
    [ACTIONS.REMOVE]: createEvent<Readonly<{ id: Id }>>(),
    [ACTIONS.SET]: createEvent<Readonly<{ id: Id; component: Component<any> }>>(),
    [ACTIONS.SHOW]: createEvent<Readonly<{ id: Id }>>(),
    [ACTIONS.ATTACH_LOGGER]: attachLogger,
  };
  const getLogText: GetLogText<keyof typeof api, Id> = ({ action, slotId }) => {
    if (action === ACTIONS.HIDE) {
      return `${slotId} slot content was hidden`;
    }

    if (action === ACTIONS.REMOVE) {
      return `${slotId} slot content was removed`;
    }

    return action === ACTIONS.SET ? `${slotId} slot content was removed` : `${slotId} slot content was shown`;
  };

  type LogParameters = Parameters<typeof getLogText>[0];

  const logFx = createEffect<NonNullable<NonNullable<typeof config>['logger']>['fn']>(
    config?.logger?.fn || console.info,
  );

  guard({
    clock: sample({
      clock: [
        api.hide.map(({ id }) => ({
          slotId: id,
          action: ACTIONS.HIDE,
        })),
        api.remove.map(({ id }) => ({
          slotId: id,
          action: ACTIONS.REMOVE,
        })),
        api.set.map(({ id }) => ({
          slotId: id,
          action: ACTIONS.SET,
        })),
        api.show.map(({ id }) => ({
          slotId: id,
          action: ACTIONS.SHOW,
        })),
      ],
      source: $shouldLog,
      fn: (shouldLog, logParameters): LogParameters | null => (shouldLog ? logParameters : null),
    }),
    filter: (data): data is LogParameters => data !== null,
    target: logFx.prepend<LogParameters>(getLogText),
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

  return {
    api,
    createSlot,
  };
};
