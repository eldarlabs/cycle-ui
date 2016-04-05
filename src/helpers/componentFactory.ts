const isolate = require('@cycle/isolate');
import { Observable } from 'rx';
import { getComponentParams } from './componentParams';
import { CycleUiComponentProps, CycleComponent } from './cycleDomInterfaces';

export function componentFactory<T extends CycleUiComponentProps>(factory: any,
    defaults: T, sources: any, propsOrChildren: any, children?: string | Array<CycleComponent>) {

  const params = getComponentParams<T>(defaults, propsOrChildren, children);

  if (params.props.isolate) {
    factory = isolate(factory);
  }

  const props$ = Observable.just(params.props);

  if (typeof sources === 'undefined') {
    return factory(props$, params.children);
  } else {
    return factory(sources, props$, params.children);
  }
}
