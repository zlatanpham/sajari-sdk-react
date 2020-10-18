import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextProvider } from '@sajari/react-sdk';
import { Provider, Pipeline, Values, useContext } from '@sajari/react-hooks';

const TestDataCall = () => {
  const { search, ...rest } = useContext();
  console.log(search);
  console.log(rest);
  React.useEffect(() => {
    search.search('hello', true);
  });
  return null;
};

const pipeline = new Pipeline(
  {
    project: '1594153711901724220',
    collection: 'bestbuy',
    endpoint: '//jsonapi-us-valkyrie.sajari.net',
  },
  'query',
  undefined,
);

const values = new Values({ q: '' });

const App = () => {
  return (
    <Provider search={{ pipeline, values }}>
      <ContextProvider>
        <TestDataCall />
      </ContextProvider>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
