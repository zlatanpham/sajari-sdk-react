import React from 'react';

interface Props {
  htmlFor: string;
  /** Visually hidden label */
  visuallyHidden?: boolean;
}

export interface LabelProps extends Props, React.HTMLAttributes<HTMLLabelElement> {}
