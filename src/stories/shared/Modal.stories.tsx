import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import Button from '~shared/Extensions/Button';
import Modal from '~shared/Extensions/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Shared/Modal',
  component: Modal,
  argTypes: {
    title: {
      name: 'Title',
      control: {
        type: 'text',
      },
    },
  },
  args: {
    title: 'Deprecate extension',
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
      <Button mode="primaryOutline" aria-label="Open modal" text="Deprecate extension" onClick={onOpenModal} />
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
  render: () => <ModalWithState />,
};
