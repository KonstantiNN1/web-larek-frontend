export interface IProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    isFull?: boolean;
}

export interface IOrder {
    id: number;
    products: IProduct[];
    totalAmount: number;
    customerName: string;
    customerAddress: string;
}

export interface IOrderResult {
    success: boolean;
    orderId: string;
    totalAmount: number;
}

export interface IWebLarekApi {
    getAllProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: IOrder): Promise<IOrderResult>;
}

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

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