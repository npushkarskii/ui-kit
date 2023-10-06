import {CommerceAPIErrorStatusResponse} from '../../../api/commerce/commerce-api-error-response';
import {ProductRecommendation} from '../../../api/search/search/product-recommendation';
import {AnyFacetResponse} from '../../facets/generic/interfaces/generic-facet-response';
import {buildRelevanceSortCriterion} from '../../sort/sort';
import {Sort} from './sort/product-listing-sort';

export interface ProductListingV2State {
  error: CommerceAPIErrorStatusResponse | null;
  isLoading: boolean;
  responseId: string;
  products: ProductRecommendation[];
  facets: AnyFacetResponse[];
  sort: Sort;
}

export const getProductListingV2InitialState = (): ProductListingV2State => ({
  error: null,
  isLoading: false,
  responseId: '',
  products: [],
  facets: [],
  sort: {
    appliedSort: buildRelevanceSortCriterion(),
    availableSorts: [],
  },
});