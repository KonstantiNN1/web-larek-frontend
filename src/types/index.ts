import { Product } from "../components/Product";

export type ApiListResponse<Type> = { 
    // total: number, 
    items: Type[] 
}; 

// export type ApiResponse<Type> = { 
//     items: Type[] 
// }; 

export type CategoryOfProduct =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'; 

export type FormErrors = { [key: string]: string | undefined };

export interface IProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected?: boolean;
}

export interface IProductInCart extends IProduct {
    index: number;
}

export interface ICart {
    list: Object[];
    price: number;
}

export interface IDelivery {
    address: string;
    payment: 'Онлайн' | 'При получении' | undefined;
}

export interface IUser {
    email: string;
    phone: string;
}

export interface IOrder extends IDelivery, IUser {
    total: number,
    items: object[]
} 

export interface Actions {
    onClick: (event: MouseEvent) => void;
}

export interface IAppData {
    cart: IProduct[];
    gallery: IProduct[];
    order: IOrder;
    addToCart(product: IProduct): void
    deleteFromCart(product: IProduct): void
    clearCart(): void
    clearOrder(): void;
    setProducts(): void
    getTotalPrice(): number
    getTotalNumber(): number
    validateDelivery(): boolean;
    validateUser(): boolean;
    resetChosen(): boolean;
    errors: FormErrors;
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

export interface IFormState {
    valid: boolean;
    errors: string[];
};

export interface IModal {
	content: HTMLElement;
};