import { Observable } from 'rx';
//import { span, input, label } from '@cycle/dom';
const { input, label, span } = require('@cycle/dom');
import * as classNames from 'classnames';
import { Radio } from './Radio';
//import style from './style';
//import style from 'react-toolbox/lib/radio/style';
const style = require('react-toolbox/lib/radio/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');

// TODO: check these props
export interface RadioButtonProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
};

export function RadioButton(sources, props) {
  const props$: Observable<RadioButtonProps> = defaultProps(props, {
    checked: false,
    className: '',
    disabled: false,
  });

  // Enforce isolation for now, otherwise Inputs all show the same data
  return isolate(makeRadioButton)(sources, props$);
}

function makeRadioButton(sources: any, props$: Observable<RadioButtonProps>) {
  const value$ = Observable.just(1);
  const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {

    const className = classNames(style[props.disabled ? 'disabled' : 'field'], props.className);

    //TODO: split input into a new function
    //TODO: make an equivalent of data-react-toolbox='radio-button' for div?
    return label({ className: className }, [
      input({
        className: style.input,
        readonly: props.readonly,
        //TODO: which version?
        // attributes: {
        //   readonly: props.readonly,
        // },
        ref: 'input',
        type: 'radio'
      }),
      Radio(sources, {
        checked: props.checked,
        disabled: props.disabled,
      }).DOM,
      props.label ? label([
        span({
          className: style.text
        }, [
          props.label
        ]),
      ]) : null,
    ]);
  });

  return {
    DOM: vtree$,
//    value$,
  };

}

// class RadioButton extends React.Component {
//   static propTypes = {
//     checked: React.PropTypes.bool,
//     className: React.PropTypes.string,
//     disabled: React.PropTypes.bool,
//     label: React.PropTypes.string,
//     name: React.PropTypes.string,
//     onBlur: React.PropTypes.func,
//     onChange: React.PropTypes.func,
//     onFocus: React.PropTypes.func,
//     value: React.PropTypes.any
//   };
//
//   static defaultProps = {
//     checked: false,
//     className: '',
//     disabled: false
//   };

  //
  // handleClick = (event) => {
  //   const {checked, disabled, onChange} = this.props;
  //   if (event.pageX !== 0 && event.pageY !== 0) this.blur();
  //   if (!disabled && !checked && onChange) onChange(event, this);
  // };
  //
  // blur () {
  //   this.refs.input.blur();
  // }
  //
  // focus () {
  //   this.refs.input.focus();
  // }
  //

//export default RadioButton;
