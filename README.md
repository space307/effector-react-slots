# Effector React Slots


A slot is a place in a component where you can insert any unknown component. It's a well-known abstraction used by frameworks
such as Vue.js and Svelte.

Slots arn't present in the React. With React you can achieve this goal using props or React.Context.
In large projects this is not convenient, because it generates "props hell" or smears the logic.

Using React with Effector we can achieve slot goals without the problems described above.

[Try it out](https://codesandbox.io/s/effector-react-slots-example-eppjr?file=/src/App.tsx)

## Usage

### Step 1

```sh
npm install --save @space307/effector-react-slots

# or

yarn add @space307/effector-react-slots
```

### Step 2

Define constant with slots name and call `createSlotFactory`.

```typescript
import { createSlotFactory } from '@space307/effector-react-slots';

export const SLOTS = {
  FOO: 'foo',
};

export const { api, createSlot } = createSlotFactory({ slots: SLOTS });
```

### Step 3

Create Slot component.

```tsx
import React from 'react';
import { useStoreMap } from 'effector-react';

import { createSlot, SLOTS } from './slots';

const { $slot } = createSlot({ id: SLOTS.FOO });

export const FooSlot = () => {
  const Component = useStoreMap({
    store: $slot,
    fn: ({ component }) => component,
    keys: [],
  });

  return <Component />;
};
```

### Step 4

Insert Slot component to your UI.

```tsx
import React from 'react';

import { FooSlot } from './fooSlot';

export const ComponentWithSlot = () => (
  <>
    <h1>Hello, Slots!</h1>
    <FooSlot />
  </>
);
```

### Step 5

Render something inside slot. For example, based on data from feature toogle of your app.

```tsx
import { split } from 'effector';

import { $featureToggle } from './featureToggle';
import { api, SLOTS } from './slots';

const MyAwesomeFeature = () => <p>Look at my horse</p>;
const VeryAwesomeFeature = () => <p>My horse is amaizing</p>;

split({
  source: $featureToggle,
  match: {
    awesome: (data) => data === 'awesome',
    veryAwesome: (data) => data === 'veryAwesome',
    hideAll: (data) => data === 'hideAll',
  },
  cases: {
    awesome: api.set.prepend(() => ({ id: SLOTS.FOO, component: MyAwesomeFeature })),
    veryAwesome: api.set.prepend(() => ({ id: SLOTS.FOO, component: VeryAwesomeFeature })),
    hideAll: api.remove.prepend(() => ({ id: SLOTS.FOO })),
  },
});
```

[Try it out](https://codesandbox.io/s/effector-react-slots-example-eppjr?file=/src/App.tsx)

## TypeScript guide

Best practices for writing well-typed code.

### createSlot

Props of component passed to slot can be defined as generic

```typescript
const slot = createSlot<{ readonly text: string }>({ id: 'heading' });
```

## API

### createSlotFactory

Function that returns a function for creating slots and an API for working with slots.

### API

### createSlot

Function, takes the slot name. Returns the table containing the slot

#### set

#### remove
