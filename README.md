# Effector React Slots

☄️ Effector library for slots implementation in React.

## What is a slot

A slot is a place in a component where you can insert any unknown component. It's a well-known abstraction used by frameworks
such as Vue.js and Svelte.

Slots arn't present in the React. With React you can achieve this goal using props or React.Context.
In large projects this is not convenient, because it generates "props hell" or smears the logic.

Using React with Effector we can achieve slot goals avoiding the problems described above.

[Try it out](https://replit.com/@binjospookie/effector-react-slots-example)

## Usage

### Step 1

```sh
npm install effector-react-slots
```

or

```sh
yarn add effector-react-slots
```

### Step 2

Define constant with slots name and call `createSlotFactory`.

```typescript
import { createSlotFactory } from '@space307/effector-react-slots';

export const SLOTS = {
  FOO: 'foo',
} as const;

export const { api, createSlot } = createSlotFactory({ slots: SLOTS });
```

### Step 3

Create Slot component.

```ts
import { createSlot, SLOTS } from './slots';

export const { Slot: FooSlot } = createSlot({ id: SLOTS.FOO });
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

[Try it out](https://replit.com/@binjospookie/effector-react-slots-example)


## API

### createSlotFactory

Function that returns a function for creating slots and an API for manipulating them.

```typescript
const { createSlot, api } = createSlotFactory({ slots: { FOO: 'foo' } });
```

### createSlot

Function, takes the slot id. Returns Slot component.

```typescript
const { Slot } = createSlot({ id: 'foo' });
```

### api.set

Method for rendering component in a slot. Takes slot id and component.

```typescript
api.set({ id: 'foo', component: Foo });
```

### api.remove

Method to stop rendering component in a slot. Takes slot id.

```typescript
api.remove({ id: 'foo' });
```

### api.hide

Alows to hide the slot data. Like `api.remove`, without deleting the slot data. Takes slot id.

```typescript
api.hide({ id: 'foo' });
```

### api.show

Alows to show a hidden slot data. Takes slot id.

```typescript
api.show({ id: 'foo' });
```

## TypeScript guide

### createSlot

Props of component passed to slot can be defined as generic.

```typescript
createSlot<{ readonly text: string }>({ id: 'heading' });
```

## Useful links
* [Slots proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)
* [Vue.js docs](https://v3.vuejs.org/guide/component-slots.html)
* [Svelte docs](https://svelte.dev/docs#slot)
