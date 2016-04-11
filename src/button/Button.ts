import { Observable } from 'rx';
const { h, span } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/button/style');
//import FontIcon from '../font_icon';
//import Ripple from '../ripple';
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

// TODO: check these props
export interface ButtonProps extends CycleUiComponentProps {
  checked?: boolean;
  disabled?: boolean;
  accent?: boolean;
  flat?: boolean;
  floating?: boolean;
  href?: string;
  icon?: any;
  inverse?: boolean;
  label?: string;
  mini?: boolean;
  neutral?: boolean;
  primary?: boolean;
  raised?: boolean;
  type?: string;
};

const ButtonDefaultProps: ButtonProps = {
  // Enforce isolation for now, otherwise Buttons may interact
  isolate: true,
  accent: false,
  className: '',
  flat: false,
  floating: false,
  mini: false,
  neutral: true,
  primary: false,
  raised: false
};

export function Button(sources: any, props?: ButtonProps, children?: Array<CycleComponent>):
    CycleDomComponent {
  return componentFactory<ButtonProps>(ButtonFactory, ButtonDefaultProps, sources,
    props, children);
}

export function ButtonFactory(sources: any, props$: Observable<ButtonProps>,
    children: Array<CycleComponent>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const element = props.href ? 'a' : 'button';
    const level = props.primary ? 'primary' : props.accent ? 'accent' : 'neutral';
    const shape = props.flat ? 'flat' : props.raised ? 'raised' : props.floating ?
      'floating' : 'flat';

    const className = classNames([style[shape]], {
      [style[level]]: props.neutral,
      [style.mini]: props.mini,
      [style.inverse]: props.inverse
    }, props.className);

    return (
      h(element, { props: { className }, attrs: { 'data-cycle-ui': 'button' } }, [
        //icon ? <FontIcon className={style.icon} value={icon}/> : null,
        //label: props.label
      // ,
        props.label &&
          span(props.label),
        children
      ])
    );
  });

  return {
    DOM: vtree$,
  };
};
