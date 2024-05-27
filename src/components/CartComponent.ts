import { Component } from './base/Component';
import { EventEmitter } from './base/events';
import { IProduct } from '../types/types';

export class CartComponent extends Component<IProduct[]> {
    private eventEmitter: EventEmitter;
    private basketCounterElement: HTMLElement | null;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
        this.basketCounterElement = document.querySelector('.header__basket-counter');
    }

    render(cart: IProduct[]) {
        super.render(cart);

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => {
            this.toggle(false);
        });

        const modalContent = document.createElement('div');
        modalContent.className = 'modal__content';

        const titleElement = document.createElement('h2');
        titleElement.className = 'modal__title';
        titleElement.textContent = 'Корзина';
        modalContent.appendChild(titleElement);

        const productList = document.createElement('ul');
        productList.className = 'basket__list';

        cart.forEach((product, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'basket__item card card_compact';

            const indexElement = document.createElement('span');
            indexElement.className = 'basket__item-index';
            indexElement.textContent = (index + 1).toString();

            const titleElement = document.createElement('span');
            titleElement.className = 'card__title';
            titleElement.textContent = product.title;

            const priceElement = document.createElement('span');
            priceElement.className = 'card__price';
            priceElement.textContent = `${product.price} синапсов`;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'basket__item-delete';
            deleteButton.setAttribute('aria-label', 'удалить');
            deleteButton.addEventListener('click', () => {
                this.eventEmitter.emit('cart:remove', product.id);
            });

            listItem.appendChild(indexElement);
            listItem.appendChild(titleElement);
            listItem.appendChild(priceElement);
            listItem.appendChild(deleteButton);

            productList.appendChild(listItem);
        });

        modalContent.appendChild(productList);

        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'modal__actions';

        const totalPriceElement = document.createElement('span');
        totalPriceElement.className = 'basket__price';
        totalPriceElement.textContent = `${cart.reduce((sum, product) => sum + product.price, 0)} синапсов`;

        const checkoutButton = document.createElement('button');
        checkoutButton.className = 'button basket__button';
        checkoutButton.textContent = 'Оформить';
        checkoutButton.disabled = cart.length === 0; // Блокируем кнопку, если корзина пустая
        checkoutButton.addEventListener('click', () => {
            this.eventEmitter.emit('order:checkout');
        });

        actionsContainer.appendChild(checkoutButton);
        actionsContainer.appendChild(totalPriceElement);

        modalContent.appendChild(actionsContainer);
        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(modalContent);

        this.container.appendChild(modalContainer);
        this.updateBasketCounter(cart.length);
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }

    updateBasketCounter(count: number) {
        if (this.basketCounterElement) {
            this.basketCounterElement.textContent = count.toString();
        }
    }
}