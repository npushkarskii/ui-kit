/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Utility functions to be used for Commerce Server Side Rendering.
 */
import {Action, AnyAction, Middleware, UnknownAction} from '@reduxjs/toolkit';
import {stateKey} from '../../app/state-key';
import {buildProductListing} from '../../controllers/commerce/product-listing/headless-product-listing';
import {buildSearch} from '../../controllers/commerce/search/headless-search';
import type {Controller} from '../../controllers/controller/headless-controller';
import {
  createWaitForActionMiddleware,
  createWaitForActionMiddlewareWithCount,
} from '../../utils/utils';
import {buildControllerDefinitions} from '../commerce-ssr-engine/common';
import {
  ControllerDefinitionsMap,
  InferControllerStaticStateMapFromDefinitionsWithSolutionType,
  SolutionType,
} from '../commerce-ssr-engine/types/common';
import {
  EngineDefinition,
  EngineDefinitionOptions,
} from '../commerce-ssr-engine/types/core-engine';
import {NavigatorContextProvider} from '../navigatorContextProvider';
import {composeFunction} from '../ssr-engine/common';
import {createStaticState} from '../ssr-engine/common';
import {
  EngineStaticState,
  InferControllerPropsMapFromDefinitions,
} from '../ssr-engine/types/common';
import {
  CommerceEngine,
  CommerceEngineOptions,
  buildCommerceEngine,
} from './commerce-engine';

/**
 * The SSR commerce engine.
 */
export interface SSRCommerceEngine extends CommerceEngine {
  /**
   * Waits for the search to be completed and returns a promise that resolves to a `SearchCompletedAction`.
   */
  // TODO: document: essentially a promise for the first search/request and a list of recommendation promises
  waitForRequestCompletedActions(): Promise<Action[]>;
}

export type CommerceEngineDefinitionOptions<
  TControllers extends ControllerDefinitionsMap<SSRCommerceEngine, Controller>,
> = EngineDefinitionOptions<CommerceEngineOptions, TControllers>;

function isListingFetchCompletedAction(action: unknown): action is Action {
  return /^commerce\/productListing\/fetch\/(fulfilled|rejected)$/.test(
    (action as UnknownAction).type
  );
}

function isSearchCompletedAction(action: unknown): action is Action {
  return /^commerce\/search\/executeSearch\/(fulfilled|rejected)$/.test(
    (action as UnknownAction).type
  );
}

function isRecommendationCompletedAction(action: unknown): action is Action {
  return /^commerce\/recommendations\/fetch\/(fulfilled|rejected)$/.test(
    (action as UnknownAction).type
  );
}

// TODO: rename
function getRecommendationControllerCountFromDefinitions<
  TControllerDefinitions extends ControllerDefinitionsMap<
    SSRCommerceEngine,
    Controller
  >,
>(definitionMap: TControllerDefinitions): number {
  let slotIdCount = 0;
  // TODO: remove any
  Object.values(definitionMap as Record<string, any>).forEach((x) => {
    if (x.isRecommendation) {
      slotIdCount++;
    }
  });
  return slotIdCount;
}

// TODO: rename
function getRecommendationWaitForActionMiddleware<
  TControllerDefinitions extends ControllerDefinitionsMap<
    SSRCommerceEngine,
    Controller
  >,
>(
  definitionMap: TControllerDefinitions
): {
  promise: Promise<Action>;
  middleware: Middleware;
} {
  let slotIdCount =
    getRecommendationControllerCountFromDefinitions(definitionMap);

  return createWaitForActionMiddlewareWithCount(
    isRecommendationCompletedAction,
    slotIdCount
  );
}

function buildSSRCommerceEngine(
  solutionType: SolutionType,
  options: CommerceEngineOptions & {
    recommendationOptions: {
      // TODO: rename
      promise: Promise<Action>;
      middleware: Middleware;
    };
  }
): SSRCommerceEngine {
  // TODO: put in function

  // let waitAction;
  // if (solutionType === SolutionType.recommendation) {
  //   // in case of recommendation only (e.g. home page)
  //   // TODO: clean that
  //   const middleware: Middleware = () => (next) => (action) => {
  //     next(action);
  //   };
  //   waitAction = {middleware, promise: Promise.resolve(null as unknown as Action)}; // TODO: get rid of that
  // } else {
  if (solutionType !== SolutionType.recommendation) {
    const {middleware, promise} = createWaitForActionMiddleware(
      solutionType === SolutionType.listing
        ? isListingFetchCompletedAction
        : isSearchCompletedAction
    );
    const commerceEngine = buildCommerceEngine({
      ...options,
      middlewares: [
        ...(options.middlewares ?? []),
        middleware,
        options.recommendationOptions.middleware, // TODO: clean that
      ],
    });
    return {
      ...commerceEngine,

      get [stateKey]() {
        return commerceEngine[stateKey];
      },

      waitForRequestCompletedActions() {
        return Promise.all([promise, options.recommendationOptions.promise]); // TODO: clean that
      },
    };
  } else {
    const commerceEngine = buildCommerceEngine({
      ...options,
      middlewares: [
        ...(options.middlewares ?? []),
        options.recommendationOptions.middleware, // TODO: clean that
      ],
    });
    return {
      ...commerceEngine,

      get [stateKey]() {
        return commerceEngine[stateKey];
      },

      waitForRequestCompletedActions() {
        return Promise.all([options.recommendationOptions.promise]); // TODO: clean that
      },
    };
  }
}

export interface CommerceEngineDefinition<
  TControllers extends ControllerDefinitionsMap<SSRCommerceEngine, Controller>,
  TSolutionType extends SolutionType,
> extends EngineDefinition<
    SSRCommerceEngine,
    TControllers,
    CommerceEngineOptions,
    TSolutionType
  > {}

/**
 * Initializes a Commerce engine definition in SSR with given controllers definitions and commerce engine config.
 * @param options - The commerce engine definition
 * @returns Three utility functions to fetch the initial state of the engine in SSR, hydrate the state in CSR,
 *  and a build function that can be used for edge cases requiring more control.
 */
export function defineCommerceEngine<
  TControllerDefinitions extends ControllerDefinitionsMap<
    SSRCommerceEngine,
    Controller
  >,
>(
  options: CommerceEngineDefinitionOptions<TControllerDefinitions>
): {
  listingEngineDefinition: CommerceEngineDefinition<
    TControllerDefinitions,
    SolutionType.listing
  >;
  searchEngineDefinition: CommerceEngineDefinition<
    TControllerDefinitions,
    SolutionType.search
  >;
  recommendationEngineDefinition: CommerceEngineDefinition<
    TControllerDefinitions,
    SolutionType.recommendation
  >;
} {
  const {controllers: controllerDefinitions, ...engineOptions} = options;
  type Definition = CommerceEngineDefinition<
    TControllerDefinitions,
    SolutionType
  >;
  type BuildFunction = Definition['build'];
  type FetchStaticStateFunction = Definition['fetchStaticState'];
  type HydrateStaticStateFunction = Definition['hydrateStaticState'];
  type FetchStaticStateFromBuildResultFunction =
    FetchStaticStateFunction['fromBuildResult'];
  type HydrateStaticStateFromBuildResultFunction =
    HydrateStaticStateFunction['fromBuildResult'];
  type BuildParameters = Parameters<BuildFunction>;
  type FetchStaticStateParameters = Parameters<FetchStaticStateFunction>;
  type HydrateStaticStateParameters = Parameters<HydrateStaticStateFunction>;
  type FetchStaticStateFromBuildResultParameters =
    Parameters<FetchStaticStateFromBuildResultFunction>;
  type HydrateStaticStateFromBuildResultParameters =
    Parameters<HydrateStaticStateFromBuildResultFunction>;

  const getOptions = () => {
    return engineOptions;
  };

  const setNavigatorContextProvider = (
    navigatorContextProvider: NavigatorContextProvider
  ) => {
    engineOptions.navigatorContextProvider = navigatorContextProvider;
  };

  const buildFactory =
    <T extends SolutionType>(solutionType: T) =>
    async (...[buildOptions]: BuildParameters) => {
      // TODO: rename
      const recommendationOptions = getRecommendationWaitForActionMiddleware(
        controllerDefinitions ?? {}
      );
      const engine = buildSSRCommerceEngine(solutionType, {
        recommendationOptions,
        ...(buildOptions?.extend
          ? await buildOptions.extend(getOptions())
          : getOptions()),
      });
      const controllers = buildControllerDefinitions({
        definitionsMap: (controllerDefinitions ?? {}) as TControllerDefinitions,
        engine,
        solutionType,
        propsMap: (buildOptions && 'controllers' in buildOptions
          ? buildOptions.controllers
          : {}) as InferControllerPropsMapFromDefinitions<TControllerDefinitions>,
      });

      return {
        engine,
        controllers,
      };
    };

  const fetchStaticStateFactory: (
    solutionType: SolutionType
  ) => FetchStaticStateFunction = (solutionType: SolutionType) =>
    composeFunction(
      async (...params: FetchStaticStateParameters) => {
        if (!getOptions().navigatorContextProvider) {
          // TODO: KIT-3409 - implement a logger to log SSR warnings/errors
          console.warn(
            '[WARNING] Missing navigator context in server-side code. Make sure to set it with `setNavigatorContextProvider` before calling fetchStaticState()'
          );
        }
        const buildResult = await buildFactory(solutionType)(...params);
        const staticState = await fetchStaticStateFactory(
          solutionType
        ).fromBuildResult({
          buildResult,
        });
        return staticState;
      },
      {
        fromBuildResult: async (
          ...params: FetchStaticStateFromBuildResultParameters
        ) => {
          const [
            {
              buildResult: {engine, controllers},
            },
          ] = params;

          // TODO: do not execute the first request if only rendering recommendation
          if (solutionType === SolutionType.listing) {
            console.log('>> fetch listing products');
            buildProductListing(engine).executeFirstRequest();
          }

          if (solutionType === SolutionType.search) {
            console.log('>> execute search');
            buildSearch(engine).executeFirstSearch();
          }

          // Refreshing recommendation regardless of the solution type
          console.log('*********************');
          console.log(params[0].buildResult.controllers);
          console.log('*********************');

          Object.entries(controllerDefinitions as Record<string, any>).forEach(
            ([key, value]) => {
              if ((value as any).isRecommendation) {
                console.log('refreshing', key);
                key in controllers && (controllers as any)[key].refresh(); // TODO: remove any
              }
            }
          );

          return createStaticState({
            searchActions: await engine.waitForRequestCompletedActions(),
            controllers,
          }) as EngineStaticState<
            AnyAction,
            InferControllerStaticStateMapFromDefinitionsWithSolutionType<
              TControllerDefinitions,
              SolutionType
            >
          >;
        },
      }
    );

  const hydrateStaticStateFactory: (
    solutionType: SolutionType
  ) => HydrateStaticStateFunction = (solutionType: SolutionType) =>
    composeFunction(
      async (...params: HydrateStaticStateParameters) => {
        if (!getOptions().navigatorContextProvider) {
          // TODO: KIT-3409 - implement a logger to log SSR warnings/errors
          console.warn(
            '[WARNING] Missing navigator context in client-side code. Make sure to set it with `setNavigatorContextProvider` before calling hydrateStaticState()'
          );
        }
        const buildResult = await buildFactory(solutionType)(
          ...(params as BuildParameters)
        );
        const staticState = await hydrateStaticStateFactory(
          solutionType
        ).fromBuildResult({
          buildResult,
          searchActions: params[0]!.searchActions,
        });
        return staticState;
      },
      {
        fromBuildResult: async (
          ...params: HydrateStaticStateFromBuildResultParameters
        ) => {
          const [
            {
              buildResult: {engine, controllers},
              searchActions,
            },
          ] = params;

          searchActions.forEach((action) => {
            engine.dispatch(action);
          });
          await engine.waitForRequestCompletedActions();
          return {engine, controllers};
        },
      }
    );
  return {
    listingEngineDefinition: {
      build: buildFactory(SolutionType.listing),
      fetchStaticState: fetchStaticStateFactory(SolutionType.listing),
      hydrateStaticState: hydrateStaticStateFactory(SolutionType.listing),
      setNavigatorContextProvider,
    } as CommerceEngineDefinition<TControllerDefinitions, SolutionType.listing>,
    searchEngineDefinition: {
      build: buildFactory(SolutionType.search),
      fetchStaticState: fetchStaticStateFactory(SolutionType.search),
      hydrateStaticState: hydrateStaticStateFactory(SolutionType.search),
      setNavigatorContextProvider,
    } as CommerceEngineDefinition<TControllerDefinitions, SolutionType.search>,
    recommendationEngineDefinition: {
      //TODO: only used for pages with no search
      build: buildFactory(SolutionType.recommendation),
      fetchStaticState: fetchStaticStateFactory(SolutionType.recommendation),
      hydrateStaticState: hydrateStaticStateFactory(
        SolutionType.recommendation
      ),
      setNavigatorContextProvider,
    } as CommerceEngineDefinition<
      TControllerDefinitions,
      SolutionType.recommendation
    >,
  };
}
