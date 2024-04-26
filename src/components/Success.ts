import { Component } from "./base/Component";
import { Actions } from "../types";
import { ISuccess } from "../types";

export class Success extends Component<ISuccess> {
    protected closeButton: HTMLButtonElement;
    protected description: HTMLElement;

    constructor(container: HTMLElement, className: string, action?:Actions) {
        super(container);
        this.closeButton = container.querySelector(`.order-success__close`);
        this.description = container.querySelector(`.${className}__description`);

        if (action.onClick) {
            if(this.closeButton) {
                this.closeButton.addEventListener('click', action.onClick);
            };
        };
    };

    setDescription(totalPrice: number): void {
        this.description.textContent = `Списано ${totalPrice} синапсов`;
    };
};