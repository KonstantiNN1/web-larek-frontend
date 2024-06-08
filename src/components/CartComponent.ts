import { Component } from './base/Component';
import { EventEmitter } from './base/Stneve';
import { IProduct } from '../types/types';

export class CartComponent extends Component<IProduct[]> {
    private eventEmitter: EventEmitter;
    private basketCounterElement: HTMLElement | null;

    constructor(container: HTMLElement, eventEmitter: EventEmitter) {
        super(container);
        this.eventEmitter = eventEmitter;
        this.basketCounterElement = document.querySelector('.header__basket-counter');
    }

    render(cart: IProduct[]): HTMLElement {
        super.render();

        const template = document.getElementById('basket') as HTMLTemplateElement;
        if (!template) {
            throw new Error('Template with id "basket" not found.');
        }

        const basketElement = document.importNode(template.content, true);

        const closeButton = document.createElement('button');
        closeButton.className = 'modal__close';
        closeButton.setAttribute('aria-label', 'закрыть');
        closeButton.addEventListener('click', () => {
            this.toggle(false);
        });

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal__container';
        modalContainer.appendChild(closeButton);
        modalContainer.appendChild(basketElement);

        const productList = modalContainer.querySelector('.basket__list') as HTMLUListElement;
        const checkoutButton = modalContainer.querySelector('.basket__button') as HTMLButtonElement;
        const totalPriceElement = modalContainer.querySelector('.basket__price') as HTMLSpanElement;

        if (cart.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.className = 'basket__empty-message';
            emptyMessage.textContent = 'Ваша корзина пуста';
            productList.appendChild(emptyMessage);
        } else {
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
        }

        const totalPrice = cart.reduce((sum, product) => sum + (product.price || 0), 0);
        totalPriceElement.textContent = `${totalPrice} синапсов`;
        checkoutButton.disabled = cart.length === 0 || totalPrice === 0; // Блокируем кнопку, если корзина пустая или сумма заказа равна 0
        checkoutButton.addEventListener('click', () => {
            this.eventEmitter.emit('order:checkout');
        });

        this.container.innerHTML = '';
        this.container.appendChild(modalContainer);
        this.updateBasketCounter(cart.length);

        return this.container;
    }

    updateBasketCounter(count: number) {
        if (this.basketCounterElement) {
            this.basketCounterElement.textContent = count.toString();
        }
    }

    toggle(show: boolean) {
        if (show) {
            this.container.classList.add('modal_active');
        } else {
            this.container.classList.remove('modal_active');
        }
    }
}