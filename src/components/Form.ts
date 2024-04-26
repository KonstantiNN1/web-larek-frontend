import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { IFormState } from "../types";

export class Form<N> extends Component<IFormState> {
    protected submit: HTMLButtonElement;
    protected error: HTMLElement;

    constructor(container: HTMLElement, protected event: IEvents) {
        super(container);
        this.submit = this.container.querySelector('.order__button');
        this.error = this.container.querySelector('.form__errors');

        // проверить нижние два вызова и onInputChange
        
        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof N;
            const value = target.value;
            this.onInputChange(field, value);
          });
      

        this.container.addEventListener('submit', (evt: Event) => {
            evt.preventDefault();
            this.event.emit(`${this.container.title}:submit`);
          });
        }
      

    setSubmit(value: boolean) {
        this.submit.disabled = !value;
    }

    // исправить ошибку

    // setError(value: string) {
    //     this.setTextContent.(this.error, value)
    // }

    protected onInputChange(field: keyof N, value: string) {
        this.event.emit('orderInput:change', {
          field,
          value,
        })
      }
    
}

