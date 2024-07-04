import {
  ProductListing as ProductListingController,
  ProductListingState,
} from '@coveo/headless/commerce-ssr';
import {useEffect, useState, FunctionComponent} from 'react';
import ProductListCommon from '../common/product-list';

interface ProductListProps {
  staticState: ProductListingState;
  controller?: ProductListingController;
}

export const ProductList: FunctionComponent<ProductListProps> = ({
  staticState,
  controller,
}) => {
  const [state, setState] = useState(staticState);

  useEffect(
    () => controller?.subscribe(() => setState({...controller.state})),
    [controller]
  );

  return <ProductListCommon products={state.products} />;
};
