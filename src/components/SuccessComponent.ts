import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class SuccessComponent extends Component<null> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render(totalAmount: number): HTMLElement {
        super.render();

        const successTemplate = document.getElementById('success') as HTMLTemplateElement;
        if (!successTemplate) {
            throw new Error('Template with id "success" not found.');
        }

        const successElement = document.importNode(successTemplate.content, true);

        const amountElement = successElement.querySelector('.order-success__description');
        if (amountElement) {
            amountElement.textContent = `Списано ${totalAmount} синапсов`;
        }

        const closeButton = successElement.querySelector('.order-success__close') as HTMLElement;
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.eventEmitter.emit('cart:clear');
                this.toggle(false);
            });
        }

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.style.width = '1320px';
        modalContainer.style.height = '645px';

        const modalCloseButton = document.createElement('button');
        modalCloseButton.className = 'modal__close';
        modalCloseButton.setAttribute('aria-label', 'закрыть');
        modalCloseButton.style.position = 'absolute';
        modalCloseButton.style.top = '10px';
        modalCloseButton.style.right = '10px';
        modalCloseButton.addEventListener('click', () => {
            this.eventEmitter.emit('cart:clear');
            this.toggle(false);
        });

        modalContainer.appendChild(modalCloseButton);
        modalContainer.appendChild(successElement);

        this.container.innerHTML = '';
        this.container.appendChild(modalContainer);
        this.toggle(true);

        return this.container;
    }

    toggle(show: boolean) {
        this.toggleClass(this.container, 'modal_active', show);
        if (!show) {
            this.eventEmitter.emit('cart:clear');
            document.removeEventListener('click', this.handleOverlayClick);
            document.removeEventListener('keydown', this.handleEscapePress);
        }
    }

    private handleOverlayClick = (event: MouseEvent) => {
        if (event.target === this.container) {
            this.toggle(false);
        }
    };

    private handleEscapePress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            this.toggle(false);
        }
    };
}