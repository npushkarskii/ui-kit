import {PactV3} from '@pact-foundation/pact';
import {describe, it, expect} from 'vitest';
import {sortByFieldsMatcher} from '../../../pact-provider/commons/commerceContextMatcher.js';
import {
  providerFactory,
  addSuggestionInteraction,
  addCommerceSearchInteraction,
  addCommerceSuggestionInteraction,
} from '../../../pact-provider/provider.js';
import {getSampleCommerceEngineConfiguration} from '../../app/commerce-engine/commerce-engine-configuration.js';
import {buildCommerceEngine} from '../../app/commerce-engine/commerce-engine.js';
import {
  buildSearchEngine,
  getSampleSearchEngineConfiguration,
} from '../../app/search-engine/search-engine.js';
import {
  buildFieldsSortCriterion,
  SortDirection,
} from '../../features/sort/sort.js';
import {buildSearchBox as buildCommerceSearchBox} from '../commerce/search-box/headless-search-box.js';
import {buildSearch} from '../commerce/search/headless-search.js';
import {Controller} from '../controller/headless-controller.js';
import {buildSearchBox} from './headless-search-box.js';

const getSearchBoxController = (url: string) => {
  const configuration = getSampleSearchEngineConfiguration();
  configuration.search!.proxyBaseUrl = url;
  const engine = buildSearchEngine({
    configuration,
    navigatorContextProvider: () => ({
      clientId: crypto.randomUUID(),
      location: 'some location',
      referrer: 'some referrer',
      userAgent: 'some user agent',
    }),
  });
  return buildSearchBox(engine);
};

const getCommerceControllers = (url: string) => {
  const configuration = getSampleCommerceEngineConfiguration();
  configuration.proxyBaseUrl = url;
  const engine = buildCommerceEngine({
    configuration,
    navigatorContextProvider: () => ({
      clientId: crypto.randomUUID(),
      location: 'some location',
      referrer: 'some referrer',
      userAgent: 'some user agent',
    }),
  });
  const search = buildSearch(engine);

  return {
    products: search,
    searchBox: buildCommerceSearchBox(engine),
    pagination: search.pagination(),
    sort: search.sort(),
  };
};

describe('SearchBox', () => {
  let provider: PactV3;
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    provider = providerFactory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when there are suggestions available', () => {
    beforeEach(() => {
      provider = addSuggestionInteraction(provider);
    });

    it('should return suggestions', async () => {
      await provider.executeTest(async (mockServer) => {
        const searchBox = getSearchBoxController(mockServer.url);
        searchBox.showSuggestions();
        await waitForNSubscribeCallback(searchBox, 2);
        expect(searchBox.state).toMatchSnapshot();
      });
    });
  });

  // TODO: move this to commerce contract testing
  describe('when there are search results available', () => {
    beforeEach(() => {
      provider = addCommerceSuggestionInteraction(provider);
      provider = addCommerceSearchInteraction(provider);
    });

    it('should return search results', async () => {
      await provider.executeTest(async (mockServer) => {
        const {searchBox, products} = getCommerceControllers(mockServer.url);
        searchBox.updateText('blue shoes');
        await waitForNSubscribeCallback(searchBox, 2);
        searchBox.submit();
        await waitForNSubscribeCallback(searchBox, 2);
        expect(products.state.products).toMatchSnapshot();
      });
    });
    // TODO: test with pager and sort criteria
  });

  // TODO: put in loadmore contract testing
  describe('when sorting by fields', () => {
    beforeEach(() => {
      provider = addCommerceSearchInteraction(
        provider,
        'Sorting results by fields',
        {
          sort: sortByFieldsMatcher,
        }
      );
    });

    it('should return search results', async () => {
      await provider.executeTest(async (mockServer) => {
        const {sort, products} = getCommerceControllers(mockServer.url);
        sort.sortBy(
          buildFieldsSortCriterion([
            {name: 'custom_field', direction: SortDirection.Ascending},
          ])
        );
        await waitForNSubscribeCallback(products, 2);
        expect(sort.state).toMatchSnapshot();
      });
    });
    // TODO: test with pager and sort criteria
  });

  describe('when there are more products available', () => {
    beforeEach(() => {
      provider = addCommerceSearchInteraction(
        provider
        // 'There are search results with pagination',
        // commercePagerMatcher
      );
    });

    it('should return search results', async () => {
      await provider.executeTest(async (mockServer) => {
        const {pagination, products} = getCommerceControllers(mockServer.url);
        pagination.setPageSize(48); // Mock the pageSize returned by the API
        pagination.nextPage();
        await waitForNSubscribeCallback(products, 2);
        expect(pagination.state).toMatchSnapshot();
      });
    });
    // TODO: test with pager and sort criteria
  });
});

async function waitForNSubscribeCallback(
  controller: Controller,
  subscribeThreshold: number
) {
  await new Promise<void>((resolve) => {
    let subscribeCount = 0;
    controller.subscribe(() => {
      if (++subscribeCount < subscribeThreshold) {
        return;
      }
      resolve();
    });
  });
}
