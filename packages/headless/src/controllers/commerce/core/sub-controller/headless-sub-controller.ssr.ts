import {
  ControllerDefinitionOption,
  ListingOnlyControllerDefinition,
  SearchOnlyControllerDefinition,
  SharedControllerDefinition,
  SolutionType,
} from '../../../../app/ssr-engine/types/common';
import {Controller} from '../../../controller/headless-controller';
import {Summary} from '../../core/summary/headless-core-summary';
import {buildProductListing} from '../../product-listing/headless-product-listing';
import {ProductListingSummaryState} from '../../product-listing/summary/headless-product-listing-summary';
import {buildSearch} from '../../search/headless-search';
import {SearchSummaryState} from '../../search/summary/headless-search-summary';

type SolutionTypeControllerDefinition<
  TController extends Controller,
  TDefinition extends ControllerDefinitionOption | undefined,
> = TDefinition extends {listing?: true; search?: true} | undefined
  ? SharedControllerDefinition<TController>
  : TDefinition extends {listing?: true; search?: false}
    ? ListingOnlyControllerDefinition<TController>
    : TDefinition extends {listing?: false; search?: true}
      ? SearchOnlyControllerDefinition<TController>
      : never;

export function defineQuerySummary<
  TOptions extends ControllerDefinitionOption | undefined,
>(options?: TOptions) {
  return {
    ...options, // TODO: This is only used for type inference and conditional types, ideally, it should not be exposed to users
    build: (engine, solutionType: SolutionType) =>
      solutionType === 'listing'
        ? buildProductListing(engine).summary()
        : buildSearch(engine).summary(),
  } as SolutionTypeControllerDefinition<
    // TODO: Not sure the conditional is required here. Check if the type can be inferred controller state without it simply be building the right build method
    Summary<
      SolutionType extends 'listing'
        ? ProductListingSummaryState
        : SearchSummaryState
    >,
    TOptions
  >;
}
