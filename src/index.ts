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
import { EventEmitter } from './components/base/Events';
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

    const contactsContainer = document.createElement('div');
    contactsContainer.className = 'modal hidden';
    document.body.appendChild(contactsContainer);
    const contactFormComponent = new ContactFormComponent(contactsContainer, eventEmitter, form);

    const successModalContainer = document.createElement('div');
    successModalContainer.className = 'modal hidden';
    document.body.appendChild(successModalContainer);
    const successComponent = new SuccessComponent(successModalContainer, eventEmitter);

    const productPopupContainer = document.createElement('div');
    productPopupContainer.className = 'modal hidden';
    document.body.appendChild(productPopupContainer);
    const productPopupComponent = new ProductPopupComponent(productPopupContainer, eventEmitter);

    const orderComponent = new OrderComponent(orderModalContainer, eventEmitter, form);

    // Обработчики событий для обновления UI
    eventEmitter.on('products:updated', (data: { products: IProduct[] }) => {
        page.setProducts(data.products);
        cartComponent.render([])

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
        console.log('Форма загружена и содержит:', data);
        form.setField('email', data.email);
        form.setField('phone', data.phone);

        if (form.validate()) {
            const orderData = form.getOrderData() as IOrderRequest;
            console.log('Данные для отправки:', orderData);
            // Отправка данных на сервер
            api.postOrder(orderData).then((result: IOrderResult) => {
                if (result.id && result.total) {
                    console.log('Успешно');
                    successComponent.render(result.total);
                    successComponent.toggle(true);
                    cartComponent.toggle(false);
                    contactFormComponent.toggle(false);
                    productPopupComponent.toggle(false);
                } else {
                    console.log('Ошибка:', result);
                }
            }).catch((error) => {
                console.error('Ошибка загрузки:', error);
            });
        } else {
            console.log('Ошибка валидации');
        }
    });

    // Загрузка продуктов при старте
    appData.fetchProducts();

    // Привязка обработчиков событий к элементам страницы
    document.querySelector('.header__basket')?.addEventListener('click', () => {
        cartComponent.toggle(true);
    });

    // Обработка события закрытия модальных окон при клике на overlay
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal')) {
            toggleAllModals(false);
        }
    });

    // Обработка события закрытия модальных окон при нажатии на клавишу Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            toggleAllModals(false);
        }
    });

    // Обработка события добавления товара в корзину
    eventEmitter.on('cart:add', (product: IProduct) => {
        appData.addToBasket(product);
        product.selected = true; // Обновляем состояние продукта
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
        const items = appData.basket.map(product => product.id.toString());
        form.setField('total', total);
        form.setField('items', items);
        orderComponent.render();
        orderComponent.toggle(true);
        cartComponent.toggle(false);
    });

    // Обработка события очистки корзины
    eventEmitter.on('cart:clear', () => {
        appData.clearBasket();
        updateBasketCounter(0);
    });

    // Обработка события открытия формы контактов
    eventEmitter.on('order:contactForm', () => {
        orderComponent.toggle(false);
        contactFormComponent.render();
        contactFormComponent.toggle(true);
    });

    function updateBasketCounter(count: number) {
        const basketCounter = document.querySelector('.header__basket-counter');
        if (basketCounter) {
            basketCounter.textContent = count.toString();
        }
    }

    function toggleAllModals(show: boolean) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (show) {
                modal.classList.add('modal_active');
            } else {
                modal.classList.remove('modal_active');
            }
        });

        if (!show) {
            eventEmitter.emit('cart:clear');
        }
    }
});