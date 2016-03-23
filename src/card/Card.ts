import { Observable } from 'rx';
const { div } = require('@cycle/dom');
const style = require('react-toolbox/lib/card/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
import { CycleDomComponent } from '../helpers/cycleDomComponent';
import * as classNames from 'classnames';

export interface CardProps {
  className?: string;
  raised?: boolean;
};

export function Card(sources, props?, children?): CycleDomComponent {
  const props$: Observable<CardProps> = defaultProps(props, {
    className: '',
    raised: false
  });

  // TODO: isolation?
  return isolate(makeCard)(sources, props$, children);
}

function makeCard(sources: any, props$: Observable<CardProps>, children): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.card, {
      [style.raised]: props.raised
    }, props.className);

    return (
      div({
        //TODO: Not sure why this only works if I define class twice!
        className,
        attributes: {
          'class': className,
          'data-cycle-ui': 'card',
        }
      }
      ,
      [children]
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
