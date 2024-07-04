import {Product} from '@coveo/headless/commerce-ssr';

interface ProductListCommonProps {
  products: Product[];
}

export default function ProductListCommon({products}: ProductListCommonProps) {
  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.ec_product_id}>
          <h3>{product.ec_name}</h3>
        </li>
      ))}
    </ul>
  );
}
