import { Observable } from 'rx';
const { div, input, label, span } = require('@cycle/dom');
import * as classNames from 'classnames';
import { RadioButton, RadioButtonProps } from './RadioButton';
const style = require('react-toolbox/lib/radio/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');

// TODO: check these props
export interface RadioGroupProps {
  className?: string;
  disabled?: boolean;
  name?: string;
  value?: any;
};

export function RadioGroup(sources, props, childrenProps: Array<RadioButtonProps>) {
  //console.log(childrenProps);
  const props$: Observable<RadioGroupProps> = defaultProps(props, {
    className: '',
    disabled: false,
  });

  // Enforce isolation for now, otherwise Inputs all show the same data
  return isolate(makeRadioGroup)(sources, props$, childrenProps);
}

function makeRadioGroup(sources: any, props$: Observable<RadioGroupProps>, childrenProps: Array<RadioButtonProps>) {
  const childrenDOMs = [];
  const childrenValues: Observable<any>[] = [];
  for (let childProps of childrenProps) {
    //console.log('child' + childProps);
    let childRadio = RadioButton(sources, childProps);
    childrenValues.push(childRadio.value$);
    childrenDOMs.push(childRadio.DOM);
  }

  const itemMouseClick$ = Observable.just('RadioFirst');
  const vtree$ = props$.map( (props) => {

    const $radioGroupSelectedValue = Observable.combineLatest(childrenValues, (...values) => {
      return { itemMouseClick$ };
    }).startWith(props.value)
      .do(x => console.log('radioGroupSelectedValue ' + x));

    const className = classNames('radioGroup', props.className);
    //return div(props.className);
    return div( { className },
      [childrenDOMs]);
  });

  return {
    DOM: vtree$,
  };

}
