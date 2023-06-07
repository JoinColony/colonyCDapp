import { useState } from 'react';

export const useAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const onOpenIndexChange = (index: number) => {
    setOpenIndex(index);
  };

  return {
    openIndex,
    onOpenIndexChange,
  };
};
