import { API_URL} from "../utils/constants";
import { Api } from "./base/api";
import { ApiListResponse } from "../types";
import { IProduct } from "../types";
import { IOrder } from "../types";

interface IWebLarekApi {
    getProduct(id: string): Promise<IProduct>;
    getAllProducts(): Promise<IProduct[]>;
    postOrder(order: IOrder): Promise<IOrderAnswer>
}

interface IOrderAnswer {
    id: string;
    total: number
}

export class WebLarekApi extends Api<IWebLarekApi>{
    cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
		this.cdn = cdn;
    };

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image,
        }))
    };

    getAllProducts(): Promise<IProduct[]> {
        return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			})));
    };

    postOrder(order: IOrder): Promise<IOrderAnswer> {
        return this.post('/order', order).then((data: IOrderAnswer) => data);
    };
};