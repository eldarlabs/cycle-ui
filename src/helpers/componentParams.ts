import { defaultUndefinedProps } from './defaultProps';

function isChildren(object: any): boolean {
    return Array.isArray(object) || typeof object === 'undefined';
}

export function getComponentParams<T>(defaultProps: T, propsOrChildren: any, children?: any) {
  let props: T;
  if (isChildren(propsOrChildren)) {
    children = propsOrChildren;
  } else {
    props = propsOrChildren;
  }
  props = defaultUndefinedProps<T>(props, defaultProps);

  return { props, children };
}
