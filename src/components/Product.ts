import { IProduct } from "../types";
import { CategoryOfProduct } from "../types";
import { Actions } from "../types";
import { IProductInCart } from "../types";
import { Component } from "./base/Component";


export class Product extends Component<IProduct> {
    protected title: HTMLElement;
    protected category: HTMLElement;
    protected image: HTMLImageElement;
    protected button: HTMLButtonElement;
    price: HTMLElement;
    selected?: boolean;

    constructor(className: string, container: HTMLElement, action?: Actions) {
        super(container);
        this.title = container.querySelector(`.${className}_title`);
        this.category = container.querySelector(`.${className}_category`);
        this.image = container.querySelector(`.${className}_image`);
        this.price = container.querySelector(`.${className}_price`);
        this.button = container.querySelector(`.${className}_button`);

        if (action && action.onClick) {
            if (this.button) {
                this.button.addEventListener('click', action.onClick);
            } else {
                this.button.removeEventListener('click', action.onClick);
            }
        }
    };

    getId(): string {
        const value = this.container.dataset.id;
        return value || ''
    };

    setId(value: string): void {
        this.container.dataset.id = value;
    };
    
    getTitle(): string {
        const value = this.container.dataset.title;
        return value || '';
    };
    
    setTitle(value: string): void {
        this.container.dataset.title = value;
    };
    
    // решить проблему с setImage
    // setImage(value: string): void {
    //     this.container.dataset.src = value;
    // };
    
    setSelected(value: boolean): void {
        if (!this.button.disabled) {
            this.button.disabled = value;
        };
    };
    
    setPrice(value: number | null): void {
        this.price.textContent = value.toString();
    };
    
    setCategory(value: CategoryOfProduct): void {
        this.category.textContent = value;
    };
};

export class OpenedProduct extends Product {
    protected description: HTMLElement;

    constructor(className: string, container: HTMLElement, action?: Actions) {
        super(className, container, action);
        this.button = container.querySelector(`.${className}_button`);
    };
    setDescription(value: string): void {
        this.description.textContent = value;
    };
};

export class ProductInCart extends Component<IProductInCart> {
    protected index: HTMLElement;
    protected title: HTMLElement;
    protected price: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(className: string, container: HTMLElement, action?: Actions) {
        super(container);
        this.title = container.querySelector(`.${className}_title`);
        this.price = container.querySelector(`.${className}_price`);
        this.button = container.querySelector(`.${className}_button`);
        this.index = container.querySelector(`.basket__item-index`);

        if (action.onClick) {
            if (this.button) {
                this.button.addEventListener('click', action.onClick);
            } else {
                this.button.removeEventListener('click', action.onClick);
            };
        };
    }

    setIndex(value: number): void { 
        this.index.textContent = value.toString();
    };

    setTitle(value: string): void {
        this.title.textContent = value;
    };

    setPrice(value: number | null): void {
        this.price.textContent = value.toString();
    };
};