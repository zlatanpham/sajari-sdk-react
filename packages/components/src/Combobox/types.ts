import React from 'react';

export type ComboboxMode = 'standard' | 'typeahead' | 'suggestions' | 'results';

export interface ResultItem {
  title: string;
  url?: string;
  descption?: string;
  image?: string;
}

interface Props<T = string | ResultItem> {
  /** The mode for the combobox to operate */
  mode?: ComboboxMode;
  /** The state when entering an invalid input */
  invalid?: boolean;
  /** An aria-label, also used for the placeholder if not specified */
  label?: string;
  /** Hint for virtual keyboards
   * https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-enterkeyhint-attribute */
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  /* OnVoiceInput handler */
  onVoiceInput?: (text: string) => void;
  /** Whether to enable speech recognition API */
  enableVoice?: boolean;
  /** Whether to set the capture the voice input as the input value */
  captureVoiceInput?: boolean;
  /** Show a loading icon */
  loading?: boolean;
  /** Autocomplete items */
  items?: Array<T>;
  /** Called when the value changes  */
  onChange?: (value?: string) => void;
  /** The typeahead completion value */
  completion?: string;
  /** The size of the combobox input */
  size?: 'sm' | 'md';
  /** Whether to show tips in the dropdown on how to navigate the options */
  showDropdownTips?: boolean;
  /** Whether to show the "Powered by Sajari" in the dropdown */
  showPoweredBy?: boolean;
  /** Render function for customised suggestion item */
  itemRender?: (params: {
    item: T;
    index: number;
    selected: boolean;
    inputValue: string;
    typedInputValue: string;
  }) => React.ReactNode;
  /** Convert item to a suggestion string */
  itemToString?: (item: T) => string;
}

type HtmlAttributes = Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof Props>;

export interface ComboboxProps<T = string> extends Props<T>, HtmlAttributes {}
