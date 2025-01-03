import {Fragment, FunctionalComponent, h} from '@stencil/core';

export interface LoadMoreGuardProps {
  isLoaded: boolean;
  hasResults: boolean;
}

/**
 * @deprecated Use `loadMoreGuard` directive instead.
 */
export const LoadMoreGuard: FunctionalComponent<LoadMoreGuardProps> = (
  {isLoaded, hasResults},
  children
) => {
  if (!isLoaded || !hasResults) {
    return;
  }
  return <Fragment>{children}</Fragment>;
};
