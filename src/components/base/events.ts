// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber<T = any> = (event: T) => void;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T = any>(event: EventName, callback: Subscriber<T>): void;
    emit<T = any>(event: string, data?: T): void;
}

export class EventEmitter implements IEvents {
    private _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    on<T = any>(eventName: EventName, callback: Subscriber<T>) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    emit<T = any>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    onAll(callback: Subscriber<{ eventName: string; data: unknown }>) {
        this.on("*", callback);
    }

    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    trigger<T = any>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}