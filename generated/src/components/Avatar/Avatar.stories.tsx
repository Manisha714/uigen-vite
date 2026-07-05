import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: 'select',
      options: ['circle', 'square'],
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    size: 'md',
    variant: 'circle',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    alt: 'User Avatar',
    size: 'md',
    variant: 'circle',
  },
};

export const Small: Story = {
  args: {
    initials: 'AB',
    size: 'sm',
    variant: 'circle',
  },
};

export const Large: Story = {
  args: {
    initials: 'CD',
    size: 'lg',
    variant: 'circle',
  },
};

export const ExtraLarge: Story = {
  args: {
    initials: 'EF',
    size: 'xl',
    variant: 'circle',
  },
};

export const Square: Story = {
  args: {
    initials: 'GH',
    size: 'md',
    variant: 'square',
  },
};

export const SquareWithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    alt: 'User Avatar',
    size: 'lg',
    variant: 'square',
  },
};
