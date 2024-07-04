import {
  Controller,
  ControllerDefinitionsMap,
  CommerceEngineDefinitionOptions, // defineCommerceFacets,
  CommerceEngine,
  defineProductListing,
  defineStandaloneSearchBox, // defineSearchBox,
  defineContext, // defineCommerceSearchParameterManager,
  getSampleCommerceEngineConfiguration,
  defineQuerySummary,
  defineSearchBox,
  defineSearch,
} from '@coveo/headless/commerce-ssr';

type CommerceEngineConfig = CommerceEngineDefinitionOptions<
  ControllerDefinitionsMap<CommerceEngine, Controller>
>;

const configuration = {
  ...getSampleCommerceEngineConfiguration(),
  analytics: {
    trackingId: 'sports',
    enabled: false, // TODO: setup navigatorContext
  },
  // analytics: {enabled: false},
};

export const searchConfig = {
  configuration: configuration,
  controllers: {
    context: defineContext(),
    searchBox: defineSearchBox({options: {}}),
    productList: defineProductListing(), // TODO: also need to know how to configure a search page
    summary: defineQuerySummary(),
    // facets: defineCommerceFacets(), // TODO: need to support facet generator
    // searchParameterManager: defineCommerceSearchParameterManager(),
  },
} satisfies CommerceEngineConfig;

export const productListingConfig = {
  configuration: configuration,

  controllers: {
    context: defineContext(),
    // searchBox: defineSearchBox({options: {}}),
    searchBox: defineStandaloneSearchBox({
      options: {redirectionUrl: '/search'},
    }),
    search: defineSearch(),
    summary: defineQuerySummary(),
    // facets: defineCommerceFacets(), // TODO: need to support facet generator
    // searchParameterManager: defineCommerceSearchParameterManager(),
  },
} satisfies CommerceEngineConfig;
