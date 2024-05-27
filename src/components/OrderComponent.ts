import { Component } from './base/Component';
import { IOrder } from '../types/types';
import { EventEmitter } from './base/events';

export class OrderComponent extends Component<IOrder> {
    private order: IOrder;
    private eventEmitter: EventEmitter;
    private contactsContainer: HTMLElement;
    private selectedPaymentMethod: 'online' | 'cash' | null = null;

    constructor(container: HTMLElement, eventEmitter: EventEmitter, contactsContainer: HTMLElement) {
        super(container);
        this.eventEmitter = eventEmitter;
        this.contactsContainer = contactsContainer;
        this.order = {
            id: 0,
            products: [],
            totalAmount: 0,
            customerName: '',
            customerAddress: ''
        };
    }

    setOrder(order: IOrder) {
        this.order = order;
        this.render();
    }

    handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const { name, value } = target;

        if (name === 'customerName') {
            this.order.customerName = value;
        } else if (name === 'customerAddress') {
            this.order.customerAddress = value;
        }
    }

    selectPaymentMethod(method: 'online' | 'cash') {
        this.selectedPaymentMethod = method;

        const onlineButton = this.container.querySelector('.button_online') as HTMLButtonElement;
        const cashButton = this.container.querySelector('.button_cash') as HTMLButtonElement;

        if (method === 'online') {
            onlineButton.classList.add('button_alt-active');
            cashButton.classList.remove('button_alt-active');
        } else {
            onlineButton.classList.remove('button_alt-active');
            cashButton.classList.add('button_alt-active');
        }

        this.checkFormValidity();
    }

    checkFormValidity() {
        const confirmButton = this.container.querySelector('.button_confirm') as HTMLButtonElement;
        const addressInput = this.container.querySelector('input[name="customerAddress"]') as HTMLInputElement;

        confirmButton.disabled = !(addressInput.value.trim() && this.selectedPaymentMethod);
    }

    confirmOrder() {
        this.eventEmitter.emit('order:contactForm', this.order);
        this.toggle(false);
    }

    render() {
        super.render(this.order);

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
        onlineButton.addEventListener('click', () => this.selectPaymentMethod('online'));
        paymentButtons.appendChild(onlineButton);

        const cashButton = document.createElement('button');
        cashButton.type = 'button';
        cashButton.className = 'button button_alt button_cash';
        cashButton.textContent = 'При получении';
        cashButton.addEventListener('click', () => this.selectPaymentMethod('cash'));
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
        addressInput.name = 'customerAddress';
        addressInput.placeholder = 'Введите адрес';
        addressInput.value = this.order.customerAddress;
        addressInput.addEventListener('input', this.handleInputChange.bind(this));
        addressInput.addEventListener('input', this.checkFormValidity.bind(this));
        addressLabel.appendChild(addressInput);

        modalContent.appendChild(addressLabel);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'button button_confirm';
        confirmButton.textContent = 'Далее';
        confirmButton.addEventListener('click', this.confirmOrder.bind(this));
        confirmButton.disabled = true;

        modalContent.appendChild(confirmButton);

        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(modalContent);
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
}