'use client';

import {NavigatorContext} from '@coveo/headless-react/ssr-commerce';
import {useEffect, useState} from 'react';
import {
  SearchHydratedState,
  SearchStaticState,
  searchEngineDefinition,
} from '../../_lib/commerce-engine';
import FacetGenerator from '../facets/facet-generator';
import ProductList from '../product-list';
import {Recommendations} from '../recommendation-list';
import SearchBox from '../search-box';
import ShowMore from '../show-more';
import Summary from '../summary';
import Triggers from '../triggers/triggers';

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
        setHydratedState({engine, controllers});

        // Refreshing recommendations in the browser after hydrating the state in the client-side
        // Recommendation refresh in the server is not supported yet.
        controllers.popularBoughtRecs.refresh();
      });
  }, [staticState]);

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{flex: 1}}>
          <Triggers
            redirectionStaticState={
              staticState.controllers.redirectionTrigger.state
            }
            redirectionController={
              hydratedState?.controllers.redirectionTrigger
            }
            queryStaticState={staticState.controllers.queryTrigger.state}
            queryDontroller={hydratedState?.controllers.queryTrigger}
            notifyStaticState={staticState.controllers.notifyTrigger.state}
            notifyController={hydratedState?.controllers.notifyTrigger}
          />
          <SearchBox />
          <FacetGenerator />
          <Summary />
          <ProductList />
          {/* The ShowMore and Pagination components showcase two frequent ways to implement pagination. */}
          {/* <Pagination
          staticState={staticState.controllers.pagination.state}
          controller={hydratedState?.controllers.pagination}
        ></Pagination> */}
          <ShowMore />
        </div>

        <div style={{flex: 1}}>
          {/* popularBoughtRecs */}
          {/* TODO: need to find a better way to target a recommendation slot id */}
          <Recommendations />
        </div>
      </div>
    </>
  );
}
