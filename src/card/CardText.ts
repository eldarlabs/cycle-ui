import { Observable } from 'rx';
const { div, p } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/card/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

export interface CardTextProps extends CycleUiComponentProps {
};

const CardTextDefaultProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
};

export function CardText(sources: any, props?: CardTextProps,
    children?: string | Array<CycleComponent>): CycleDomComponent {
  return componentFactory<CardTextProps>(CardTextFactory, CardTextDefaultProps, sources,
    props, children);
}

export function CardTextFactory(sources: any, props$: Observable<CardTextProps>,
                      children: string | Array<CycleComponent>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.cardText, props.className);
    console.log(children);
    return (
      div( { props: { className } },
        typeof children === 'string' ? p(children) : children
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
