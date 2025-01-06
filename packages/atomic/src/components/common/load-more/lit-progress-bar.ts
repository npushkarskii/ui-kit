import {html} from 'lit-html';

interface LoadMoreProgressBarProps {
  from: number;
  to: number;
}

export function loadMoreProgressBar({from, to}: LoadMoreProgressBarProps) {
  const percentage = (from / to) * 100;
  const width = `${Math.ceil(percentage)}%`;
  return html`<div
    part="progress-bar"
    class="bg-neutral relative my-2 h-1 w-72 rounded"
  >
    <div
      class="progress-bar z-1 absolute left-0 top-0 h-full overflow-hidden rounded bg-gradient-to-r"
      style="${width}"
    ></div>
  </div>`;
}
