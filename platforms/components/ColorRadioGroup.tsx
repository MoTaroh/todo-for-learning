import { ColorUnion } from '@/types/colorUnion';
import { RadioGroup } from '@headlessui/react';
import { useState } from 'react';

const colorList = [
  'gray',
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
];
interface Props {
  categoryColor: ColorUnion;
  handleColor: (color: ColorUnion) => void;
}

export default function ColorRadioGroup({ categoryColor, handleColor }: Props) {
  return (
    <RadioGroup
      value={categoryColor}
      onChange={handleColor}
      className="flex flex-col justify-start space-y-2"
    >
      <RadioGroup.Label className="text-sm font-bold">Color</RadioGroup.Label>
      <div className="flex items-center space-x-2">
        {colorList.map((color) => (
          <RadioGroup.Option
            key={color}
            value={color}
            className="-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
          >
            {({ active, checked }) => (
              <span
                className={`h-8 w-8 bg-${color}-500 ring-${color}-400 rounded-full ${
                  active && checked && 'ring ring-offset-1'
                } ${!active && checked && `ring-2 ring-offset-2`}`}
              ></span>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
