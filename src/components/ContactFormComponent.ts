// import { Component } from './base/Component';
// import { EventEmitter } from './base/events';

// export class ContactFormComponent extends Component<null> {
//     private eventEmitter: EventEmitter;

//     constructor(container: HTMLElement, eventEmitter: EventEmitter) {
//         super(container);
//         this.eventEmitter = eventEmitter;
//     }

//     handleInputChange(event: Event) {
//         const target = event.target as HTMLInputElement;
//         const form = target.closest('form') as HTMLFormElement;
//         const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
//         const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
//         const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

//         const isFormValid = emailInput.value.trim() !== '' && phoneInput.value.trim() !== '';
//         submitButton.disabled = !isFormValid;

//     }

//     handleSubmit(event: Event) {
//         event.preventDefault();
//         const form = event.target as HTMLFormElement;
//         const email = (form.querySelector('input[name="email"]') as HTMLInputElement).value;
//         const phone = (form.querySelector('input[name="phone"]') as HTMLInputElement).value;

//         this.eventEmitter.emit('contactForm:submitted', { email, phone });
//     }

//     render(): HTMLElement {
//         super.render();

//         const template = document.getElementById('contacts') as HTMLTemplateElement;
//         if (!template) {
//             throw new Error('Template with id "contacts" not found.');
//         }

//         const contactFormElement = document.importNode(template.content, true);

//         const form = contactFormElement.querySelector('form') as HTMLFormElement;
//         form.addEventListener('submit', this.handleSubmit.bind(this));

//         const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
//         const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
//         emailInput.addEventListener('input', this.handleInputChange.bind(this));
//         phoneInput.addEventListener('input', this.handleInputChange.bind(this));

//         const closeButton = document.createElement('button');
//         closeButton.className = 'modal__close';
//         closeButton.setAttribute('aria-label', 'закрыть');
//         closeButton.addEventListener('click', () => this.toggle(false));

//         const modalContainer = document.createElement('div');
//         modalContainer.className = 'modal__container';
//         modalContainer.appendChild(closeButton);
//         modalContainer.appendChild(contactFormElement);

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
import { EventEmitter } from './base/Events';
import { Form } from './Form';

export class ContactFormComponent extends Component<null> {
    private eventEmitter: EventEmitter;
    private form: Form;

    constructor(container: HTMLElement, eventEmitter: EventEmitter, form: Form) {
        super(container);
        this.eventEmitter = eventEmitter;
        this.form = form;
    }

    handleInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const { name, value } = target;
        // this.form.setField(name as keyof IOrderRequest, value as any);
        this.checkFormValidity();
    }

    handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const email = (form.querySelector('input[name="email"]') as HTMLInputElement).value;
        const phone = (form.querySelector('input[name="phone"]') as HTMLInputElement).value;

        this.eventEmitter.emit('contactForm:submitted', { email, phone });
    }

    checkFormValidity() {
        const form = this.container.querySelector('form') as HTMLFormElement;
        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        const errorElement = phoneInput.nextElementSibling as HTMLElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

        let isFormValid = true;

        // Email validation
        if (!emailInput.checkValidity()) {
            emailInput.style.border = '1px solid red';
            isFormValid = false;
        } else {
            emailInput.style.border = '';
        }

        // Phone validation
        if (!phoneInput.checkValidity()) {
            phoneInput.style.border = '1px solid red';
            if (errorElement) {
                errorElement.textContent = 'Введите номер телефона по образцу: +7 (999) 999-99-99';
                errorElement.style.color = 'red';
            }
            isFormValid = false;
        } else {
            phoneInput.style.border = '';
            if (errorElement) {
                errorElement.textContent = '';
            }
        }

        submitButton.disabled = !isFormValid;
    }

    render(): HTMLElement {
        super.render();

        const template = document.getElementById('contacts') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template with id "contacts" not found.');
        }

        const contactFormElement = document.importNode(template.content, true);

        const form = contactFormElement.querySelector('form') as HTMLFormElement;
        form.addEventListener('submit', this.handleSubmit.bind(this));

        const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement;
        emailInput.addEventListener('input', this.handleInputChange.bind(this));
        phoneInput.addEventListener('input', this.handleInputChange.bind(this));

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => this.toggle(false));

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(contactFormElement);

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
