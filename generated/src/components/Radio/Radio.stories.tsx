import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Option 1',
    name: 'option',
    value: 'option1',
  },
};

export const Checked: Story = {
  args: {
    label: 'Option 1',
    name: 'option',
    value: 'option1',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Option',
    name: 'option',
    value: 'option2',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked',
    name: 'option',
    value: 'option3',
    checked: true,
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    name: 'option',
    value: 'option4',
  },
};
