import { Observable } from 'rx';
const { div, h5, p } = require('@cycle/dom');
const style = require('react-toolbox/lib/card/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
import { CycleDomComponent, CycleComponent } from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';
//import { Avatar } from '../avatar';

export interface CardTitleProps {
  //: TODO need to figure out how to define an element in Cycle.js
  avatar?: string | CycleComponent; // element
  className?: string;
  children?: string | Array<CycleComponent> | CycleComponent;
  subtitle?: string | CycleComponent;
  title?: string | CycleComponent;
};

export function CardTitle(sources, props?, children?): CycleDomComponent {
  const props$: Observable<CardTitleProps> = defaultProps(props, {
    className: '',
  });

  // TODO: isolation?
  return isolate(makeCardTitle)(sources, props$, children);
}

function makeCardTitle(sources: any, props$: Observable<CardTitleProps>, children): CycleDomComponent {
  const vtree$ = props$.map( (props) => {

    //TODO: do Avatars at some point

    //let avatarComponent;

    // if (typeof avatar === 'string') {
    //   avatarComponent = <Avatar image={avatar} />;
    // } else {
    //   avatarComponent = avatar;
    // }

    const className = classNames(style.cardTitle, {
      // [style.small]: props.avatar,
      // [style.large]: !props.avatar
    }, props.className);

    const titleDOM = props.title &&
      h5(`.${style.title}`, [props.title]);

    const childrenAsStringDOM = props.children && typeof props.children === 'string' &&
      h5(`.${style.title}`,
        [props.children]
      );

    const subtitleDOM = props.subtitle &&
      p(`.${style.subtitle}`, [props.subtitle]);

    const childrenAsArray = props.children && typeof children !== 'string' &&
      [children];

    return (
      div({
          className,
        },
        //TODO: Avatars
        // {avatarComponent && (
        //   <div className={style.avatar}>
        //     {avatarComponent}
        //   </div>
        // )}
        div(
          titleDOM,
          childrenAsStringDOM,
          subtitleDOM,
          childrenAsArray
        )
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
