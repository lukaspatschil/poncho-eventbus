import EventBus from '../lib/index';
import {EventBusError} from "../lib";

describe('EventBus Tests', () => {
  const message = 'This is a message';
  const type = 'Message';

  let eventBus: EventBus;

  let mockCallback: jest.Mock<void, []>;

  class NewEvent {
    constructor(public type: string, public message: string) {}
  }

  beforeEach(() => {
    eventBus = new EventBus();
    mockCallback = jest.fn();
  });

  describe('Add event listener', () => {
    it('registers a new event listener and fire event', () => {
      // Given
      eventBus.on(NewEvent, mockCallback);

      // When
      eventBus.emit(new NewEvent(type, message));
  
      // Then
      expect(mockCallback).toBeCalledWith({type, message});
    });

    it('registers a new event with a string and fire event', () => {
      // Given
      const eventName = 'EventName';
      eventBus.on(eventName, mockCallback);

      // When
      eventBus.emit(eventName);

      // Then
      expect(mockCallback).toBeCalledWith(eventName);
    });

    it('registers a new event listener and fire event multiple times', () => {
      // Given
      eventBus.on(NewEvent, mockCallback);
  
      // When
      eventBus.emit(new NewEvent(type, message));
      eventBus.emit(new NewEvent(type, message));
  
      // Then
      expect(mockCallback).toBeCalledTimes(2);
    });

    it('throws an error when an unsupported type is provided', () => {
      // When
      // @ts-expect-error - The type error should be tested
      const instantiate = () => eventBus.on(12, mockCallback);
      
      // Then
      expect(instantiate).toThrowError(EventBusError);
    });
  });

  describe('Post events', () => {
    it('emits an event on to the listener', () => {
      // Given
      eventBus.on(NewEvent, mockCallback);

      // When
      eventBus.emit(new NewEvent(type, message));

      // Then
      expect(mockCallback).toBeCalledWith({type, message});
    });

    it('posts an event on to the listener', () => {
      // Given
      eventBus.on(NewEvent, mockCallback);

      // When
      eventBus.post(new NewEvent(type, message));

      // Then
      expect(mockCallback).toBeCalledWith({type, message});
    });
  });

  describe('Remove event listener', () => {
    it('remove a event listener and do not fire event after removal', () => {
      // Given
      const remove = eventBus.on(NewEvent, mockCallback);

      // When
      eventBus.emit(new NewEvent(type, message));
      remove();
      eventBus.emit(new NewEvent(type, message));

      // Then
      expect(mockCallback).toBeCalledTimes(1);
    });

    it('remove a event listener successful', () => {
      // Given
      const remove = eventBus.on(NewEvent, mockCallback);

      // When
      const status = remove();

      // Then
      expect(status).toBe(true);
    });

    it('remove a event listener from event with multiple listeners', () => {
      // Given
      const mockCallback2 = jest.fn(a => a);
      const remove = eventBus.on(NewEvent, mockCallback);
      eventBus.on(NewEvent, mockCallback2);

      // When
      remove();
      eventBus.emit(new NewEvent(type, message));

      // Then
      expect(mockCallback).not.toBeCalledWith({type, message});
    });
  });
})
