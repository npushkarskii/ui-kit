import {SharedControllerDefinition} from '../../../app/ssr-engine/types/common';
import {Controller} from '../../controller/headless-controller';
import {buildSearchBox, SearchBox} from './headless-search-box';

type SolutionTypeControllerDefinition<TController extends Controller> =
  SharedControllerDefinition<TController>;

/**
 * @internal
 * */
export function defineSearchBox(): SolutionTypeControllerDefinition<SearchBox> {
  return {
    listing: true, // Again, if we can avoid having to set these boolean to ensure the type is inferred correctly, it would be better
    search: true,
    build: (engine) => buildSearchBox(engine),
  };
}
