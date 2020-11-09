/* eslint-disable react/jsx-curly-brace-presence */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Button, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@sajari/react-components';
import { useFilter } from '@sajari/react-hooks';
import { useCallback, useEffect, useState } from 'react';
import tw from 'twin.macro';

import { SmallChevronDown, SmallChevronUp } from '../assets/icons';
import FilterBox from '../FilterBox';
import Input from '../Input';
import { ListFilterProps } from './types';
import { sortList } from './utils';

const noop = () => {};

const ListFilter = ({ name, title, limit = 8, searchable = false, sortable = false, itemRender }: ListFilterProps) => {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { options, reset, setSelected, selected, multi } = useFilter(name);
  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  useEffect(() => {
    setQuery('');
  }, [options]);

  useEffect(() => {
    setExpanded(false);
  }, [query, selected, options]);

  if (options.length === 0) {
    return null;
  }

  const Control = multi ? Checkbox : Radio;
  const filtered = searchable ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const len = filtered.length;
  const slice = len > limit;
  const sorted = sortable ? sortList(filtered, selected) : filtered;
  const sliced = slice && !expanded ? sorted.slice(0, limit) : sorted;
  const Icon = expanded ? SmallChevronUp : SmallChevronDown;

  const innerList = sliced.map(({ label, count }) => (
    <div className="flex justify-between items-center" key={label + count}>
      <Control value={label} checked={selected.includes(label)} onChange={noop} css={tw`text-sm`}>
        {typeof itemRender === 'function' ? itemRender(label) : label}
      </Control>
      <span className="ml-2 text-xs text-gray-400">{count}</span>
    </div>
  ));

  return (
    <FilterBox title={title} showReset={selected.length > 0 && multi} onReset={reset}>
      {searchable ? (
        <div css={tw`mb-2`}>
          <Input
            value={query}
            onChange={(value) => {
              setQuery(value || '');
            }}
          />
        </div>
      ) : null}
      <div id={`list-${name}`}>
        {multi ? (
          <CheckboxGroup value={selected} onChange={setSelected}>
            {innerList}
          </CheckboxGroup>
        ) : (
          <RadioGroup value={selected[0]} onChange={(e) => setSelected([e.target.value])}>
            {innerList}
          </RadioGroup>
        )}
      </div>

      {slice ? (
        <div css={tw`mt-1`}>
          <Button
            appearance="link"
            onClick={toggleExpanded}
            aria-controls={`list-${name}`}
            aria-expanded={expanded}
            size="sm"
            spacing="none"
          >
            {expanded ? 'Show less' : `Show ${len - limit} more`}
            <Icon css={[tw`ml-2`, `color: ${({ theme }) => theme.colors.primary}`]} />
          </Button>
        </div>
      ) : null}
    </FilterBox>
  );
};

export default ListFilter;
