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

    getField(field: keyof IOrderRequest): string | number | string[] {
        return this.order[field];
    }

    validate(): boolean {
        const { payment, email, phone, address, total, items } = this.order;
        console.log('Validating form with data:', this.order);
        return !!payment && !!email && !!phone && !!address && total > 0 && items && items.length > 0;
    }

    getOrderData(): IOrderRequest {
        return this.order;
    }
}
