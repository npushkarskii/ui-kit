import {html} from 'lit-html';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LoadMoreContainer(children: any) {
  return html`
    <div class="flex flex-col items-center" part="container">${children}</div>
  `;
}
