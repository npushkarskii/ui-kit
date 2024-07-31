import {SolutionTypeControllerDefinition} from '../../../app/ssr-engine/types/common';
import {SearchBox, SearchBoxProps, buildSearchBox} from './headless-search-box';

export * from './headless-search-box';

export interface SearchBoxDefinition
  extends SolutionTypeControllerDefinition<SearchBox, undefined> {}

/**
 * Defines a `SearchBox` controller instance.
 *
 * @param props - The configurable `SearchBox` properties.
 * @returns The `SearchBox` controller definition.
 * */
export function defineSearchBox(props?: SearchBoxProps): SearchBoxDefinition {
  return {
    listing: true, // Again, if we can avoid having to set these boolean to ensure the type is inferred correctly, it would be better
    search: true,
    build: (engine) => buildSearchBox(engine, props),
  };
}
