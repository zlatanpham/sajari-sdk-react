/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useId } from '@reach/auto-id';
import { mergeProps } from '@react-aria/utils';
import { useCombobox } from 'downshift';
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import tw from 'twin.macro';

import { IconSearch, IconSmallSearch, IconSpinner } from '../assets/icons';
import Box from '../Box';
import useVoiceInput from '../hooks/useVoiceInput';
import { __DEV__ } from '../utils/assertion';
import Dropdown from './components/Dropdown';
import Typeahead from './components/Typeahead';
import Voice from './components/Voice';
import ComboboxContextProvider from './context';
import { useComboboxStyles } from './styles';
import { ComboboxProps } from './types';

const Combobox = React.forwardRef((props: ComboboxProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    mode = 'standard',
    label,
    placeholder,
    enterKeyHint = 'search',
    id = `combobox-${useId()}`,
    invalid,
    onChange = () => {},
    onKeyDown = () => {},
    onVoiceInput = () => {},
    enableVoice = false,
    captureVoiceInput = true,
    loading = false,
    value: valueProp = '',
    items = [],
    completion = '',
    size = 'md',
    showDropdownTips = true,
    showPoweredBy = true,
    itemToString = (item: string) => item,
    itemRender,
    ...rest
  } = props;
  const [value, setValue] = useState(valueProp);
  const [typedInputValue, setTypedInputValue] = useState(valueProp.toString());
  useEffect(() => setValue(valueProp), [valueProp]);
  const { supported: voiceSupported } = useVoiceInput();

  const {
    isOpen: open,
    getLabelProps,
    getMenuProps,
    getItemProps,
    getInputProps,
    getComboboxProps,
    selectedItem,
    highlightedIndex,
    inputValue,
    setInputValue,
  } = useCombobox({
    items,
    itemToString,
    inputValue: value.toString(),
    onInputValueChange: (changes) => {
      setValue(changes.inputValue ?? '');
      onChange(changes.inputValue);
    },
    onSelectedItemChange: (changes) => onChange(changes.inputValue),
    stateReducer: (state, { changes, type }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownArrowDown:
          if (state.highlightedIndex === (items || []).length - 1) {
            return {
              ...changes,
              inputValue: typedInputValue,
              selectedItem: typedInputValue,
              highlightedIndex: undefined,
            };
          }

          if (changes.highlightedIndex !== undefined) {
            const item = (items || [])[changes.highlightedIndex];
            const stringItem = itemToString(item);

            if (typeof stringItem !== 'string') {
              return changes;
            }

            return {
              ...changes,
              inputValue: stringItem,
              selectedItem: stringItem,
            };
          }

          return changes;

        case useCombobox.stateChangeTypes.InputKeyDownArrowUp:
          if (state.highlightedIndex === 0) {
            return {
              ...changes,
              inputValue: typedInputValue,
              selectedItem: typedInputValue,
              highlightedIndex: undefined,
            };
          }

          if (changes.highlightedIndex !== undefined) {
            const item = (items || [])[changes.highlightedIndex];
            const stringItem = itemToString(item);

            if (typeof stringItem !== 'string') {
              return changes;
            }

            return {
              ...changes,
              inputValue: stringItem,
              selectedItem: stringItem,
            };
          }

          return changes;

        case useCombobox.stateChangeTypes.ItemMouseMove:
          if (mode === 'suggestions' && changes.highlightedIndex !== undefined) {
            const item = (items || [])[changes.highlightedIndex];
            const stringItem = itemToString(item);
            if (typeof stringItem !== 'string') {
              return changes;
            }

            return {
              ...changes,
              inputValue: stringItem,
              selectedItem: stringItem,
            };
          }
          return changes;

        case useCombobox.stateChangeTypes.InputKeyDownEscape:
          if (mode === 'suggestions' && state.isOpen) {
            return {
              ...changes,
              isOpen: true,
              inputValue: typedInputValue,
            };
          }
          return changes;

        default:
          return changes;
      }
    },
  });

  const context = {
    mode,
    inputValue,
    open,
    items,
    completion,
    selectedItem,
    highlightedIndex,
    getMenuProps,
    getItemProps,
    showDropdownTips,
    showPoweredBy,
    typedInputValue,
    itemToString,
    itemRender,
  };

  const handleVoiceInput = (input: string) => {
    if (captureVoiceInput) {
      setValue(input);
    }
    onVoiceInput(input);
  };

  const { styles, focusProps } = useComboboxStyles({
    size,
    voiceEnabled: enableVoice && voiceSupported,
    loading,
  });

  return (
    <ComboboxContextProvider value={context}>
      <Box css={styles.container}>
        <Box css={styles.inputContainer} {...getComboboxProps()}>
          <Box as="label" css={styles.label} {...getLabelProps({ htmlFor: id })}>
            {label ?? placeholder}
          </Box>

          <Box css={styles.iconContainerLeft}>{size === 'sm' ? <IconSmallSearch /> : <IconSearch />}</Box>

          <Typeahead />

          <Box
            ref={ref}
            as="input"
            css={styles.input}
            {...mergeProps(
              getInputProps({
                type: 'search',
                dir: 'auto',
                placeholder,
                'aria-invalid': invalid,
                autoCapitalize: 'off',
                autoComplete: 'off',
                autoCorrect: 'off',
                spellCheck: 'false',
                inputMode: 'search',
                onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
                  // Don't supress native form submission when 'Enter' key is pressed
                  // Only if the user isn't focused on an item in the suggestions
                  if (e.key === 'Enter' && highlightedIndex === -1) {
                    (e.nativeEvent as any).preventDownshiftDefault = true;
                  }

                  if (e.key === 'Enter' && highlightedIndex > -1) {
                    setTypedInputValue(itemToString(items[highlightedIndex]));
                  }

                  if (e.key === 'ArrowRight' && mode === 'typeahead') {
                    // @ts-ignore: selectionStart is a member of event.target
                    if (e.target.selectionStart === inputValue.length) {
                      if (completion.startsWith(inputValue)) {
                        onChange(completion);
                        setInputValue(completion);
                        setTypedInputValue(completion);
                      }
                    }
                  }

                  onKeyDown(e);
                },
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  onChange(e.target.value);
                  setTypedInputValue(e.target.value);
                },
              }),
              focusProps,
            )}
            enterKeyHint={enterKeyHint}
            {...rest}
          />

          {enableVoice || loading ? (
            <Box css={styles.iconContainerRight}>
              {loading && <IconSpinner css={size === 'sm' ? tw`w-3 h-3` : ''} />}
              {enableVoice && <Voice onVoiceInput={handleVoiceInput} />}
            </Box>
          ) : null}
        </Box>

        <Dropdown />
      </Box>
    </ComboboxContextProvider>
  );
});

if (__DEV__) {
  Combobox.displayName = 'Combobox';
}

export default Combobox;
export type { ComboboxProps };
