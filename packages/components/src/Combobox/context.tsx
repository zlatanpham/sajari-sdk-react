import { createContext } from '@sajari/react-sdk-utils';
import { PropGetters } from 'downshift';

import { ComboboxMode, ComboboxProps } from './types';

interface ComboboxContextProps<T = string> {
  mode: ComboboxMode;
  inputValue: string;
  open: boolean;
  items: Array<T>;
  completion: string;
  getItemProps: PropGetters<any>['getItemProps'];
  getMenuProps: PropGetters<any>['getMenuProps'];
  highlightedIndex: number;
  selectedItem: any;
  showDropdownTips: boolean;
  showPoweredBy: boolean;
  typedInputValue: string;
  itemToString: Required<ComboboxProps<T>>['itemToString'];
  itemRender: ComboboxProps<T>['itemRender'];
}

const [ComboboxContextProvider, useComboboxContext] = createContext<ComboboxContextProps>({
  strict: true,
  name: 'ComboboxContext',
});

export default ComboboxContextProvider;
export { useComboboxContext };
