# Effector React Slots

☄️ Effector library for slots implementation in React.

![Made with love in ~/.space307](https://madewithlove.now.sh/ru?heart=true&colorA=%23000000&colorB=%2304b2b9&text=%7E%2F.space307)

- [What is a slot](#what-is-a-slot)
- [Usage](#usage)
  - [Step 1](#step-1)
  - [Step 2](#step-2)
  - [Step 3](#step-3)
  - [Step 4](#step-4)
  - [Step 5](#step-5)
- [API](#api)
  - [createSlotFactory](#createslotfactory)
  - [createSlot](#createslot)
  - [api.set](#apiset)
  - [api.remove](#apiremove)
  - [api.hide](#apihide)
  - [api.show](#apishow)
  - [api.attachLogger](#apiattachlogger)
    - [Arguments](#arguments)
      - [`fn`](#fn)
      - [`watchList`](#watchlist)
- [Advanced](#advanced)
  - [Fallback content](#fallback-content)
- [TypeScript guide](#typescript-guide)
  - [createSlot](#createslot-1)
- [Useful links](#useful-links)

## What is a slot

A slot is a place in a component where you can insert any unknown component. It's a well-known abstraction used by frameworks
such as Vue.js and Svelte.

Slots aren't present in the React. With React you can achieve this goal using props or React.Context.
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
import { createSlotFactory } from 'effector-react-slots';

export const SLOTS = {
  FOO: 'foo',
} as const;

export const { api, createSlot } = createSlotFactory(SLOTS);
```

### Step 3

Create Slot component.

```ts
import { createSlot, SLOTS } from './slots';

export const { Slot: FooSlot } = createSlot(SLOTS.FOO);
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

Render something inside slot. For example, based on data from feature toggle of your app.

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
  },
  cases: {
    awesome: api.set.prepend(() => ({ id: SLOTS.FOO, component: MyAwesomeFeature })),
    veryAwesome: api.set.prepend(() => ({ id: SLOTS.FOO, component: VeryAwesomeFeature })),
    __: api.remove.prepend(() => ({ id: SLOTS.FOO })),
  },
});
```

[Try it out](https://replit.com/@binjospookie/effector-react-slots-example)

## API

### createSlotFactory

Function that returns a function for creating slots and an API for manipulating them.

```typescript
const SLOTS = {
  FOO: 'foo'
};

const { createSlot, api } = createSlotFactory(SLOTS);
```

### createSlot

Function, takes the slot id. Returns Slot component.

```typescript
const { Slot } = createSlot('foo');
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

Allows to hide the slot data. Like `api.remove`, without deleting the slot data. Takes slot id.

```typescript
api.hide({ id: 'foo' });
```

### api.show

Allows to show a hidden slot data. Takes slot id.

```typescript
api.show({ id: 'foo' });
```

### api.attachLogger

> Since v2.2.0

Allows to log actions that take place with slots.

```typescript
api.attachLogger();

slotApi.attachLogger({
  fn: ({ meta: { slotId } }) => console.info(slotId),
});

slotApi.attachLogger({
  watchList: [SLOTS.FOO, SLOTS.BAR],
});

slotApi.attachLogger({
  watchList: [SLOTS.FOO, SLOTS.BAR],
  fn: ({ meta: { slotId } }) => console.info(slotId),
});
```

#### Arguments

##### `fn`

Optional. Function which could be used for logging.
Accepts object:

```typescript
{
  meta: {
    action: 'set' | 'remove' | 'hide' | 'show',
    slotId: SlotId,
    slotName: string;
  };
  message: string;
}
```

##### `watchList`

```typescript
type: SlotId[]
```

Optional. Allows to specify which slots should be logged.

```typescript
slotApi.attachLogger({
  watchList: [SLOTS.FOO, SLOTS.BAR],
});
```

## Advanced

### Fallback content

> Since v2.1.0

Slot can contain fallback content that is rendered if no component are passed.

```tsx
import { render } from 'render';
import { createSlotFactory } from 'effector-react-slots';

const SLOTS = {
  FOO: 'foo',
} as const;

const { api, createSlot } = createSlotFactory(SLOTS);
const { Slot: FooSlot } = createSlot(SLOTS.FOO);

const MyAwesomeFeature = () => <p>Look at my horse</p>;
const ComponentWithSlot = () => <FooSlot>Fallback text</FooSlot>;

render(ComponentWithSlot); // "Fallback text"
api.set({ id: SLOTS.FOO, component: MyAwesomeFeature });
render(ComponentWithSlot); // "Look at my horse"
api.remove({ id: SLOTS.FOO });
render(ComponentWithSlot); // "Fallback text"
```

## TypeScript guide

### createSlot

Props of component passed to slot can be defined as generic.

```typescript
createSlot<{ readonly count: number }>(string);
```

## Useful links
* [Slots proposal](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)
* [Vue.js docs](https://v3.vuejs.org/guide/component-slots.html)
* [Svelte docs](https://svelte.dev/docs#slot)
