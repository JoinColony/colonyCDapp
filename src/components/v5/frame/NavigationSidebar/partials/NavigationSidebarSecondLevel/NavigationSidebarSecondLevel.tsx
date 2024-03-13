import { ArrowLineRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { useTablet } from '~hooks/index.ts';
import { multiLineTextEllipsis } from '~utils/strings/index.ts';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';
import Button from '~v5/shared/Button/index.ts';

import NavigationFeedbackWidget from '../NavigationFeedbackWidget/index.ts';
import useNavigationSidebarContext from '../NavigationSidebarContext/hooks.ts';
import NavigationSidebarLinksList from '../NavigationSidebarLinksList/index.ts';

import { type NavigationSidebarSecondLevelProps } from './types.ts';

const displayName =
  'v5.frame.NavigationSidebar.partials.NavigationSidebarSecondLevel';

const MAX_DESCRIPTION_LENGTH = 115;

const NavigationSidebarSecondLevel: FC<NavigationSidebarSecondLevelProps> = ({
  title,
  description,
  content,
  additionalContent,
  onArrowClick,
  isExpanded,
  bottomActionProps,
}) => {
  const isTablet = useTablet();
  const { setOpenItemIndex } = useNavigationSidebarContext();
  const isContentList = Array.isArray(content);

  return (
    <div className="flex h-full flex-col justify-between gap-4 pb-8 md:overflow-auto md:p-6 md:pt-[1.625rem]">
      <div>
        {!isTablet && (
          <div className="flex justify-between gap-4 px-2 md:px-0">
            <h2 className="text-gray-900 heading-5">{title}</h2>
            {onArrowClick && (
              <button
                type="button"
                onClick={onArrowClick}
                className="md:hover:text-blue-500 text-gray-900 transition-colors"
              >
                <ArrowLineRight
                  size={16}
                  className={clsx(
                    'inline-block fill-current transition-transform',
                    {
                      'rotate-180': isExpanded,
                    },
                  )}
                />
              </button>
            )}
          </div>
        )}
        {description && (
          <div className="h-15 line-clamp-3 px-2 text-md text-gray-600 md:mt-1 md:px-0">
            <p>{multiLineTextEllipsis(description, MAX_DESCRIPTION_LENGTH)}</p>
          </div>
        )}
        {isContentList ? (
          <NavigationSidebarLinksList
            className="mt-4 md:-mx-2.5 md:mt-9 md:w-[calc(100%+1.25rem)]"
            items={content}
          />
        ) : (
          content
        )}
        {additionalContent}
      </div>
      {!isTablet && (
        <div className="flex flex-col gap-5">
          <NavigationFeedbackWidget />
          {bottomActionProps && (
            <>
              {!('to' in bottomActionProps) && (
                <Button
                  {...bottomActionProps}
                  onClick={(e) => {
                    setOpenItemIndex(undefined);
                    bottomActionProps.onClick?.(e);
                  }}
                  className="w-full"
                />
              )}
              {'to' in bottomActionProps && (
                <ButtonLink {...bottomActionProps} className="w-full" />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

NavigationSidebarSecondLevel.displayName = displayName;

export default NavigationSidebarSecondLevel;
