import { Observable } from 'rx';
import { span, input, label } from '@cycle/dom';
import classNames from 'classnames';
import { Radio } from './Radio';
import Input from '../Input';
//import style from './style';
import style from 'react-toolbox/lib/radio/style';
import { defaults } from 'lodash';

export function RadioButton(sources, props) {

  defaults(props, {
    checked: false,
    className: '',
    disabled: false,
  });

  //TODO: helper: default to isolate function, but allow function override

  //TODO: make a helper to check if an observable is already passed
  const props$ = Observable.just(props);
  const { DOM } = sources;

  const value$ = Observable.just(1);
  const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {

    const className = classNames(style[props.disabled ? 'disabled' : 'field'], props.className);

    //TODO: split input into a new function
    //TODO: make an equivalent of data-react-toolbox='radio-button' for div?
    return label({ className: className,}, [
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
      //Input(sources, {
        checked: props.checked,
        disabled: props.disabled,
      }).DOM,
      props.label ? label([
        span({
          className: style.text
        }, [
          props.label
        ]),
      ]): null,
    ])
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
