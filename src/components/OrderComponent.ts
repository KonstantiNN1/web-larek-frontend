// import { Component } from './base/Component';
// import { IOrder, IOrderRequest } from '../types/types';
// import { EventEmitter } from './base/events';
// import { Form } from './Form';

// export class OrderComponent extends Component<IOrder> {
//     private form: Form;
//     private eventEmitter: EventEmitter;
//     private selectedPaymentMethod: 'online' | 'cash' | null = null;

//     constructor(container: HTMLElement, eventEmitter: EventEmitter, form: Form) {
//         super(container);
//         this.eventEmitter = eventEmitter;
//         this.form = form;
//     }

//     handleInputChange(event: Event) {
//         const target = event.target as HTMLInputElement;
//         const { name, value } = target;

//         if (name === 'address') {
//             this.form.setField(name as keyof IOrderRequest, value);
//         }
//     }

//     selectPaymentMethod(method: 'online' | 'cash') {
//         this.selectedPaymentMethod = method;
//         this.form.setField('payment', method);

//         const onlineButton = this.container.querySelector('.button[name="card"]') as HTMLButtonElement;
//         const cashButton = this.container.querySelector('.button[name="cash"]') as HTMLButtonElement;

//         if (method === 'online') {
//             onlineButton.classList.add('button_alt-active');
//             cashButton.classList.remove('button_alt-active');
//         } else {
//             onlineButton.classList.remove('button_alt-active');
//             cashButton.classList.add('button_alt-active');
//         }

//         this.checkFormValidity();
//     }

//     checkFormValidity() {
//         const confirmButton = this.container.querySelector('.order__button') as HTMLButtonElement;
//         const addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
//         const paymentMethod = this.form.getField('payment') as string;

//         confirmButton.disabled = !(addressInput.value.trim() && paymentMethod);
//     }

//     confirmOrder() {
//         this.eventEmitter.emit('order:confirmed', {
//             paymentMethod: this.form.getField('payment') as string,
//             address: this.form.getField('address') as string
//         });
//         this.toggle(false);
//     }

//     render(): HTMLElement {
//         super.render();

//         const template = document.getElementById('order') as HTMLTemplateElement;
//         if (!template) {
//             throw new Error('Template with id "order" not found.');
//         }

//         const orderElement = document.importNode(template.content, true);

//         const form = orderElement.querySelector('form') as HTMLFormElement;
//         form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             this.confirmOrder();
//         });

//         const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
//         addressInput.value = this.form.getField('address') as string || '';
//         addressInput.addEventListener('input', this.handleInputChange.bind(this));
//         addressInput.addEventListener('input', this.checkFormValidity.bind(this));

//         const onlineButton = form.querySelector('.button[name="card"]') as HTMLButtonElement;
//         const cashButton = form.querySelector('.button[name="cash"]') as HTMLButtonElement;
//         onlineButton.addEventListener('click', () => this.selectPaymentMethod('online'));
//         cashButton.addEventListener('click', () => this.selectPaymentMethod('cash'));

//         const confirmButton = form.querySelector('.order__button') as HTMLButtonElement;
//         confirmButton.addEventListener('click', this.confirmOrder.bind(this));
//         confirmButton.disabled = true;

//         const closeButton = document.createElement('button');
//         closeButton.className = 'modal__close';
//         closeButton.setAttribute('aria-label', 'закрыть');
//         closeButton.addEventListener('click', () => this.toggle(false));

//         const modalContainer = document.createElement('div');
//         modalContainer.className = 'modal__container';
//         modalContainer.appendChild(closeButton);
//         modalContainer.appendChild(orderElement);

//         this.container.innerHTML = '';
//         this.container.appendChild(modalContainer);
//         this.toggle(true);

//         return this.container;
//     }

//     toggle(show: boolean) {
//         if (show) {
//             this.container.classList.add('modal_active');
//         } else {
//             this.container.classList.remove('modal_active');
//         }
//     }
// }
import { Component } from './base/Component';
import { IOrder, IOrderRequest } from '../types/types';
import { EventEmitter } from './base/events';
import { Form } from './Form';

export class OrderComponent extends Component<IOrder> {
    private form: Form;
    private eventEmitter: EventEmitter;
    private selectedPaymentMethod: 'online' | 'cash' | null = null;

    constructor(container: HTMLElement, eventEmitter: EventEmitter, form: Form) {
        super(container);
        this.eventEmitter = eventEmitter;
        this.form = form;
    }

    handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const { name, value } = target;

        if (name === 'address') {
            this.form.setField(name as keyof IOrderRequest, value);
        }
    }

    validateAddress(address: string): boolean {
        const hasThreeLetters = /[a-zA-Zа-яА-Я]{3,}/.test(address);
        const hasOneDigit = /\d/.test(address);
        return hasThreeLetters && hasOneDigit;
    }

    selectPaymentMethod(method: 'online' | 'cash') {
        this.selectedPaymentMethod = method;
        this.form.setField('payment', method);

        const onlineButton = this.container.querySelector('.button[name="card"]') as HTMLButtonElement;
        const cashButton = this.container.querySelector('.button[name="cash"]') as HTMLButtonElement;

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
        const confirmButton = this.container.querySelector('.order__button') as HTMLButtonElement;
        const addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;
        const paymentMethod = this.form.getField('payment') as string;

        const isAddressValid = this.validateAddress(addressInput.value);
        const errorElement = this.container.querySelector('.form__errors') as HTMLElement;

        if (!isAddressValid) {
            addressInput.style.border = '1px solid red';
            if (errorElement) {
                errorElement.textContent = 'Введите адрес, куда доставить товары';
                errorElement.style.color = 'red';
            }
        } else {
            addressInput.style.border = '';
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        confirmButton.disabled = !(isAddressValid && paymentMethod);
    }

    confirmOrder() {
        this.eventEmitter.emit('order:confirmed', {
            paymentMethod: this.form.getField('payment') as string,
            address: this.form.getField('address') as string
        });
        this.toggle(false);
    }

    render(): HTMLElement {
        super.render();

        const template = document.getElementById('order') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template with id "order" not found.');
        }

        const orderElement = document.importNode(template.content, true);

        const form = orderElement.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.confirmOrder();
        });

        const addressInput = form.querySelector('input[name="address"]') as HTMLInputElement;
        addressInput.value = this.form.getField('address') as string || '';
        addressInput.addEventListener('blur', this.handleInputChange.bind(this));
        addressInput.addEventListener('input', this.checkFormValidity.bind(this));

        const onlineButton = form.querySelector('.button[name="card"]') as HTMLButtonElement;
        const cashButton = form.querySelector('.button[name="cash"]') as HTMLButtonElement;
        onlineButton.addEventListener('click', () => this.selectPaymentMethod('online'));
        cashButton.addEventListener('click', () => this.selectPaymentMethod('cash'));

        const confirmButton = form.querySelector('.order__button') as HTMLButtonElement;
        confirmButton.addEventListener('click', this.confirmOrder.bind(this));
        confirmButton.disabled = true;

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => {
            this.toggle(false);
        });

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(orderElement);

        this.container.innerHTML = '';
        this.container.appendChild(modalContainer);
        this.toggle(true);

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
