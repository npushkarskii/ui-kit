import {
  defineCommerceEngine,
  InferStaticState,
  InferHydratedState,
} from '@coveo/headless-react/ssr-commerce';
import engineConfig from './commerce-engine-config';

export const engineDefinition = defineCommerceEngine(engineConfig);

export const {listingEngineDefinition, searchEngineDefinition, useEngine} =
  engineDefinition;

export const {
  useCart,
  useContext,
  useProductList,
  useDidYouMean,
  useInstantProducts,
  useNotifyTrigger,
  usePagination,
  usePopularBoughtRecs,
  usePopularViewedRecs,
  useProductView,
  useQueryTrigger,
  useRecentQueriesList,
  useRedirectionTrigger,
  useSearchBox,
  useSort,
  useStandaloneSearchBox,
  useSummary,
  useFacetGenerator,
} = engineDefinition.controllers;

export type ListingStaticState = InferStaticState<
  typeof listingEngineDefinition
>;
export type ListingHydratedState = InferHydratedState<
  typeof listingEngineDefinition
>;

export type SearchStaticState = InferStaticState<typeof searchEngineDefinition>;
export type SearchHydratedState = InferHydratedState<
  typeof searchEngineDefinition
>;

// TODO: add missing types
// export type StandaloneStaticState = InferStaticState<
//   typeof standaloneEngineDefinition
// >;
// export type StandaloneHydratedState = InferHydratedState<
//   typeof standaloneEngineDefinition
// >;
