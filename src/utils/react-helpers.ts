import React, { Children, isValidElement } from "react";

export function setRef<T = any>(ref: React.Ref<T> = null, value: T) {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
  } else {
    // eslint-disable-next-line no-param-reassign
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * Get a list of all valid React child elements
 * @param children
 */
export function cleanChildren(
  children: React.ReactChildren | React.ReactNode
): React.ReactElement[] {
  return Children.toArray(children).filter(child =>
    isValidElement(child)
  ) as React.ReactElement[];
}

export function assignRef(ref: React.Ref<HTMLElement>, value: HTMLElement) {
  if (ref == null) {
    return;
  }

  try {
    setRef(ref, value);
  } catch (error) {
    throw new Error(`Cannot assign value "${value}" to ref "${ref}"`);
  }
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];

export interface CreateContextOptions {
  /** If `true`, React will throw if context is `null` or `undefined`. In some cases, you might want to support nested context, so you can set it to `false` */
  strict?: boolean;
  /** Error message to throw if the context is `undefined` */
  errorMessage?: string;
  /** The display name of the context */
  name?: string;
}

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const {
    strict = true,
    errorMessage = "useContext must be inside a Provider with a value",
    name
  } = options;
  const Context = React.createContext<ContextType | undefined>(undefined);

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);
    if (!context && strict) {
      throw new Error(errorMessage);
    }
    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<
    ContextType
  >;
}
