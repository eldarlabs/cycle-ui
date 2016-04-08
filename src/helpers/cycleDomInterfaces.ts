import { Observable } from 'rx';

export interface CycleDomComponent {
  DOM: Observable<Object>;
  [others: string]: any;
}

// Currently not all components would conform to a CycleDomComponent, so for now
// I will provide this lose equivalent to a React Element PropType which I think
// basically means it can be anything?
//TODO: Investigate more if this can be tightened to better types
export interface CycleComponent {
}

export interface CycleUiComponentProps {
  isolate?: boolean;
  className?: string;
  style?: string;
}
