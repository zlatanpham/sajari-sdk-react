/** @jsx jsx */
import { jsx } from '@emotion/core';
import { mergeProps } from '@react-aria/utils';
import { __DEV__ } from '@sajari/react-sdk-utils';
import classnames from 'classnames';
import React from 'react';

import Box from '../../Box';
import { useTabContext } from '../context';
import useTabStyles from './styles';
import { TabProps } from './types';

const Tab = React.forwardRef((props: TabProps, ref?: React.Ref<HTMLButtonElement>) => {
  const { selected, disabled, id, className, selectedClassName = '', ...rest } = props;
  const { disableDefaultStyles } = useTabContext();
  const { styles, focusRingProps } = useTabStyles(props);

  return (
    <Box
      ref={ref}
      role="tab"
      as="button"
      type="button"
      tabIndex={selected ? 0 : -1}
      id={`tab-${id}`}
      disabled={disabled}
      aria-selected={selected}
      aria-disabled={disabled}
      aria-controls={`panel-${id}`}
      className={classnames(className, { [selectedClassName]: selected })}
      css={disableDefaultStyles ? undefined : styles}
      {...mergeProps(rest, focusRingProps)}
    />
  );
});

if (__DEV__) {
  Tab.displayName = 'Tab';
}

export default Tab;
export type { TabProps };
