import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class OrderComponent extends Component<{}> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render(): HTMLElement {
        this.container.innerHTML = ''; // Очищаем содержимое контейнера перед рендерингом нового модального окна
        super.render({});

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.style.width = '1320px';
        modalContainer.style.height = '645px';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => this.toggle(false));

        const modalContent = document.createElement('div');
        modalContent.className = 'modal__content';

        const titleElement = document.createElement('h2');
        titleElement.className = 'modal__title';
        titleElement.textContent = 'Способ оплаты';
        modalContent.appendChild(titleElement);

        const paymentButtons = document.createElement('div');
        paymentButtons.className = 'order__buttons';

        const onlineButton = document.createElement('button');
        onlineButton.type = 'button';
        onlineButton.className = 'button button_alt button_online';
        onlineButton.textContent = 'Онлайн';
        paymentButtons.appendChild(onlineButton);

        const cashButton = document.createElement('button');
        cashButton.type = 'button';
        cashButton.className = 'button button_alt button_cash';
        cashButton.textContent = 'При получении';
        paymentButtons.appendChild(cashButton);

        modalContent.appendChild(paymentButtons);

        const addressLabel = document.createElement('label');
        addressLabel.className = 'order__field';

        const addressTitle = document.createElement('span');
        addressTitle.className = 'form__label modal__title';
        addressTitle.textContent = 'Адрес доставки';
        addressLabel.appendChild(addressTitle);

        const addressInput = document.createElement('input');
        addressInput.className = 'form__input';
        addressInput.type = 'text';
        addressInput.name = 'address';
        addressInput.placeholder = 'Введите адрес';
        addressLabel.appendChild(addressInput);

        modalContent.appendChild(addressLabel);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'button button_confirm';
        confirmButton.textContent = 'Далее';
        modalContent.appendChild(confirmButton);

        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(modalContent);
        this.container.appendChild(modalContainer);
        this.toggle(true);

        confirmButton.addEventListener('click', () => {
            const paymentMethod = onlineButton.classList.contains('button_alt-active') ? 'online' : 'cash';
            const address = addressInput.value;

            this.eventEmitter.emit('order:confirmed', { paymentMethod, address });
            this.toggle(false);
        });

        onlineButton.addEventListener('click', () => {
            onlineButton.classList.add('button_alt-active');
            cashButton.classList.remove('button_alt-active');
        });

        cashButton.addEventListener('click', () => {
            onlineButton.classList.remove('button_alt-active');
            cashButton.classList.add('button_alt-active');
        });

        return this.container;
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }
}