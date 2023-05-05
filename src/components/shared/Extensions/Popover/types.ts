import { Placement, State as PopperJsState } from '@popperjs/core';
import { CSSProperties, Dispatch, FocusEvent, HTMLAttributes, ReactNode, SetStateAction } from 'react';
import { MessageDescriptor } from 'react-intl';
import { PopperOptions } from 'react-popper-tooltip';
import { Unionize } from 'utility-types';
import { SimpleMessageValues } from '~types';

export interface PopoverProps {
  appearance?: PopoverAppearanceType;
  children: ReactNode | PopoverChildFn;
  renderContent: PopoverContent;
  renderContentValues?: SimpleMessageValues;
  isOpen?: boolean;
  onClose?: (data?: any, modifiers?: { cancelled: boolean }) => void;
  openDelay?: number;
  closeDelay?: number;
  closeAfterDelay?: boolean;
  placement?: Placement;
  popperOptions?: PopperOptions;
  retainRefFocus?: boolean;
  showArrow?: boolean;
  trigger?: PopoverTriggerType;
}

export type PopoverAppearanceType = {
  theme?: 'dark' | 'grey';
  size?: 'medium';
};

export interface PopoverChildFnProps {
  ref: (arg0: HTMLElement | null) => void;
  id: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export type PopoverChildFn = (arg0: PopoverChildFnProps) => ReactNode;

export type PopoverTriggerElementType = PopoverChildFn | ReactElement;

export type PopoverTriggerType = 'hover' | 'click' | 'disabled';

export type PopoverContent = ReactNode | MessageDescriptor | ((arg0: { close: () => void }) => ReactNode);

export interface PopoverWrapperProps {
  appearance?: PopoverAppearanceType;
  arrowRef: Dispatch<SetStateAction<HTMLElement | null>>;
  close: () => void;
  content: PopoverContent;
  contentRef: Dispatch<SetStateAction<HTMLElement | null>>;
  contentValues?: SimpleMessageValues;
  onFocus: (evt: FocusEvent<HTMLElement>) => void;
  popperAttributes: Record<string, object | undefined>;
  popperStyles: Record<string, CSSProperties>;
  retainRefFocus?: boolean;
  showArrow: boolean;
  state: PopperJsState | null;
}

export interface AllTriggerProps {
  onClick: () => void;
  onMouseEnter: () => void;
  disabled: null;
}

export type ReferenceElementProps = Unionize<AllTriggerProps> &
  Pick<HTMLAttributes<HTMLElement>, 'aria-describedby'> & {
    ref: Dispatch<SetStateAction<HTMLElement>>;
  };
