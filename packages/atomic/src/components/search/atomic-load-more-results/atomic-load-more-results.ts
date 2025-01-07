import {
  buildQuerySummary,
  buildResultList,
  QuerySummary,
  QuerySummaryState,
  ResultList,
  ResultListState,
} from '@coveo/headless';
import {LitElement} from 'lit';
import {html, TemplateResult} from 'lit-html';
import {customElement, state} from 'lit/decorators.js';
import {BindingGuard, ErrorGuard} from '../../../utils/component-guards.js';
import {
  bindStateToController,
  initializeBindings,
} from '../../../utils/initialization-lit-utils.js';
import {loadMoreButton} from '../../common/load-more/lit-button.js';
import {loadMoreGuard} from '../../common/load-more/lit-guard.js';
import {loadMoreProgressBar} from '../../common/load-more/lit-progress-bar.js';
import '../../common/load-more/lit-summary.js';
import {loadMoreSummary} from '../../common/load-more/lit-summary.js';
import type {Bindings} from '../atomic-search-interface/interfaces.js';

type GenericRender = string | TemplateResult | undefined | null; // TODO: remove this and move to util

@customElement('atomic-load-more-results')
export class AtomicLoadMoreResults extends LitElement {
  public resultList!: ResultList;
  public querySummary!: QuerySummary;
  @initializeBindings() bindings!: Bindings;
  @state() public error!: Error;

  @bindStateToController('querySummary')
  @state()
  private querySummaryState!: QuerySummaryState;
  @bindStateToController('resultList')
  @state()
  private resultListState!: ResultListState;

  public initialize() {
    console.log('Initializable Elements', this.bindings);
    this.querySummary = buildQuerySummary(this.bindings.engine);
    this.resultList = buildResultList(this.bindings.engine, {
      options: {
        fieldsToInclude: [],
      },
    });
  }

  private onClick() {
    this.bindings.store.state.resultList?.focusOnNextNewResult();
    this.resultList.fetchMoreResults();
  }

  // TODO: move these 2 decorator in class decorator or in a component mixin!
  @ErrorGuard()
  @BindingGuard()
  public render(): GenericRender {
    const {lastResult: from, total: to} = this.querySummaryState;
    const {i18n} = this.bindings;
    const summary = loadMoreSummary({
      i18n,
      from,
      to,
    });
    const progressBar = loadMoreProgressBar({
      from,
      to,
    });
    const button = loadMoreButton({
      i18n,
      moreAvailable: this.resultListState.moreResultsAvailable,
      onClick: () => this.onClick(),
    });

    return html`${loadMoreGuard(
      {
        hasResults: this.querySummaryState.hasResults,
        isLoaded: this.bindings.store.isAppLoaded(),
      },
      html`${summary}${progressBar}${button}`
    )}`;
  }
}
