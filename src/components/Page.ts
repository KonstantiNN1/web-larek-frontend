import { Component } from './base/Component';
import { IProduct } from '../types/types';
import { ProductComponent } from './ProductComponent';
import { EventEmitter } from './base/Events';
import { IPage } from '../types/types';

export class Page extends Component<IPage> {
    private products: IProduct[];
    private eventEmitter: EventEmitter;

    constructor(containerId: string, eventEmitter: EventEmitter) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Элемент с id ${containerId} не найден`);
        }
        super(container);
        this.products = [];
        this.eventEmitter = eventEmitter;
    }

    setProducts(products: IProduct[]) {
        this.products = products;
        this.render();
    }

    render(): HTMLElement {
        super.render();

        const fragment = document.createDocumentFragment();

        const productComponent = new ProductComponent(this.container, this.products);
        productComponent.renderProducts(this.products);

        productComponent.on('product:clicked', (product: IProduct) => {
            this.eventEmitter.emit('product:clicked', product);
        });

        return this.container;
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener);
    }

    getProductsContainer(): HTMLElement {
        return document.getElementById('gallery');
    }
}