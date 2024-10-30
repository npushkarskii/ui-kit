import {
  Controller,
  CommerceEngine,
  ControllerDefinitionsMap,
  CommerceEngineDefinitionOptions,
  defineCommerceEngine as defineBaseCommerceEngine,
  CommerceEngineOptions,
  SolutionType, // getSampleCommerceEngineConfiguration,
  // defineSummary,
  // defineProductList,
  // defineRecommendations,
  // defineCart,
  // defineSearchBox,
  // defineContext,
  // defineRecentQueriesList,
  // defineNotifyTrigger,
  // defineQueryTrigger,
  // defineRedirectionTrigger,
  // defineStandaloneSearchBox,
  // defineInstantProducts,
  // definePagination,
  // defineSort,
  // defineProductView,
  // defineDidYouMean,
  // defineFacetGenerator,
} from '@coveo/headless/ssr-commerce';
// Workaround to prevent Next.js erroring about importing CSR only hooks
import React from 'react';
import {singleton} from '../utils.js';
import {
  buildControllerHooks,
  buildEngineHook,
  buildHydratedStateProvider,
  buildHydratedListingStateProvider,
  buildStaticStateProvider,
  buildStaticListingStateProvider,
} from './common.js';
import {ContextState, ReactEngineDefinition} from './types.js';

export type ReactCommerceEngineDefinition<
  TControllers extends ControllerDefinitionsMap<CommerceEngine, Controller>,
  TSolutionType extends SolutionType,
> = ReactEngineDefinition<
  CommerceEngine,
  TControllers,
  CommerceEngineOptions,
  TSolutionType
>;

// Wrapper to workaround the limitation that `createContext()` cannot be called directly during SSR in next.js
export function createSingletonContext<
  TControllers extends ControllerDefinitionsMap<CommerceEngine, Controller>,
  TSolutionType extends SolutionType,
>() {
  return singleton(() =>
    React.createContext<ContextState<
      CommerceEngine,
      TControllers,
      TSolutionType
    > | null>(null)
  );
}

/**
 * Returns controller hooks as well as SSR and CSR context providers that can be used to interact with a Commerce engine
 *  on the server and client side respectively.
 */
export function defineCommerceEngine<
  TControllers extends ControllerDefinitionsMap<CommerceEngine, Controller>,
  // TSolutionType extends SolutionType,
>(
  options: CommerceEngineDefinitionOptions<TControllers>
  // ): ReactCommerceEngineDefinition<TControllers, TSolutionType> {
) {
  const singletonContext = createSingletonContext<
    TControllers,
    SolutionType.listing // TODO: find a way to get other solution types as well
  >();
  return {
    ...defineBaseCommerceEngine({...options}),
    useEngine: buildEngineHook(singletonContext),
    controllers: buildControllerHooks(singletonContext, options.controllers),
    StaticStateProvider: buildStaticStateProvider(singletonContext),
    HydratedStateProvider: buildHydratedStateProvider(singletonContext),
    // TODO: encapsulate this in namespaces
    StaticListingStateProvider:
      buildStaticListingStateProvider(singletonContext),
    HydratedListingStateProvider:
      buildHydratedListingStateProvider(singletonContext),
    // HydratedSearchStateProvider:
    //   buildHydratedSearchStateProvider(singletonContext),
  };
}

// *********************************************************************
// *********************************************************************
//                        S  A  N  D  B  O  X
// *********************************************************************
// *********************************************************************
/*
const engineDefinition = defineCommerceEngine({
  configuration: {...getSampleCommerceEngineConfiguration()},
  controllers: {
    summary: defineSummary(),
    productList: defineProductList(),
    popularViewedRecs: defineRecommendations({
      options: {
        slotId: 'd73afbd2-8521-4ee6-a9b8-31f064721e73',
      },
    }),
    popularBoughtRecs: defineRecommendations({
      options: {
        slotId: 'af4fb7ba-6641-4b67-9cf9-be67e9f30174',
      },
    }),
    cart: defineCart(),
    searchBox: defineSearchBox(),
    context: defineContext(),
    recentQueriesList: defineRecentQueriesList(),
    notifyTrigger: defineNotifyTrigger(),
    queryTrigger: defineQueryTrigger(),
    redirectionTrigger: defineRedirectionTrigger(),
    standaloneSearchBox: defineStandaloneSearchBox({
      options: {redirectionUrl: '/search'},
    }),
    instantProducts: defineInstantProducts({options: {}}),
    pagination: definePagination({options: {pageSize: 9}}),
    sort: defineSort(),
    productView: defineProductView(),
    didYouMean: defineDidYouMean(), // TODO KIT-3463: implement did you mean in sample
    facetGenerator: defineFacetGenerator({search: false}),
  },
});

export const a = engineDefinition.listingEngineDefinition;

export const {useFacetGenerator} = engineDefinition.controllers;

// */
