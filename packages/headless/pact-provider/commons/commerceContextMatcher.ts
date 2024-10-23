import {MatchersV3} from '@pact-foundation/pact';
import {SortBy} from '../../src/features/sort/sort.js';

const {
  equal,
  regex,
  like,
  string,
  integer,
  boolean,
  atLeastOneLike,
  eachLike,
  eachKeyMatches,
} = MatchersV3;

export const commerceContextMatcher = like({
  user: like({
    userAgent: string(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    ),
    // latitude: decimal(46.8131),
    // longitude: decimal(71.2075),
  }),
  view: eachKeyMatches(
    {
      url: string(),
      referrer: string(),
    },
    regex('url|referrer', 'url')
  ),
  cart: eachLike(
    {
      productId: string('shoe-a1-red'),
      quantity: integer(2),
    },
    0
  ),
  source: atLeastOneLike(string('@coveo/headless@2.61.0')),
  capture: boolean(true),
  // labels: like({
  //   category: string('garden > garden-tools > chainsaws'),
  //   brand: string('ACME'),
  // }),
});

export const commercePagerMatcher = {perPage: integer(30)};

export const sortByRelevanceMatcher = {sortCriteria: equal(SortBy.Relevance)};
export const sortByFieldsMatcher = {
  sortCriteria: equal(SortBy.Fields),
  fields: eachLike({
    field: string('price'),
    ...eachKeyMatches(
      {
        direction: regex('asc|desc', 'asc'),
      },
      regex('field|direction', 'asc')
    ),
  }),
};
