import { CountAggregate } from '@sajari/sdk-js';
import { useCallback, useMemo } from 'react';

import { useContext } from '../SearchContextProvider';
import { FilterItem, FilterItems } from './types';

function useFilter(name: string) {
  const {
    search: { filters = [], response },
  } = useContext();

  const filter = useMemo(() => {
    return filters.filter((f) => f.getName() === name)[0];
  }, []);

  if (!filter) {
    throw new Error(`Filter "${name}" doesn't exist.`);
  }

  // Passing response as a dependency will cause the output from the previous response
  // need to do extra work here to solve the issue and remove ts-ignore
  // @ts-ignore
  const options = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let options: FilterItems = [];

    if (!response) {
      return [];
    }

    const aggregates = response.getAggregates();
    const aggregateFilters = response.getAggregateFilters();
    const fieldCount = filter.getCount();

    if (fieldCount) {
      let count = {};
      ({ count } = (aggregateFilters || {})[fieldCount] || {});
      if (!count) {
        ({ count = {} } = (aggregates || {})[fieldCount] || {});
      }

      // eslint-disable-next-line @typescript-eslint/no-shadow
      options = Object.entries(count).map(([label, count]: [string, number]) => ({
        label,
        count,
        value: `${fieldCount} = '${label}'`,
      }));

      filter.setOptions(options.reduce((a, c) => ({ ...a, [c.label]: c.value }), {}));

      return options;
    }

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

      return (count[value] as number) ?? 0;
    };

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

    return options;
  });

  const setSelected = useCallback((value: string) => {
    filter.set(value, !filter.isSet(value));
  }, []);

  return {
    options,
    selected: filter.get(),
    setSelected,
    multi: filter.isMulti(),
  };
}

export default useFilter;
