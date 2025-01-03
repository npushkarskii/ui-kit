import {html} from 'lit-html';
import {when} from 'lit-html/directives/when.js';

export interface LoadMoreGuardProps {
  isLoaded: boolean;
  hasResults: boolean;
}

export function loadMoreGuard<T>(
  {isLoaded, hasResults}: LoadMoreGuardProps,
  children: T
) {
  return when(isLoaded && hasResults, () => html`${children}`);
}
