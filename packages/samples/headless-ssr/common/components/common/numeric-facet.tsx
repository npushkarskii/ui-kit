import {NumericFacet as NumericFacetController} from '@coveo/headless/commerce-ssr';

interface FacetProps {
  facet: NumericFacetController;
}

export default function RegularFacet({facet}: FacetProps) {
  return (
    <fieldset>
      <legend>{facet.state.displayName} facet</legend>
      <ul className="facet-values">
        {facet.state.values.map((value) => (
          // TODO: support numeric facet
          <li key={value.start}>
            <input
              type="checkbox"
              checked={value.state === 'selected'}
              onChange={() => facet.toggleExclude(value)}
              disabled={facet.state.isLoading}
            />
            {value.start} ({value.numberOfResults} products)
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
