import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class ContactFormComponent extends Component<{}> {
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

        const emailLabel = document.createElement('label');
        emailLabel.className = 'form__label';
        emailLabel.textContent = 'Email';
        const emailInput = document.createElement('input');
        emailInput.className = 'form__input';
        emailInput.type = 'email';
        emailInput.name = 'email';
        emailInput.placeholder = 'Введите Email';
        emailLabel.appendChild(emailInput);

        const phoneLabel = document.createElement('label');
        phoneLabel.className = 'form__label';
        phoneLabel.textContent = 'Телефон';
        const phoneInput = document.createElement('input');
        phoneInput.className = 'form__input';
        phoneInput.type = 'tel';
        phoneInput.name = 'phone';
        phoneInput.placeholder = '+7 (999) 999-99-99';
        phoneLabel.appendChild(phoneInput);

        modalContent.appendChild(emailLabel);
        modalContent.appendChild(phoneLabel);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'button button_confirm';
        confirmButton.textContent = 'Оплатить';
        modalContent.appendChild(confirmButton);

        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(modalContent);
        this.container.appendChild(modalContainer);
        this.toggle(true);

        confirmButton.addEventListener('click', () => {
            const email = emailInput.value;
            const phone = phoneInput.value;

            console.log('Contact form submitted with email:', email, 'and phone:', phone);
            this.eventEmitter.emit('contactForm:submitted', { email, phone });
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
