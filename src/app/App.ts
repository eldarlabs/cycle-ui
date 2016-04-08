import { Observable } from 'rx';
const { div } = require('cycle-snabbdom');
import * as classNames from 'classnames';
const style = require('react-toolbox/lib/app/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';

export interface AppProps extends CycleUiComponentProps {
}

export const AppDefaultProps = {
  isolate: false,
  className: ''
};

export function App(props?: AppProps, children?: any[]): CycleDomComponent;
export function App(children?: any[]): CycleDomComponent;

export function App(propsOrChildren: any, children?: any) {
  return componentFactory<AppProps>(AppFactory, AppDefaultProps, undefined, propsOrChildren,
    children);
}

export function AppFactory(props$: Observable<AppProps>, children?: any[]): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.root, props.className);

    return div( { props: { className } },
      children);
  });

  return {
    DOM: vtree$,
  };
}
