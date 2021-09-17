import { useStoreMap } from 'effector-react';

import { SLOT_ID } from './init';

const afterAmountButtonSlot = createSlot({ id: SLOT_ID.FOO });

export const FooSlot = () => {
  const Component = useStoreMap({
    store: afterAmountButtonSlot.$slot,
    fn: ({ component }) => component,
    keys: [],
  });

  return <Component />;
};
