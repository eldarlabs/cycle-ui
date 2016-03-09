import { Observable } from 'rx';
//import { span, input, label } from '@cycle/dom';
const { div, input, label, span } = require('@cycle/dom');
import * as classNames from 'classnames';
import { Radio } from './Radio';
//import style from './style';
//import style from 'react-toolbox/lib/radio/style';
const style = require('react-toolbox/lib/radio/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
const combineLatestObj = require('rx-combine-latest-obj');

// TODO: check these props
export interface RadioButtonProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
  value?: any;
};

export function RadioButton(sources: any, props?) {
  const props$: Observable<RadioButtonProps> = defaultProps(props, {
    checked: false,
    className: '',
    disabled: false,
  });

  // Enforce isolation for now, unless I find a better way to localize selects
  return isolate(makeRadioButton)(sources, props$);
}

function intent(DOM) {
  const radioLabelClick$ = DOM.select('span').events('click');
  const radioClick$ = DOM.select('input').events('click');
  const itemMouseClick$ = radioLabelClick$.merge(radioClick$).startWith('first')
    .do(x => console.log(x));
  return { itemMouseClick$ };
}

function model(props$: Observable<RadioButtonProps>, actions) {
  const clickedValue$ = Observable.combineLatest(actions.itemMouseClick$, props$, (click, props) => props.value)
     .do(x => console.log('clickedValue ' + x));

  const radioGroupValue$ = Observable.just('RadioHard');
  const checked$ = Observable.combineLatest(props$, clickedValue$, radioGroupValue$, (props, clickedValue, radioGroupValue) => {
    return !props.disabled && (clickedValue === radioGroupValue);
  })
  .do(x => console.log('checked ' + x));

  return combineLatestObj({clickedValue$, props$, checked$ });
}

function view(sources, state$) {
  return state$.map( ({props, checked} ) => {

    const className = classNames('radioButton', style[props.disabled ? 'disabled' : 'field'], props.className);
    const inputClassName = classNames('radioInput', style.input);

    //TODO: split input into a new function
    //TODO: make an equivalent of data-react-toolbox='radio-button' for div?
    return div([
      label({ className: className }, [
        input({
          className: inputClassName,
          readonly: props.readonly,
          //TODO: which version?
          // attributes: {
          //   readonly: props.readonly,
          // },
          type: 'radio'
        }),
        Radio(sources, {
          checked: checked,
          disabled: props.disabled,
        }).DOM,
        props.label ? label([
          span({
            className: style.text
          }, [
            props.label
          ]),
        ]) : null,
      ]),
    ]);
  });
}

function makeRadioButton(sources: any, props$: Observable<RadioButtonProps>) {
  const { DOM } = sources;

  const actions = intent(DOM);
  const state$ = model(props$, actions);
  const vtree$ = view(sources, state$);

  return {
    DOM: vtree$,
    value$: state$.value$,
  };

}
