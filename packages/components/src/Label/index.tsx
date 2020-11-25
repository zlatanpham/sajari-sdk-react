/* eslint-disable jsx-a11y/label-has-associated-control */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { __DEV__ } from '@sajari/react-sdk-utils';
import React from 'react';

import Box from '../Box';
import { useTextSize } from '../hooks';
import useLabelStyles from './styles';
import { LabelProps } from './types';

const Label = React.forwardRef((props: LabelProps, ref?: React.Ref<HTMLLabelElement>) => {
  const { disableDefaultStyles = false, visuallyHidden, size, styles: stylesProp, ...rest } = props;
  const styles = useLabelStyles(props);
  const sizeStyles = useTextSize({ size });

  return (
    <Box
      as="label"
      {...rest}
      ref={ref}
      css={[disableDefaultStyles || !visuallyHidden ? undefined : [sizeStyles, styles], stylesProp]}
    />
  );
});

if (__DEV__) {
  Label.displayName = 'Label';
}

export default Label;
export type { LabelProps };
