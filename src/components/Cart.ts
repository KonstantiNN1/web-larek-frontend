import { IEvents } from "./base/events";
import { ICart } from "../types";
import { Component } from "./base/Component";

export class Cart extends Component<ICart> {
    protected list: HTMLElement;
    protected price: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, className: string, protected event: IEvents) {
        super(container);
        this.list = container.querySelector(`.${className}_list`);
        this.price = container.querySelector(`.${className}_price`);
        this.button = container.querySelector(`.${className}_button`);

        if (this.button) {
            this.button.addEventListener('click', () => this.event.emit('cart:toOrder'))
          }

    };

    setPrice(newPrice: number): void {
        this.price.textContent = newPrice.toString();
    };

    setList(products: HTMLElement[]): void {
        this.list.replaceChildren(...products);
        if (products.length) {
            this.button.disabled === true; 
        } else {
            this.button.disabled === false; 
        };
    };
};
