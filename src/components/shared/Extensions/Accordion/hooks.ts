import { useCallback, useState } from 'react';

export const useAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const [manualOpen, setManualOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const onOpenIndexChange = useCallback((index: number) => {
    setOpenIndex(index);
    if (index !== -1) {
      setManualOpen(true);
      setIsAccordionOpen(true); // set to true when manually opened
    } else {
      setManualOpen(false); // set to false when manually closed
      setIsAccordionOpen(false);
    }
  }, []);

  return {
    openIndex,
    manualOpen,
    isAccordionOpen,
    onOpenIndexChange,
  };
};
