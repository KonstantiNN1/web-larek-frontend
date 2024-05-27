import { Api } from './base/api';
import { IWebLarekApi, IProduct, IOrder, IOrderResult } from '..//types/types';
import { API_URL, CDN_URL } from '../utils/constants'

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
        return this.get('/product').then((response: any) => {
            const products = response.items as IProduct[];
            return products.map(this.addimage.bind(this));
        });
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((response: any) => {
            const product = response as IProduct;
            return this.addimage(product);
        });
    }

    postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((response: any) => response as IOrderResult);
    }
}