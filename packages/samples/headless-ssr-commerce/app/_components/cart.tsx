import {Cart as CartController, CartState} from '@coveo/headless/ssr-commerce';
import {useEffect, useState, FunctionComponent} from 'react';

interface CartProps {
  staticState: CartState;
  controller?: CartController;
}

export const Cart: FunctionComponent<CartProps> = ({
  staticState,
  controller,
}) => {
  const [state, setState] = useState(staticState);

  useEffect(
    () => controller?.subscribe(() => setState({...controller.state})),
    [controller]
  );

  return (
    <>
      <h2>Cart</h2>
      <ul className="product-list">
        {state.items.map((product) => (
          <li key={product.name}>
            <h3>{product.name}</h3>
          </li>
        ))}
      </ul>
    </>
  );
};
