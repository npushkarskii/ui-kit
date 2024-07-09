import {
  Controller,
  ControllerDefinitionsMap,
  CommerceEngineDefinitionOptions, // defineCommerceFacets,
  CommerceEngine,
  defineProductListing,
  defineStandaloneSearchBox, // defineSearchBox,
  defineContext, // defineCommerceSearchParameterManager,
  getSampleCommerceEngineConfiguration,
  defineFacets,
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
};

const commonControllers = {
  context: defineContext(),
  // searchParameterManager: defineCommerceSearchParameterManager(), // TODO: not sure
};

export const searchConfig = {
  configuration: configuration,
  controllers: {
    ...commonControllers,
    searchBox: defineSearchBox({options: {}}),
    search: defineSearch(),
    summary: defineQuerySummary(),
    facets: defineFacets(),
  },
} satisfies CommerceEngineConfig;

export const productListingConfig = {
  configuration: configuration,
  controllers: {
    ...commonControllers,
    searchBox: defineStandaloneSearchBox({
      options: {redirectionUrl: '/search'},
    }),
    productList: defineProductListing(), // TODO: also need to know how to configure a search page
    summary: defineQuerySummary(),
    facets: defineFacets(),
  },
} satisfies CommerceEngineConfig;
