import React, { useEffect, useState } from 'react';
import { createContext } from 'sajari-react-sdk-utils';
import { Config, defaultConfig } from '../context/config';
import { Pipeline, Response, Values } from '../controllers';

export type SearchFn = (query: string, override: boolean) => void;
export type ClearFn = (values?: { [k: string]: string | undefined }) => void;
export type ResultClickedFn = (url: string) => void;
export type PaginateFn = (page: number) => void;

type Procedure = (...args: any[]) => void;

function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds = 50,
  options = {
    isImmediate: false,
  },
): F {
  let timeoutId: number | undefined;

  return function (this: any, ...args: any[]) {
    const context = this;

    const doLater = function () {
      timeoutId = undefined;
      if (!options.isImmediate) {
        func.apply(context, args);
      }
    };

    const shouldCallNow = options.isImmediate && timeoutId === undefined;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    // @ts-ignore
    timeoutId = setTimeout(doLater, waitMilliseconds);

    if (shouldCallNow) {
      func.apply(context, args);
    }
  } as any;
}

export interface PipelineContextState {
  response: Response | null;
  query: string;
  completion: string;
  suggestions: string[];
  config: Config;
  search: SearchFn;
  clear: ClearFn;
}

export interface ProviderPipelineConfig {
  pipeline: Pipeline;
  values: Values;
  config?: Config;
}

export interface ProviderPipelineState {
  response: Response | null;
  query: string;
  config: Config;
  completion: string;
  suggestions: string[];
}

export interface PipelineProviderProps {
  search: ProviderPipelineConfig;
  instant?: ProviderPipelineConfig;

  searchOnLoad?: boolean;
}

export interface PipelineProviderState {
  search: ProviderPipelineState;
  instant: ProviderPipelineState;
}

export interface Context {
  search: PipelineContextState;
  instant: PipelineContextState;

  resultClicked: ResultClickedFn;
  paginate: PaginateFn;
}

const [ContextProvider, useContext] = createContext<Context>({
  strict: true,
  name: 'PipelineContext',
});

interface State {
  response: Response | null;
  query: string;
  completion: string;
  suggestions: string[];
  config: Config;
}

const defaultState: State = {
  response: null,
  query: '',
  completion: '',
  suggestions: [],
  config: defaultConfig,
};

const Provider: React.FC<PipelineProviderProps> = ({ children, search, instant, searchOnLoad }) => {
  const [searchState, setSearchState] = useState(defaultState);
  const [instantState, setInstantState] = useState(defaultState);
  const response = search.pipeline.getResponse();

  useEffect(() => {
    const mergedConfig = { ...defaultConfig, ...search.config };
    setSearchState((state) => ({
      ...state,
      response,
      query: search.values.get()[mergedConfig.qParam] || '',
      config: mergedConfig,
    }));

    setInstantState((state) => ({
      ...state,
      config: { ...defaultConfig, ...search.config },
    }));
  }, []);

  const searchFn = (key: 'search' | 'instant') =>
    debounce((query: string, override: boolean = false) => {
      const func = key === 'instant' ? instant : search;
      const state = key === 'instant' ? instantState : searchState;
      const { pipeline, values } = func as ProviderPipelineConfig;
      const { config } = state;

      const text = {
        [config.qParam]: query,
        [config.qOverrideParam]: undefined,
      };

      if (override) {
        text[config.qOverrideParam] = 'true';
      }

      values.set(text);
      if (text[config.qParam]) {
        pipeline.search(values.get());
      } else {
        pipeline.clearResponse(values.get());
      }
    }, 50);

  const clear = (key: 'search' | 'instant') => (vals?: { [k: string]: string | undefined }) => {
    const func = key === 'instant' ? instant : search;
    const { pipeline, values } = func as ProviderPipelineConfig;

    if (vals !== undefined) {
      values.set(vals);
    }
    pipeline.clearResponse(values.get());
  };

  // const handleResultClicked = (url: string) => search.pipeline.emitResultClicked(url);

  const handlePaginate = (page: number) => {
    const { pipeline, values } = search;

    values.set({ page: String(page) });
    pipeline.search(values.get());
  };

  const handleResultClicked = (url: string) => search.pipeline.emitResultClicked(url);

  const getContext = (state: PipelineProviderState) =>
    ({
      ...state,
      search: {
        ...state.search,
        search: searchFn('search'),
        clear: clear('search'),
      },
      instant: {
        ...state.instant,
        search: searchFn('instant'),
        clear: clear('instant'),
      },
      resultClicked: handleResultClicked,
      paginate: handlePaginate,
    } as Context);

  return (
    <ContextProvider value={getContext({ instant: instantState, search: searchState })}>{children}</ContextProvider>
  );
};

export default Provider;
