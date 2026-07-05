import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
    },
    showLabel: {
      control: 'boolean',
    },
    animated: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Success: Story = {
  args: {
    value: 75,
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    value: 60,
    variant: 'warning',
  },
};

export const Danger: Story = {
  args: {
    value: 30,
    variant: 'danger',
  },
};

export const WithoutLabel: Story = {
  args: {
    value: 45,
    showLabel: false,
  },
};

export const Animated: Story = {
  args: {
    value: 50,
    animated: true,
  },
};
