import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          title="Modal Title"
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
        >
          <p>This is the modal content. You can put any content here.</p>
        </Modal>
      </>
    );
  },
};

export const WithoutConfirm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          title="Information"
          onClose={() => setIsOpen(false)}
        >
          <p>This modal only has a cancel button.</p>
        </Modal>
      </>
    );
  },
};

export const CustomButtons: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          title="Confirm Action"
          onClose={() => setIsOpen(false)}
          onConfirm={() => setIsOpen(false)}
          confirmText="Delete"
          cancelText="Keep"
        >
          <p>Are you sure you want to delete this item?</p>
        </Modal>
      </>
    );
  },
};
