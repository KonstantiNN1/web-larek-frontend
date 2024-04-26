import { IEvents } from "./events";

export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        // проверить работоспособность с data
        Object.assign(this, data);
    };
        // проверить с payload?
    emitEvents(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
    };
};