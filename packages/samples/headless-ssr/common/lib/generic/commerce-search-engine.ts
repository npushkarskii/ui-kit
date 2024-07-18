// import {
//   defineCommerceEngine,
//   InferStaticState,
//   InferHydratedState,
// } from '@coveo/headless/commerce-ssr';
// import {searchConfig} from '../../components/common/commerce-engine-config';

// // TODO: only have one engine definition
// const engineDefinition = defineCommerceEngine(searchConfig);

// export type SearchStaticState = InferStaticState<typeof engineDefinition>;
// export type SearchHydratedState = InferHydratedState<typeof engineDefinition>;

// //  const {fetchStaticState, hydrateStaticState} = engineDefinition;

// const a = {
//   ListingSSR: {
//     fetchStaticState: engineDefinition.fetchStaticState,
//     hydrateStaticState: engineDefinition.hydrateStaticState,
//   },
//   SearchSSR: {
//     fetchStaticState: engineDefinition.fetchStaticState,
//     hydrateStaticState: engineDefinition.hydrateStaticState,
//   },
// };
// export const {ListingSSR, SearchSSR} = a;
