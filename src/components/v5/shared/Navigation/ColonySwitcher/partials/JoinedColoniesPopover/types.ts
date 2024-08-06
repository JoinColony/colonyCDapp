import { type usePopperTooltip } from 'react-popper-tooltip';

type PopperTooltip = ReturnType<typeof usePopperTooltip>;

export interface JoinedColoniesPopoverProps {
  visible: PopperTooltip['visible'];
  setTooltipRef: PopperTooltip['setTooltipRef'];
  getTooltipProps: PopperTooltip['getTooltipProps'];
}
