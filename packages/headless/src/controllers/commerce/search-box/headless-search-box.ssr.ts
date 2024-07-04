import {CommerceEngine} from '../../../app/commerce-engine/commerce-engine';
import {ControllerDefinitionWithoutProps} from '../../../app/ssr-engine/types/common';
import {
  buildStandaloneSearchBox,
  StandaloneSearchBoxProps,
  StandaloneSearchBox,
} from '../standalone-search-box/headless-standalone-search-box';
import {SearchBox, SearchBoxProps, buildSearchBox} from './headless-search-box';

export * from './headless-search-box';
export * from '../standalone-search-box/headless-standalone-search-box';

export interface SearchBoxDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, SearchBox> {}

export interface StandaloneSearchBoxDefinition
  extends ControllerDefinitionWithoutProps<
    CommerceEngine,
    StandaloneSearchBox
  > {}

/**
 * Defines a `SearchBox` controller instance.
 *
 * @param props - The configurable `SearchBox` properties.
 * @returns The `SearchBox` controller definition.
 * */
export function defineSearchBox(props?: SearchBoxProps): SearchBoxDefinition {
  return {
    build: (engine) => buildSearchBox(engine, props),
  };
}

// TODO: maybe should simply have a prop like redirection-url so we don't have to expose 2 functions
export function defineStandaloneSearchBox(
  props: StandaloneSearchBoxProps
): StandaloneSearchBoxDefinition {
  return {
    build: (engine) => buildStandaloneSearchBox(engine, props),
  };
}
