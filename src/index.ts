import './scss/styles.scss';

import { AppData } from './components/AppData';
import { Cart } from './components/Cart';
import { Form } from './components/Form';
import { Order, User, Delivery } from './components/Order';
import { Page } from './components/Page';
import { Product, OpenedProduct, ProductInCart } from './components/Product';
import { Success } from './components/Success';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/Modal';
import { ApiListResponse } from './types';

// ApiResponse

const catalogOfProductsTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const ProductCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const userTemplate = ensureElement<HTMLTemplateElement>('#contacts')

const api = new WebLarekApi(CDN_URL, API_URL);
const event = new EventEmitter();

const appData = new AppData({}, event);

const page = new Page(document.body, event);
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, 'modal', event);
const cart = new Cart(cloneTemplate(cartTemplate), 'basket', event);
const delivery = new Delivery(cloneTemplate(deliveryTemplate), 'order', event);
const user = new User(cloneTemplate(userTemplate), 'contacts', event);


api.getAllProducts()
    .then((res) => {
        appData.setCatalog(res);
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });