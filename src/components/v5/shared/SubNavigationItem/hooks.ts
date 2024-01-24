import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext';
import useCopyToClipboard from '~hooks/useCopyToClipboard';

export const useMembersSubNavigation = () => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const colonyURL = `${window.location.origin}/${colonyName}`;

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      delayShow: 200,
      delayHide: 200,
      placement: 'left-start',
      interactive: true,
      offset: [0, 16],
    });

  return {
    handleClick: () => handleClipboardCopy(colonyURL),
    isCopyTriggered: isCopied,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  };
};
