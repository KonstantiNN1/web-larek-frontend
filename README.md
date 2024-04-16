# Архитектура проекта

## Слой отображения (View) 

### базовый class Cell: 
*Не путать с продуктом! Его типизация ниже в **Особые типы***

**cellName: string** – название ячейки

**cellImage: string** – ссылка на изображение/прорисовка изображения

**cellType: string** – категория ячейки

**cellPrice: string** – цена в формате ${number} + string

**onClick: void** – метод, который вызывает попап.

### базовый class Popup:

private **popupName**: string – название попапа

**buttonClick: void** – метод, срабатывающий при нажатии на кнопку 

**closeButtonClick: void** – метод, срабатывающий при нажатии на крестики, escape или overlay – он закрывает попап

?**isValid** – метод, который проверяет валидность кнопки

?**toggleButton** – метод, который делает кнопку активной/неактивной


### CellPopup extends Cell & Popup: 

**cellName**; **cellImage**; **cellType**; **cellPrice** – полностью приходят из класса Cell

**closeButtoClick** – полностью приходят из класса Popup

**buttonClick** – видоизмененный метод, который закрывает попап отправляет товар в корзину


### сlass PopupCart extends Popup: 

**closeButtoClick** – полностью приходят из класса Popup

**buttonClick** – видоизмененный метод, который закрывает попап, сохраняет данные и переходит к следующему классу PopupPayment

**products**: <number: string> – список продуктов, которые мы уже добавили в корзину 

**wholePrice**: string – общая цена за все продукты, записанная в формате ${price} + string

**deleteProduct**: void – удаление продукта из корзины 


### PopupPayment extends Popup:

**closeButtoClick** – полностью приходят из класса Popup

**buttonClick** – видоизмененный метод, который закрывает меняет сохраняет данные и переходит к следующему классу PopupPayment

**isValid** – повторяет функционал с добавлением параметра

**toggleButton** – повторяет функционал с добавлением параметра

**adressInput: string** – поле, куда необходимо записать адрес в виде строки

**paymentNow: HTMLElementButton** - кнопка, на которой написано "Онлайн"

**paymentAfter: HTMLElementButton** - кнопка, на которой написано "При получении"

**isChosen: boolean** – метод, который определяет выбранную кнопку

**activateButton: void** – метод, который добавляет рамку выбранной кнопке


### PopupAuthorization extends Popup: 

**closeButtoClick** – полностью приходят из класса Popup

**buttonClick** – видоизмененный метод, который закрывает меняет сохраняет данные и переходит к следующему классу PopupPayment

**isValid** – повторяет функционал с добавлением параметра

**toggleButton** – повторяет функционал с добавлением параметра

**emailInput: string** – поле, куда необходимо записать email в виде строки

**phoneInput: string** – поле, куда необходимо записать номер телефона, нужна регулярка только цифры, +, ( и )


### PopupCompleted extends Popup: 

**popupName**: string – название попапа

**buttonClick: void** – метод, срабатывающий при нажатии на кнопку 

**closeButtonClick: void** – метод, срабатывающий при нажатии на крестики, escape или overlay – он закрывает попап

**popupImage: string** – изображение, добавленное в попап

**wholePrice**: string – общая цена за все продукты, записанная в формате ${price} + string


## Слой представления (Presenter)

### class Api: 

**baseApi: string** – базовый API, от которого идем

**getCells: object<string>** – GET метод, который добавляет все ячейки на главную страницу 

**postOrder: object<number: object>** – POST метод, который будет отправлять данные на сервер после совершения заказа

## Слой данных (Model)

### class Cart: 
**products: object<number: string>** – объект, идентичный тому, что был в PopupCart

**addProduct: object<number: string>** – метод, который добавляет продукт в корзину и возвращает новый объект

**deleteProduct: object<number: string>** – метод, который удаляет продукт из корзины и возвращает новый объект

**getProducts: object<number: string>** – метод, который возвращает актуальный объект с продуктами (используется для отображения на главной странице и для popupCard)

### class Order:

**address: string** - переменная, в которую будет записан адрес

**method: string** - переменная, в которую будет записан метод оплаты

**email: string** - переменная, в которую будет записан эл. адрес

**phone: string** - переменная, в которую будет записан номер телефона

**setAdress: object<string>** – метод, который устанавливает способ оплаты

**setMethod: object<string>** – метод, который устанавливает адрес

**setEmail: object<string>** – метод, который устанавливает эл. почту

**setPhone: object<string>** – метод, который устанавливает номер телефона

**getUserData: object** – метод, который возвращает все данные клиента


## Особые типы данных, интерфейсы

**type CategoryOfProduct** =  'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка'  – всевозможные типы, которые упомянуты в макете 

**interface Product** – описывает каждый продукт (не путать с описанием ячейки из **класса Cell**) {

  productId: string; – идентификатор продукта в БД
  
  name: string; – название продукта
  
  description: string; – то описание, которое видно на сайте
  
  image: string; – ссылка на иллюстрацию 
  
  category: CategoryOfProduct; – категория продукта
  
  price: number | null; - цена только в формате номера, которая может быть 0 и ее нужно добавить в формате ${Product['price']}
  
  selected: boolean; – добавлен или нет продукт в корзину
}

**interface InOrder** {

  items: Product[] – то, на какие заказы выполняется заказ, состоит из массива объектов продукт;
  
  numberOfProducts: number; – количество товаров, на который оформляется заказ, условно – items.length 
  
  paymentMethod: string; – выбрано онлайн или офлайн оплата
  
  address: string; – адрес доставки
  
  email: string; – эл. почта клиента
  
  phone: string; – номер клиента
}



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

или

```
yarn build
```

