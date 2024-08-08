import {SharedControllerDefinitionWithoutProps} from '../../../../app/commerce-ssr-engine/types/common';
import {buildCart, Cart, CartProps} from './headless-cart';

export interface CartDefinition
  extends SharedControllerDefinitionWithoutProps<Cart> {}

export type {CartState, Cart} from './headless-cart';

/**
 * @internal
 * Defines a `Cart` controller instance.
 *
 * @param props - The configurable `SearchBox` properties.
 * @returns The `SearchBox` controller definition.
 * */
export function defineCart(props: CartProps): CartDefinition {
  return {
    listing: true,
    search: true,
    build: (engine) => buildCart(engine, props),
  };
}
