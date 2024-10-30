'use client';

import {NavigatorContext} from '@coveo/headless-react/ssr-commerce';
import {PropsWithChildren, useEffect, useState} from 'react';
import {
  HydratedStateProvider,
  listingEngineDefinition,
  ListingHydratedState,
  ListingStaticState,
  StaticListingStateProvider,
} from '../../_lib/commerce-engine';

interface ListinPageProps {
  staticState: ListingStaticState;
  navigatorContext: NavigatorContext;
}

export default function ListingPage({
  staticState,
  navigatorContext,
  children,
}: PropsWithChildren<ListinPageProps>) {
  const [hydratedState, setHydratedState] = useState<
    ListingHydratedState | undefined
  >(undefined);

  // Setting the navigator context provider also in client-side before hydrating the application
  listingEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  useEffect(() => {
    listingEngineDefinition
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

  if (hydratedState) {
    return (
      <HydratedStateProvider
        engine={hydratedState.engine}
        controllers={hydratedState.controllers}
      >
        <>{children}</>
      </HydratedStateProvider>
    );
  } else {
    return (
      <StaticListingStateProvider controllers={staticState.controllers}>
        {/* // TODO: FIXME:  Type 'React.ReactNode' is not assignable to type 'import(".../node_modules/@types/react/index").ReactNode'.
  Type 'bigint' is not assignable to type 'ReactNode'.*/}
        <>{children}</>
      </StaticListingStateProvider>
    );
  }
}
