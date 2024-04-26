import { Component } from "./base/Component";
import { IModal } from "../types";
import { IEvents } from "./base/events";

export class Modal extends Component<IModal> {
    private closeButton: HTMLButtonElement;
	private content: HTMLElement;

    constructor(container: HTMLElement, className: string, protected event: IEvents) {
        super(container);
        this.closeButton = container.querySelector(`.${className}__close`);
        this.content = container.querySelector(`.${className}__content`);
        // добавить event
    };

    setContent(value: HTMLElement): void {
        this.content.replaceChildren(value);
    };

    openModal(): void {
        this.toggleClass(this.container, 'modal_active');
        this.event.emit('modal:open');
    };

    closeModal(): void {
        this.toggleClass(this.container, 'modal_active');
		this.content = null;
		this.event.emit('modal:close');
    };

    // добавить рендер

};