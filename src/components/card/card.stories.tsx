import type { Meta, StoryObj } from '@storybook/react';
import { Vector3 } from 'three';
import {Setup} from '../../setup';
import { Card } from './card';

const meta: Meta = {
  title: 'Example/Card',
  component: Card,
    decorators: [(storyFn) => <Setup cameraPosition={new Vector3(0, 0, 5)}>{storyFn()}</Setup>],
  argTypes: {
    cardSize: { control: { type: 'number', min:1, max:10, step: 0.5, default: 4 } },
    cardThickness: { control: { type: 'number', min:0.01, max:1, step: 0.01 } },
  },
} satisfies Meta<typeof Card>;
 
export default meta;
type Story = StoryObj<typeof meta>;

export const CardStory: Story = {
  args: {
    cardSize: 7,
    cardThickness: 0.01,
  },
};
