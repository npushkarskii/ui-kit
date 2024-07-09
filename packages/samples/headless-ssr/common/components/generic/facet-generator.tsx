import {
  FacetGeneratorState,
  FacetGenerator as FacetGeneratorController,
} from '@coveo/headless/commerce-ssr';
import {FunctionComponent} from 'react';
// import NumericFacet from '../common/numeric-facet';
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
      {
        // staticState?.facets?.map((facet) => {
        Object.values(staticState).map((facet) => {
          switch (facet.type) {
            case 'regular':
              return (
                <RegularFacet
                  controller={controller?.facets[0] as any}
                  staticState={facet.state}
                />
              ); // TODO: need a way to pass the static state
            case 'numericalRange':
              // return <RegularFacet facet={staticState[0] as any} />;
              return <>Unsupported Facet type: {facet.type}</>;
            default:
              return <>Unsupported Facet type: {facet.type}</>;
          }
        })

        //   }
      }
    </>
  );
};
