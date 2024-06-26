import { IProduct } from '../types/types';
import { Component } from './base/Component';
import { EventEmitter } from './base/Events';
import { categoryClasses } from '../utils/utils';

export class ProductPopupComponent extends Component<IProduct> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render(product: IProduct): HTMLElement {
        super.render();

        const cardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        if (!cardTemplate) {
            throw new Error('Шаблон с id "card-preview" не найден.');
        }

        const cardElement = document.importNode(cardTemplate.content, true);

        const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
        if (categoryElement && product.category) {
            categoryElement.textContent = product.category;
            this.applyCategoryClass(categoryElement, product.category);
        }

        const titleElement = cardElement.querySelector('.card__title') as HTMLElement;
        if (titleElement) {
            titleElement.textContent = product.title;
        }

        const descriptionElement = cardElement.querySelector('.card__text') as HTMLElement;
        if (descriptionElement) {
            descriptionElement.textContent = product.description;
        }

        const priceElement = cardElement.querySelector('.card__price') as HTMLElement;
        if (priceElement) {
            priceElement.textContent = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
        }

        const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.title;
        }

        const buttonElement = cardElement.querySelector('.button.card__button') as HTMLButtonElement;
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                this.eventEmitter.emit('cart:add', product);
                buttonElement.disabled = true;
                this.toggle(false);
            });
        }

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', () => {
            this.toggle(false);
        });

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(cardElement);

        this.container.innerHTML = '';
        this.container.appendChild(modalContainer);

        return this.container;
    }

    applyCategoryClass(element: HTMLElement, category: string) {
        const categoryClass = categoryClasses[category];
        if (categoryClass) {
            element.classList.add(categoryClass);
        }
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }
}