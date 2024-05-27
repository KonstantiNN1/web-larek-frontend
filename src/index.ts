import './scss/styles.scss';

import { Page } from './components/Page';
import { CartComponent } from './components/CartComponent';
import { OrderComponent } from './components/OrderComponent';
import { SuccessComponent } from './components/SuccessComponent';
import { AppData } from './components/AppData';
import { WebLarekApi } from './components/WebLarekApi';
import { IProduct, IOrder } from './types/types';
import { ProductPopupComponent } from './components/ProductPopupComponent';
import { EventEmitter } from './components/base/events';
import { ContactFormComponent } from './components/ContactFormComponent';

document.addEventListener('DOMContentLoaded', () => {
    const eventEmitter = new EventEmitter();

    // Инициализация API и данных приложения
    const api = new WebLarekApi();
    const appData = new AppData(api);

    // Инициализация компонентов
    const page = new Page('gallery', eventEmitter);
    const cartModalContainer = document.getElementById('modal-container');
    const cartComponent = new CartComponent(cartModalContainer, eventEmitter);

    const orderModalContainer = document.createElement('div');
    orderModalContainer.className = 'modal hidden';
    document.body.appendChild(orderModalContainer);

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

    const orderComponent = new OrderComponent(orderModalContainer, eventEmitter, contactsContainer);

    // Обработчики событий для обновления UI
    appData.on('products:updated', (data) => {
        page.setProducts(data.products);
    });

    appData.on('cart:updated', (data) => {
        cartComponent.render(data.cart);
    });

    appData.on('order:updated', (data) => {
        if (data.order) {
            orderComponent.setOrder(data.order);
            orderComponent.toggle(true);
        } else {
            orderComponent.toggle(false);
        }
    });

    appData.on('order:placed', (data) => {
        successComponent.render(data.result.success ? data.result.totalAmount : 0);
        if (data.result.success) {
            eventEmitter.emit('cart:clear');
        } else {
            console.log('Заказ не оформлен');
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

    // Обработка события клика на продукт
    page.on('product:clicked', (product: IProduct) => {
        productPopupComponent.render(product);
        productPopupComponent.toggle(true);
    });

    // Обработка события добавления товара в корзину
    eventEmitter.on('cart:add', (product: IProduct) => {
        appData.addToCart(product);
        productPopupComponent.toggle(false); // Закрытие модального окна ProductPopupComponent
    });

    // Обработка события закрытия корзины
    eventEmitter.on('cart:close', () => {
        cartComponent.toggle(false); // Закрытие модального окна CartComponent
    });

    // Обработка события удаления товара из корзины
    eventEmitter.on('cart:remove', (productId: number) => {
        appData.removeFromCart(productId);
    });

    // Обработка события оформления заказа
    eventEmitter.on('order:checkout', () => {
        const order: IOrder = {
            id: Date.now(),
            products: appData.getCart(),
            totalAmount: appData.getCart().reduce((sum, product) => sum + product.price, 0),
            customerName: '',
            customerAddress: ''
        };
        appData.setOrder(order);
        orderComponent.setOrder(order); // обновление заказа
        orderComponent.toggle(true);
        cartComponent.toggle(false); // Закрытие корзины после оформления заказа
    });

    // Обработка события отправки контактной формы
    eventEmitter.on('contact:submit', (contactData) => {
        const order = appData.getOrder();
        if (order) {
            order.customerName = contactData.email;
            order.customerAddress = contactData.phone;
            appData.setOrder(order);
            contactFormComponent.toggle(false);
            successComponent.render(order.totalAmount);
            successComponent.toggle(true);

            // Закрытие всех других модальных окон
            cartComponent.toggle(false);
            orderComponent.toggle(false);
            productPopupComponent.toggle(false);
        }
    });

    // Переход от OrderComponent к ContactFormComponent
    eventEmitter.on('order:contactForm', () => {
        orderComponent.toggle(false);
        contactFormComponent.render();
        contactFormComponent.toggle(true);
    });

    eventEmitter.on('order:place', (order: IOrder) => {
        appData.placeOrder().then(result => {
            if (result.success) {
                successComponent.render(result.totalAmount);
                appData.clearCart();
            } else {
                console.log('заказ не оформлен');
            }
            cartComponent.render(appData.getCart()); // Перерисовываем корзину, чтобы обновить состояние кнопки
        });
    });
    

    // Обработка события очистки корзины
    eventEmitter.on('cart:clear', () => {
        appData.clearCart();
    });
});
