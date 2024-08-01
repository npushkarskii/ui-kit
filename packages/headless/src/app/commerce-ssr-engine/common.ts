import {Controller} from '../../controllers/controller/headless-controller';
import {InvalidControllerDefinition} from '../../utils/errors';
import {mapObject} from '../../utils/utils';
import {CoreEngine, CoreEngineNext} from '../engine';
import {InferControllerPropsMapFromDefinitions} from '../ssr-engine/types/common';
import {
  ControllerDefinition,
  ControllerDefinitionOption,
  ControllerDefinitionsMap,
  InferControllerFromDefinition,
  InferControllerPropsFromDefinition,
  InferControllersMapFromDefinition,
  SolutionType,
} from './types/common';

function buildControllerFromDefinition<
  TControllerDefinition extends ControllerDefinition<TEngine, Controller>,
  TEngine extends CoreEngine | CoreEngineNext,
>({
  definition,
  engine,
  solutionType,
  props,
}: {
  definition: TControllerDefinition;
  engine: TEngine;
  solutionType: SolutionType;
  props?: InferControllerPropsFromDefinition<TControllerDefinition>;
}): InferControllerFromDefinition<TControllerDefinition> {
  return (
    'build' in definition
      ? definition.build(engine, solutionType)
      : definition.buildWithProps(engine, props, solutionType)
  ) as InferControllerFromDefinition<TControllerDefinition>;
}

export function buildControllerDefinitions<
  TControllerDefinitionsMap extends ControllerDefinitionsMap<
    CoreEngine | CoreEngineNext,
    Controller
  >,
  TEngine extends CoreEngine | CoreEngineNext,
  TSolutionType extends SolutionType,
>({
  definitionsMap,
  engine,
  solutionType,
  propsMap,
}: {
  definitionsMap: TControllerDefinitionsMap;
  engine: TEngine;
  solutionType: TSolutionType;
  propsMap: InferControllerPropsMapFromDefinitions<TControllerDefinitionsMap>;
}): InferControllersMapFromDefinition<
  TControllerDefinitionsMap,
  TSolutionType
> {
  return mapObject(definitionsMap, (definition, key) =>
    buildControllerFromDefinition({
      definition,
      engine,
      solutionType,
      props: propsMap?.[key as keyof typeof propsMap],
    })
  ) as InferControllersMapFromDefinition<
    TControllerDefinitionsMap,
    TSolutionType
  >;
}

export function ensureAtLeastOneSolutionType(
  options?: ControllerDefinitionOption
) {
  if (options?.listing === false && options?.search === false) {
    throw new InvalidControllerDefinition();
  }
}