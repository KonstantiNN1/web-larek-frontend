import { IDelivery } from "../types";
import { IUser } from "../types";
import { IOrder } from "../types";
import { Form } from "./Form";
import { IEvents } from "./base/events";

export class Delivery extends Form<IDelivery> {
    protected online: HTMLButtonElement;
    protected offline: HTMLButtonElement;
    protected address: HTMLInputElement

    constructor(container: HTMLFormElement, className: string, protected event: IEvents) {
        super(container, event);
        this.online = container.elements.namedItem('card') as HTMLButtonElement;
        this.offline = container.elements.namedItem('cash') as HTMLButtonElement;
        this.address = container.elements.namedItem('address') as HTMLInputElement;

        if (this.offline) {
            this.offline.addEventListener('click', () => {
                this.offline.classList.add('button_alt-active');
                this.online.classList.remove('button_alt-active');
                //проверить, нужно здесь кэш или офлайн
                this.onInputChange('payment', 'cash');
            });
        };
        if (this.online) {
            this.online.addEventListener('click', () => {
                this.online.classList.add('button_alt-active');
                this.offline.classList.remove('button_alt-active');
                //проверить, нужн здесь кэш или офлайн
                this.onInputChange('payment', 'card');
            });
        };
    };

    disableButtons() {
        this.offline.classList.remove('button_alt-active');
        this.online.classList.remove('button_alt-active');
      };
}

export class User extends Form<IUser> {
    protected email: HTMLInputElement;
    protected phone: HTMLInputElement;

    constructor(container: HTMLFormElement, className: string, event: IEvents) {
        super(container, event);
        this.email = container.elements.namedItem('email') as HTMLInputElement;
        this.phone = container.elements.namedItem('phone') as HTMLInputElement;
    };
};

// доработать класс
export class Order extends Form<IOrder> {
    protected items: HTMLElement[];
    protected total: HTMLElement;
    protected payment: HTMLElement;
    protected address: HTMLInputElement;
    protected email: HTMLInputElement;
    protected phone: HTMLInputElement;

    constructor(container: HTMLElement, event: IEvents) {
        super(container, event);
    };
};