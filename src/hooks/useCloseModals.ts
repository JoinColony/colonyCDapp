import { useEffect } from 'react';

export enum CloseModalEvent {
  CloseModals = 'closeModals',
}

const useCloseModals = (closeModalCallback: () => void) => {
  useEffect(() => {
    const handleCloseModals = () => {
      closeModalCallback();
    };

    window.addEventListener(CloseModalEvent.CloseModals, handleCloseModals);

    return () =>
      window.removeEventListener(
        CloseModalEvent.CloseModals,
        handleCloseModals,
      );
  }, [closeModalCallback]);
};

export default useCloseModals;
