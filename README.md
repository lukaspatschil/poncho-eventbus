# @ponchojs/eventbus

Light weight event bus for JavaScript and TypeScript written in TypeScript with complete type integration.

In order for the event bus to work it is necessary to use ES6 or higher.

## Usage

First import the package with ESM or CommonJS:

```js
import EventBus from '@ponchojs/eventbus';

const EventBus = require('@ponchojs/eventbus');
```

In order to use the eventBus you will need to create a new instance of it:

```js
const eventBus = new EventBus();
```

### Adding an event listener

You can simply add an event listener by calling the `on` function on your event bus.
The first value is the event it should listen to. This has to be a class, function or string.
The second parameter is the callback function which will be called when the event is emitted.

The return value of this function will be the function which unsubscribes this listener from the event bus.

```js
const removeFunction = eventBus.on(NewEvent, event => console.log(event));

const removeFunction = eventBus.on('event', event => console.log(event));
```

### Removing an event listener

When you add an event listener it will return a function. When it is called the event listener will be removed from the event bus.
If the listener was removed successfully it will return `true` otherwise `false`.

```js
const removed = removeFunction();
```

### Emitting an event

With the `emit` or `post` function you can emit a new event on the event bus. This function simply takes your event data as input.

```js
eventBus.emit(new NewEvent('This is data'));

eventBus.post(new NewEvent('This is data'));

eventBus.emit('event');

eventBus.post('event');
```

## TypeScript and typing

Since this package uses typescript it is possible to get all the type information about the event you are listening to. This helps while developing your callbacks and also allows the typescript compiler to recognize errors in your type usage.

## Bugs and feature suggestions

If you find any bugs or have any feature suggestions feel free to create a new issue on the [issue tracker](https://github.com/lukaspatschil/poncho-eventbus/issues).
