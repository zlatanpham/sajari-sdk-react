/* eslint-disable react/no-array-index-key */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import tw from 'twin.macro';

import { IconDownKey, IconEnterKey, IconUpKey } from '../../../assets/icons';
import Box from '../../../Box';
import PoweredBy from '../../../PoweredBy';
import Text from '../../../Text';
import { useComboboxContext } from '../../context';
import DropdownItem from '../DropdownItem';
import DropdownResult from '../DropdownResult';
import { useDropdownStyles } from './styles';

const Dropdown = () => {
  const {
    mode,
    open,
    items,
    inputValue,
    highlightedIndex,
    getMenuProps,
    showDropdownTips,
    showPoweredBy,
    itemToString,
    itemRender,
    typedInputValue,
  } = useComboboxContext();
  const shown = (mode === 'results' || mode === 'suggestions') && open && items.length > 0;
  const styles = useDropdownStyles({ shown });
  const label = mode === 'results' ? 'Results' : 'Suggestions';
  let listRender: React.ReactNode = null;
  if (itemRender) {
    listRender = items.map((item, index) => {
      return (
        <React.Fragment key={itemToString(item)}>
          {itemRender({
            item,
            index,
            selected: highlightedIndex === index,
            inputValue,
            typedInputValue,
          })}
        </React.Fragment>
      );
    });
  } else if (mode === 'results') {
    listRender = items.map((item, index) => {
      const selected = highlightedIndex === index;

      // @ts-ignore
      return <DropdownResult value={item} selected={selected} index={index} key={`${item.title}-${index}`} />;
    });
  } else {
    listRender = items.map((item, index) => {
      const value = itemToString(item);
      const selected = highlightedIndex === index;
      const highlight = inputValue.length > 0 && value.startsWith(inputValue);

      return (
        <DropdownItem value={value} highlight={highlight} selected={selected} index={index} key={`${value}-${index}`} />
      );
    });
  }

  return (
    <Box css={styles.container}>
      <Text as="h6" css={styles.heading}>
        {label}
      </Text>

      <ul {...getMenuProps()} css={styles.items}>
        {listRender}
      </ul>

      {(showDropdownTips || showPoweredBy) && (
        <Box as="footer" css={styles.footer}>
          {showDropdownTips && (
            <Box as="span" css={styles.footerItems}>
              <Box as="span" css={styles.footerItem}>
                <IconUpKey css={styles.footerIcon} />
                <IconDownKey css={styles.footerIcon} />
                to navigate
              </Box>

              <Box as="span" css={styles.footerItem}>
                <IconEnterKey css={styles.footerIcon} />
                to select
              </Box>

              <Box as="span" css={styles.footerItem}>
                <Box as="span" css={tw`mr-1 font-medium`}>
                  esc
                </Box>
                to dismiss
              </Box>
            </Box>
          )}

          {showPoweredBy && <PoweredBy />}
        </Box>
      )}
    </Box>
  );
};

export default Dropdown;
