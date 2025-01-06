import {html} from 'lit-html';

export const loadMoreContainer = <T>(children: T) => html`
  <div class="flex flex-col items-center" part="container">${children}</div>
`;
