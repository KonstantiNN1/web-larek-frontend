import { Api } from './base/Api';
import { IWebLarekApi, IProduct, IOrder, IOrderResult, IOrderRequest } from '..//types/types';
import { API_URL, CDN_URL } from '../utils/constants'
import { ApiListResponse } from '..//types/types';

export class WebLarekApi extends Api<IWebLarekApi> {
    private cdn: string;

    constructor(options?: RequestInit) {
        super(API_URL, options);
        this.cdn = CDN_URL;
    }

    private addimage(product: IProduct): IProduct {
        product.image = `${this.cdn}/${product.image}`;
        return product;
    }

    getAllProducts(): Promise<IProduct[]> {
        return this.get('/product').then((response: ApiListResponse<IProduct>) => {
            const products = response.items as IProduct[];
            return products.map(this.addimage.bind(this));
        });
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((response: IProduct) => {
            const product = response as IProduct;
            return this.addimage(product);
        });
    }

    postOrder(order: IOrderRequest): Promise<IOrderResult> {
        return fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        }).then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Error response from server:', err);
                    return Promise.reject(err);
                });
            }
            return response.json();
        }).catch(error => {
            console.error('Error making request:', error);
            throw error;
        });
    }
}