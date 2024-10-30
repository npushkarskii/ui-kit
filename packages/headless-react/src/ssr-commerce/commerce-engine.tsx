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
import {singleton, SingletonGetter} from '../utils.js';
import {
  buildControllerHooks,
  buildEngineHook,
  buildHydratedStateSearchProvider,
  buildHydratedStateStandaloneProvider,
  buildStaticStateListingProvider,
  buildStaticStateSearchProvider,
  buildStaticStateStandaloneProvider,
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
  TSolutionType extends SolutionType = SolutionType,
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
>(options: CommerceEngineDefinitionOptions<TControllers>) {
  const singletonContext = createSingletonContext<TControllers>();

  type ContextStateType<TSolutionType extends SolutionType> = SingletonGetter<
    React.Context<ContextState<
      CommerceEngine,
      TControllers,
      TSolutionType
    > | null>
  >;
  type ListingContext = ContextStateType<SolutionType.listing>;
  type SearchContext = ContextStateType<SolutionType.search>;
  type StandaloneContext = ContextStateType<SolutionType.standalone>;

  const {
    listingEngineDefinition,
    searchEngineDefinition,
    standaloneEngineDefinition,
  } = defineBaseCommerceEngine({...options});
  return {
    useEngine: buildEngineHook(singletonContext),
    controllers: buildControllerHooks(singletonContext, options.controllers),
    listingEngineDefinition: {
      ...listingEngineDefinition,
      StaticStateProvider: buildStaticStateListingProvider(
        singletonContext as ListingContext
      ),

      HydratedStateProvider: buildStaticStateListingProvider(
        singletonContext as ListingContext
      ),
    },
    searchEngineDefinition: {
      ...searchEngineDefinition,
      StaticStateProvider: buildStaticStateSearchProvider(
        singletonContext as SearchContext
      ),
      HydratedStateProvider: buildHydratedStateSearchProvider(
        singletonContext as SearchContext
      ),
    },
    standaloneEngineDefinition: {
      ...standaloneEngineDefinition,
      StaticStateProvider: buildStaticStateStandaloneProvider(
        singletonContext as StandaloneContext
      ),
      HydratedStateProvider: buildHydratedStateStandaloneProvider(
        singletonContext as StandaloneContext
      ),
    },
  };
}
