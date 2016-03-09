import { defaults } from 'lodash';
import { Observable } from 'rx';

export function defaultProps<T>(props: any, defaultProps: T): Observable<T> {
  // TODO: possibly get functional and use Maybe?
  // if props are null or undefined
  if (props == null) {
    // make an empty object so we can default it
    props = {};
  }

  defaults(props, defaultProps);

  // return the Observable if it was passed in, or create one from the Object passed in
  return Observable.isObservable(props) ? props : Observable.just(props);
}
