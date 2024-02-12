import { Trash } from '@phosphor-icons/react';
import React, { useCallback, useState } from 'react';

import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import type { Meta, StoryObj } from '@storybook/react';

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
    isFullOnMobile: {
      name: 'Is full on mobile?',
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    isFullOnMobile: true,
    isWarning: false,
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
      <Button
        mode="primaryOutlineFull"
        aria-label="Open modal"
        text="Trigger button"
        onClick={onOpenModal}
      />
      <Modal {...args} onClose={onCloseModal} isOpen={isOpen}>
        The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over
        the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog. The quick brown fox jumps over the
        lazy dog. The quick brown fox jumps over the lazy dog. The quick brown
        fox jumps over the lazy dog. The quick brown fox jumps over the lazy
        dog. The quick brown fox jumps over the lazy dog. The quick brown fox
        jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
        The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over
        the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog. The quick brown fox jumps over the
        lazy dog. The quick brown fox jumps over the lazy dog. The quick brown
        fox jumps over the lazy dog. The quick brown fox jumps over the lazy
        dog. The quick brown fox jumps over the lazy dog. The quick brown fox
        jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
        The quick brown fox jumps over the lazy dog. The quick brown fox jumps
        over the lazy dog. The quick brown fox jumps over the lazy dog. The
        quick brown fox jumps over the lazy dog. The quick brown fox jumps over
        the lazy dog. The quick brown fox jumps over the lazy dog. The quick
        brown fox jumps over the lazy dog. The quick brown fox jumps over the
        lazy dog.
      </Modal>
    </>
  );
};

export const Base: Story = {
  args: {
    icon: Trash,
    isFullOnMobile: true,
  },
  render: (args) => <ModalWithState {...args} />,
};

export const WithWarning: Story = {
  args: {
    icon: Trash,
    isWarning: true,
    isFullOnMobile: true,
  },
  render: (args) => <ModalWithState {...args} />,
};
