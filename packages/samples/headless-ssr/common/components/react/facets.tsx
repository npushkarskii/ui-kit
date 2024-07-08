'use client';

import {useAuthorFacet} from '../../lib/react/engine';
import RegularFacet from '../common/facet';

export const AuthorFacet = () => {
  const {state, methods} = useAuthorFacet();

  return (
    <RegularFacet
      title="Author"
      values={state.values}
      facetSearchQuery={state.facetSearch.query}
      facetSearchResults={state.facetSearch.values}
      isLoading={state.isLoading}
      onToggleValue={methods && ((value) => methods.toggleSelect(value))}
      onUpdateSearchQuery={
        methods && ((query) => methods.facetSearch.updateText(query))
      }
      onSubmitSearch={methods && (() => methods.facetSearch.search())}
      onToggleSearchResult={
        methods && ((result) => methods.facetSearch.select(result))
      }
    />
  );
};
