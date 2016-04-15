import { Observable as $ } from 'rx';
const { div, h6, nav, section, p } = require('cycle-snabbdom');
import * as classNames from 'classnames';
const style = require('react-toolbox/lib/dialog/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import { Overlay } from '../overlay';
import { Button } from '../button';
const { concat } = require('lodash');

export interface DialogProps extends CycleUiComponentProps {
  active?: boolean;
  invisible?: boolean;
  actions?: CycleComponent[];
  title?: string;
  type?: string;
}

export const DialogDefaultProps: DialogProps = {
  isolate: false,
  className: '',
  actions: [],
  active: false,
  type: 'normal',
};

export function Dialog(props?: DialogProps, children?: CycleComponent[]): CycleDomComponent;
export function Dialog(children?: CycleComponent[]): CycleDomComponent;

export function Dialog(propsOrChildren: any, children?: any) {
  return componentFactory<DialogProps>(DialogFactory, DialogDefaultProps,
    undefined, propsOrChildren, children);
}

export function DialogFactory(props$: $<DialogProps>,
    children?: CycleComponent[]): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const actionsDOM = props.actions.map((action) => {
      //const className = ClassNames(style.button, {[action.className]: action.className});
      if (typeof action.DOM === 'undefined') {
        return action;
      }
      return action.DOM;
    });

    const className = classNames([ style.root, style[props.type] ], {
      [style.active]: props.active
    }, props.className);

    return (
      Overlay( { active: props.active }, [
        div( { props: { className }, attrs: { 'data-cycle-ui': 'dialog' } }, [
          section( { props: { role: 'body', className: style.body } }, concat([],
            props.title && h6( { props: { className: style.title } }, props.title),
            children
          )),
          nav( { props: { role: 'navigation', className: style.navigation } },
            actionsDOM
          )
        ])
      ]).DOM
    );
  });

  return {
    DOM: vtree$,
  };
}
