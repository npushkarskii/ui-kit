import {PactV3} from '@pact-foundation/pact';
import {resolve} from 'node:path';
import {
  commerceQuerySuggestMatcherFactory,
  commerceQuerySuggestResponseMatcherFactory,
  searchMatcherFactory,
  searchResponseMatcherFactory,
} from './commerce/matcher.js';
import {
  querySuggestMatcherFactory,
  querySuggestResponseMatcherFactory,
} from './querySuggest/matcher.js';

// Create a 'pact' between the two applications in the integration we are testing
export const providerFactory = () =>
  new PactV3({
    dir: resolve(import.meta.dirname, 'pacts'),
    consumer: 'Headless',
    provider: 'SearchUI',
  });

export const addSuggestionInteraction = (provider: PactV3) =>
  provider
    .given('There are suggestions')
    .uponReceiving('a request for query suggestions')
    .withRequest(querySuggestMatcherFactory())
    .willRespondWith(querySuggestResponseMatcherFactory());

export const addCommerceSuggestionInteraction = (provider: PactV3) =>
  provider
    .given('There are commerce project suggestions')
    .uponReceiving('a request for commerce query suggestions')
    .withRequest(commerceQuerySuggestMatcherFactory())
    .willRespondWith(commerceQuerySuggestResponseMatcherFactory());

export const addCommerceSearchInteraction = (
  provider: PactV3,
  name = 'There are search results',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalTemplate: any = {} // TODO: find a better type,
) =>
  provider
    .given(name)
    .uponReceiving('a request for search results')
    .withRequest(searchMatcherFactory(additionalTemplate))
    .willRespondWith(searchResponseMatcherFactory());
