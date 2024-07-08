import {RegularFacet as RegularFacetController} from '@coveo/headless/commerce-ssr';
import {useEffect, useState} from 'react';

interface FacetProps {
  facet: RegularFacetController;
}

export default function RegularFacet({facet}: FacetProps) {
  // TODO: this does not make sense to have this here has it will never change
  const [state, setState] = useState(facet.state);

  useEffect(
    () => facet?.subscribe?.(() => setState({...facet.state})),
    [facet]
  );

  return (
    <fieldset>
      <legend>{state.displayName} facet</legend>
      <ul className="facet-values">
        {state.values.map((value) => (
          <li key={value.value}>
            <input
              type="checkbox"
              checked={value.state === 'selected'}
              onChange={() => facet.toggleSelect(value)}
              disabled={state.isLoading}
            />
            {value.value} ({value.numberOfResults} products)
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
