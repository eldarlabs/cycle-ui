import { Observable } from 'rx';
const { div, input, label, span } = require('cycle-snabbdom');
import * as classNames from 'classnames';
import { Radio } from './Radio';
const style = require('react-toolbox/lib/radio/style');
const combineLatestObj = require('rx-combine-latest-obj');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleUiComponentProps } from '../helpers/cycleDomInterfaces';

// TODO: check these props
export interface RadioButtonProps extends CycleUiComponentProps {
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  label?: string;
  value?: any;
};

const RadioButtonDefaultProps: RadioButtonProps = {
  // Enforce isolation for now
  isolate: true,
  checked: false,
  className: '',
  disabled: false,
};

export interface RadioButton extends CycleDomComponent {
  value$: Observable<string>;
}

export function RadioButton(sources: any, props?: RadioButtonProps): RadioButton {
  return componentFactory<RadioButtonProps>(RadioButtonFactory, RadioButtonDefaultProps, sources,
    props);
}

function intent(DOM: any) {
  const radioLabelClick$ = DOM.select('span').events('click');
  const radioClick$ = DOM.select('input').events('click');
  const itemMouseClick$ = radioLabelClick$.merge(radioClick$).startWith('first')
    .do((x: any) => console.log(x));
  return { itemMouseClick$ };
}

function model(props$: Observable<RadioButtonProps>, actions: any) {
  const clickedValue$ = Observable.combineLatest(
    actions.itemMouseClick$, props$, (click, props) => props.value)
    .do(x => console.log('clickedValue ' + x));

  const radioGroupValue$ = Observable.just('RadioHard');
  const checked$ = Observable.combineLatest(props$, clickedValue$, radioGroupValue$,
      (props, clickedValue, radioGroupValue) => {
    //TODO: does this stop having a disabled and checked, not just initial state?
    return !props.disabled && (clickedValue === radioGroupValue);
  })
  .do(x => console.log('checked ' + x));

  return combineLatestObj({clickedValue$, props$, checked$ });
}

function view(sources: any, state$: any) {
  return state$.map( ({props, checked} ) => {

    const className = classNames('radioButton', style[props.disabled ? 'disabled' : 'field'],
      props.className);
    const inputClassName = classNames('radioInput', style.input);

    //TODO: split input into a new function
    return (
      div([
        label( { props: { className }, attrs: { 'data-cycle-ui': 'radio-button' } }, [
          input( { props: {
            className: inputClassName,
            //TODO: which version?
            // attributes: {
            //   readonly: props.readonly,
            // },
            readonly: props.readonly,
            type: 'radio'
          },
          attrs: {
          }}),
          Radio(sources, {
            checked: checked,
            disabled: props.disabled,
          }).DOM,
          props.label && label([
            span( { props: { className: style.text } },
              props.label
            ),
          ]),
        ]),
      ])
    );
  });
}

function RadioButtonFactory(sources: any, props$: Observable<RadioButtonProps>): RadioButton {
  const { DOM } = sources;

  const actions = intent(DOM);
  const state$ = model(props$, actions);
  const vtree$ = view(sources, state$);

  return {
    DOM: vtree$,
    value$: state$.value$,
  };

}
