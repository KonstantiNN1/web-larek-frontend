import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class SuccessComponent extends Component<null> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render(totalAmount: number) {
        super.render(null); // Очистка контейнера

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
        modalContainer.style.position = 'relative'; // Установить относительное позиционирование для контейнера

        const modalCloseButton = document.createElement('button');
        modalCloseButton.className = 'modal__close';
        modalCloseButton.setAttribute('aria-label', 'закрыть');
        modalCloseButton.style.position = 'absolute'; // Абсолютное позиционирование кнопки
        modalCloseButton.style.top = '10px'; // Позиция сверху
        modalCloseButton.style.right = '10px'; // Позиция справа
        modalCloseButton.addEventListener('click', () => {
            this.eventEmitter.emit('cart:clear');
            this.toggle(false);
        });

        modalContainer.appendChild(modalCloseButton);
        modalContainer.appendChild(successElement);

        this.container.appendChild(modalContainer);
        this.toggle(true);
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }

    close() {
        this.toggleVisibility();
    }
}
