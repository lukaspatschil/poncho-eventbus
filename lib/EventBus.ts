import {EventType} from './EventTypes';
import {EventBusError} from "./EventBusError";

export type Event<T = Record<string, unknown>> = new (...args: any[]) => T;
export type Listener<T> = (event: T | string) => void;
export type Subscription = { detach: () => boolean };

export class EventBus {
  #listeners: Map<string, Listener<any>[]>;

  constructor() {
    this.#listeners = new Map<string, Listener<any>[]>();
  }

  on<T>(event: Event<T>, listener: Listener<T>): Subscription;
  on(event: string, listener: Listener<string>): Subscription;
  on<T>(event: Event<T> | string, listener: Listener<T | string>): Subscription {
    if (typeof event !== EventType.STRING && typeof event !== EventType.FUNCTION) {
      throw new EventBusError(`Event type ${typeof event} is not supported`);
    }

    const eventKey = this.#getEventKey(event);
    const oldListeners = this.#listeners.get(eventKey) ?? [];

    this.#listeners.set(eventKey, [...oldListeners, listener]);

    return {detach: this.#createDetachFunction(eventKey, listener)};
  }

  emit(event: object | string): void {
    const eventKey = this.#getEventKey(event);
    const listeners = this.#listeners.get(eventKey) ?? [];

    listeners.forEach((listener) => listener(event));
  }

  post = this.emit;

  clear(): void {
    this.#listeners = new Map();
  }

  #getEventKey<T>(event: Event<T> | string | object): string {
    const eventType = typeof event;
    let eventKey;

    switch (eventType) {
      case EventType.STRING:
        eventKey = `${EventType.STRING}_${event as string}`;
        break;
      case EventType.FUNCTION:
        eventKey = `${EventType.FUNCTION}_${(event as Event).name }`;
        break;
      case EventType.OBJECT:
        eventKey = `${EventType.FUNCTION}_${(event as object).constructor.name}`;
        break;
      default:
        eventKey = `${EventType.UNKNOWN}_${event as unknown}`;
        break;
    }

    return eventKey;
  }

  #createDetachFunction<T>(eventKey: string, listener: Listener<T>): () => boolean {
    return () => {
      const oldListeners = this.#listeners.get(eventKey) ?? [];
      let status;

      if (oldListeners.length <= 1) {
        status = this.#listeners.delete(eventKey);
      } else {
        const newListeners = oldListeners.filter((item) => item !== listener);
        this.#listeners.set(eventKey, newListeners);

        status = Boolean(oldListeners.length - newListeners.length);
      }

      return status;
    };
  }
}
