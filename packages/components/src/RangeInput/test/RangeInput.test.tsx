import { ThemeProvider } from '@sajari/react-sdk-utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import RangeInput from '..';

describe('RangeInput', () => {
  it('should call the onChange handler', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <ThemeProvider>
        <RangeInput value={[50, 75]} onChange={onChange} />
      </ThemeProvider>,
    );

    const [leftSlider] = Array.from(getAllByRole('slider'));
    const times = 13;
    for (let i = 0; i < times; i += 1) {
      fireEvent.keyDown(leftSlider, { keyCode: 37 });
    }
    expect(leftSlider.dataset.value).toBe(`${50 - times}`);
    expect(onChange).toHaveBeenCalledWith([50 - times, 75]);
  });

  it('should render ticks', () => {
    const { getByText } = render(
      <ThemeProvider>
        <RangeInput value={[50, 75]} tick={100} min={0} max={500} />
      </ThemeProvider>,
    );
    const ticks = [0, 100, 200, 300, 400, 500];
    // eslint-disable-next-line no-restricted-syntax
    for (const tick of ticks) {
      expect(getByText(tick.toString())).toBeInTheDocument();
    }
  });

  it('should increase value by provided steps', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(
      <ThemeProvider>
        <RangeInput value={[50, 75]} onChange={onChange} tick={100} min={0} max={500} step={25} />
      </ThemeProvider>,
    );
    const [, rightSlider] = Array.from(getAllByRole('slider'));
    const times = 3;
    const steps = 25;
    for (let i = 0; i < times; i += 1) {
      fireEvent.keyDown(rightSlider, { keyCode: 39 });
    }
    expect(rightSlider.dataset.value).toBe(`${75 + times * steps}`);
    expect(onChange).toHaveBeenCalledWith([50, 75 + times * steps]);
  });

  it('should increase value when input value changes', () => {
    const onChange = jest.fn();
    const { container, getAllByRole } = render(
      <ThemeProvider>
        <RangeInput value={[50, 75]} showInputs onChange={onChange} tick={100} min={0} max={500} step={25} />
      </ThemeProvider>,
    );
    const [leftSlider] = Array.from(getAllByRole('slider'));
    const [leftInput] = Array.from<HTMLInputElement>(container.querySelectorAll('input[type=number]'));
    fireEvent.change(leftInput, { target: { value: '21' } });
    expect(leftSlider.dataset.value).toBe('21');
    expect(onChange).toHaveBeenCalledWith([21, 75]);
  });
});