/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {NavigatorContext} from '@coveo/headless/ssr-commerce';
import {useEffect, useState} from 'react';
import {
  recommendationEngineDefinition,
  RecommendationHydratedState,
  RecommendationStaticState,
} from '../_lib/commerce-engine';
import {ProductList} from './product-list';

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Recommendation({
  staticState,
  navigatorContext,
}: {
  staticState: RecommendationStaticState;
  navigatorContext: NavigatorContext;
}) {
  const [hydratedState, setHydratedState] = useState<
    RecommendationHydratedState | undefined
  >(undefined);

  // Setting the navigator context provider also in client-side before hydrating the application
  recommendationEngineDefinition.setNavigatorContextProvider(
    () => navigatorContext
  );

  useEffect(() => {
    recommendationEngineDefinition
      .hydrateStaticState({
        searchActions: staticState.searchActions,
      })
      .then(({engine, controllers}) => {
        setHydratedState({engine, controllers});
        // TODO: we refresh the recommendations in the UI, not in the server
        // controllers.popularBoughtRecs.refresh();
      });
  }, [staticState]);

  return (
    <>
      {/* TODO: add UI component here */}
      <h2>popular_bought</h2>
      <h2>
        {(staticState.controllers as any).popularBoughtRecs.state.headline}
      </h2>
      <ProductList
        staticState={(staticState.controllers as any).popularBoughtRecs.state}
        controller={(hydratedState?.controllers as any).popularBoughtRecs}
      />
      <h2>
        {(staticState.controllers as any).popularViewedRecs.state.headline}
      </h2>
      <ProductList
        staticState={(staticState.controllers as any).popularViewedRecs.state}
        controller={(hydratedState?.controllers as any).popularViewedRecs}
      />
    </>
  );
}
