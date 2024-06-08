import { Component } from './base/Component';
import { IProduct } from '../types/types';
import { EventEmitter } from './base/Events';
import { categoryClasses } from '../utils/utils';
import { ProductPopupComponent } from './ProductPopupComponent';

export class ProductComponent extends Component<IProduct> {
    private eventEmitter: EventEmitter;
    products: IProduct[];

    constructor(container: HTMLElement, products: IProduct[]) {
        super(container);
        this.eventEmitter = new EventEmitter();
        this.products = products;
    }

    getProduct(productId: number): IProduct | undefined {
        return this.products.find((product) => product.id === productId);
    }

    renderProducts(products: IProduct[]): void {
        products.forEach((product) => {
            this.render(product);
        });
    }
    
    render(product: IProduct): HTMLElement {
        super.render(product);

        const cardTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
        if (!cardTemplate) {
            throw new Error('Template with id "card-catalog" not found.');
        }

        const cardElement = document.importNode(cardTemplate.content, true);

        this.setText(cardElement.querySelector('.card__category') as HTMLElement, product.category);
        this.setText(cardElement.querySelector('.card__title') as HTMLElement, product.title);
        this.setText(cardElement.querySelector('.card__price') as HTMLElement, product.price === null ? 'Бесценно' : `${product.price} синапсов`);

        const imageElement = cardElement.querySelector('.card__image') as HTMLImageElement;
        this.setImage(imageElement, product.image, product.title);

        const cardContainer = cardElement.querySelector('.card') as HTMLElement;
        if (cardContainer) {
            cardContainer.dataset.id = product.id.toString();
            cardContainer.addEventListener('click', () => {
                this.eventEmitter.emit('product:clicked', product);
            });
        }

        const categoryElement = cardElement.querySelector('.card__category') as HTMLElement;
        if (product.category) {
            this.applyCategoryClass(categoryElement, product.category);
        }

        this.container.appendChild(cardElement);
        return this.container;
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener);
    }

    applyCategoryClass(element: HTMLElement, category: string) {
        const categoryClass = categoryClasses[category];
        if (categoryClass) {
            element.classList.add(categoryClass);
        }
    }
}