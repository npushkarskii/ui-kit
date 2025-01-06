import {i18n} from 'i18next';
import {html} from 'lit-html';

// import {Button} from '../button';

interface LoadMoreButtonProps {
  i18n: i18n;
  onClick: () => void;
  moreAvailable: boolean;
  label?: 'load-more-results' | 'load-more-products';
}

export function LoadMoreButton({
  i18n,
  onClick,
  moreAvailable,
  label,
}: LoadMoreButtonProps) {
  if (!moreAvailable) {
    return;
  }
  // TODO: use button function
  return html`<button
    style="primary"
    part="load-more-results-button"
    class="my-2 p-3 font-bold"
    @click=${() => onClick()}
  >
    ${i18n.t(label || 'load-more-results')}
  </button>`;
}
