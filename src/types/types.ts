export interface IProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category?: string;
    isFull?: boolean;
}

// Order interfaces
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

// API interfaces
export interface IWebLarekApi {
    getAllProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: IOrder): Promise<IOrderResult>;
}

// Api response type
export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

// Api post methods type
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