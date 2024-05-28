import { Component } from './base/Component';
import { IProduct } from '../types/types';
import { ProductComponent } from './ProductComponent';
import { EventEmitter } from './base/events';
import { IPage } from '../types/types';

export class Page extends Component<IPage> {
    private products: IProduct[];
    private eventEmitter: EventEmitter;

    constructor(containerId: string, eventEmitter: EventEmitter) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Элемент с id ${containerId} не найден.`);
        }
        super(container);
        this.products = [];
        this.eventEmitter = eventEmitter;
    }

    setProducts(products: IProduct[]) {
        this.products = products;
        this.render();
    }

    render() {
        super.render(null);

        const fragment = document.createDocumentFragment();

        this.products.forEach(product => {
            const productComponent = new ProductComponent(document.createElement('div'));
            productComponent.render(product);
            productComponent.on('product:clicked', (product: IProduct) => {
                this.eventEmitter.emit('product:clicked', product);
            });
            fragment.appendChild(productComponent.getElement());
        });

        this.container.appendChild(fragment);
    }

    on(eventName: string, listener: (...args: any[]) => void) {
        this.eventEmitter.on(eventName, listener);
    }
}
