export type ApiListResponse<Type> = { 
    total: number, 
    items: Type[] 
}; 

type CategoryOfProduct =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'; 

type FormErrors = { [key: string]: string | undefined };

interface IProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

interface IProductInCart extends IProduct {
    index: number;
}

interface ICart {
    list: Object[];
    price: number;
}

interface IOrder {
    adress: string;
    payment: 'Онлайн' | 'При получении';
}

interface IUser {
    email: string;
    phone: string;
}

interface Actions {
    onClick: (event: MouseEvent) => void;
}

interface IAppData {
    cart: IProduct[];
    inCart: IProduct[];
    order: IOrder;
    addToCart(product: IProduct): void
    deleteFromCart(product: IProduct): void
    clearCart(): void
    clearOrder(): void;
    setProducts(): void
    getTotalPrice(): void
    getTotalNumber(): void
    validateOrder(): boolean;
    validateUser(): boolean;
    resetChosen(): boolean;
    errors: FormErrors;
}

interface IPage {
    catalog: HTMLElement[];
    cart: HTMLElement[];
    incart: number;
}

interface ISuccess {
    close: HTMLButtonElement;
    image: string;
    description: string;
    totalSumm: number;
}