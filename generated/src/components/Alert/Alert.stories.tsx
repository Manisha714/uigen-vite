import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    dismissible: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    title: 'Success!',
    message: 'Your operation completed successfully.',
    type: 'success',
  },
};

export const Error: Story = {
  args: {
    title: 'Error!',
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
};

export const Warning: Story = {
  args: {
    title: 'Warning',
    message: 'Please review this information before proceeding.',
    type: 'warning',
  },
};

export const Info: Story = {
  args: {
    title: 'Information',
    message: 'This is an informational message for the user.',
    type: 'info',
  },
};

export const NonDismissible: Story = {
  args: {
    title: 'Important Notice',
    message: 'This alert cannot be dismissed.',
    type: 'warning',
    dismissible: false,
  },
};
