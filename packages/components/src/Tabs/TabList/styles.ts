import { mapStyles } from '@sajari/react-sdk-utils';
import tw, { TwStyle } from 'twin.macro';

import { useTabContext } from '../context';

export default function useTabListStyles() {
  const { align } = useTabContext();
  const styles: Record<'container', TwStyle[]> = { container: [] };

  styles.container.push(tw`flex border-0 border-b border-gray-200 border-solid`);

  switch (align) {
    case 'center':
      styles.container.push(tw`justify-center`);
      break;

    case 'end':
      styles.container.push(tw`justify-end`);
      break;

    default:
    case 'start':
      styles.container.push(tw`justify-start`);
      break;
  }

  return mapStyles(styles);
}
