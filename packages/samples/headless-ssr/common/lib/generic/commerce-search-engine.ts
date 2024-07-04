import {
  defineCommerceEngine,
  InferStaticState,
  InferHydratedState,
} from '@coveo/headless/commerce-ssr';
import {searchConfig} from '../../components/common/commerce-engine-config';

const engineDefinition = defineCommerceEngine(searchConfig);

export type SearchStaticState = InferStaticState<typeof engineDefinition>;
export type SearchHydratedState = InferHydratedState<typeof engineDefinition>;

export const {fetchStaticState, hydrateStaticState} = engineDefinition;
