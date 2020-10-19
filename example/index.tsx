import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextProvider } from '@sajari/react-sdk';
import { Provider, Pipeline, Values, useContext } from '@sajari/react-hooks';

const SearchPlayground = () => {
  const {
    search: { search, response },
  } = useContext();

  console.log(response);

  return (
    <input
      type="text"
      onChange={(e) => {
        search(e.target.value, true);
      }}
    />
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

const values = new Values({ q: '' });

const App = () => {
  return (
    <Provider search={{ pipeline, values }}>
      <ContextProvider>
        <SearchPlayground />
      </ContextProvider>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
