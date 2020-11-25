/* eslint-disable jsx-a11y/anchor-has-content */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { mergeProps } from '@react-aria/utils';
import { __DEV__, useTheme } from '@sajari/react-sdk-utils';
import React from 'react';
import tw from 'twin.macro';

import { useFocusRingStyles } from '../hooks';
import { LinkProps } from './types';

const Link = React.forwardRef((props: LinkProps, ref?: React.Ref<HTMLAnchorElement>) => {
  const { focusProps, focusRingStyles } = useFocusRingStyles();
  const { disableDefaultStyles = false, styles: stylesProp, ...rest } = props;
  const theme = useTheme();

  return (
    <a
      {...mergeProps(rest, focusProps)}
      ref={ref}
      css={[
        disableDefaultStyles
          ? undefined
          : [
              tw`relative transition-colors duration-150`,
              focusRingStyles,
              `&:hover, &:focus { color: ${theme.color.primary.base} }`,
            ],
        stylesProp,
      ]}
    />
  );
});

if (__DEV__) {
  Link.displayName = 'Link';
}

export default Link;
export type { LinkProps };
