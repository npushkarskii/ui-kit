import {CommerceEngine} from '../../../app/commerce-engine/commerce-engine';
import {ControllerDefinitionWithoutProps} from '../../../app/ssr-engine/types/common';
import {ProductListing, buildProductListing} from './headless-product-listing';

export * from './headless-product-listing';

export interface ProductListingDefinition
  extends ControllerDefinitionWithoutProps<CommerceEngine, ProductListing> {}

/**
 * Defines a `ProductListing` controller instance.
 *
 * @param props - The configurable `ProductListing` properties.
 * @returns The `ProductListing` controller definition.
 * */
export function defineProductListing(): ProductListingDefinition {
  return {
    build: (engine) => buildProductListing(engine),
  };
}
