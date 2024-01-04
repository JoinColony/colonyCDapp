import React from 'react';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { LEARN_MORE_PAYMENTS } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useColonyContext, useMobile } from '~hooks';
import LearnMore from '~shared/Extensions/LearnMore';
import Icon from '~shared/Icon';
import { SubNavigationMobile } from '~v5/common/SubNavigation';
import Button from '~v5/shared/Button';
import PopoverBase from '~v5/shared/PopoverBase';

import Nav from './partials/Nav';
import { getNavItems } from './partials/utils';

const displayName = 'common.Extensions.ColonyNavigation';

const ColonyNavigation = () => {
  const { colony } = useColonyContext();
  const { name } = colony || {};
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const navItems = getNavItems(name);
  const {
    actionSidebarToggle: [, { toggle: toggleActionSideBar }],
  } = useActionSidebarContext();

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip(
      {
        delayShow: isMobile ? 0 : 200,
        delayHide: isMobile ? 0 : 200,
        placement: 'bottom',
        trigger: 'click',
        interactive: true,
      },
      {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -61],
            },
          },
        ],
      },
    );

  return (
    <>
      <button
        type="button"
        className="flex items-center sm:hidden"
        ref={setTriggerRef}
        aria-label={formatMessage({ id: 'ariaLabel.openMenu' })}
      >
        <Icon name="list" appearance={{ size: 'tiny' }} />
        <span className="text-2 ml-1.5">{formatMessage({ id: 'menu' })}</span>
      </button>
      {!isMobile && <Nav items={navItems} />}
      {isMobile && visible && (
        <PopoverBase
          setTooltipRef={setTooltipRef}
          tooltipProps={getTooltipProps}
          classNames="w-full border-none shadow-none px-0 pt-0 pb-6 bg-base-white"
        >
          <div className="w-full pt-[5.5625rem] sm:pt-0">
            <span className="divider mb-3" />
            <div className="px-6">
              <Nav items={navItems} />
              <span className="divider mb-3" />
              <SubNavigationMobile />
              <div className="flex flex-col items-center justify-between border-t border-gray-200 mt-3">
                <div className="my-6 w-full">
                  <Button
                    text="Create new action"
                    mode="quinary"
                    isFullSize={isMobile}
                    onClick={() => toggleActionSideBar()}
                  />
                </div>
                <LearnMore
                  message={{
                    id: `${displayName}.helpText`,
                    defaultMessage:
                      'Need help and guidance? <a>Visit our docs</a>',
                  }}
                  href={LEARN_MORE_PAYMENTS}
                />
              </div>
            </div>
          </div>
        </PopoverBase>
      )}
    </>
  );
};

ColonyNavigation.displayName = displayName;

export default ColonyNavigation;
