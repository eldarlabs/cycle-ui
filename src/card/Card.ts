import { Observable } from 'rx';
const { div } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/card/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

export interface CardProps extends CycleUiComponentProps {
  raised?: boolean;
};

const CardDefaultProps: CardProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
  raised: false,
};

export function Card(sources: any, props?: CardProps, children?: Array<CycleComponent>):
    CycleDomComponent {
  return componentFactory<CardProps>(CardFactory, CardDefaultProps, sources,
    props, children);
}

export function CardFactory(sources: any, props$: Observable<CardProps>,
    children: Array<CycleComponent>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.card, {
      [style.raised]: props.raised
    }, props.className);

    return (
      div({
          props: { className },
          attrs: { 'data-cycle-ui': 'card' }
        },
        children
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
