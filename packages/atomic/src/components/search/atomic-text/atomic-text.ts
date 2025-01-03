import {
  css,
  CSSResultGroup,
  html,
  PropertyValues,
  TemplateResult,
  unsafeCSS,
} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {BindingGuard, ErrorGuard} from '../../../utils/component-guards.js';
import {initializeBindings} from '../../../utils/initialization-lit-utils.js';
import {TailwindLitElement} from '../../../utils/tailwind.element.js';
import type {Bindings} from '../atomic-search-interface/interfaces.js';
import styles from './atomic-text.styles.tw.css';

type GenericRender = string | TemplateResult | undefined | null;

/**
 * The `atomic-text` component leverages the I18n translation module through the atomic-search-interface.
 */
@customElement('atomic-text')
export class AtomicText extends TailwindLitElement {
  @initializeBindings() bindings!: Bindings;
  @state() public error!: Error;
  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (!this.value) {
      this.error = new Error('The "value" attribute must be defined.');
    }
    // this.setAttribute(renderedAttribute, 'false');
    // this.setAttribute(loadedAttribute, 'false');
  }
  #strings = {
    value: () => {
      return this.bindings.i18n.t(this.value, {
        count: this.count,
      });
    },
  };

  static styles: CSSResultGroup = [
    TailwindLitElement.styles,
    css`
      div {
        border: 1px solid red;
        border-radius: var(--atomic-border-radius-xl);
      }
    `,
    unsafeCSS(styles),
  ];

  #unsubscribeLanguageChanged = () => {};

  protected willUpdate(_changedProperties: PropertyValues): void {
    // TODO: can get rid of this?
    // console.log('WILL UPDATE');
    if (_changedProperties.has('bindings')) {
      this.#unsubscribeLanguageChanged();
      const onLanguageChanged = () => this.requestUpdate();
      this.bindings.i18n.on('languageChanged', onLanguageChanged);
      this.#unsubscribeLanguageChanged = () =>
        this.bindings.i18n.off('languageChanged', onLanguageChanged);
      //TODO initialize controller, to keep in mind when generalizing.
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    // this.setAttribute(renderedAttribute, 'false');
    // this.setAttribute(loadedAttribute, 'false');
    this.#unsubscribeLanguageChanged();
  }

  /**
   * The string key value.
   */
  @property({reflect: true, type: String}) public value!: string;
  /**
   * The count value used for plurals.
   */
  @property({reflect: true, type: Number}) public count?: number;

  @ErrorGuard()
  @BindingGuard()
  // @SetRenderedAttribute() // TODO: is this necessary?
  public render(): GenericRender {
    return html`<div class="bg-primary border p-2 text-xs">
      ${this.#strings.value()}
    </div>`;
  }
}

// const renderedAttribute = 'data-atomic-rendered';
// const loadedAttribute = 'data-atomic-loaded';

declare global {
  interface HTMLElementTagNameMap {
    'atomic-text': AtomicText;
  }
}
