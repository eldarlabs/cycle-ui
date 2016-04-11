import { Observable } from 'rx';
const { h, div, span, label } = require('cycle-snabbdom');
import * as classNames from 'classnames';
// import FontIcon from '../font_icon';
const style = require('react-toolbox/lib/input/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';

export interface InputProps extends CycleUiComponentProps {
  label?: string;
  floating?: boolean;
  values?: any;
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

const InputDefaultProps: InputProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
  disabled: false,
  floating: true,
  multiline: false,
  required: false,
  type: 'text',
};

export function Input(sources: any, props?: InputProps): CycleDomComponent {
  return componentFactory<InputProps>(InputFactory, InputDefaultProps, sources,
    props);
}

export function InputFactory(sources: any, props$: Observable<InputProps>): CycleDomComponent {
  const { DOM } = sources;

  //TODO: make a helper
  const value$ = props$.flatMap((props) => {
    let newValues$: Observable<any> = null;
    if (props.values === undefined) {
      // TODO: use input or some other event. react-toolbox seems to use change
      // but that does not update the count for max length as you type
      // TODO: use a better selector
      newValues$ = DOM.select('input').events('input').
        map( (ev: Event) => (<HTMLInputElement>ev.target).value);
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
    return (
      div( { props: { className: divClassName }, attrs: { 'data-cycle-ui': 'input' } }, [
        h(props.multiline ? 'textarea' : 'input', {
          props: {
            className,
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
          },
          attrs: {
            maxlength: props.maxLength,
            readonly: props.readonly,
          }
        }),
        // TODO: icon
        // props.icon ? <FontIcon className={style.icon} value={icon} /> : null}
        span( { props: { className: style.bar } } ),
        props.label &&
          label( { props: { className: labelClassName } },
            props.label),
        props.error &&
          span( { props: { className: style.error } } ),
        props.maxLength &&
          span( { props: { className: style.counter } },
            `${length} / ${props.maxLength}`),
      ])
    );
  });
  return {
    DOM: vtree$,
    value$,
  };
}
