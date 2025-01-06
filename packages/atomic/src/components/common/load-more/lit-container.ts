import {html, TemplateResult} from 'lit-html';

export function LoadMoreContainer(children: TemplateResult<1>) {
  return html`
    <div class="flex flex-col items-center" part="container">${children}</div>
  `;
}
