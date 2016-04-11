import { Observable } from 'rx';
const { div } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/card/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

export interface CardActionsProps extends CycleUiComponentProps {
  children?: Array<CycleComponent>;
};

const CardActionsDefaultProps: CardActionsProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
};

export function CardActions(sources: any, props?: CardActionsProps,
    children?: Array<CycleComponent>): CycleDomComponent {
  return componentFactory<CardActionsProps>(CardActionsFactory, CardActionsDefaultProps, sources,
    props, children);
}

export function CardActionsFactory(sources: any, props$: Observable<CardActionsProps>,
                         children: Array<CycleComponent>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.cardActions, props.className);

    return (
      div( { props: { className } },
        children
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
