import { defaults } from 'lodash';

export function defaultUndefinedProps<T>(props: T, defaultProps: T): T {
  // if props are null or undefined
  if (props == null) {
    // just use defaults
    return defaultProps;
  } else {
    //overwrite any undefined props with the defaults
    return defaults<T>(props, defaultProps);
  }
}
