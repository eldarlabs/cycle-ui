import { Observable } from 'rx';
const { div } = require('@cycle/dom');
const style = require('react-toolbox/lib/card/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
import { CycleDomComponent, CycleComponent } from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

export interface CardActionsProps {
  className?: string;
  children?: Array<CycleComponent>;
};

export function CardActions(sources: any, props?: CardActionsProps, children?: Array<CycleComponent>): CycleDomComponent {
  const props$: Observable<CardActionsProps> = defaultProps(props, {
    className: '',
  });

  // TODO: isolation?
  return isolate(makeCardActions)(sources, props$, children);
}

function makeCardActions(sources: any, props$: Observable<CardActionsProps>, children: Array<CycleComponent>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.cardActions, props.className);
    console.log(children);
    return (
      div({ className } ,
        [children]
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
