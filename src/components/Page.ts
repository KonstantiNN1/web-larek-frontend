import { IPage } from "../types";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

export class Page extends Component<IPage>{
    protected gallery: HTMLElement;
    protected counter: HTMLElement;
    protected cart: HTMLElement;
    protected layout: HTMLElement;

    constructor(container: HTMLElement, protected event: IEvents) {
        super(container);
        this.cart = container.querySelector(`.header__basket`);
        this.counter = container.querySelector(`.header__basket-counter`);
        this.gallery = container.querySelector(`.gallery`);
        this.layout = container.querySelector(`.page__wrapper`);

        if (this.cart) {
            this.cart.addEventListener('click', () => this.event.emit('cart:open'));
          };
    };

    setСounter(value: number) {
        this.setTextContent(this.counter, String(value));
    };

    setGallery(products: HTMLElement[]) {
        this.gallery.replaceChildren(...products);
    };

    //блокировка прокрутки, если надо
};