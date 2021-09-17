# Effector React Slots

## What is a slot?

A slot is a place in a component where you can insert any unknown component. It's a well-known abstraction used by frameworks
such as Vue.js and Svelte.

Slots arn't present in the React. With React you can achieve this goal using props or React.Context.
In large projects this is not convenient, because it generates "props hell" or smears the logic.

Using React with Effector we can achieve slot goals without the problems described above.

## How to achieve

### Step 1

Install `@space307/effector-react-slots`

```
npm i -save @space307/effector-react-slots
```

### Step 2

Define constant with slots name and call `makeCreateSlot`.

```typescript
import { makeCreateSlot } from '@space307/effector-react-slots';

export const SLOT_ID = {
  FOO: 'foo',
  BAR: 'bar',
};

export const { api, createSlot } = makeCreateSlot<typeof SLOT_ID[keyof typeof SLOT_ID]>();
```

### Step 3

Create Slot component.

```tsx
import React from 'react';
import { useStoreMap } from 'effector-react';

import { createSlot, SLOT_ID } from './slots';

const { $slot } = createSlot({ id: SLOT_ID.FOO });

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
import { api, SLOT_ID } from './slots';

const MyAwesomeFeature = () => <p>Look at my horse!</p>;
const VeryAwesomeFeature = () => <p>My horse is amaizing!</p>;

split({
  source: $featureToggle,
  match: {
    awesome: (data) => msg.type === 'awesome',
    veryAwesome: (data) => msg.type === 'veryAwesome',
  },
  cases: {
    awesome: api.set.prepend(() => ({ id: SLOT_ID.FOO, Component: MyAwesomeFeature })),
    veryAwesome: api.set.prepend(() => ({ id: SLOT_ID.FOO, Component: VeryAwesomeFeature })),
  },
});
```

[Try it](https://codesandbox.com)

## API

### makeCreateSlot

Function that returns a function for creating slots and an API for working with slots.

### API

### createSlot

function, takes the slot name. returns the table containing the slot

#### set

#### remove
