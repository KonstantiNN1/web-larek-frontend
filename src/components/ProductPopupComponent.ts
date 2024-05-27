import { IProduct } from '../types/types';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export class ProductPopupComponent extends Component<IProduct> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
    }

    render(product: IProduct) {
        super.render(product);

        const cardTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
        if (!cardTemplate) {
            throw new Error('Шаблон с id "card-preview" не найден.');
        }

        const cardElement = document.importNode(cardTemplate.content, true);

        const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
        if (categoryElement && product.category) {
            categoryElement.textContent = product.category;
            this.applyCategoryStyle(categoryElement, product.category);
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

        const buttonElement = cardElement.querySelector('.button.card__button') as HTMLElement;
        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                this.eventEmitter.emit('cart:add', product);
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

        this.container.appendChild(modalContainer);
        this.toggle(true);
    }

    applyCategoryStyle(element: HTMLElement, category: string) {
        let color = '';
        switch (category) {
            case 'софт-скил':
                color = '#83FA9D';
                break;
            case 'другое':
                color = '#FAD883';
                break;
            case 'дополнительное':
                color = '#B783FA';
                break;
            case 'хард-скил':
                color = '#FAA083';
                break;
            case 'кнопка':
                color = '#83DDFA';
                break;
            default:
                color = '#FFFFFF';
        }
        element.style.backgroundColor = color;
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }
}