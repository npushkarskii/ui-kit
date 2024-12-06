import manifest from '@coveo/atomic/custom-element-manifest' with {type: 'json'};
import {createWriteStream} from 'fs';

const commerceIndexFilePipe = createWriteStream(
  'src/components/stencil-generated/commerce/index.ts',
);
const searchIndexFilePipe = createWriteStream(
  'src/components/stencil-generated/search/index.ts'
);

commerceIndexFilePipe.write(
  `
import React from 'react';
import {createComponent} from '@lit/react';
`
);

searchIndexFilePipe.write(
  `
import React from 'react';
import {createComponent} from '@lit/react';
`
);

const getClassFromTag = (tag) => tag.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

const getComponentDeclaration = (moduleExport) =>
  `
import {defineCustomElement as define${moduleExport.declaration.name}, ${getClassFromTag(moduleExport.name)} as WC_${moduleExport.declaration.name}} from '@coveo/atomic/components/${moduleExport.declaration.module.split('/').pop().split(".").shift()}';
define${moduleExport.declaration.name}();
export const ${getClassFromTag(moduleExport.name)} = createComponent({
  tagName: '${moduleExport.name}',
  elementClass: WC_${moduleExport.declaration.name},
  react: React,
});
`;

for (const module of manifest.modules) {
  for (const moduleExport of module.exports) {
      if (moduleExport.kind === 'custom-element-definition') {
      if (moduleExport.declaration.module.startsWith('src/components/commerce')) {
        commerceIndexFilePipe.write(getComponentDeclaration(moduleExport));
      }
      if (moduleExport.declaration.module.startsWith('src/components/search')) {
        searchIndexFilePipe.write(getComponentDeclaration(moduleExport));
      }
      if (moduleExport.declaration.module.startsWith('src/components/recommendation')) {
        searchIndexFilePipe.write(getComponentDeclaration(moduleExport));
      }
      if (moduleExport.declaration.module.startsWith('src/components/common')) {
        searchIndexFilePipe.write(getComponentDeclaration(moduleExport));
        commerceIndexFilePipe.write(getComponentDeclaration(moduleExport));
      }
    }
  }
}

commerceIndexFilePipe.close();
searchIndexFilePipe.close();