import { useRef, useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type AddTransactionTableModel } from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';

const useCloseModalClick = ({ onTransactionModalClose }) => {
  const formRef = useRef<UseFormReturn<AddTransactionTableModel>>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const toggleCancelModal = () => {
    setIsCancelModalOpen((val) => !val);
  };
  return {
    closeFormModalClick: () => {
      const { dirtyFields } = formRef.current?.formState || {};

      if (dirtyFields && Object.keys(dirtyFields).length > 0) {
        toggleCancelModal();
      } else {
        onTransactionModalClose();
      }
    },
    formRef,
    isCancelModalOpen,
    toggleCancelModalOff: () => setIsCancelModalOpen(false),
  };
};

export default useCloseModalClick;
