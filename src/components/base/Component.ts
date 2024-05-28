export class Component<T> {
    protected container: HTMLElement;
    protected data: T | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(data: T, ...args: any[]) {
        this.data = data;
        this.container.innerHTML = '';
    }

    toggleVisibility() {
        this.container.classList.toggle('hidden');
    }

    protected emit(eventName: string, data?: any): void {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        this.container.dispatchEvent(event);
    }
}