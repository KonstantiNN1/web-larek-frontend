import { IOrderRequest } from '../types/types';

export class Form {
    private order: IOrderRequest;

    constructor() {
        this.order = {
            payment: undefined,
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        };
    }

    setField(field: keyof IOrderRequest, value: string | number | string[]) {
        (this.order as any)[field] = value;
    }

    getField(field: keyof IOrderRequest): string | number | string[] | undefined {
        return this.order[field];
    }

    validate(): boolean {
        const { email, phone, address, payment, total, items } = this.order;
        if (!email || !phone || !address || !payment || !total || !items || items.length === 0) {
            console.log('Validation failed:', { email, phone, address, payment, total, items });
            return false;
        }
        return true;
    }

    getOrderData(): IOrderRequest {
        return this.order;
    }
}

