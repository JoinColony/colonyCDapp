import clsx from 'clsx';
import React, { FC } from 'react';

import { useTablet } from '~hooks';
import Icon from '~shared/Icon';
import { multiLineTextEllipsis } from '~utils/strings';
import Button from '~v5/shared/Button';
import ButtonLink from '~v5/shared/Button/ButtonLink';

import NavigationFeedbackWidget from '../NavigationFeedbackWidget';
import useNavigationSidebarContext from '../NavigationSidebarContext/hooks';
import NavigationSidebarLinksList from '../NavigationSidebarLinksList';

import { NavigationSidebarSecondLevelProps } from './types';

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
    <div className="pb-8 md:p-6 md:pt-[1.625rem] h-full flex flex-col justify-between gap-4 md:overflow-auto">
      <div>
        {!isTablet && (
          <div className="flex justify-between gap-4 px-2 md:px-0">
            <h2 className="heading-5 text-gray-900">{title}</h2>
            {onArrowClick && (
              <button
                type="button"
                onClick={onArrowClick}
                className="text-gray-900 transition-colors md:hover:text-blue-500"
              >
                <Icon
                  name="arrow-line-right"
                  appearance={{
                    size: 'extraSmall',
                  }}
                  className={clsx(
                    'fill-current inline-block transition-transform',
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
          <div className="h-15 line-clamp-3 md:mt-1 text-md text-gray-600 px-2 md:px-0">
            <p>{multiLineTextEllipsis(description, MAX_DESCRIPTION_LENGTH)}</p>
          </div>
        )}
        {isContentList ? (
          <NavigationSidebarLinksList
            className="mt-4 md:mt-9 md:-mx-2.5 md:w-[calc(100%+1.25rem)]"
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
