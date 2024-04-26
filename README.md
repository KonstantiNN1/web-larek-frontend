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


### abstract class Component<T>:

_container_: HTMLElement – какой-либо элемент, который передается в конструкторе

_toggleClass(element: HTMLElement, class: string): void_ – метод, который меняет класс у элемента

_setTextContent(element: HTMLElement, value: string)_ – метод, который устанавливает текст

_setActivation(element: HTMLElement, value: boolean)_ – метод, который устанавливает состояние 

_setImage(elemen: HTMLImageElement, src: string, alt: string)_ – метод, который устанавливает фото и альтернативное описание 

_toggleVisibility(element: HTMLElement)_ – метод, который меняет видимость элемента

_getElement(element: HTMLElement)_ – метод, который возвращает элемент


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

### class Product extends Component<IProduct>  – класс, который описывает продукт и то, какие действия с ним можно сделать


    title: HTMLElement – название ячейки

    category: HTMLElement – категория ячейки

    image: HTMLImageElement – ссылка на изображение/прорисовка изображения

    price: HTMLElement – цена в формате $number + string

    button: HTMLButtonElement – вшитая в карточку кнопка
    
    ?selected: boolean

    ?actions: Actions

    get id(): string

    set id(value: string): void
   
    get title(): string

    set title(value: string): void

    set image(value: string): void

    set selected(value: boolean): void

    set price(calue: numver | null)

    set category(value: CategoryOfProduct)
 

### class OpenedProduct extends Product – класс, который описывает продукт, открытый в модальном окне


    description: HTMLElement

    set description(value: string)


### class Page extends Component<IPage> – класс, который описывает стартовую страницу


    gallery: HTMLElement;

    counter: HTMLElement;

    cart: HTMLElement;

    layout: HTMLElement;

    set gallery();

    set counter();



### class Cart extends Component<ICart>  – класс, который описывает корзину (открытую в модальном окне) 


    list: HTMLElement

    price: HTMLElement

    button: HTMLButtonElement

    ?events: IEvents

    set price(newPrice: number)

    set list(products: HTMLElement[]) 


### class ProductInCart extends Component<IProductInCart> – класс, который описывает каждый продукт в корзине


    index: HTMLElement

    title: HTMLElement

    price: HTMLElement

    button: HTMLButtonElement

    ?actions: Actions

    set index(value: number)

    set title(value: string)

    set price(value: number | null)


### class Order extends Component<IDelivery> – класс, который описывает модальное окно заказа


    online: HTMLButtonElement

    offline: HTMLButtonElement

    address: HTMLInputElement

    actions: Actions

    toggleIsChosen(button: HTMLButtonElement): void


### class User extends Component<IUser> – класс, который описывает модальное окно ввода данных о клиенте


    email: HTMLInputElement;
   
    phone: HTMLInputElement;
   
    actions: Actions


### class Success extends Component<ISuccess> 



    close: HTMLButtonElement;

    totalSumm: HTMLElement;

    image: HTMLElement;

    description: HTMLElement;




## Слой данных (Model)

### class AppData extends Model<IAppData> – класс для взаимодействия представления с данными 

 
    cart: HTMLElement[];
    
    inCart: HTMLElement[];
    
    order: Record<HTMLElement>;
    
    addToCart(product: HTMLElement): void
    
    deleteFromCart(product: HTMLElement): void
    
    clearCart(): void

    clearOrder(): void;

    setProducts(): void

    getTotalPrice(): void

    getTotalNumber(): void

    validateDelivery(): boolean;

    validateUser(): boolean;

    resetChosen(): boolean;

    errors: FormErrors;




## Сервисный класс 

### class WebLarekApi – предоставляет методы для взаимодействия с API, позволяя получать информацию о продуктах и оформлять заказы. Класс наследует от базового класса Api и реализует интерфейс IWebLarekApi

    constructor(cdn: string, baseUrl: string, options?: RequestInit)

    getAllProducts(): Promise<IProduct[]> - Возвращает список продуктов. Добавляет URL изображения к каждому продукту.

    getProduct(id: string): Promise<IProduct> - Возвращает информацию о продукте по его идентификатору. Добавляет URL изображения к продукту.

    postOrder(order: IOrder): Promise<IOrderResult> - Отправляет заказ. Возвращает результат оформления заказа.



## Типы данных 

**type CategoryOfProduct** =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'  – всевозможные типы, которые упомянуты в макете 

**type FormErrors =  [key: string]: string | undefined ** – тип для вызова ошибки во время валидации

**interface IProduct**  – все, что встречается у продукта во время отображения на экране или его выбора
  id: string;

  title: string;

  category: string;
  
  description: string;
  
  image: string;
  
  price: number | null;
  
  selected: boolean;



**interface IProductInCart extends IProduct**  – то, что есть у продукта в корзине
   
    index: number;


**interface ICart**  – то, как выглядит сама корзина
    
    list: Object[];
    
    price: number;


**interface IOrderForm**  – вся форма для заказа

  items: object[]

  payment: 'Онлайн' | 'При получении' | undefined;
  
  address: string;
  
  email: string;
  
  phone: string;



**interface IDelivery**  – первая часть формы, которые появляется в модальном окне при нажатии кнопки "Оформить"
    
    address: string;
    
    payment: 'Онлайн' | 'При получении';


**interface IUser**  – вторая часть формы, после деталей заказа
   
    email: string;
   
    phone: string;


**interface Actions**  – любое действие, которое происходит при клике  
  
    onClick: (event: MouseEvent) => void;


**interface IAppData**  – то, какие данные и методы необходимы для работы приложения

    cart: Product[];
    
    gallery: Product[];
    
    order: IOrder;
    
    addToCart(product: Product): void
    
    deleteFromCart(product: Product): void
    
    clearCart(): void

    clearOrder(): void;

    setProducts(): void

    getTotalPrice(): void

    getTotalNumber(): void

    validateOrder(): boolean;

    validateUser(): boolean;

    resetChosen(): boolean;

    errors: FormErrors;



**interface IPage**  – то, как выглядит приложение при загрузке

    gallery: HTMLElement[];

    cart: HTMLElement[];

    counter: number;



**interface ISuccess**  – то, как выглядит последнее окно после успешного заказа
    
    closeButton: HTMLButtonElement;

    image: string;

    description: string;

    totalSumm: number;




## Presenter 

'product: select' – вызывается при выборе продукта 

'product: toCart' - вызывается при нажатии на кнопку в "В корзину"

'cart: open' – вызывается при нажатии на значок корзины на главной странице

'cart: deleteProduct' – вызывается при нажатии на значок удаления в корзине; удаляет продукт из корзины 

'cart: toOrder' – вызывается при нажатии на кнопку "Оформить"

'order: submit' – вызывается при нажатии на кнопку "Далее" во время вызова класса Order

'order: input' – вызывается при заполнении инпутов во время вызова класса Order, валидирует

'order: error' – вызывается при ошибке при заполнении формы, во время вызова класса Order

'user: submit' – вызывается при нажатии на кнопку "Далее" во время вызова класса User

'user: input' – вызывается при заполнении инпутов во время вызова класса Order, валидирует

'user: error' – вызывается при ошибке при заполнении формы во время вызова класса User

'order: ordered' – вызывает последний попап "Заказ оформлен"

'modal: close' – вызывается при нажатии на крестик, escape и overlay во время заказа

'gallery: open'