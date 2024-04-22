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
- src/styles/styles.scss — корневой файл стилей
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

_event_ – объект событий, который также передается в конструктуоре 

_emitEvents(event)_ – метод, который эмитирует события


### abstract class Component<T>:

_container_: HTMLElement – какой-либо элемент, который передается в конструкторе

_toggleClass(element: HTMLElement, class: string): void_ – метод, который меняет класс у элемента

_setValue(element: HTMLElement, value: string)_ – метод, который устанавливает текст

_setActivation(element: HTMLElement, value: boolean)_ – метод, который устанавливает состояние 

_setImage(elemen: HTMLElement, src: string, alt: string)_ – метод, который устанавливает фото и альтернативное описание 

_toggleVisibility(element: HTMLElement)_ – метод, который меняет видимость элемента

_getElement(element: HTMLElement)_ – метод, который возвращает элемент


### class Api:

_baseApi: string_ – базовый API, от которого идем

_options: object<string>_ – добавление типовых данных

_handleResponse(response: Response): Promise<object>_ – метод, который обрабатывает ответ в других методах

_get(uri: string): Product[]_ – GET метод, который принимает все данные от сервера

_post(uri: string, data: object, method: ApiPostMethods = 'POST): InOrder[]_ – POST метод, который будет отправлять данные на сервер

### class EventEmitter: 

_events: Map<EventName, Set<Subscriber>>_ – события

_on<T extends object>(eventName: EventName, callback: (event: T) => void)_ - метод, которые устанавливает обработчик на событие
  
_off(eventName: EventName, callback: Subscriber)_ – метод, который убирает снимает обработчик с события

_emit<T extends object>(eventName: string, data?: T)_ – метод, который вызывает событие

_onAll(callback: (event: EmitterEvent) => void)_ – метод, который позволяет слушать все события

_offAll()_ – метод для сброса всех обработчиков

_trigger<T extends object>(eventName: string, context?: Partial<T>)_ – метод, чтобы сделать коллбек триггер, генерирующий событие при вызове 




## Слой отображения (View) 

### class Product extends Component<IProduct>  – класс, который описывает продукт и то, какие действия с ним можно сделать
{

    name: HTMLElement – название ячейки

    category: HTMLElement – категория ячейки

    image: HTMLImageElement – ссылка на изображение/прорисовка изображения

    price: HTMLElement – цена в формате ${number} + string

    button: HTMLButtonElement – вшитая в карточку кнопка

    ?actions: Actions

    get id(): string

    set id(value: string): void
   
    get name(): string

    set name(value: string): void

    set image(value: string): void

    set selected(value: boolean): void

    set price(calue: numver | null)

    set category(value: CategoryOfProduct)
} 

### class OpenedProduct extends Product – класс, который описывает продукт, открытый в модальном окне
{
    description: HTMLElement

    set description(value: string)
}

### class PAge extends Component<IPage> – класс, который описывает стартовую страницу
{
    catalog: HTMLElement;

    incart: HTMLElement;

    cart: HTMLElement;

    layout: HTMLElement;
}

### class Cart extends Component<ICart>  – класс, который описывает корзину (открытую в модальном окне) 
{
    list = HTMLElement

    price = HTMLElement

    button = HTMLButtonElement

    ?actions: Actions

    set price(price: number)

    set list(products: HTMLElements[]) 
}

### class ProductInCart extends Component<IProductInCart> – класс, который описывает каждый продукт в корзине
{
    index: HTMLElement

    name: HTMLElement

    price: HTMLElement

    button: HTMLButtonElement

    ?actions: Actions

    set index(value: number)

    set name(value: string)

    set price(value: number | null)
}

### class Order extends Component<IOrder> – класс, который описывает модальное окно заказа
{
    online: HTMLButtonElement

    offline: HTMLButtonElement

    adress: HTMLInputElement

    actions: Actions

    toggleIsChosen(button: HTMLButtonElement): void
}

### class User extends Component<IUser> – класс, который описывает модальное окно ввода данных о клиенте
{
    email: HTMLInputElement;
   
    phone: HTMLInputElement;
   
    actions: Actions
}

### class Success extends Component<ISuccess> 
{

    close: HTMLButtonElement;

    totalSumm: HTMLElement;

    image: HTMLElement;

    description: HTMLElement;


}






## Слой данных (Model)

### class AppData extends Model<IAppData> – класс для взаимодействия представления с данными 
{ 
   _полностью повторяет интерфейс IAppDara_
}




## Сервисный класс 

### class WebLarekApi 
{
    getProduct() - запрос для чтения данных 1-го продукта
    
    getAllProducts() - запрос для чтения данных по всем продуктам
    
    postOrder() - запрос после успешного оформления заказа
}





## Типы данных 

**type CategoryOfProduct** =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'  – всевозможные типы, которые упомянуты в макете 

**type FormErrors = { [key: string]: string | undefined }** – тип для вызова ошибки во время валидации


**interface IProduct** { – все, что встречается у продукта во время отображения на экране или его выбора
  id: string;

  name: string;

  category: string;
  
  description: string;
  
  image: string;
  
  price: number | null;
  
  selected: boolean;

}

**interface IProductInCart extends IProduct** { – то, что есть у продукта в корзине
   
    index: number;
}

**interface ICart** { – то, как выглядит сама корзина
    
    list: Object[];
    
    price: number;
}

**interface IOrderForm** { – вся форма для заказа

  payment: 'Онлайн' | 'При получении';
  
  address: string;
  
  email: string;
  
  phone: string;

}

**interface IOrder** { – первая часть формы, которые появляется в модальном окне при нажатии кнопки "Оформить"
    
    adress: string;
    
    payment: 'Онлайн' | 'При получении';
}

**interface IUser** { – вторая часть формы, после деталей заказа
   
    email: string;
   
    phone: string;
}

**interface Actions** { – любое действие, которое происходит при клике  
  
    onClick: (event: MouseEvent) => void;
}

**interface IAppData** { – то, какие данные и методы необходимы для работы приложения

    cart: Product[];
    
    inCart: Product[];
    
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

}

**interface IPage** { – то, как выглядит приложение при загрузке

    catalog: HTMLElement[];

    cart: HTMLElement[];

    incart: number;

}

**interface ISuccess** { – то, как выглядит последнее окно после успешного заказа
    
    close: HTMLButtonElement;

    image: string;

    description: string;

    totalSumm: number;

}




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






