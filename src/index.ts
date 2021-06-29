import { EventBus } from './eventBus';

class LoggerEvent {
  constructor(public type: string, public message: string) {}
}

const cobus = new EventBus;

const bad = cobus.on(LoggerEvent, event => console.log(event));

cobus.on(LoggerEvent, event => console.error(`${event.type}: ${event.message}`));

cobus.emit(new LoggerEvent('ERROR', 'This is an error message since it is working!'));

bad();

cobus.emit(new LoggerEvent('ERROR', 'Secound message for the events'));