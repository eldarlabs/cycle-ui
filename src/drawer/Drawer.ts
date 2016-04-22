import { Observable as $, Subject } from 'rx';
const { h, aside } = require('cycle-snabbdom');
const dialogPolyfill = require('dialog-polyfill/dialog-polyfill.js');
import * as classNames from 'classnames';
const style = require('./style');
//const style = require('react-toolbox/lib/drawer/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';

export interface DrawerProps extends CycleUiComponentProps {
  active?: boolean;
  // TODO Enum? oneOf(['left', 'right'])
  type?: string;
}

export const DrawerDefaultProps: DrawerProps = {
  isolate: true,
  className: '',
  active: false,
  type: 'left',
};

export function Drawer(sources: any, props?: DrawerProps, children?: CycleComponent[]):
    CycleDomComponent;
export function Drawer(sources: any, children?: CycleComponent[]): CycleDomComponent;

export function Drawer(sources: any, propsOrChildren: any, children?: any) {
  return componentFactory<DrawerProps>(DrawerFactory, DrawerDefaultProps,
    sources, propsOrChildren, children);
}

export function DrawerFactory(sources: any, props$: $<DrawerProps>,
    children?: CycleComponent[]): CycleDomComponent {

  let closeEvent$: any = new Subject();

  let className: string;
  props$.map( (props) => {
    className = classNames([ style.root, style[props.type] ], {
      [style.active]: props.active
    }, props.className);
  });

  // const drawerClose$ = sources.DOM.select(`.${className}`).events('close').
  //   startWith(false).
  //   map((x: any) => false).
  //   do((x: any) => console.log('mydrawerClose$: ' + x));
  //
  // const drawerCancel$ = sources.DOM.select('.drawer').events('cancel').map(() => false).
  //   startWith(false).
  //   do((x: any) => console.log('drawerCancel: ' + x));

  //const vtree$ = $.combineLatest(props$, drawerClose$, (props, drawerClose) => {
  const vtree$ = props$.map( (props) => {
    console.log('DOM');
    const className = classNames([ style.root, style[props.type] ], {
      [style.active]: props.active
    }, props.className);

    // const isOpen$ = $.merge(
    //   props.active,
    //   sources.DOM.select(`.${className}`).events('close').map(() => false),
    // ).startWith(false)

    const insert = (vnode: any) => {
      console.log('insert hook');
      const dialog: any = document.querySelector('dialog');
      dialogPolyfill.registerDialog(dialog);
      if (props.active) {
        console.log('showing modal');
        dialog.showModal();
        dialog.oncancel = (event: any) => {
          console.log('cancel');
        };

        dialog.addEventListener('close', (event: any) => {
          console.log('theonclose');
          closeEvent$.onNext(false);
        });

        // closeEvent$ = (<any>$).fromEvent(dialog, 'close').
        //   startWith(false);
        dialog.onclick = (event: any) => {
          const rect = dialog.getBoundingClientRect();
          const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
          if (!isInDialog) {
              console.log('clicked outside dialog and about to close');
              dialog.close();
          }
        };
        // const backdrop: any = document.querySelector('.backdrop');
        // console.log(backdrop);
        // if (backdrop != null) {
        //   console.log('adding backdrop listener');
        //   backdrop.onclick = () => {
        //     console.log('click on backdrop');
        //     dialog.close();
        //   };
        // }
      } else {
        const overlay: any = document.querySelector('._dialog_overlay');
        if (overlay != null) {
          console.log('removing dialog overlay');
          overlay.parentNode.removeChild(overlay);
        }
      }
    };

    return (
//      Overlay( { active: props.active }, [
        // TODO only render when required: props.active &&, but errors if nothing is returned
        h('dialog', {hook: {insert}, props: { className },
            attrs: { 'data-cycle-ui': 'drawer' } }, [
          aside( { props: { className: style.content } },
            children
          ),
        ])
//      ]).DOM
    );
  });

  return {
    DOM: vtree$,
    closeEvent$
  };
}
