import { Observable } from 'rx';
//import { h, div, span, input, label } from '@cycle/dom';
const { h, div, span, input, label } = require('@cycle/dom');

import * as classNames from 'classnames';
//import FontIcon from '../font_icon';
//import style from 'react-toolbox/lib/input/style';
const style = require('react-toolbox/lib/input/style');
import { defaults } from 'lodash';

// interface InputProps {
//   label?: string;
// }

//   static propTypes = {
//     children: React.PropTypes.any,
//     className: React.PropTypes.string,
//     disabled: React.PropTypes.bool,
//     error: React.PropTypes.string,
//     floating: React.PropTypes.bool,
//     icon: React.PropTypes.any,
//     label: React.PropTypes.string,
//     maxLength: React.PropTypes.number,
//     multiline: React.PropTypes.bool,
//     onBlur: React.PropTypes.func,
//     onChange: React.PropTypes.func,
//     onFocus: React.PropTypes.func,
//     onKeyPress: React.PropTypes.func,
//     required: React.PropTypes.bool,
//     type: React.PropTypes.string,
//     value: React.PropTypes.any
//   };

//   blur () {
//     this.refs.input.blur();
//   }

//   focus () {
//     this.refs.input.focus();
//   }

export function Input(sources, props) {

  defaults(props, {
    className: '',
    disabled: false,
    floating: true,
    multiline: false,
    required: false,
    type: 'text'
  });

  //TODO: helper: default to isolate function, but allow function override

  //TODO: make a helper to check if an observable is already passed
  const props$ = Observable.just(props);
  const { DOM } = sources;

  //TODO: make a helper
  const value$ = props$.flatMap((props) => {
    let newValues$ = null;
    if (props.values === undefined) {
      //TODO: use input or some other event. react-toolbox seems to use change
      //but that does not update the count for max length as you type
      //TODO: use a better selector
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

    //TODO: split input into a new function
    //TODO: make an equivalent of data-react-toolbox='input' for div?
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
        disabled: props.isDisabled,
        invalid: props.isInvalid,
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
      //TODO: icon
      //props.icon ? <FontIcon className={style.icon} value={icon} /> : null}
      span({className: style.bar}),
      props.label ?
        label({
          className: labelClassName
        }, props.label): null,
      props.error ? span({ className: style.error }) : null,
      props.maxLength ? span({ className: style.counter }, `${length} / ${props.maxLength}`) : null,
    ])
  });

  return {
    DOM: vtree$,
    value$,
  };
}

//export default Input;
