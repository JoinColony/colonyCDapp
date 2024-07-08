import { useCallback, useRef, useState } from 'react';

// Open an async confirm modal that can be used with the Modal component.
const useConfirmModal = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const modalResolve = useRef<(val: boolean | PromiseLike<boolean>) => void>();

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    if (modalResolve.current) {
      modalResolve.current(false);
    }
  }, [modalResolve]);

  const handleConfirm = useCallback(() => {
    setModalOpen(false);
    if (modalResolve.current) {
      console.log('we have current');
      modalResolve.current(true);
    }
  }, [modalResolve]);

  const openModal = useCallback(async () => {
    if (isModalOpen) {
      // FIXME: Think about this more, shall we return an already existing promise?
      return Promise.resolve(true);
    }
    console.log('opening a modal');
    setModalOpen(true);
    return new Promise<boolean>((resolve) => {
      modalResolve.current = resolve;
    });
  }, [isModalOpen]);

  const closeModal = useCallback(
    (state: boolean) => {
      setModalOpen(false);
      if (modalResolve.current) {
        modalResolve.current(state);
      }
    },
    [modalResolve],
  );

  return {
    isModalOpen,
    handleCancel,
    handleConfirm,
    openModal,
    closeModal,
  };
};

export default useConfirmModal;
