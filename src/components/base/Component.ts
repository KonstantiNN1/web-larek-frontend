export class Component<T> {
    protected container: HTMLElement;
    protected data: T | null = null;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    render(data: T, ...args: any[]) {
        this.data = data;
        this.container.innerHTML = ''; // Очистка контейнера перед рендерингом
    }

    toggleVisibility() {
        this.container.classList.toggle('hidden');
    }

    open() {
        this.container.classList.remove('hidden');
    }

    close() {
        this.container.classList.add('hidden');
    }

    protected emit(eventName: string, data?: any): void {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        this.container.dispatchEvent(event);
    }
}
