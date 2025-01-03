import {html, LitElement, TemplateResult} from 'lit';
import {Bindings} from '../components/search/atomic-search-interface/interfaces';

export interface LitElementWithError extends LitElement {
  error?: Error;
}

export interface LitElementWithBindings extends LitElement {
  bindings?: Bindings;
}

export function ErrorGuard<Component extends LitElementWithError>(): (
  target: Component,
  propertyKey: 'render',
  descriptor: TypedPropertyDescriptor<
    () => string | TemplateResult | undefined | null
  >
) => void | TypedPropertyDescriptor<
  () => string | TemplateResult | undefined | null
> {
  return (_target, _propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: Component) {
      if (this.error) {
        console.error(this.error, this);
        return html` <div class="text-error">
          <p>
            <b>${this.nodeName.toLowerCase()} component error</b>
          </p>
          <p>Look at the developer console for more information.</p>
        </div>`;
      }
      return originalMethod?.call(this);
    };
    return descriptor;
  };
}

export function BindingGuard<Component extends LitElementWithBindings>(): (
  target: Component,
  propertyKey: 'render',
  descriptor: TypedPropertyDescriptor<
    () => string | TemplateResult | undefined | null
  >
) => void | TypedPropertyDescriptor<
  () => string | TemplateResult | undefined | null
> {
  return (_target, _propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: Component) {
      this.classList.toggle('atomic-hidden', !this.bindings);
      return this.bindings ? originalMethod?.call(this) : null;
    };
    return descriptor;
  };
}

// TODO: what is the purpose of data-atomic-rendered
// export function SetRenderedAttribute<
//   Component extends LitElementWithBindings,
// >(): (
//   target: Component,
//   propertyKey: 'render',
//   descriptor: TypedPropertyDescriptor<
//     () => string | TemplateResult | undefined | null
//   >
// ) => void | TypedPropertyDescriptor<
//   () => string | TemplateResult | undefined | null
// > {
//   return (_target, _propertyKey, descriptor) => {
//     const originalMethod = descriptor.value;
//     descriptor.value = function (this: Component) {
//       this.setAttribute(renderedAttribute, 'true');
//       descriptor.value = originalMethod;
//       return originalMethod?.call(this);
//     };
//     return descriptor;
//   };
// }
