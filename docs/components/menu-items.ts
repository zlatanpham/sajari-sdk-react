// Pin !important items to the top of the menu since they're ... important
const comparer = (a: string, b: string) => {
  if (a.toLowerCase().startsWith('!')) {
    return -1;
  }

  return a.localeCompare(b);
};

const components = [
  'AspectRatio',
  'Button',
  'ButtonGroup',
  'Checkbox',
  'Combobox',
  'Heading',
  'Image',
  'Pagination',
  'PoweredBy',
  'Radio',
  'RangeInput',
  'Rating',
  'ResizeObserver',
  'Select',
  'Swatch',
  'Tabs',
  'Text',
].sort(comparer);

const hooks = [
  '!SearchProvider',
  'useAutocomplete',
  'useFilter',
  'usePagination',
  'useQuery',
  'useResultsPerPage',
  'useSearch',
  'useSorting',
  'useTracking',
  'useVariables',
].sort(comparer);

const searchComponents = [
  '!SearchProvider',
  'Filter',
  'Input',
  'Pagination',
  'Results',
  'ResultsPerPage',
  'Summary',
  'Sorting',
  'ViewType',
].sort(comparer);

const classes = ['FilterBuilder', 'Pipeline', 'Response', 'Variables'].sort();

const tracking = ['NoTracking', 'ClickTracking', 'PosNegTracking'].sort();

export { classes, components, searchComponents, hooks, tracking };