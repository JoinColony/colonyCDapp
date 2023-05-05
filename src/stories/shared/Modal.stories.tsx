import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import Button from '~shared/Extensions/Button';
import Modal from '~shared/Extensions/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  argTypes: {
    icon: {
      name: 'Icon',
      options: ['trash'],
      control: {
        type: 'select',
      },
    },
    isWarning: {
      name: 'Is warning?',
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWithState = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Button mode="primaryOutline" aria-label="Open modal" text="Trigger button" onClick={onOpenModal} />
      <Modal {...args} onClose={onCloseModal} isOpen={isOpen}>
        The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox
        jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
        dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown
        fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
        lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
        the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog.
      </Modal>
    </>
  );
};

export const Base: Story = {
  args: {
    icon: 'trash',
  },
  render: (args) => <ModalWithState {...args} />,
};

export const WithWarning: Story = {
  args: {
    icon: 'trash',

    isWarning: true,
  },
  render: (args) => <ModalWithState {...args} />,
};

export const WithAvatar: Story = {
  args: {
    icon: '',
  },
  render: (args) => <ModalWithState {...args} />,
};
