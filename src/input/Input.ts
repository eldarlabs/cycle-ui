import { Observable } from 'rx';
const { h, div, span, label } = require('@cycle/dom');

import * as classNames from 'classnames';
// import FontIcon from '../font_icon';
const style = require('react-toolbox/lib/input/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');

export interface InputProps {
  label?: string;
  floating?: boolean;
  values?: any;
  className?: string;
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
  maxLength?: number;
  multiline?: boolean;
  required?: boolean;
  type?: string;
  initial?: any;
  icon?: any;
  readonly?: boolean;
  autocapitalize?: boolean;
  autocomplete?: boolean;
  autocorrect?: boolean;
  autofocus?: boolean;
  list?: any;
  max?: number;
  min?: number;
  name?: string;
  pattern?: string;
  placeholder?: string;
  size?: number;
  step?: number;
}

//   blur () {
//     this.refs.input.blur();
//   }

//   focus () {
//     this.refs.input.focus();
//   }

export function Input(sources: Object, props: InputProps): any {

  const props$: Observable<InputProps> = defaultProps(props, {
    className: '',
    disabled: false,
    floating: true,
    multiline: false,
    required: false,
    type: 'text'
  });

  // Enforce isolation for now, otherwise Inputs all show the same data
  return isolate(makeImport)(sources, props$);
}

function makeImport(sources: any, props$: Observable<InputProps>) {
  const { DOM } = sources;

  //TODO: make a helper
  const value$ = props$.flatMap((props) => {
    let newValues$ = null;
    if (props.values === undefined) {
      // TODO: use input or some other event. react-toolbox seems to use change
      // but that does not update the count for max length as you type
      // TODO: use a better selector
      newValues$ = DOM.select('input').events('input').map(ev => ev.target.value);
    } else {
      newValues$ = props.values;
    }
    const initialValue$ = Observable.just(props.initial);
    return initialValue$.concat(newValues$);
  });

  const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {
    const className = classNames(style.input, {[style.filled]: value});

    const labelClassName = classNames(style.label, {[style.fixed]: !props.floating});

    const length = props.maxLength && value ? value.length : 0;

    const divClassName = classNames(style.root, {
      [style.disabled]: props.disabled,
      [style.errored]: props.error,
      [style.hidden]: props.type === 'hidden',
      [style.withIcon]: props.icon
    }, props.className);

    // TODO: split input into a new function
    // TODO: make an equivalent of data-react-toolbox='input' for div?
    return div({
      className: divClassName,
      }, [
      h(props.multiline ? 'textarea' : 'input', {
        className,
        attributes: {
          maxlength: props.maxLength,
          readonly: props.readonly,
        },
        ref: 'input',
        role: 'input',
        autocapitalize: props.autocapitalize,
        autocomplete: props.autocomplete,
        autocorrect: props.autocorrect,
        autofocus: props.autofocus,
        value,
        disabled: props.disabled,
        invalid: props.invalid,
        list: props.list,
        max: props.max,
        min: props.min,
        name: props.name,
        pattern: props.pattern,
        placeholder: props.placeholder,
        required: props.required,
        size: props.size,
        step: props.step,
        type: props.type,
      }),
      // TODO: icon
      // props.icon ? <FontIcon className={style.icon} value={icon} /> : null}
      span({className: style.bar}),
      props.label ?
        label({
          className: labelClassName
        }, props.label) : null,
      props.error ? span({ className: style.error }) : null,
      props.maxLength ? span({ className: style.counter }, `${length} / ${props.maxLength}`) : null,
    ]);
  });

  return {
    DOM: vtree$,
    value$,
  };
}
