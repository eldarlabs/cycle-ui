import { Observable } from 'rx';
const { div, h5, p } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/card/style');
import { defaultProps } from '../helpers/defaultProps';
const isolate = require('@cycle/isolate');
import { CycleDomComponent, CycleComponent } from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';
import { concat } from 'lodash';
//import { Avatar } from '../avatar';

export interface CardTitleProps {
  //: TODO need to figure out how to define an element in Cycle.js
  avatar?: string | CycleComponent; // element
  className?: string;
  //children?: string | Array<CycleComponent> | CycleComponent;
  subtitle?: string | CycleComponent;
  title?: string | CycleComponent;
};

export function CardTitle(sources: any, props?: CardTitleProps,
                          children?: string | Array<CycleComponent> | CycleComponent):
                          CycleDomComponent {
  const props$: Observable<CardTitleProps> = defaultProps(props, {
    className: '',
  });

  // TODO: isolation?
  return isolate(makeCardTitle)(sources, props$, children);
}

function makeCardTitle(sources: any, props$: Observable<CardTitleProps>,
                       children: string | Array<CycleComponent> | CycleComponent):
                       CycleDomComponent {
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
      h5(`.${style.title}`, props.title);

    const childrenAsStringDOM = children && typeof children === 'string' &&
      h5(`.${style.title}`,
        children
      );

    const subtitleDOM = props.subtitle &&
      p(`.${style.subtitle}`, props.subtitle);

    const childrenAsArray = children && typeof children !== 'string' &&
      children;

    return (
      div( { props: { className } }, [
        div(concat(
          titleDOM,
          childrenAsStringDOM,
          subtitleDOM,
          childrenAsArray
        )),
      ]
      // [
      //   //TODO: Avatars
      //   // {avatarComponent && (
      //   //   <div className={style.avatar}>
      //   //     {avatarComponent}
      //   //   </div>
      //   // )}
      // ]
      )
    );
  });

  return {
    DOM: vtree$,
  };
};
