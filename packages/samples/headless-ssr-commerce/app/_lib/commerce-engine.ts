import {
  defineCommerceEngine,
  InferStaticState,
  InferHydratedState,
} from '@coveo/headless-react/ssr-commerce';
import engineConfig from './commerce-engine-config';

const engineDefinition = defineCommerceEngine(engineConfig);

export const {
  listingEngineDefinition,
  searchEngineDefinition,
  standaloneEngineDefinition,
  HydratedStateProvider,
  HydratedListingStateProvider,
  StaticListingStateProvider,
  StaticStateProvider,
  useEngine,
} = engineDefinition;

export const {
  useCart,
  useContext,
  useProductList,
  useDidYouMean,
  useFacetGenerator,
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

export type StandaloneStaticState = InferStaticState<
  typeof standaloneEngineDefinition
>;
export type StandaloneHydratedState = InferHydratedState<
  typeof standaloneEngineDefinition
>;
