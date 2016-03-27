import { Observable } from 'rx';
const { div } = require('@cycle/dom');
const style = require('react-toolbox/lib/radio/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
//import Ripple from '../ripple';
import { CycleDomComponent } from '../helpers/cycleDomInterfaces';

// TODO: check these props
export interface RadioProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
};

export function Radio(sources: any, props?: RadioProps): CycleDomComponent {
  //TODO: make defaults or use parents?
  const props$: Observable<RadioProps> = defaultProps(props, {
    checked: false,
    className: '',
    disabled: false,
  });

  // Enforce isolation for now, otherwise Inputs all show the same data
  return isolate(makeRadio)(sources, props$);
}

function makeRadio(sources: any, props$: Observable<RadioProps>): CycleDomComponent {
  //const vtree$ = Observable.combineLatest(props$, value$, (props, value) => {
  const vtree$ = props$.map( (props) => {

    const className = style[props.checked ? 'radio-checked' : 'radio'];

    //TODO: make an equivalent of data-react-toolbox='radio' for div?
    return (
      div( { className } )
    );
  });

  return {
    DOM: vtree$,
  };
};

//export default Radio;

// export default Ripple({
//   className: style.ripple,
//   spread: 2.6,
//   centered: true
// })(Radio);
// export {Radio as RawRadio};
