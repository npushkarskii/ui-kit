'use client';

import {NavigatorContext} from '@coveo/headless/ssr-commerce';
import {useEffect, useState} from 'react';
import {
  searchEngineDefinition,
  SearchHydratedState,
  SearchStaticState,
} from '../_lib/commerce-engine';
import {Cart} from './cart';
import {ProductList} from './product-list';
import {Summary} from './summary';

export default function SearchPage({
  staticState,
  navigatorContext,
}: {
  staticState: SearchStaticState;
  navigatorContext: NavigatorContext;
}) {
  const [hydratedState, setHydratedState] = useState<
    SearchHydratedState | undefined
  >(undefined);

  // Setting the navigator context provider also in client-side before hydrating the application
  searchEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  useEffect(() => {
    searchEngineDefinition
      .hydrateStaticState({
        searchAction: staticState.searchAction,
      })
      .then(({engine, controllers}) => {
        console.log('*********************');
        console.log(controllers);
        console.log('*********************');
        setHydratedState({engine, controllers});
      });
  }, [staticState]);

  return (
    <>
      <h1>Search Page</h1>
      {/* TODO: add UI component here */}
      <Cart
        staticState={staticState.controllers.cart.state}
        controller={hydratedState?.controllers.cart}
      ></Cart>
      <h2>Search List</h2>
      <ProductList
        staticState={staticState.controllers.productList.state}
        controller={hydratedState?.controllers.productList}
        cart={hydratedState?.controllers.cart}
      />
      <Summary
        staticState={staticState.controllers.summary.state}
        controller={hydratedState?.controllers.summary}
        hydratedState={hydratedState}
      />
    </>
  );
}
