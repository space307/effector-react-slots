import type { Event } from 'effector';
import type { ReactElement } from 'react';

export const ACTIONS = {
  HIDE: 'hide',
  REMOVE: 'remove',
  SET: 'set',
  SHOW: 'show',
  ATTACH_LOGGER: 'attachLogger',
} as const;

export type Component<S> = (props: S) => ReactElement | null;

export type SlotsApi<Id> = {
  [ACTIONS.HIDE]: Event<Readonly<{ id: Id }>>;
  [ACTIONS.REMOVE]: Event<Readonly<{ id: Id }>>;
  [ACTIONS.SET]: Event<Readonly<{ id: Id; component: Component<any> }>>;
  [ACTIONS.SHOW]: Event<Readonly<{ id: Id }>>;
};

export type SlotName = string;
