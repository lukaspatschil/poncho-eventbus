type EventType<T = {}> = new (...args: any[]) => T;
type Listener<T> = (event: T) => void;
type RemoveFunction = () => boolean;

export default class EventBus {
  #listeners: Map<string, Function[]>;

  constructor() {
    this.#listeners = new Map<string, Function[]>();
  }

  on<T>(event: EventType<T>, listener: Listener<T>): RemoveFunction {
    const oldListeners = this.#listeners.get(event.name) ?? [];

    this.#listeners.set(event.name, [...oldListeners, listener]);

    return (): boolean => {
      const oldListeners = this.#listeners.get(event.name) ?? [];
      let status = false;

      if (oldListeners.length <= 1) {
        status = this.#listeners.delete(event.name);
      } else {
        const newListeners = oldListeners.filter((item) => item !== listener);
        this.#listeners.set(event.name, newListeners);

        status = Boolean(oldListeners.length - newListeners.length);
      }

      return status;
    };
  }

  // TODO: Add better typing to only allow class objects
  emit(event: Object): void {
    const listeners = this.#listeners.get(event.constructor.name) ?? [];

    listeners.forEach((listener) => listener(event));
  }
}

module.exports = EventBus;
