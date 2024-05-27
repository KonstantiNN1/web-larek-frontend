import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { IContactFormComponent } from '../types/types';

export class ContactFormComponent extends Component<IContactFormComponent> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render() {
        super.render(null);

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.style.width = '1320px'; 
        modalContainer.style.height = '645px';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal__content';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => this.toggle(false));

        const emailLabel = document.createElement('label');
        emailLabel.className = 'form__label modal__title';
        emailLabel.textContent = 'Email';

        const emailInput = document.createElement('input');
        emailInput.className = 'form__input';
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.placeholder = 'Введите Email';

        const phoneLabel = document.createElement('label');
        phoneLabel.className = 'form__label modal__title';
        phoneLabel.textContent = 'Телефон';

        const phoneInput = document.createElement('input');
        phoneInput.className = 'form__input';
        phoneInput.type = 'tel';
        phoneInput.name = 'phone';
        phoneInput.placeholder = '+7 (9__) ___-__-__';

        const confirmButton = document.createElement('button');
        confirmButton.className = 'button';
        confirmButton.textContent = 'Оплатить';
        confirmButton.disabled = true;

        // Проверка на заполненность полей для активации кнопки
        const validateForm = () => {
            const emailValid = emailInput.validity.valid;
            const phoneValid = /^[+()\d\s-]+$/.test(phoneInput.value) && phoneInput.value.length > 0;
            confirmButton.disabled = !(emailValid && phoneValid);
        };

        emailInput.addEventListener('input', validateForm);
        phoneInput.addEventListener('input', validateForm);

        confirmButton.addEventListener('click', () => {
            this.eventEmitter.emit('contact:submit', {
                email: emailInput.value,
                phone: phoneInput.value,
            });
            this.toggle(false);
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(emailLabel);
        modalContent.appendChild(emailInput);
        modalContent.appendChild(phoneLabel);
        modalContent.appendChild(phoneInput);
        modalContent.appendChild(confirmButton);

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

    on(event: string, callback: (data: any) => void) {
        this.eventEmitter.on(event, callback);
    }
}
