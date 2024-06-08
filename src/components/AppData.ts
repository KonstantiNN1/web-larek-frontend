import { IProduct, IOrder, IOrderRequest, IOrderResult, FormErrors, IAppState } from '../types/types';
import { EventEmitter } from './base/Events';
import { WebLarekApi } from './WebLarekApi';

export class AppData implements IAppState {
    basket: IProduct[] = [];
    store: IProduct[] = [];
    order: IOrder = {
        id: Date.now(),
        products: [],
        totalAmount: 0,
        customerName: '',
        customerAddress: ''
    };
    formErrors: FormErrors = {};
    private api: WebLarekApi;
    private eventEmitter: EventEmitter;

    constructor(api: WebLarekApi, eventEmitter: EventEmitter) {
        this.api = api;
        this.eventEmitter = eventEmitter;
    }

    addToBasket(value: IProduct): void {
        if (!this.basket.find(product => product.id === value.id)) {
            this.basket.push(value);
            value.selected = true;
            this.eventEmitter.emit('cart:updated', { cart: this.basket });
        }
    }

    deleteFromBasket(id: number): void {
        this.basket = this.basket.filter(product => product.id !== id);
        this.eventEmitter.emit('cart:updated', { cart: this.basket });
    }

    clearBasket(): void {
        this.basket = [];
        this.eventEmitter.emit('cart:updated', { cart: this.basket });
    }

    getBasketAmount(): number {
        return this.basket.length;
    }

    getTotalBasketPrice(): number {
        return this.basket.reduce((total, product) => total + (product.price || 0), 0);
    }

    setItems(): void {
        this.order.products = this.basket;
    }

    setOrderField(field: keyof IOrder, value: string): void {
        (this.order as any)[field] = value;
    }

    validateContacts(): boolean {
        const { customerName, customerAddress } = this.order;
        const nameValid = customerName.length > 0;
        const addressValid = customerAddress.length > 0;
        this.formErrors.customerName = nameValid ? '' : 'Invalid name';
        this.formErrors.customerAddress = addressValid ? '' : 'Invalid address';
        return nameValid && addressValid;
    }

    validateOrder(): boolean {
        const { customerAddress, totalAmount } = this.order;
        const addressValid = customerAddress.length > 0;
        const paymentValid = totalAmount > 0;
        this.formErrors.customerAddress = addressValid ? '' : 'Address required';
        this.formErrors.payment = paymentValid ? '' : 'Payment method required';
        return addressValid && paymentValid;
    }

    refreshOrder(): boolean {
        this.order = {
            id: Date.now(),
            products: [],
            totalAmount: 0,
            customerName: '',
            customerAddress: ''
        };
        return true;
    }

    setStore(items: IProduct[]): void {
        this.store = items.map(item => ({ ...item, selected: false }));
        this.eventEmitter.emit('products:updated', { products: this.store });
    }

    resetSelected(): void {
        this.store = this.store.map(item => ({ ...item, selected: false }));
    }

    placeOrder(orderRequest: IOrderRequest): Promise<IOrderResult> {
        return fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderRequest)
        }).then(response => response.json());
    }

    fetchProducts(): void {
        this.api.getAllProducts().then(products => {
            this.setStore(products);
        });
    }
}
