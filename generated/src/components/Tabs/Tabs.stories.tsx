import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <p>This is the content for Tab 1</p>,
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: <p>This is the content for Tab 2</p>,
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: <p>This is the content for Tab 3</p>,
  },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
  },
};

export const WithDefaultTab: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'tab2',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      ...sampleTabs,
      {
        id: 'tab4',
        label: 'Tab 4',
        content: <p>This is the content for Tab 4</p>,
      },
      {
        id: 'tab5',
        label: 'Tab 5',
        content: <p>This is the content for Tab 5</p>,
      },
    ],
  },
};
