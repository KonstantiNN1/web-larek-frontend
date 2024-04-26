import { Model } from "./base/Model";
import { IAppData } from "../types";
import { IOrder, IDelivery, IProduct, FormErrors, IFormState } from "../types";
import { Product } from "./Product";
import { IEvents } from "./base/events";
import { Actions } from "../types";


export class AppData extends Model<IAppData> {
    protected cart: Product[] = [];
    gallery: IProduct[];
    products: Product[];
    protected order: IOrder = 
    {
        items: [],
        total: null,
        payment: undefined,
        address: '',
        phone: '',
        email: ''
    };
    errors: FormErrors;
    action: Actions;

    constructor(data: Partial<IAppData>, event: IEvents) {
		super(data, event);
	}

    addToCart(product: Product): void {
        this.cart.push(product);
    };

    // попробовать с id
    deleteFromCart(product: Product): void {
        this.cart.filter(item => item !== product);
    };

    clearCart(): void {
        this.cart.length = 0;
    };

    clearOrder(): void {
        this.order = {
            items: [],
            total: null,
            payment: undefined,
            address: '',
            phone: '',
            email: ''
        };
    };

    getTotalPrice(): number {
        return this.cart.reduce((sum, next) => sum + Number(next.price), 0);
    };

    getTotalNumber(): number {
        return this.cart.length;
    };

    validateDelivery(): boolean {
        const error: typeof this.errors = {};
        if (!this.order.address) {
            'Укажите адрес для доставки';
        } if (this.order.payment === undefined) {
            'Выберете способ оплаты';
        };
        this.errors = error;
        this.events.emit('order: error', this.errors);
        return Object.keys(error).length === 0;
    };

    validateUser(): boolean {
        const error: typeof this.errors = {};
        if (!this.order.phone) {
            'Укажите ваш контактный телефон';
        } if (!this.order.email) {
            'Укажите вашу электронную почту';
        };
        this.errors = error;
        this.events.emit('order: error', this.errors);
        return Object.keys(error).length === 0;
    };

    resetChosen(): void {
        this.gallery.forEach(item => item.selected = false);
    };

    // проверить работоспобоность 
    setGallery(value: IProduct[]) {
        this.gallery = value;
		this.emitEvents('gallery: open', this.gallery);
	}

    setCatalog(items: IProduct[]) {
        this.products = items.map((item: IProduct) => {
            const cardElement = document.getElementById('card');
            if (!cardElement) {
                throw new Error('Card element not found');
            }
            return new Product('card', cardElement); 
        });
        this.emitEvents('catalog: open', { catalog: this.products });
    }
};

   

