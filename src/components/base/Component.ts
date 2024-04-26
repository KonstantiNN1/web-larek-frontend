export abstract class Component<T> {
    constructor(protected container: HTMLElement) {}
    
    toggleClass(element: HTMLElement, nameClass: string): void {
        element.classList.toggle(nameClass);
    }

    setTextContent(element: HTMLElement, value: string): void {
        element.textContent = String(value);
    }

    setActivation(element: HTMLElement, value: boolean): void {
        if (value === true) {
            element.setAttribute('disabled', '');
        } else {
            element.removeAttribute('disabled');
        }
    }

    setImage(element: HTMLImageElement, src: string, alt: string): void {
        element.src = src;
        if (alt) {
            element.alt = alt;
        }
    }

    toggleVisibility(element: HTMLElement): void {
        if (element.style.visibility === 'display') {
            element.style.removeProperty('display');
        } else {
            element.style['visibility'] = 'display';
        }
    }

    // проверить на data
    getElement(element: HTMLElement): HTMLElement {
        Object.assign(this as object, element);
        return this.container;
    }
}