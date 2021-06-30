# poncho-eventbus

A small event bus written in typescript with complete type safty.

## Usage

First import the package with ESM or CommonJS:

```js
import { EventBus } from '@ponchojs/eventbus';
```

In order to use the eventBus you will need to create a new instance of it:

```js
const eventBus = new EventBus();
```

### Adding an event listener

You can simply add an event listener by calling the `on` function on your event bus.
The first value is the event it should listen to. This has to be a class.
The secound parameter is the callback function which will be called when the event is emitted.

The return value of this function will be the function which unsbscribes this listener from the event bus.

```js
const removeFunction = eventBus.on(NewEvent, event => console.log(event));
```

### Removing an event listener

When you add an event listener it will return a function. When it is called the event listener will be removed from the event bus.
If the listener was removed successfully it will return `true` otherwise `false`.

```js
const removed = removeFunction();
```

### Emitting an event

With the `emit` function you can emit a new event on the event bus. This function simply takes your event data as input.

```js
eventBus.emit(new NewEvent('This is data'));
```