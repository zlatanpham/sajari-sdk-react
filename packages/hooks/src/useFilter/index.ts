import { CountAggregate } from '@sajari/sdk-js';
import { useCallback, useMemo, useRef } from 'react';

import { useContext } from '../SearchContextProvider';
import { FilterItem, FilterItems } from './types';

function useFilter(name: string) {
  const {
    search: { filters = [], response, query },
  } = useContext();

  const previous = useRef<FilterItems>([]);

  const filter = useMemo(() => {
    return filters.filter((f) => f.getName() === name)[0];
  }, []);

  if (!filter) {
    throw new Error(`Filter "${name}" doesn't exist.`);
  }

  // @ts-ignore
  const options = useMemo(() => {
    if (query === '') {
      return previous.current;
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let options: FilterItems = [];

    if (!response) {
      return [];
    }

    const aggregates = response.getAggregates();
    const aggregateFilters = response.getAggregateFilters();

    const getBucketCount = (value: string): number => {
      let count: number | CountAggregate = 0;

      if (Object.keys(aggregateFilters?.buckets?.count ?? {}).includes(value)) {
        // @ts-ignore
        ({ count } = aggregateFilters?.buckets);
      } else if (Object.keys(aggregates?.buckets?.count ?? {}).includes(value)) {
        // @ts-ignore
        ({ count } = aggregates?.buckets);
      }

      if (typeof count === 'number') {
        return 0;
      }

      // @ts-ignore - String index (works fine 🤷🏼‍♂️)
      return (count[value] as number) ?? 0;
    };

    // Get items from aggregates for regular facets
    // or map the bucket types to title / filter format
    // Get items from aggregates for regular facets
    // or map the bucket types to title / filter format
    if (!aggregates?.buckets) {
      return [];
    }

    options = Object.entries(filter.getOptions()).map(([label, value]) => {
      const id = `${name}_${label}`;
      const count = getBucketCount(id);

      return { label, value, count } as FilterItem;
    });

    previous.current = options;

    return options;
  });

  const setSelected = useCallback((value: string) => {
    filter.set(value, !filter.isSet(value));
  }, []);

  return {
    options,
    selected: filter.get(),
    setSelected,
  };
}

export default useFilter;
