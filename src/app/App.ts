import { Observable } from 'rx';
const { div } = require('@cycle/dom');
import * as classNames from 'classnames';
const style = require('react-toolbox/lib/app/style');
import { defaultProps } from '../helpers/defaultProps';
import { CycleDomComponent } from '../helpers/cycleDomComponent';
//const isolate = require('@cycle/isolate');

export interface AppProps {
  className?: string;
}

export function App(props?: AppProps, children?: any): CycleDomComponent {

  const props$: Observable<AppProps> = defaultProps(props, {
    className: '',
  });

  return makeApp(props$, children);
}

function makeApp(props$: Observable<AppProps>, children?: any): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    const className = classNames(style.root, props.className);

    return div({
        className,
      },
      [children]);
  });

  return {
    DOM: vtree$,
  };
}
