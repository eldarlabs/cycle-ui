import { Observable } from 'rx';
const { h, span } = require('@cycle/dom');
const style = require('react-toolbox/lib/button/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
//import FontIcon from '../font_icon';
//import Ripple from '../ripple';
import { CycleDomComponent } from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';

// TODO: check these props
export interface ButtonProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  accent?: boolean;
  //children: React.PropTypes.node,
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

export function Button(sources, props?, children?): CycleDomComponent {
  const props$: Observable<ButtonProps> = defaultProps(props, {
    accent: false,
    className: '',
    flat: false,
    floating: false,
    mini: false,
    neutral: true,
    primary: false,
    raised: false
  });

  // Enforce isolation for now, otherwise Buttons may interact
  return isolate(makeButton)(sources, props$, children);
}

function makeButton(sources: any, props$: Observable<ButtonProps>, children): CycleDomComponent {
  //const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {
  const vtree$ = props$.map( (props) => {

    const element = props.href ? 'a' : 'button';
    const level = props.primary ? 'primary' : props.accent ? 'accent' : 'neutral';
    const shape = props.flat ? 'flat' : props.raised ? 'raised' : props.floating ? 'floating' : 'flat';

    const className = classNames([style[shape]], {
      [style[level]]: props.neutral,
      [style.mini]: props.mini,
      [style.inverse]: props.inverse
    }, props.className);

    //TODO: make an equivalent of data-react-toolbox='radio' for div?
    return (
      h(element, {
        className,
        //icon ? <FontIcon className={style.icon} value={icon}/> : null,
        //label: props.label
      }, [
        props.label ?
          span([props.label]) : null,
        , [children]
      ])
    );
  });

  return {
    DOM: vtree$,
  };
};
