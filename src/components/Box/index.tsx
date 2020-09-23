import React from "react";
import { PropsWithAs } from "../../types/component-as";
import { forwardRefWithAs } from "../../utils/forwardRefWithAs";

interface BoxProps {
  children?: React.ReactNode;
}

const BoxComponent = (
  props: PropsWithAs<BoxProps, any>,
  ref: React.Ref<HTMLDivElement>
) => {
  const { as: Type = "div", children, ...rest } = props;
  return (
    <Type ref={ref} {...rest}>
      {children}
    </Type>
  );
};

const Box = forwardRefWithAs<BoxProps, any>(BoxComponent);

export default Box;
