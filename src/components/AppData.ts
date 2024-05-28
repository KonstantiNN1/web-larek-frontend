import { Model } from './base/Model';
import { IProduct, IOrder, IWebLarekApi, IOrderResult } from '../types/types';
import { AppDataStructure, AppDataEvents } from '../types/types';

export class AppData extends Model<AppDataStructure> {
    private api: IWebLarekApi;

    constructor(api: IWebLarekApi) {
        super({
            products: [],
            cart: [],
            order: null
        });
        this.api = api;
    }

    fetchProducts() {
        this.api.getAllProducts().then(products => {
            this.data.products = products;
            this.emitEvents('products:updated', this.data);
        });
    }

    addToCart(product: IProduct) {
        this.data.cart.push(product);
        this.emitEvents('cart:updated', this.data);
    }

    removeFromCart(productId: number) {
        this.data.cart = this.data.cart.filter(product => product.id !== productId);
        this.emitEvents('cart:updated', this.data);
    }

    clearCart() {
        this.data.cart = [];
        this.emitEvents('cart:updated', this.data);
    }

    setOrder(order: IOrder) {
        this.data.order = order;
        this.emitEvents('order:updated', this.data);
    }

    placeOrder() {
        if (this.data.order) {
            return this.api.postOrder(this.data.order).then((result: IOrderResult) => {
                this.clearCart();
                this.emitEvents('order:placed', { result, ...this.data });
                return result;
            });
        }
        return Promise.reject('No order to place');
    }

    protected emitEvents<K extends keyof AppDataEvents>(eventName: K, eventData: AppDataEvents[K]) {
        this.events.emit(eventName, eventData);
    }

    on<K extends keyof AppDataEvents>(event: K, callback: (data: AppDataEvents[K]) => void) {
        this.events.on(event, callback as (data: unknown) => void);
    }

    // getProducts(): IProduct[] {
    //     return this.data.products;
    // }

    getCart(): IProduct[] {
        return this.data.cart;
    }

    getOrder(): IOrder | null {
        return this.data.order;
    }
}