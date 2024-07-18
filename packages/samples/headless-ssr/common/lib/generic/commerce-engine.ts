import {
  defineCommerceEngine,
  InferStaticState,
  InferHydratedState,
} from '@coveo/headless/commerce-ssr';
import {masterEngineConfig} from '../../components/common/commerce-engine-config';

const engineDefinition = defineCommerceEngine(masterEngineConfig);

export type SearchStaticState = InferStaticState<
  (typeof engineDefinition)['ListingSSR']
>;
export type SearchHydratedState = InferHydratedState<
  (typeof engineDefinition)['ListingSSR']
>;

export const {ListingSSR, SearchSSR} = engineDefinition;
