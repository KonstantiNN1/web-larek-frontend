# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/mixins/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

# Архитектура проекта

## Базовые классы

### abstract class Model<T> 

_data_ – данные, которые передаются в конструкторе 

_events_ – объект событий, который также передается в конструктуоре 

_emitEvents(events)_ – метод, который эмитирует события

_on_ – метод, который обрабатывает нажатие


### abstract class Component<T>:

_container_: HTMLElement – какой-либо элемент, который передается в конструкторе

_data_: T | null

_toggleVisibility(): void_ – метод, который меняет класс у элемента

_render()_ – основной метод класса, который описывает его функциональность

_open()_ – метод для открытия  

_close_ – метод для закрытия 

_emit(eventName: string, data?: any)_ – метод для эмитации


### class api:

_baseUrl: string_ – базовый API, от которого идем

_options: object<string>_ – добавление типовых данных

_handleResponse(response: Response): Promise<object>_ – метод, который обрабатывает ответ в других методах

_get(uri: string): Product[]_ – GET метод, который принимает все данные от сервера

_post(uri: string, data: object, method: ApiPostMethods = 'POST): InOrder[]_ – POST метод, который будет отправлять данные на сервер

### class events: 

_events: Map<EventName, Set<Subscriber>>_ – события

_on<T extends object>(eventName: EventName, callback: (event: T) => void)_ - метод, которые устанавливает обработчик на событие
  
_off(eventName: EventName, callback: Subscriber)_ – метод, который убирает снимает обработчик с события

_emit<T extends object>(eventName: string, data?: T)_ – метод, который вызывает событие

_onAll(callback: (event: EmitterEvent) => void)_ – метод, который позволяет слушать все события

_offAll()_ – метод для сброса всех обработчиков

_trigger<T extends object>(eventName: string, context?: Partial<T>)_ – метод, чтобы сделать коллбек триггер, генерирующий событие при вызове 




## Слой отображения (View) 

### class ProductComponent extends Component<IProduct>  – класс, который описывает продукт и то, какие действия с ним можно сделать
 
    _eventEmitter: EventEmitter_ – добавляется для того, чтобы работали события

    _render(product: IProduct)_ – основной метод класса
    
    _setElementText(cardElement: DocumentFragment, selector: string, text: string | undefined)_ – метод для создания элемента
   
    _getElement()_ – метод, чтобы получить элемент

    _on(eventName: string, listener: (...args: any[]) => void)_ – метод для активации нажатия

    _applyCategoryStyle(element: HTMLElement, category: string)_ – метод для установки цвета категории 
 

### class ProductPopupComponent extends Component<IProduct> – класс, который описывает продукт, открытый в модальном окне

    _eventEmitter: EventEmitter_ – добавляется для того, чтобы работали события

    _render(product: IProduct)_ – основной метод класса, который реализовывает функциональность
    
    _toggle(show: boolean)_ – метод для открытия/закрытия попапа 

    _applyCategoryStyle(element: HTMLElement, category: string)_ – метод для установки цвета категории 


### class Page extends Component<IPage> – класс, который описывает стартовую страницу

    products: IProduct[] – все продукты (карточки) на страницк
    
    eventEmitter: EventEmitter – обработчик событий

    setProducts(products: IProduct[]) - метод для установки карточек

    on(eventName: string, listener: (...args: any[]) => void) – метод для обработки клика

    render() – метод, описывающий основую функциональность класса


### class CartComponent extends Component<IProduct[]>  – класс, который описывает корзину (открытую в модальном окне) 

    eventEmitter: EventEmitter – обработчик событий
    
    private basketCounterElement: HTMLElement | null – иконка корзины
    
    render(cart: IProduct[]) – метод, описывающий основую функциональность класса

    toggle(show: boolean) – открытие/закрытия модального окна

    updateBasketCounter(count: number) – метод для обновления количества на иконке корзины


### class OrderComponent extends Component<IOrder> – класс, который описывает модальное окно заказа

    order: IOrder – описание заказа
    
    eventEmitter: EventEmitter – обработчик событий
    
    contactsContainer: HTMLElement – описание следующего попапа (для перехода к нему)
    
    selectedPaymentMethod: 'online' | 'cash' | null = null – описание метода оплаты
    
    setOrder(order: IOrder) – метод для заполнения заказа

    handleInputChange(event: Event) – метод для изменений, который вносятся в заказе

    selectPaymentMethod(method: 'online' | 'cash') – метод для выбора способа оплаты

    checkFormValidity() – метод для валидации

    confirmOrder() – метод для перехода к следующему попапу

    render() – метод, описывающий основую функциональность класса

    toggle(show: boolean) – открытие/закрытия модального окна


### class ContactFormComponent extends Component<IContactFormComponent> – класс, который описывает модальное окно ввода данных о клиенте


    eventEmitter: EventEmitter – обработчик событий
   
    render() – метод, описывающий основую функциональность класса
   
    toggle(show: boolean) – открытие/закрытия модального окна

    on(event: string, callback: (data: any) => void) - обработка нажатия на кнопук


### class SuccessComponent extends Component<ISuccess> - класс, описывающий модальное окно при успешном заказе

    eventEmitter: EventEmitter – обработчик событий
    
    render(totalAmount: number) – метод, описывающий основую функциональность класса

    toggle(show: boolean) – открытие/закрытия модального окна


## Слой данных (Model)

### class AppData extends Model<IAppData> – класс для взаимодействия представления с данными 


    api: IWebLarekApi – передача сервисного класса 

    products: [] – список продуктов
    
    cart: [] – все продукты в корзине
    
    fetchProducts() – метод для обновления продуктов
 
    addToCart(product: IProduct) – метод для добавления продукта в корзину
    
    removeFromCart(productId: number)  – метод для удаления продукта из корзины
    
    clearCart()  – очистка корзины 
    
    setOrder(order: IOrder) – установка заказа 
    
    placeOrder() – оформление заказа  
    
    on<K extends keyof AppDataEvents>(event: K, callback: (data: AppDataEvents[K]) => void) – обработка действия

    getCart(): IProduct[] – метод, чтобы передать корзину

    getOrder(): IOrder | null  – метод, чтобы передать заказ




## Сервисный класс 

### class WebLarekApi – предоставляет методы для взаимодействия с API, позволяя получать информацию о продуктах и оформлять заказы. Класс наследует от базового класса Api и реализует интерфейс IWebLarekApi

    constructor(cdn: string, baseUrl: string, options?: RequestInit)

    getAllProducts(): Promise<IProduct[]> - Возвращает список продуктов. Добавляет URL изображения к каждому продукту.

    getProduct(id: string): Promise<IProduct> - Возвращает информацию о продукте по его идентификатору. Добавляет URL изображения к продукту.

    postOrder(order: IOrder): Promise<IOrderResult> - Отправляет заказ. Возвращает результат оформления заказа.



## Типы данных 

**type CategoryOfProduct** =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'  – всевозможные типы, которые упомянуты в макете 

**type FormErrors =  [key: string]: string | undefined ** – тип для вызова ошибки во время валидации

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
    
    totalAmount: number;
    
}



## Presenter 

'cart:clear' – для очистки корзины 

'product:clicked' - При выборе продукта

'cart:add' – добавление продукта в корзину

'cart:close' – закрытие корзины

'cart:remove' – удаление товара из корзине 

'order:checkout' – оформление заказа

'contact:submit' – ввод личных данных (второе модальное окно)

'order:contactForm' – ввод адреса и способа оплаты (первое модальное окно)

'order:place' – завершение оформления заказа

'products:updated' – актуализация товаров в корзине 

'cart:updated' – актуализация корзины

'order:updated' – актуализация заказа