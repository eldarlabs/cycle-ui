import { Observable } from 'rx';
const { div } = require('cycle-snabbdom');
import * as classNames from 'classnames';
import { RadioButton, RadioButtonProps } from './RadioButton';
/* tslint:disable: no-unused-variable */
const style = require('react-toolbox/lib/radio/style'); /* tslint:enable */
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';

// TODO: check these props
export interface RadioGroupProps extends CycleUiComponentProps {
  disabled?: boolean;
  name?: string;
  value?: any;
};

const RadioGroupDefaultProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
  disabled: false,
};

export function RadioGroup(sources: any, props?: RadioGroupProps,
    children?: Array<CycleComponent>): CycleDomComponent {
  return componentFactory<RadioGroupProps>(RadioGroupFactory, RadioGroupDefaultProps, sources,
    props, children);
}

function RadioGroupFactory(sources: any, props$: Observable<RadioGroupProps>,
                        children: Array<RadioButton>): CycleDomComponent {
  const childrenDOMs: any[] = [];
  const childrenValues: Observable<any>[] = [];
  //TODO: allow other kinds of children?
  for (let childRadio of children) {
    // TODO: maybe remove RadioButton interface if I can make value$ compile using CycleDomComponent
    // interface
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

    return (
      div( { props: { className }, attrs: { 'data-cycle-ui': 'radio-group' } },
        childrenDOMs
      )
    );
  });

  return {
    DOM: vtree$,
  };

}
