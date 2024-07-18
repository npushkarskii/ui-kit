import {CommerceEngine} from '../../../app/commerce-engine/commerce-engine';
import {
  ControllerDefinitionWithoutProps,
  SolutionType,
} from '../../../app/ssr-engine/types/common';
import {
  FacetGenerator,
  FacetGeneratorState,
} from '../core/facets/generator/headless-commerce-facet-generator';
import {Summary} from '../core/summary/headless-core-summary';
import {buildSearch} from '../search/headless-search';
import {ProductListing, buildProductListing} from './headless-product-listing';
import {ProductListingSummaryState} from './summary/headless-product-listing-summary';

export * from './headless-product-listing';

export interface ProductListingDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, ProductListing> {}

export interface SummaryDefinition
  extends ControllerDefinitionWithoutProps<
    CommerceEngine,
    Summary<ProductListingSummaryState>
  > {}

export interface FacetGeneratorDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, FacetGenerator> {}

// TODO: build productlisting controller only once and then extract the the rest of the sub controllers
/**
 * Defines a `ProductListing` controller instance.
 *
 * @param props - The configurable `ProductListing` properties.
 * @returns The `ProductListing` controller definition.
 * */
export function defineProductListing(): ProductListingDefinition {
  return {
    build: (engine) => buildProductListing(engine),
  };
}

export function defineQuerySummary(): SummaryDefinition {
  return {
    build: (engine, solutionType) =>
      solutionType === SolutionType.Listing
        ? buildProductListing(engine).summary()
        : buildSearch(engine).summary(),
  };
}
export type {FacetGeneratorState, FacetGenerator};
export function defineFacets(): FacetGeneratorDefinition {
  return {
    build: (engine, solutionType) =>
      solutionType === SolutionType.Listing
        ? buildProductListing(engine).facetGenerator()
        : buildSearch(engine).facetGenerator(),
  };
}
