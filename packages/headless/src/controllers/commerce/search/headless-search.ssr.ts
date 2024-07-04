import {CommerceEngine} from '../../../app/commerce-engine/commerce-engine';
import {ControllerDefinitionWithoutProps} from '../../../app/ssr-engine/types/common';
import {Search, buildSearch} from './headless-search';

export * from './headless-search';

export interface SearchDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, Search> {}

/**
 * Defines a `Search` controller instance.
 *
 * @param props - The configurable `Search` properties.
 * @returns The `Search` controller definition.
 * */
export function defineSearch(): SearchDefinition {
  return {
    build: (engine) => buildSearch(engine),
  };
}
