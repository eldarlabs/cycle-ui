import { Observable } from 'rx';

export interface DOMDriverFunction {
  (vtree$: Observable<any>): any;
}

export function makeDOMDriver(container: string | Element, customElements?: any): DOMDriverFunction;
