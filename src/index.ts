import { createApi, createStore, createEvent, guard, sample } from 'effector';

import type { ReactElement, PropsWithChildren } from 'react';

type Component<S> = (props: PropsWithChildren<S>) => ReactElement | null;
type Store<S> = {
  readonly component: Component<S>;
};

export const createSlotFactory = ({ slots }: { readonly slots: Record<string, string | number> }) => {
  type Id = typeof slots[keyof typeof slots];

  const api = {
    remove: createEvent<{ readonly id: Id }>(),
    set: createEvent<{ readonly id: Id; readonly component: Component<any> }>(),
  };

  const createSlot = <P>({ id }: { readonly id: Id }) => {
    const defaultToStore: Store<P> = {
      component: () => null,
    };
    const $slot = createStore<Store<P>>(defaultToStore);
    const slotApi = createApi($slot, {
      remove: (state) => ({ ...state, component: defaultToStore.component }),
      set: (state, payload: Component<P>) => ({ ...state, component: payload }),
    });
    const guardFilter = (payload: { readonly id: Id }) => payload.id === id;

    guard({
      clock: api.remove,
      filter: guardFilter,
      target: slotApi.remove,
    });

    sample({
      clock: guard({
        clock: api.set,
        filter: guardFilter,
      }),
      fn: ({ component }) => component,
      target: slotApi.set,
    });

    return {
      $slot,
    };
  };

  return {
    api,
    createSlot,
  };
};
