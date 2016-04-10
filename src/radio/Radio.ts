import { Observable } from 'rx';
import * as classNames from 'classnames';
const { div } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/radio/style');
//import Ripple from '../ripple';
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';

// TODO: check these props
export interface RadioProps extends CycleUiComponentProps {
  checked?: boolean;
  disabled?: boolean;
};

//TODO: make defaults or use parents?
const RadioDefaultProps = {
  // Enforce isolation for now
  isolate: true,
  checked: false,
  className: '',
  disabled: false,
};

export function Radio(sources: any, props?: RadioProps): CycleDomComponent {
  return componentFactory<RadioProps>(RadioFactory, RadioDefaultProps, sources,
    props);
}

function RadioFactory(sources: any, props$: Observable<RadioProps>): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style[props.checked ? 'radio-checked' : 'radio'], props.className);

    return (
      div( { props: { className }, attrs: { 'data-cycle-ui': 'radio' } } )
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
