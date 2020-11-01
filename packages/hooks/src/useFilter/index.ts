import { useCallback, useMemo } from 'react';

import { useContext } from '../SearchContextProvider';

function useFilter(name: string) {
  const {
    search: { filters = [] },
  } = useContext();

  const filter = useMemo(() => {
    return filters.filter((f) => f.getName() === name)[0];
  }, []);

  if (!filter) {
    throw new Error(`Filter "${name}" doesn't exist.`);
  }

  const setSelected = useCallback((value: string) => {
    filter.set(value, !filter.isSet(value));
  }, []);

  const options = useMemo(
    () =>
      Object.entries(filter.getOptions()).map(([label, value]) => ({
        label,
        value,
      })),
    [],
  );

  return {
    options,
    selected: filter.get(),
    setSelected,
  };
}

export default useFilter;
