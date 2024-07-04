import {CommerceEngine} from '../../../app/commerce-engine/commerce-engine';
import {ControllerDefinitionWithProps} from '../../../app/ssr-engine/types/common';
import {Context, ContextProps, buildContext} from './headless-context';

export * from './headless-context';

export interface ContextDefinition
  extends ControllerDefinitionWithProps<
    CommerceEngine,
    Context,
    ContextProps
  > {}

/**
 * Defines a `Context` controller instance.
 *
 * @returns The `Context` controller definition.
 * */
export function defineContext(): ContextDefinition {
  return {
    // TODO: check if correctly sets the initial state
    // TODO: check if it works well with context switch reducer
    buildWithProps: (engine, props) => buildContext(engine, props),
  };
}
