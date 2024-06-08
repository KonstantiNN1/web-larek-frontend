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
- src/scss/styles.scss — корневой файл стилей
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
 
eventEmitter: EventEmitter – добавляется для того, чтобы работали события

constructor(container: HTMLElement, products: IProduct[], eventEmitter: EventEmitter) – конструктор класса
        
        container: HTMLElement – HTML элемент, в который будет рендериться продукт
        
        products: IProduct[] – массив продуктов
        
        eventEmitter: EventEmitter – экземпляр для обработки событий

render(product: IProduct) – основной метод класса, который рендерит продукт

        product: IProduct – продукт, который нужно отрендерить

setElementText(cardElement: DocumentFragment, selector: string, text: string | undefined) – метод для установки текста элемента
        
        cardElement: DocumentFragment – фрагмент документа, содержащий элемент

        selector: string – селектор элемента

        text: string | undefined – текст для установки

getElement() – метод для получения элемента

on(eventName: string, listener: (...args: any[]) => void) – метод для подписки на событие

        eventName: string – имя события
        
        listener: (...args: any[]) => void – функция-обработчик события

applyCategoryStyle(element: HTMLElement, category: string) – метод для установки стиля категории

        element: HTMLElement – элемент, к которому применяется стиль

        category: string – категория продукта
 

### class ProductPopupComponent extends Component<IProduct> – класс, который описывает продукт, открытый в модальном окне

eventEmitter: EventEmitter – добавляется для того, чтобы работали события

constructor(container: HTMLElement, eventEmitter: EventEmitter) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться модальное окно

        eventEmitter: EventEmitter – экземпляр для обработки событий

render(product: IProduct) – основной метод класса, который рендерит продукт в модальном окне

        product: IProduct – продукт, который нужно отрендерить

toggle(show: boolean) – метод для открытия/закрытия попапа

        show: boolean – флаг, указывающий нужно ли показать или скрыть попап

applyCategoryStyle(element: HTMLElement, category: string) – метод для установки стиля категории

        element: HTMLElement – элемент, к которому применяется стиль
    
        category: string – категория продукта

### class Page extends Component<IPage> – класс, который описывает стартовую страницу

products: IProduct[] – все продукты (карточки) на странице

eventEmitter: EventEmitter – обработчик событий

constructor(container: HTMLElement, eventEmitter: EventEmitter) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться страница

        eventEmitter: EventEmitter – экземпляр для обработки событий

setProducts(products: IProduct[]) – метод для установки карточек

        products: IProduct[] – массив продуктов для отображения

on(eventName: string, listener: (...args: any[]) => void) – метод для обработки клика

        eventName: string – имя события
        
        listener: (...args: any[]) => void – функция-обработчик события

render() – метод, описывающий основную функциональность класса


### class CartComponent extends Component<IProduct[]>  – класс, который описывает корзину

eventEmitter: EventEmitter – обработчик событий

basketCounterElement: HTMLElement | null – иконка корзины

constructor(container: HTMLElement, eventEmitter: EventEmitter) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться корзина

        eventEmitter: EventEmitter – экземпляр для обработки событий

render(cart: IProduct[]) – метод, описывающий основную функциональность класса

        cart: IProduct[] – массив продуктов в корзине

toggle(show: boolean) – метод для открытия/закрытия модального окна

        show: boolean – флаг, указывающий нужно ли показать или скрыть модальное окно

updateBasketCounter(count: number) – метод для обновления количества на иконке корзины

        count: number – количество продуктов в корзине


### class OrderComponent extends Component<IOrder> – класс, который описывает модальное окно заказа

order: IOrder – описание заказа

eventEmitter: EventEmitter – обработчик событий

contactsContainer: HTMLElement – описание следующего попапа (для перехода к нему)

selectedPaymentMethod: 'online' | 'cash' | null – описание метода оплаты

constructor(container: HTMLElement, eventEmitter: EventEmitter, contactsContainer: HTMLElement, form: Form) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться модальное окно заказа

        eventEmitter: EventEmitter – экземпляр для обработки событий

        contactsContainer: HTMLElement – HTML элемент для следующего попапа

        form: Form – экземпляр класса Form для работы с данными формы

setOrder(order: IOrder) – метод для заполнения заказа

        order: IOrder – объект заказа

handleInputChange(event: Event) – метод для обработки изменений в форме заказа

        event: Event – событие изменения

selectPaymentMethod(method: 'online' | 'cash') – метод для выбора способа оплаты

        method: 'online' | 'cash' – выбранный способ оплаты

checkFormValidity() – метод для валидации формы

confirmOrder() – метод для перехода к следующему попапу

render() – метод, описывающий основную функциональность класса

toggle(show: boolean) – метод для открытия/закрытия модального окна

        show: boolean – флаг, указывающий нужно ли показать или скрыть модальное окно


### class ContactFormComponent extends Component<null> – класс, который описывает модальное окно ввода данных о клиенте

eventEmitter: EventEmitter – обработчик событий

form: Form – экземпляр класса Form для работы с данными формы

constructor(container: HTMLElement, eventEmitter: EventEmitter, form: Form) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться модальное окно

        eventEmitter: EventEmitter – экземпляр для обработки событий

        form: Form – экземпляр класса Form

render() – метод, описывающий основную функциональность класса

toggle(show: boolean) – метод для открытия/закрытия модального окна

        show: boolean – флаг, указывающий нужно ли показать или скрыть модальное окно

on(event: string, callback: (data: any) => void) – метод для обработки событий

        event: string – имя события
        
        callback: (data: any) => void – функция-обработчик события


### class SuccessComponent extends Component<ISuccess> - класс, описывающий модальное окно при успешном заказе

eventEmitter: EventEmitter – обработчик событий

constructor(container: HTMLElement, eventEmitter: EventEmitter) – конструктор класса

        container: HTMLElement – HTML элемент, в который будет рендериться модальное окно

        eventEmitter: EventEmitter – экземпляр для обработки событий

render(totalAmount: number) – метод, описывающий основную функциональность класса

        totalAmount: number – сумма успешного заказа

toggle(show: boolean) – метод для открытия/закрытия модального окна

        show: boolean – флаг, указывающий нужно ли показать или скрыть модальное окно


## Слой данных (Model)

### class AppData implements AppState – класс для взаимодействия представления с данными 


basket: IProduct[] – корзина с продуктами

store: IProduct[] – список всех продуктов

order: IOrder – текущий заказ

formErrors: FormErrors – ошибки форм

api: WebLarekApi – экземпляр API для взаимодействия с сервером

eventEmitter: EventEmitter – экземпляр для обработки событий


constructor(api: WebLarekApi, eventEmitter: EventEmitter)

        api: WebLarekApi – экземпляр API для взаимодействия с сервером

        eventEmitter: EventEmitter – экземпляр для обработки событий

addToBasket(value: IProduct): void – метод для добавления продукта в корзину

        value: IProduct – продукт для добавления

deleteFromBasket(id: number): void – метод для удаления продукта из корзины

        id: number – ID продукта для удаления

clearBasket(): void – метод для полной очистки корзины

getBasketAmount(): number – метод для получения количества продуктов в корзине

getTotalBasketPrice(): number – метод для получения общей суммы продуктов в корзине

setItems(): void – метод для установки продуктов в заказе

setOrderField(field: keyof IOrder, value: string): void – метод для установки значения поля заказа

        field: keyof IOrder – поле заказа

        value: string – значение для установки

validateContacts(): boolean – метод для валидации контактной формы

validateOrder(): boolean – метод для валидации формы заказа

refreshOrder(): boolean – метод для обновления заказа

setStore(items: IProduct[]): void – метод для установки продуктов

        items: IProduct[] – массив продуктов

resetSelected(): void – метод для сброса выбора продуктов

placeOrder(orderRequest: IOrderRequest): Promise<IOrderResult> – метод для размещения заказа

        orderRequest: IOrderRequest – запрос на размещение заказа

fetchProducts(): void – метод для получения продуктов с сервера


## Сервисный класс 

### class WebLarekApi – предоставляет методы для взаимодействия с API, позволяя получать информацию о продуктах и оформлять заказы. Класс наследует от базового класса Api и реализует интерфейс IWebLarekApi

constructor(options?: RequestInit) – конструктор класса

        options?: RequestInit – опции для инициализации

getAllProducts(): Promise<IProduct[]> – возвращает список продуктов

getProduct(id: string): Promise<IProduct> – возвращает информацию о продукте по его идентификатору

        id: string – ID продукта

postOrder(order: IOrderRequest): Promise<IOrderResult> – отправляет заказ, возвращает результат оформления заказа

        order: IOrderRequest – объект заказа



## Типы данных 

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

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

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


export interface IWebLarekApi {
   
    getAllProducts(): Promise<IProduct[]>;
   
    getProduct(id: string): Promise<IProduct>;
   
    postOrder(order: IOrderRequest): Promise<IOrderResult>;
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