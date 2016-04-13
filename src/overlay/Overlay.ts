import { Observable as $ } from 'rx';
const { div } = require('cycle-snabbdom');
import * as classNames from 'classnames';
const style = require('react-toolbox/lib/overlay/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';
const { concat } = require('lodash');

export interface OverlayProps extends CycleUiComponentProps {
  active?: boolean;
  invisible?: boolean;
}

export const OverlayDefaultProps: OverlayProps = {
  isolate: false,
  className: '',
  //TODO: check active false is okay
  active: false,
  invisible: false,
};

export function Overlay(props?: OverlayProps, children?: any[]): CycleDomComponent;
export function Overlay(children?: any[]): CycleDomComponent;

export function Overlay(propsOrChildren: any, children?: any) {
  return componentFactory<OverlayProps>(OverlayFactory, OverlayDefaultProps,
    undefined, propsOrChildren, children);
}

export function OverlayFactory(props$: $<OverlayProps>,
    children?: any[]): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.root, {
      [style.active]: props.active,
      [style.invisible]: props.invisible
    }, props.className);

    return div( { props: { className } }, [
      div( { props: { className: style.overlay } },
        children
      )
    ]);
  });

  return {
    DOM: vtree$,
  };
}
