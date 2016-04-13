import { Observable as $ } from 'rx';
const { div, h6, nav, section, p } = require('cycle-snabbdom');
import * as classNames from 'classnames';
const style = require('react-toolbox/lib/dialog/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';
import { Overlay } from '../overlay';
import { Button } from '../button';

export interface DialogProps extends CycleUiComponentProps {
  active?: boolean;
  invisible?: boolean;
  actions?: any[];
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

export function Dialog(props?: DialogProps, children?: any[]): CycleDomComponent;
export function Dialog(children?: any[]): CycleDomComponent;

export function Dialog(propsOrChildren: any, children?: any) {
  return componentFactory<DialogProps>(DialogFactory, DialogDefaultProps,
    undefined, propsOrChildren, children);
}

export function DialogFactory(props$: $<DialogProps>,
    children?: any[]): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const actions: any[] = props.actions;
    // props.actions.map((action, idx) => {
    //   const className = ClassNames(style.button, {[action.className]: action.className});
    //   return Button key={idx} {...action} className={className} />;
    // });

    const className = classNames([ style.root, style[props.type] ], {
      [style.active]: props.active
    }, props.className);

    return (
      Overlay( { active: props.active }, [
        div( { props: { className }, attrs: { 'data-cycle-ui': 'dialog' } }, [
          section( { props: { role: 'body', className: style.body } }, [
            props.title && h6( { props: { className: style.title } }, props.title),
            //children
            p('hi')
          ]),
          nav( { props: { role: 'navigation', className: style.navigation } },
            actions
          )
        ])
      ]).DOM
    );
  });

  return {
    DOM: vtree$,
  };
}
