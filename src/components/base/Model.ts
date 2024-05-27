import { EventEmitter } from './events';

export abstract class Model<T> {
    protected data: T;
    protected events: EventEmitter;

    constructor(data: T) {
        this.data = data;
        this.events = new EventEmitter();
    }

    protected emitEvents<K extends keyof T>(eventName: string, eventData: T) {
        this.events.emit(eventName, { ...this.data, ...eventData });
    }

    on<K extends keyof T>(event: string, callback: (data: T) => void) {
        this.events.on(event, callback as (data: unknown) => void);
    }
}