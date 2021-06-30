type EventType<T={}> = new (...args: any[]) => T;
type Listener<T> = (event: T) => void;
type RemoveFunction = () => boolean;

export class EventBus {
  #listeners: Map<string, Function[]>;

  constructor() {
    this.#listeners = new Map<string, Function[]>();
  }

  on<T>(event: EventType<T>, listener: Listener<T>): RemoveFunction {
    const oldListeners = this.#listeners.get(event.name) ?? [];

    this.#listeners.set(event.name, [...oldListeners, listener]);

    return () => {
      const oldListeners = this.#listeners.get(event.name) ?? [];
      let status = false;

      if (oldListeners.length >= 1) {
        status = this.#listeners.delete(event.name);
      } else {
        // TODO make better return value
        this.#listeners.set(event.name, oldListeners.filter(item => item === listener));
        status = true;
      }

      return status;
    }
  }

  // TODO: Add better typing to only allow class objects
  emit(event: Object) {
    const listeners = this.#listeners.get(event.constructor.name) ?? [];

    listeners.forEach(listener => listener(event));
  }
}

module.exports= { EventBus };