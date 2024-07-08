import {
  FacetGeneratorState,
  FacetGenerator as FacetGeneratorController,
} from '@coveo/headless/commerce-ssr';
import {FunctionComponent} from 'react';
import NumericFacet from '../common/numeric-facet';
import RegularFacet from '../common/regular-facet';

// import {Facet} from './facet';

interface FacetGeneratorProps {
  staticState: FacetGeneratorState;
  controller?: FacetGeneratorController;
}

export const FacetGenerator: FunctionComponent<FacetGeneratorProps> = ({
  staticState,
  controller,
}) => {
  // TODO:  state is useless
  // const [_, setState] = useState(staticState);

  // useEffect(
  //   () => controller?.subscribe?.(() => setState({...controller.state})),
  //   [controller]
  // );

  return (
    <>
      {controller?.facets?.map((facet) => {
        switch (facet.type) {
          case 'regular':
            return <RegularFacet facet={facet} />; // TODO: need a way to pass the static state
          case 'numericalRange':
            return <NumericFacet facet={facet} />;

          default:
            return <>Unsupported Facet type: {facet.type}</>;
        }
      })}
    </>
  );
};
