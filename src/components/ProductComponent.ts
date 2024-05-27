import { Component } from './base/Component';
import { IProduct } from '../types/types';
import { EventEmitter } from './base/events';

export class ProductComponent extends Component<IProduct> {
    private eventEmitter: EventEmitter;

    constructor(container: HTMLElement) {
        super(container);
        this.eventEmitter = new EventEmitter();
    }

    render(product: IProduct) {
        super.render(product);

        const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!cardTemplate) {
            throw new Error('Template with id "card-catalog" not found.');
        }

        const cardElement = document.importNode(cardTemplate.content, true);

        this.setElementText(cardElement, '.card__category', product.category);
        this.setElementText(cardElement, '.card__title', product.title);
        this.setElementText(cardElement, '.card__price', product.price === null ? 'Бесценно' : `${product.price} синапсов`);

        const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.title;
        }

        cardElement.querySelector('.card')?.addEventListener('click', () => {
            this.eventEmitter.emit('product:clicked', product);
        });

        const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
        if (categoryElement && product.category) {
            categoryElement.textContent = product.category;
            this.applyCategoryStyle(categoryElement, product.category);
        }

        this.container.appendChild(cardElement);
    }

    private setElementText(cardElement: DocumentFragment, selector: string, text: string | undefined) {
        const element = cardElement.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener);
    }

    getElement(): HTMLElement {
        return this.container;
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
}