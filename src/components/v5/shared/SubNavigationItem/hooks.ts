import { usePopperTooltip } from 'react-popper-tooltip';

import { useColonyContext } from '~context/ColonyContext.tsx';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';

export const useMembersSubNavigation = () => {
  const {
    colony: { name: colonyName },
  } = useColonyContext();
  const colonyURL = `${window.location.protocol}//${process.env.HOST}/${colonyName}`;

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
