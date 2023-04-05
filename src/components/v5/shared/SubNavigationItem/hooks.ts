import { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

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

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
    });

  return {
    handleClick,
    isCopyTriggered,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  };
};
