/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import tw from 'twin.macro';

import { IconEnterKey } from '../../../assets/icons';
import Box from '../../../Box';
import { useComboboxContext } from '../../context';
import { useDropdownItemStyles } from './styles';
import { DropdownResultProps } from './types';

const DropdownResult = (props: DropdownResultProps) => {
  const { value, index, selected } = props;
  const { getItemProps, showDropdownTips } = useComboboxContext();
  const styles = useDropdownItemStyles(props);

  return (
    <Box
      as="li"
      {...getItemProps({
        index,
        item: value,
      })}
      key={`${value}_${index}`}
      css={styles.item}
    >
      <Box as="span">{value.image}</Box>

      {showDropdownTips && (
        <Box as="span" css={[styles.label, selected ? tw`opacity-100` : tw`opacity-0`]}>
          Select
          <IconEnterKey css={tw`ml-2`} />
        </Box>
      )}
    </Box>
  );
};

export default DropdownResult;
