import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextProvider } from '@sajari/react-search-ui';
import { SearchContextProvider, Pipeline, Values, useSearchContext, useFilter, Filter } from '@sajari/react-hooks';
import { Pagination } from '@sajari/react-components';
import { useEffect } from 'react';

const SearchPlayground = () => {
  const { search, setPage, page, pageCount, pageSize, totalResults, results } = useSearchContext<{
    id: string;
    free_shipping: string;
  }>();

  const { setSelected, selected, options } = useFilter('price');
  const { options: categoryOptions, setSelected: categorySetSelected, selected: categorySelected } = useFilter(
    'category',
  );

  const fromItem = pageSize * (page - 1) + 1;
  const toItem = results?.length + fromItem - 1;

  return (
    <>
      <input
        type="text"
        onChange={(e) => {
          search(e.target.value, true);
        }}
      />
      <div>
        <h6>Price</h6>
        {(options || []).map(({ label, count }) => (
          <button
            key={label}
            onClick={() => setSelected(label)}
            style={{ opacity: selected.includes(label) ? 0.7 : 1 }}
          >
            {label} ({count})
          </button>
        ))}
      </div>
      <div>
        <h6>Category</h6>
        {(categoryOptions || []).map(({ label, count }) => (
          <button
            key={label}
            onClick={() => categorySetSelected(label)}
            style={{ opacity: categorySelected.includes(label) ? 0.7 : 1 }}
          >
            {label} ({count})
          </button>
        ))}
      </div>
      {results ? (
        <p>
          Showing <b>{fromItem}</b> - <b>{toItem}</b> out of <b>{totalResults}</b> items
        </p>
      ) : null}
      {results?.map(({ values: { id, free_shipping, category, description, price, rating, title } }) => (
        <div key={id}>
          <h3>{title}</h3>
          <p>{description}</p>
          <ul>
            <li>
              <b>Category</b>: {category}
            </li>
            <li>
              <b>Price</b>: ${price}
            </li>
            <li>
              <b>Rating</b>: {rating}
            </li>
            <li>
              <b>Freeship</b>: {free_shipping ? 'yes' : 'no'}
            </li>
          </ul>
        </div>
      ))}
    </>
  );
};

const pipeline = new Pipeline(
  {
    project: '1594153711901724220',
    collection: 'bestbuy',
    endpoint: '//jsonapi-us-valkyrie.sajari.net',
  },
  'query',
);

const priceFilter = new Filter({
  name: 'price',
  options: {
    high: 'price >= 200',
    mid: 'price >= 50',
    low: 'price < 50',
  },
  multi: true,
  initial: [],
});

const categoryFilter = new Filter({
  name: 'category',
  count: 'level1',
  multi: true,
});

const values = new Values({ q: '' });

const App = () => {
  return (
    <SearchContextProvider
      search={{
        pipeline,
        values,
        fields: { category: 'brand', title: 'name' },
        filters: [priceFilter, categoryFilter],
      }}
    >
      <SearchPlayground />
    </SearchContextProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
