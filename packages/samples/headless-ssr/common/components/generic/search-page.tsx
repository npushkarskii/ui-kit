'use client';

import {useEffect, useState} from 'react';
// import {useSyncSearchParameterManager} from '../../hooks/generic/search-parameter-manager';
import {
  SearchStaticState,
  SearchHydratedState,
  hydrateStaticState,
} from '../../lib/generic/commerce-engine';
import {HydrationMetadata} from '../common/hydration-metadata';
import {ProductList} from './product-list';
import {SearchBox} from './search-box';

export default function SearchPage({
  staticState,
}: {
  staticState: SearchStaticState;
}) {
  const [hydratedState, setHydratedState] = useState<
    SearchHydratedState | undefined
  >(undefined);

  useEffect(() => {
    const {context} = staticState.controllers;
    hydrateStaticState({
      searchAction: staticState.searchAction,
      controllers: {
        context: {
          options: context.state,
        },
        // searchParameterManager: {
        //   initialState: searchParameterManager.state,
        // },
      },
    }).then(({engine, controllers}) => {
      setHydratedState({engine, controllers});
    });
  }, [staticState]);

  /**
   * This hook is used to synchronize the URL with the state of the search interface.
   */
  // useSyncSearchParameterManager({
  //   staticState: staticState.controllers.searchParameterManager.state,
  //   controller: hydratedState?.controllers.searchParameterManager,
  // });

  return (
    <>
      <SearchBox
        staticState={staticState.controllers.searchBox.state}
        controller={hydratedState?.controllers.searchBox}
      />
      {/* TODO: add facet generator component instead */}
      {/* <Facet
        title="Author"
        staticState={staticState.controllers.authorFacet.state}
        controller={hydratedState?.controllers.authorFacet}
      /> */}
      {/* TODO: uncomment */}
      <ProductList
        staticState={staticState.controllers.productList.state}
        controller={hydratedState?.controllers.productList}
      />
      <HydrationMetadata
        staticState={staticState}
        hydratedState={hydratedState}
      />
    </>
  );
}
