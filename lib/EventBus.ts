import { EventType } from './EventTypes';
import {EventBusError} from "./EventBusError";

type EventClass<T = {}> = new (...args: any[]) => T;
export type Event<T = {}> = EventClass<T>;
export type Listener<T> = (event: T) => void;
export type RemoveFunction = () => boolean;

export class EventBus {
  #listeners: Map<string, Function[]>;

  constructor() {
    this.#listeners = new Map<string, Function[]>();
  }

  on<T>(event: Event<T>, listener: Listener<T>): RemoveFunction;
  on(event: string, listener: Listener<string>): RemoveFunction;
  on<T>(event: Event<T> | string, listener: Listener<T | string>): RemoveFunction {
    if (typeof event !== EventType.STRING && typeof event !== EventType.FUNCTION) {
      throw new EventBusError(`Event type ${typeof event} is not supported`);
    }

    const eventKey = this.#getEventKey(event);
    const oldListeners = this.#listeners.get(eventKey) ?? [];

    this.#listeners.set(eventKey, [...oldListeners, listener]);

    return this.#createRemoveFunction(eventKey, listener);
  }

  emit(event: object | string): void {
    const eventKey = this.#getEventKey(event);
    const listeners = this.#listeners.get(eventKey) ?? [];

    listeners.forEach((listener) => listener(event));
  }

  post = this.emit;

  #getEventKey<T>(event: Event<T> | string | object): string {
    const eventType = typeof event;
    let eventKey;

    switch (eventType) {
      case EventType.STRING:
        eventKey = `${EventType.STRING}_${event as string}`;
        break;
      case EventType.FUNCTION:
        eventKey = `${EventType.FUNCTION}_${(event as EventClass).name }`;
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

  #createRemoveFunction<T>(eventKey: string, listener: Listener<T>): () => boolean {
    return () => {
      const oldListeners = this.#listeners.get(eventKey) ?? [];
      let status = false;

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