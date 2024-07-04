import {
  Controller,
  ControllerDefinitionsMap,
  CommerceEngineDefinitionOptions, // defineCommerceFacets,
  CommerceEngine,
  defineProductListing,
  defineSearchBox,
  defineContext, // defineCommerceSearchParameterManager,
  getSampleCommerceEngineConfiguration,
} from '@coveo/headless/commerce-ssr';

export const config = {
  configuration: {
    ...getSampleCommerceEngineConfiguration(),
    analytics: {
      trackingId: 'sports',
      enabled: false, // TODO: setup navigatorContext
    },
    // analytics: {enabled: false},
  },

  controllers: {
    context: defineContext(),
    searchBox: defineSearchBox(),
    productList: defineProductListing(), // TODO: also need to know how to configure a search page
    // facets: defineCommerceFacets(), // TODO: need to support facet generator
    // searchParameterManager: defineCommerceSearchParameterManager(),
  },
} satisfies CommerceEngineDefinitionOptions<
  ControllerDefinitionsMap<CommerceEngine, Controller>
>;
