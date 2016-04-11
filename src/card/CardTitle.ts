import { Observable } from 'rx';
const { div, h5, p } = require('cycle-snabbdom');
const style = require('react-toolbox/lib/card/style');
import { componentFactory } from '../helpers/componentFactory';
import { CycleDomComponent, CycleComponent, CycleUiComponentProps }
  from '../helpers/cycleDomInterfaces';
import * as classNames from 'classnames';
//import { concat } from 'lodash';
const { concat } = require('lodash');
//import { Avatar } from '../avatar';

export interface CardTitleProps extends CycleUiComponentProps {
  avatar?: string | CycleComponent;
  subtitle?: string | CycleComponent;
  title?: string | CycleComponent;
};

const CardTitleDefaultProps: CardTitleProps = {
  // Enforce isolation for now
  isolate: true,
  className: '',
};

export function CardTitle(sources: any, props?: CardTitleProps,
    children?: string | Array<CycleComponent>): CycleDomComponent {
  return componentFactory<CardTitleProps>(CardTitleFactory, CardTitleDefaultProps, sources,
    props, children);
}

export function CardTitleFactory(sources: any, props$: Observable<CardTitleProps>,
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
