import {
  RegularFacet as RegularFacetController,
  RegularFacetState,
} from '@coveo/headless/commerce-ssr';
import {useEffect, useState} from 'react';

interface FacetProps {
  staticState: RegularFacetState;
  controller: RegularFacetController;
}

export default function RegularFacet({controller, staticState}: FacetProps) {
  // TODO: this does not make sense to have this here has it will never change
  const [state, setState] = useState(staticState);

  useEffect(() => {
    return controller?.subscribe?.(() => setState({...controller.state}));
  }, [controller]);

  return (
    <fieldset>
      <legend>{state.displayName} facet</legend>
      <ul className="facet-values">
        {state.values?.map((value) => (
          <li key={value.value}>
            <input
              type="checkbox"
              checked={value.state === 'selected'}
              onChange={() => controller.toggleSelect(value)}
              disabled={state.isLoading}
            />
            {value.value} ({value.numberOfResults} products)
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
