import 'twin.macro';

import { styled as styledImport } from '@sajari/react-sdk-utils';

declare module 'twin.macro' {
  const styled: typeof styledImport;
}
