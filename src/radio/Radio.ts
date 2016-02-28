import { Observable } from 'rx';
//import { div } = require('@cycle/dom');
const { div } = require('@cycle/dom');
import * as classNames from 'classnames';
//import style from './style';
//import style from 'react-toolbox/lib/radio/style';
const style = require('react-toolbox/lib/radio/style');
import { defaults } from 'lodash';
//import Ripple from '../ripple';

export function Radio(sources, props) {

  //TODO: make defaults or use parents?
  defaults(props, {
    checked: false,
    className: '',
    disabled: false,
  });

  //TODO: helper: default to isolate function, but allow function override

  //TODO: make a helper to check if an observable is already passed
  const props$ = Observable.just(props);
//  const { DOM } = sources;

  const value$ = Observable.just(1);
  //const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {
  const vtree$ = props$.map( (props) => {

    const className = style[props.checked ? 'radio-checked' : 'radio'];

    //TODO: make an equivalent of data-react-toolbox='radio' for div?
    return div({
        className: className,
    });
  });

  return {
    DOM: vtree$,
//    value$,
  };
};

//export default Radio;

// export default Ripple({
//   className: style.ripple,
//   spread: 2.6,
//   centered: true
// })(Radio);
// export {Radio as RawRadio};
