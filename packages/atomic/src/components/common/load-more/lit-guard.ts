import {html} from 'lit-html';
import {directive, Directive} from 'lit-html/directive.js';
import {when} from 'lit-html/directives/when.js';

export interface LoadMoreGuardProps {
  isLoaded: boolean;
  hasResults: boolean;
}

// Alternative 1: Function
// export function loadMoreGuard<T>(
//   {isLoaded, hasResults}: LoadMoreGuardProps,
//   children: T
// ) {
//   return when(isLoaded && hasResults, () => html`${children}`);
// }

// Alternative 1: Directive
class LoadMoreGuard<T> extends Directive {
  render(props: LoadMoreGuardProps, children: T) {
    return when(props.isLoaded && props.hasResults, () => html`${children}`);
  }
}

export const loadMoreGuard = directive(LoadMoreGuard);
