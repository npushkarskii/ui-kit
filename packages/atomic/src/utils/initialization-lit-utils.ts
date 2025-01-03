import {Controller} from '@coveo/headless';
import {PropertyValues, ReactiveElement} from 'lit';
import {AnyBindings} from '../components/common/interface/bindings';
import {Bindings} from '../components/search/atomic-search-interface/interfaces';
import {closest} from './dom-utils.js';
import {buildCustomEvent} from './event-utils.js';
import {
  initializeEventName,
  initializableElements,
  InitializeEventHandler,
  MissingInterfaceParentError,
} from './initialization-lit-stencil-common-utils.js';

export {
  initializableElements,
  InitializeEventHandler,
  MissingInterfaceParentError,
} from './initialization-lit-stencil-common-utils.js';

type ControllerProperties<T> = {
  [K in keyof T]: T[K] extends Controller ? K : never;
}[keyof T];

export interface InitializableComponent<
  SpecificBindings extends AnyBindings = Bindings,
> {
  /**
   * Bindings passed from the `AtomicSearchInterface` to its children components.
   */
  bindings?: SpecificBindings;
  /**
   * Method called right after the `bindings` property is defined. This is the method where Headless Framework controllers should be initialized.
   */
  initialize?: () => void;
  error?: Error;
}

export function fetchBindings<SpecificBindings extends AnyBindings>(
  element: Element
) {
  return new Promise<SpecificBindings>((resolve, reject) => {
    const event = buildCustomEvent<InitializeEventHandler>(
      initializeEventName,
      (bindings: unknown) => resolve(bindings as SpecificBindings)
    );
    element.dispatchEvent(event);

    if (!closest(element, initializableElements.join(', '))) {
      reject(new MissingInterfaceParentError(element.nodeName.toLowerCase()));
    }
  });
}

/**
 * Retrieves `Bindings` or `CommerceBindings` on a configured parent interface.
 * @param event - The element on which to dispatch the event, which must be the child of a configured Atomic container element.
 * @returns A promise that resolves upon initialization of the parent container element, and rejects otherwise.
 */
export const initializeBindings =
  () =>
  <SpecificBindings extends AnyBindings>(
    proto: ReactiveElement,
    bindingsProperty: string
  ) => {
    type InstanceType<SpecificBindings extends AnyBindings> = ReactiveElement &
      InitializableComponent<SpecificBindings>;

    const ctor = proto.constructor as typeof ReactiveElement;
    const host = {
      _instance: null as InstanceType<SpecificBindings> | null,
      get: () => host._instance,
      set: (instance: InstanceType<SpecificBindings>) => {
        host._instance = instance;
      },
    };

    proto.addController({
      hostConnected() {
        // TODO: update language on languageChanged
        // this.bindings.i18n.on('languageChanged', updateLanguage);
        const instance = host.get();
        if (!instance) {
          return;
        }

        fetchBindings<SpecificBindings>(instance)
          .then((bindings) => {
            instance.bindings = bindings;

            if (instance.initialize) {
              instance.initialize();
            }
          })
          .catch((error) => {
            instance.error = error;
          });
      },
    });

    ctor.addInitializer((instance) => {
      host.set(instance);
      if (bindingsProperty !== 'bindings') {
        return console.error(
          `The InitializeBindings decorator should be used on a property called "bindings", and not "${bindingsProperty}"`,
          instance
        );
      }
    });
  };

export function bindStateToController<Element extends ReactiveElement>( // TODO: check if can inject @state decorator
  controllerProperty: ControllerProperties<Element>,
  options?: {
    /**
     * Component's method to be called when state is updated.
     */
    onUpdateCallbackMethod?: string;
  }
) {
  return <
    T extends Record<ControllerProperties<Element>, Controller> &
      Record<string, unknown>,
    Instance extends Element &
      T &
      InitializableComponent & {shouldUpdate: ReactiveElement['shouldUpdate']},
    K extends keyof Instance,
  >(
    proto: Element,
    stateProperty: K
  ) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      const component = instance as Instance;
      const {disconnectedCallback, initialize, shouldUpdate} = component;

      component.shouldUpdate = function (changedProperties: PropertyValues) {
        return (
          shouldUpdate.call(this, changedProperties) &&
          [...changedProperties.values()].some((v) => v !== undefined)
        );
      };

      component.initialize = function () {
        initialize && initialize.call(this);

        if (!component[controllerProperty]) {
          return;
        }

        if (
          options?.onUpdateCallbackMethod &&
          !component[options.onUpdateCallbackMethod]
        ) {
          return console.error(
            `ControllerState: The onUpdateCallbackMethod property "${options.onUpdateCallbackMethod}" is not defined`,
            component
          );
        }

        const controller = component[controllerProperty];
        const updateCallback = options?.onUpdateCallbackMethod
          ? component[options.onUpdateCallbackMethod]
          : undefined;

        const unsubscribeController = controller.subscribe(() => {
          component[stateProperty] = controller.state as Instance[K];
          typeof updateCallback === 'function' && updateCallback();
        });

        component.disconnectedCallback = function () {
          !component.isConnected && unsubscribeController?.();
          disconnectedCallback && disconnectedCallback.call(component);
        };
      };
    });
  };
}
