import {CommerceEngine} from '../../../../app/commerce-engine/commerce-engine';
import {
  ControllerDefinitionWithoutProps,
  SingleValue,
} from '../../../../app/ssr-engine/types/common';
import {FacetGenerator} from '../../core/facets/generator/headless-commerce-facet-generator';
import {Summary} from '../../core/summary/headless-core-summary';
import {buildProductListing} from '../../product-listing/headless-product-listing';
import {ProductListingSummaryState} from '../../product-listing/summary/headless-product-listing-summary';
import {buildSearch} from '../../search/headless-search';
import {SearchSummaryState} from '../../search/summary/headless-search-summary';

export interface SearchSummaryDefinition
  extends ControllerDefinitionWithoutProps<
    CommerceEngine,
    Summary<SearchSummaryState | ProductListingSummaryState>
  > {}
export interface ListingSummaryDefinition
  extends ControllerDefinitionWithoutProps<
    CommerceEngine,
    Summary<SearchSummaryState | ProductListingSummaryState>
  > {
  listing: true;
}
export interface CommonSummaryDefinition
  extends ControllerDefinitionWithoutProps<
    CommerceEngine,
    Summary<SearchSummaryState | ProductListingSummaryState>
  > {
  listing: true;
  search: true;
}

export interface FacetGeneratorDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, FacetGenerator> {
  listing: true;
}

export interface ControllerDefinitionOption {
  listing?: boolean;
  search?: boolean;
  // recommendation?: boolean;
}

const check: SingleValue = true;

export function defineQuerySummary<
  T extends ControllerDefinitionOption | undefined,
>(options?: T) {
  // TODO: add default option based on controller
  // type Ret = T extends undefined
  //   ? CommonSummaryDefinition
  //   : HasKey<T, 'listing'> extends IsTrue
  //     ? HasKey<T, 'search'> extends IsTrue
  //       ? CommonSummaryDefinition
  //       : ListingSummaryDefinition
  //     : HasKey<T, 'search'> extends IsTrue
  //       ? SearchSummaryDefinition
  //       : never;

  type Ret = T extends {listing?: true; search?: true} | undefined
    ? CommonSummaryDefinition
    : T extends {listing: true; search?: false}
      ? ListingSummaryDefinition
      : T extends {listing?: false; search: true}
        ? SearchSummaryDefinition
        : never;
  // TODO: not exactly but close!!!!
  // does not work with ({listing: false})
  // does not work with ({search: false})
  return {
    // TODO: find a way to be less verbose
    // ...(options?.listing && {listing: check}),
    // ...(options?.search && {search: check}),
    // ...(options?.recommendation && {recommendation: check}),
    ...(typeof options === 'string' && {listing: check}),
    build: (engine: CommerceEngine<{}>, solutionType: 'listing' | undefined) =>
      // solutionType === SolutionType.Listing
      solutionType === 'listing'
        ? buildProductListing(engine).summary()
        : buildSearch(engine).summary(),
  } as Ret;
}

export function defineFacets(): FacetGeneratorDefinition {
  // options?: ControllerDefinitionOption
  // TODO: add default option based on controller
  return {
    // TODO: find a way to be less verbose
    // ...(options?.listing && {listing: check}),
    // ...(options?.search && {search: check}),
    // ...(options?.recommendation && {recommendation: check}),
    listing: undefined,
    build: (engine, solutionType) =>
      // solutionType === SolutionType.Listing
      solutionType === 'listing'
        ? buildProductListing(engine).facetGenerator()
        : buildSearch(engine).facetGenerator(),
  };
}
