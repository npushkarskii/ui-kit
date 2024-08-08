import {headers} from 'next/headers';
import Nav from '../_components/nav';
import SearchPage from '../_components/search-page';
import {searchEngineDefinition} from '../_lib/commerce-engine';
import {NextJsNavigatorContext} from '../_lib/navigatorContextProvider';

/**
 * This file defines a List component that uses the Coveo Headless SSR commerce library to manage its state.
 *
 * The Listing function is the entry point for server-side rendering (SSR).
 */
export default async function Listing() {
  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  searchEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  // Fetches the static state of the app with initial state (when applicable)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const staticState = await searchEngineDefinition.fetchStaticState();

  return (
    // TODO: remove page suffix since it is a component!
    <>
      <Nav></Nav>
      <SearchPage
        staticState={staticState}
        navigatorContext={navigatorContext.marshal}
      ></SearchPage>
    </>
  );
}

export const dynamic = 'force-dynamic';
