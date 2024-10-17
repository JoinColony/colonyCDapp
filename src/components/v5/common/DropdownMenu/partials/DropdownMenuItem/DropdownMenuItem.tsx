/* eslint-disable @typescript-eslint/no-unused-vars */
import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { type FC } from 'react';

import { accordionAnimation } from '~constants/accordionAnimation.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import Link from '~v5/shared/Link/index.ts';

import { type DropdownMenuItemProps } from './types.ts';

const DropdownMenuItem: FC<DropdownMenuItemProps> = (props) => {
  const [isOpen, { toggle, registerContainerRef }] = useToggle();
  const { disabled, icon: Icon } = props;

  const itemClassName = clsx(
    'flex w-full items-center gap-3 rounded-e rounded-s px-3.5 py-2 !text-md !duration-0 md:hover:bg-gray-50 md:hover:font-medium md:hover:text-gray-900',
    { 'text-gray-300': disabled },
  );
  const content = (
    <>
      {Icon && <Icon size={16} className="flex-shrink-0" />}
      {props.label}
    </>
  );

  const renderDropdownItem = (item: JSX.Element) =>
    props.tooltipProps ? (
      <Tooltip
        {...props.tooltipProps}
        popperOptions={{
          strategy: 'fixed',
        }}
      >
        {item}
      </Tooltip>
    ) : (
      item
    );

  if ('to' in props) {
    const { tooltipProps: _, icon: __, chevronIcon: ___, ...rest } = props;

    return renderDropdownItem(
      <Link {...rest} className={itemClassName}>
        {content}
      </Link>,
    );
  }

  if (!('to' in props) && props.items?.length) {
    const {
      items,
      tooltipProps: _,
      icon: __,
      onClick,
      chevronIcon: ChevronIcon,
      ...rest
    } = props;

    return renderDropdownItem(
      <div ref={registerContainerRef}>
        <button
          type="button"
          className={clsx(itemClassName, 'justify-between')}
          onClick={(e) => {
            onClick?.(e);
            toggle();
          }}
          {...rest}
        >
          <span className="flex flex-grow items-center gap-3">{content}</span>
          {ChevronIcon ? (
            <ChevronIcon size={18} />
          ) : (
            <CaretRight
              size={18}
              className={clsx('transition-all', {
                'rotate-90': isOpen,
              })}
            />
          )}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={accordionAnimation}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
            >
              <ul>
                {items.map(({ key, ...item }) => (
                  <li key={key}>
                    <DropdownMenuItem {...item} />
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>,
    );
  }

  const {
    tooltipProps: _,
    icon: __,
    chevronIcon: ChevronIcon,
    ...rest
  } = props;

  return renderDropdownItem(
    <button
      type="button"
      className={clsx(itemClassName, {
        'justify-between': ChevronIcon,
      })}
      {...rest}
    >
      {ChevronIcon ? (
        <>
          <span className="flex flex-grow items-center gap-3">{content}</span>
          <ChevronIcon />
        </>
      ) : (
        content
      )}
    </button>,
  );
};

export default DropdownMenuItem;
