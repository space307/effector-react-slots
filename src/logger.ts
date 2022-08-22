import { createStore, createEvent, guard, sample, createEffect } from 'effector';

import { ACTIONS } from './shared';

import type { EventPayload } from 'effector';
import type { SlotsApi, SlotName } from './shared';

type Logger<S, P, T> = (
  _: Readonly<{
    message: string;
    meta: {
      action: P;
      slotId: S;
      slotName: T;
    };
  }>,
) => unknown;
type GetLogText<S, P, T> = (_: { action: S; slotId: P; slotName: T }) => string;

const LOG_TITLE = '[effector-react-slots]';

const createLogger = <Id extends string>({
  api,
  slots,
}: {
  readonly api: SlotsApi<Id>;
  readonly slots: Record<SlotName, Id>;
}) => {
  const slotNames = new Map(Object.entries(slots).map(([key, value]) => [value, key]));

  const attachLogger = createEvent<Readonly<{
    fn?: Logger<Id, keyof SlotsApi<Id>, SlotName>;
    watchList?: Id[];
  }> | void>();

  const $logger = createStore<
    Readonly<{
      shouldLog: boolean;
      watchList: Id[];
    }>
  >({
    shouldLog: false,
    watchList: Object.values(slots),
  }).on(attachLogger, (state, payload) =>
    state.shouldLog ? undefined : { shouldLog: true, watchList: payload?.watchList || Object.values(slots) },
  );

  const getLogText: GetLogText<keyof SlotsApi<Id>, Id, SlotName> = ({ action, slotId, slotName }) =>
    `${LOG_TITLE} ${slotName} -> ${action} // ${slotId}`;

  type LogParameters = Parameters<typeof getLogText>[0];

  const logFx = createEffect<NonNullable<Exclude<EventPayload<typeof attachLogger>, void>['fn']>>(({ message }) =>
    console.info(message),
  );

  const unsub = attachLogger.watch((payload) => {
    if (payload?.fn) {
      logFx.use(payload.fn);
    }

    unsub();
  });

  guard({
    clock: sample({
      clock: [
        api.hide.map(({ id }) => ({
          action: ACTIONS.HIDE,
          slotId: id,
          slotName: slotNames.get(id) as SlotName,
        })),
        api.remove.map(({ id }) => ({
          action: ACTIONS.REMOVE,
          slotId: id,
          slotName: slotNames.get(id) as SlotName,
        })),
        api.set.map(({ id }) => ({
          action: ACTIONS.SET,
          slotId: id,
          slotName: slotNames.get(id) as SlotName,
        })),
        api.show.map(({ id }) => ({
          action: ACTIONS.SHOW,
          slotId: id,
          slotName: slotNames.get(id) as SlotName,
        })),
      ],
      source: $logger,
      fn: ({ shouldLog, watchList }, logParameters): LogParameters | null =>
        shouldLog && watchList.includes(logParameters.slotId) ? logParameters : null,
    }),
    filter: (data): data is LogParameters => data !== null,
    target: logFx.prepend<LogParameters>((data) => ({ message: getLogText(data), meta: data })),
  });

  return attachLogger;
};

export { LOG_TITLE, createLogger };
export type { Logger };
