import { useState } from 'react';

export const useAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | undefined>(0);

  const onOpenIndexChange = (index: number | undefined) => {
    setOpenIndex(index);
  };

  return {
    openIndex,
    onOpenIndexChange,
  };
};
