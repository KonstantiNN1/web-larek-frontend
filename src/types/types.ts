export interface IOrder {
    id: number;
    products: IProduct[];
    totalAmount: number;
    customerName: string;
    customerAddress: string;
}

export interface IOrderRequest {
    payment: 'online' | 'cash' | undefined;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface ApiListResponse<T> {
    items: T[];
    total: number;
}

export interface IProduct {
    id: number;
    title: string;
    price: number | null;
    description: string;
    image: string;
    category?: string;
    isFull?: boolean;
    selected?: boolean
}

export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IWebLarekApi {
    getAllProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: IOrderRequest): Promise<IOrderResult>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IContactFormComponent {
    render(): void;
    toggle(show: boolean): void;
    on(event: string, callback: (data: any) => void): void;
}

export interface AppDataStructure {
    products: IProduct[];
    cart: IProduct[];
    order: IOrder | null;
}

export interface AppDataEvents {
    'products:updated': AppDataStructure;
    'cart:updated': AppDataStructure;
    'order:updated': AppDataStructure;
    'order:placed': { result: IOrderResult } & AppDataStructure;
}

export interface IPage {
    gallery: HTMLElement[];
    cart: HTMLElement[];
    counter: number;
}

export interface ISuccess {
    closeButton: HTMLButtonElement;
    image: string;
    description: string;
    totalSumm: number;
}

export interface FormErrors {
    customerName?: string;
    customerAddress?: string;
    email?: string;
    phone?: string;
    payment?: string;
}

export interface IAppState {
    basket: IProduct[];
    store: IProduct[];
    order: IOrder;
    formErrors: FormErrors;
    addToBasket(value: IProduct): void;
    deleteFromBasket(id: number): void;
    clearBasket(): void;
    getBasketAmount(): number;
    getTotalBasketPrice(): number;
    setItems(): void;
    setOrderField(field: keyof IOrder, value: string): void;
    validateContacts(): boolean;
    validateOrder(): boolean;
    refreshOrder(): boolean;
    setStore(items: IProduct[]): void;
    resetSelected(): void;
    placeOrder(orderRequest: IOrderRequest): Promise<IOrderResult>;
    fetchProducts(): void;
}