import { useState } from 'react';

import { useColonyContext } from '~hooks';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';

export const useMembersSubNavigation = () => {
  const [isCopyTriggered, setIsCopyTriggered] = useState(false);
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const colonyURL = `${window.location.origin}/colony/${name}`;

  const { handleClipboardCopy } = useCopyToClipboard(colonyURL);

  const handleClick = () => {
    setIsCopyTriggered(true);
    setTimeout(() => {
      setIsCopyTriggered(false);
    }, 4000);
    handleClipboardCopy();
  };

  return {
    handleClick,
    isCopyTriggered,
  };
};
