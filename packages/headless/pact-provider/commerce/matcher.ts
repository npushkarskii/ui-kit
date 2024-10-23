import {MatchersV3} from '@pact-foundation/pact';
import {
  commerceContextMatcher,
  sortByRelevanceMatcher,
} from '../commons/commerceContextMatcher.js';

const {
  eachLike,
  regex,
  integer,
  boolean,
  atMostLike,
  decimal,
  uuid,
  string,
  like,
  eachKeyMatches,
  fromProviderState,
} = MatchersV3;

export const commerceQuerySuggestMatcherFactory = () => ({
  method: 'POST',
  path: '/search/querySuggest',
  body: {
    query: string(),
    trackingId: string('acmecorporation_ca'),
    language: string('en'),
    currency: string('USD'),
    clientId: string('58bb4b98-1daa-4767-8c15-90a0ea67645c'),
    country: string(),
    context: like(commerceContextMatcher),
  },
});

export const commerceQuerySuggestResponseMatcherFactory = () => ({
  status: 200,
  headers: {'Content-Type': 'application/json'},
  body: {
    completions: atMostLike(
      {
        expression: string('suede'),
        score: decimal(1.0),
        highlighted: string('[suede]'),
        executableConfidence: decimal(),
        objectId: uuid(),
      },
      8,
      1
    ),
    responseId: uuid(),
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchMatcherFactory = (
  {sort} = {
    sort: sortByRelevanceMatcher,
  }
) => ({
  // TODO: find a better type
  method: 'POST',
  path: '/search',
  body: {
    // Required keys by the API
    trackingId: string('acmecorporation_ca'),
    language: string('en'),
    country: string('US'),
    currency: string('USD'),
    query: string(),
    context: like(commerceContextMatcher),
    page: fromProviderState('${page}', 0),

    // Non-required keys by the API
    ...eachKeyMatches(
      {
        perPage: integer(),
        sort,
        clientId: string('58bb4b98-1daa-4767-8c15-90a0ea67645c'),
        debug: boolean(false),
      },
      regex(
        'query|context|country|currency|language|organizationId|trackingId|url|clientId|facets|page|perPage|sort',
        '[commerceRequestKey]'
      )
    ),
  },
});

export const searchResponseMatcherFactory = () => ({
  status: 200,
  headers: {'Content-Type': 'application/json'},
  body: {
    responseId: uuid(),
    products: eachLike({
      additionalFields: like({
        size: string('M'),
        material: string('cotton'),
      }),
      ec_name: string('ACME Corp Summer Trends'),
      ec_description: string(
        'A very nice T-Shirt. Comes in blue and green colors.'
      ),
      ec_shortdesc: string('A very nice T-Shirt.'),
      ec_brand: string('ACME'),
      ec_category: string('T-Shirts'),
      ec_thumbnails: eachLike(string('https://example.com/thumbnail1.jpg')),
      ec_images: eachLike(string('https://example.com/image1.jpg')),
      ec_price: decimal(19.99),
      ec_promo_price: decimal(14.99),
      ec_in_stock: boolean(true),
      ec_item_group_id: string('0000003035'),
      ec_rating: decimal(4.5),
      ec_product_id: string('0000003035-45'),
      ec_gender: string('M'),
      ec_color: string('Blue'),
      ec_listing: string('T-Shirt'),
      clickUri: string('https://example.com/product/0000003035-45'),
      permanentid: string('0000003035-45'),
      nameHighlights: eachLike(string('ACME')),
      excerpt: string('The T-Shirt is very nice'),
      excerptHighlights: eachLike({
        length: integer(4),
        offset: integer(15),
      }),
      children: atMostLike(
        // TODO: have a children matcher
        like({
          additionalFields: like({
            size: like('M'),
            material: like('cotton'),
          }),
          ec_name: like('ACME Corp Summer Trends'),
          ec_description: like(
            'A very nice T-Shirt. Comes in blue and green colors.'
          ),
          ec_shortdesc: like('A very nice T-Shirt.'),
          ec_brand: like('ACME'),
          ec_category: like('T-Shirts'),
          ec_thumbnails: eachLike('https://example.com/thumbnail1.jpg'),
          ec_images: eachLike('https://example.com/image1.jpg'),
          ec_price: like(19.99),
          ec_promo_price: like(14.99),
          ec_in_stock: like(true),
          ec_item_group_id: like('0000003035'),
          ec_rating: like(4.5),
          ec_product_id: like('0000003035-45'),
          ec_gender: like('M'),
          ec_color: like('Blue'),
          ec_listing: like('T-Shirt'),
          clickUri: like('https://example.com/product/0000003035-45'),
          permanentid: like('0000003035-45'),
          nameHighlights: eachLike('ACME'),
          excerpt: like('The T-Shirt is very nice'),
          excerptHighlights: eachLike({
            length: like(4),
            offset: like(15),
          }),
        }),
        2,
        1
      ),
    }),
    facets: eachLike(
      {
        facetId: string(),
        field: string(),
        displayName: string(),
        values: eachLike({
          state: string('idle'),
          numberOfResults: integer(0),
          isAutoSelected: boolean(true),
          isSuggested: boolean(true),
          moreValuesAvailable: boolean(true),
          start: string(),
          end: string(),
          endInclusive: boolean(true),
        }),
        numberOfValues: like(0),
        type: string(),
        moreValuesAvailable: boolean(true),
        fromAutoSelect: boolean(true),
        isFieldExpanded: boolean(true),
      },
      0
    ),
    pagination: like({
      page: fromProviderState('${page}', 0),
      perPage: integer(48),
      totalPages: integer(14),
      totalEntries: integer(632),
    }),
    sort: like({
      appliedSort: like({
        type: string('fields'),
        field: string('ec_brand'),
        direction: string('asc'),
        displayName: string('Brand'),
      }),
      availableSorts: eachLike({
        type: string('relevance'),
        field: string('ec_price'),
        direction: string('desc'),
        displayName: string('Price'),
      }),
    }),
    executionReport: string('MAYBE'),
    triggers: eachLike(string('redirect')), //TODO: have a triggers matcher
    queryCorrection: like({
      originalQuery: string(),
      correctedQuery: string(),
      corrections: eachLike({
        correctedQuery: string(),
        wordCorrections: eachLike({
          correctedWord: string(),
          length: integer(8),
          offset: integer(15),
          originalWord: string(),
        }),
      }),
    }),
  },
});
