import './scss/styles.scss';

import { Page } from './components/Page';
import { CartComponent } from './components/CartComponent';
import { OrderComponent } from './components/OrderComponent';
import { ContactFormComponent } from './components/ContactFormComponent';
import { SuccessComponent } from './components/SuccessComponent';
import { AppData } from './components/AppData';
import { WebLarekApi } from './components/WebLarekApi';
import { IProduct, IOrderRequest, IOrderResult } from './types/types';
import { ProductPopupComponent } from './components/ProductPopupComponent';
import { EventEmitter } from './components/base/events';
import { Form } from './components/Form';

document.addEventListener('DOMContentLoaded', () => {
    const eventEmitter = new EventEmitter();

    // Инициализация API и данных приложения
    const api = new WebLarekApi();
    const appData = new AppData(api, eventEmitter);
    const form = new Form();

    // Инициализация компонентов
    const page = new Page('gallery', eventEmitter);
    const cartModalContainer = document.getElementById('modal-container') as HTMLElement;
    const cartComponent = new CartComponent(cartModalContainer, eventEmitter);

    const orderModalContainer = document.createElement('div');
    orderModalContainer.className = 'modal hidden';
    document.body.appendChild(orderModalContainer);
    const orderComponent = new OrderComponent(orderModalContainer, eventEmitter);

    const contactsContainer = document.createElement('div');
    contactsContainer.className = 'modal hidden';
    document.body.appendChild(contactsContainer);
    const contactFormComponent = new ContactFormComponent(contactsContainer, eventEmitter);

    const successModalContainer = document.createElement('div');
    successModalContainer.className = 'modal hidden';
    document.body.appendChild(successModalContainer);
    const successComponent = new SuccessComponent(successModalContainer, eventEmitter);

    const productPopupContainer = document.createElement('div');
    productPopupContainer.className = 'modal hidden';
    document.body.appendChild(productPopupContainer);
    const productPopupComponent = new ProductPopupComponent(productPopupContainer, eventEmitter);

    // Обработчики событий для обновления UI
    eventEmitter.on('products:updated', (data: { products: IProduct[] }) => {
        page.setProducts(data.products);

        page.on('product:clicked', (product: IProduct) => {
            productPopupComponent.render(product);
            productPopupComponent.toggle(true);
        });
    });

    eventEmitter.on('cart:updated', (data: { cart: IProduct[] }) => {
        cartComponent.render(data.cart);
    });

    eventEmitter.on('order:confirmed', (data: { paymentMethod: string; address: string }) => {
        form.setField('payment', data.paymentMethod);
        form.setField('address', data.address);
        orderComponent.toggle(false);
        contactFormComponent.render();
        contactFormComponent.toggle(true);
    });

    eventEmitter.on('contactForm:submitted', (data: { email: string; phone: string }) => {
        console.log('Event contactForm:submitted received with data:', data);
        form.setField('email', data.email);
        form.setField('phone', data.phone);

        if (form.validate()) {
            const orderData = form.getOrderData() as IOrderRequest;
            console.log('Order data to be sent:', orderData);
            // Отправка данных на сервер
            api.postOrder(orderData).then((result: IOrderResult) => {
                console.log('Response from server:', result);
                if (result.id && result.total) {
                    console.log('Order placed successfully');
                    successComponent.render(result.total);
                    console.log('Rendering success component');
                    successComponent.toggle(true);
                    cartComponent.toggle(false);
                    contactFormComponent.toggle(false);
                    productPopupComponent.toggle(false);
                } else {
                    console.log('Order submission failed:', result);
                }
            }).catch((error) => {
                console.error('Error submitting order:', error);
            });
        } else {
            console.log('Form validation failed');
        }
    });

    // Загрузка продуктов при старте
    appData.fetchProducts();

    // Привязка обработчиков событий к элементам страницы
    document.querySelector('.header__basket')?.addEventListener('click', () => {
        cartComponent.toggle(true);
    });

    cartModalContainer?.addEventListener('click', (event) => {
        if (event.target === cartModalContainer) {
            cartComponent.toggle(false);
        }
    });

    // Обработка события добавления товара в корзину
    eventEmitter.on('cart:add', (product: IProduct) => {
        appData.addToBasket(product);
        product.selected = true;
        productPopupComponent.toggle(false); // Закрытие модального окна ProductPopupComponent
    });

    // Обработка события закрытия корзины
    eventEmitter.on('cart:close', () => {
        cartComponent.toggle(false); // Закрытие модального окна CartComponent
    });

    // Обработка события удаления товара из корзины
    eventEmitter.on('cart:remove', (productId: number) => {
        appData.deleteFromBasket(productId);
    });

    // Обработка события оформления заказа
    eventEmitter.on('order:checkout', () => {
        const total = appData.getTotalBasketPrice();
        const items = appData.basket.map(product => product.id.toString()); // Преобразование элементов в строки
        form.setField('total', total);
        form.setField('items', items);
        orderComponent.render();
        orderComponent.toggle(true);
        cartComponent.toggle(false); // Закрытие корзины после оформления заказа
    });

    // Обработка события очистки корзины
    eventEmitter.on('cart:clear', () => {
        appData.clearBasket();
        updateBasketCounter(0); // Обновление счетчика корзины
    });

    function updateBasketCounter(count: number) {
        const basketCounter = document.querySelector('.header__basket-counter');
        if (basketCounter) {
            basketCounter.textContent = count.toString();
        }
    }
});

