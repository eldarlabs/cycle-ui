import { Observable } from 'rx';

export interface CycleDomComponent {
  DOM: Observable<Object>;
  [others: string]: any;
}