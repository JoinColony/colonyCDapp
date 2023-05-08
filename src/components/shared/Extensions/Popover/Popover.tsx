import React, {
  cloneElement,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  MouseEvent,
  PropsWithChildren,
  FC,
} from 'react';
import { nanoid } from 'nanoid';
import { usePopper } from 'react-popper';
import { usePrevious } from '~hooks';
import PopoverWrapper from './PopoverWrapper';
import { PopoverProps, ReferenceElementProps } from './types';

const displayName = 'Extensions.Popover';

const Popover: FC<PropsWithChildren<PopoverProps>> = ({
  appearance,
  children,
  renderContent,
  renderContentValues,
  isOpen: isOpenProp = false,
  onClose,
  openDelay,
  closeDelay,
  closeAfterDelay,
  placement: placementProp = 'auto',
  popperOptions = {},
  retainRefFocus,
  showArrow = true,
  trigger = 'click',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(isOpenProp);
  const [referenceElement, setReferenceElement] = useState<Element | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

  const openTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { current: elementId } = useRef<string>(nanoid());

  const { attributes, styles, state } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'arrow',
        options: { element: arrowElement },
      },
      { name: 'offset', options: { offset: [0, 6] } },
    ],
    placement: placementProp,
    ...popperOptions,
  });

  const lastIsOpenProp = usePrevious(isOpenProp);

  const close = useCallback(
    (data?: any, modifiers?: { cancelled: boolean }) => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      setIsOpen(false);
      if (typeof onClose == 'function') {
        onClose(data, modifiers);
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (closeAfterDelay) {
      closeTimeoutRef.current = setTimeout(() => {
        close();
      }, (closeDelay || 0) + (openDelay || 0));
    }
  }, [close, openDelay, closeDelay, closeAfterDelay]);

  const requestOpen = useCallback(() => {
    if (isOpen) {
      return;
    }
    if (openDelay) {
      openTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, openDelay);
      return;
    }
    setIsOpen(true);
  }, [isOpen, openDelay]);

  const handleWrapperFocus = useCallback(() => {
    if (retainRefFocus && referenceElement instanceof HTMLInputElement) {
      referenceElement.focus();
    }
  }, [referenceElement, retainRefFocus]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover' && referenceElement) {
      close();
    }
  }, [close, referenceElement, trigger]);

  const handleOutsideClick = useCallback(
    (evt: Event) => {
      const targetInRefNode = (refNode: Element | null) => {
        return evt.target instanceof Node && refNode && refNode.contains(evt.target);
      };
      if (targetInRefNode(popperElement) || targetInRefNode(referenceElement)) {
        return;
      }
      close();
    },
    [close, popperElement, referenceElement],
  );

  const ReferenceContent = useMemo<() => ReactElement>(() => {
    if (typeof children === 'function') {
      return () =>
        children({
          ref: setReferenceElement,
          id: elementId,
          isOpen: !!isOpen,
          open: () => requestOpen(),
          close,
          toggle: () => (isOpen ? close() : requestOpen()),
        }) as ReactElement;
    }
    return () =>
      cloneElement<ReferenceElementProps>(children as ReactElement, {
        'aria-describedby': isOpen ? elementId : undefined,
        ...(typeof (children as any).type === 'function'
          ? {
              innerRef: setReferenceElement,
            }
          : { ref: setReferenceElement }),
        ...(trigger
          ? {
              hover: {
                onMouseOver: requestOpen,
              },
              click: {
                onClick: (event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (isOpen) {
                    return close();
                  }
                  return requestOpen();
                },
              },
              disabled: null,
            }[trigger]
          : null),
      });
  }, [children, close, elementId, isOpen, requestOpen, trigger]);

  useEffect(() => {
    document.body.addEventListener('click', handleOutsideClick, true);
    if (referenceElement) {
      referenceElement.addEventListener('mouseout', handleMouseLeave, true);
    }
    return () => {
      if (referenceElement) {
        referenceElement.removeEventListener('mouseleave', handleMouseLeave, true);
      }
      document.body.removeEventListener('click', handleOutsideClick, true);
    };
  }, [handleMouseLeave, handleOutsideClick, referenceElement]);

  useEffect(() => {
    if (isOpenProp !== lastIsOpenProp && isOpenProp !== isOpen) {
      if (!isOpen) {
        requestOpen();
      } else {
        close();
      }
      setIsOpen(!!isOpenProp);
    }
  }, [close, isOpen, isOpenProp, lastIsOpenProp, requestOpen]);

  return (
    <>
      <ReferenceContent />
      {isOpen && (
        <PopoverWrapper
          appearance={appearance}
          arrowRef={setArrowElement}
          close={close}
          contentRef={setPopperElement}
          content={renderContent}
          contentValues={renderContentValues}
          onFocus={handleWrapperFocus}
          popperAttributes={attributes}
          popperStyles={styles}
          retainRefFocus={retainRefFocus}
          showArrow={showArrow}
          state={state}
        />
      )}
    </>
  );
};

Popover.displayName = displayName;

export default Popover;
