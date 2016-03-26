import { Observable } from 'rx';
const { div, p } = require('@cycle/dom');
const style = require('react-toolbox/lib/card/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
import { CycleDomComponent, CycleComponent } from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

export interface CardTextProps {
  className?: string;
  children?: string | Array<CycleComponent>;
};

export function CardText(sources, props?, children?): CycleDomComponent {
  const props$: Observable<CardTextProps> = defaultProps(props, {
    className: '',
  });

  // TODO: isolation?
  return isolate(makeCardText)(sources, props$, children);
}

function makeCardText(sources: any, props$: Observable<CardTextProps>, children): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.cardText, props.className);
    console.log(children);
    return (
      div({ className },
        typeof children === 'string' ? p([children]) : [children]
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
