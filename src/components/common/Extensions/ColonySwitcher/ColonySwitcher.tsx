import React, { FC, useMemo } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { usePopperTooltip } from 'react-popper-tooltip';

import { useAppContext, useMobile } from '~hooks';
import PopoverBase from '~v5/shared/PopoverBase';
import { NETWORK_DATA } from '~constants';
import { Network, useGetContributorsByAddressQuery } from '~gql';
import { notNull } from '~utils/arrays';

import ColoniesDropdown from './partials/ColoniesDropdown';
import ColonyAvatarWrapper from './partials/ColonyAvatarWrapper';
import ColonyDropdownMobile from './partials/ColonyDropdownMobile';
import { ColoniesByCategory, ColonySwitcherProps } from './types';

import styles from './ColonySwitcher.module.css';

const displayName = 'common.Extensions.ColonySwitcher';

const ColonySwitcher: FC<ColonySwitcherProps> = ({
  isCloseButtonVisible,
  activeColony,
}) => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { userLoading, user } = useAppContext();
  const { walletAddress = '' } = user || {};

  const { data } = useGetContributorsByAddressQuery({
    variables: { contributorAddress: walletAddress },
    skip: !walletAddress,
  });

  const userContributors = (
    data?.getContributorsByAddress?.items.filter(notNull) || []
  ).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const userColonies =
    userContributors
      .map((contributor) => contributor.colony || null)
      .filter(notNull) || [];

  const colonyAddress = activeColony?.colonyAddress;

  const coloniesByCategory = useMemo(
    () =>
      userColonies
        .map((item) => {
          const newNetwork = Object.keys(NETWORK_DATA).find(
            (network) =>
              NETWORK_DATA[network].chainId === item?.chainMetadata.chainId,
          );

          if (!newNetwork) {
            return item;
          }

          return {
            ...item,
            chainMetadata: {
              chainId: item.chainMetadata.chainId,
              network: newNetwork as Network,
            },
            colonyAddress: item.colonyAddress,
            name: item.name,
            metadata: {
              avatar: item.metadata?.avatar,
              displayName: item.metadata?.displayName || item.name,
              thumbnail: item.metadata?.thumbnail,
            },
          };
        })
        .reduce((group, item) => {
          const network = (item && item.chainMetadata?.network) || '';
          // eslint-disable-next-line no-param-reassign
          group[network] = group[network] ?? [];
          group[network].push(item);
          return group;
        }, {} as ColoniesByCategory),
    [userColonies],
  );

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
              offset: isMobile ? [0, -69] : [120, 8],
            },
          },
        ],
      },
    );

  return (
    <div
      className={clsx('flex justify-center', {
        relative: !isMobile,
      })}
    >
      <button
        aria-label={formatMessage({
          id: visible ? 'ariaLabel.closeDropdown' : 'ariaLabel.openDropdown',
        })}
        ref={setTriggerRef}
        className="flex items-center justify-center transition-colors duration-normal hover:text-blue-400 z-[51]"
        type="button"
      >
        <ColonyAvatarWrapper
          isMobile={isMobile}
          colonyAddress={colonyAddress}
          colony={isCloseButtonVisible ? activeColony : undefined}
        />
      </button>
      {visible && (
        <div
          className={
            !isMobile ? 'h-auto absolute top-[3.5rem] sm:top-[2.25rem]' : ''
          }
        >
          {isMobile ? (
            <PopoverBase
              setTooltipRef={setTooltipRef}
              tooltipProps={getTooltipProps}
              classNames="w-full border-none shadow-none px-0 pt-0 pb-6 bg-base-white"
            >
              <ColonyDropdownMobile isOpen={visible} userLoading={userLoading}>
                <span className="divider mb-6" />
                {userColonies.length ? (
                  <ColoniesDropdown
                    isMobile={isMobile}
                    activeColony={activeColony}
                    activeColonyAddress={colonyAddress}
                    coloniesByCategory={coloniesByCategory}
                  />
                ) : (
                  <p className="text-sm px-6">
                    {formatMessage({ id: 'missing.colonies' })}
                  </p>
                )}
              </ColonyDropdownMobile>
            </PopoverBase>
          ) : (
            <div
              ref={setTooltipRef}
              {...getTooltipProps({
                className: clsx(
                  styles.tooltipContainer,
                  'p-1 flex justify-start z-50 tooltip-container w-[15.1875rem]',
                ),
              })}
            >
              {!!userColonies.length && !userLoading ? (
                <ColoniesDropdown
                  activeColony={activeColony}
                  activeColonyAddress={colonyAddress}
                  coloniesByCategory={coloniesByCategory}
                />
              ) : (
                <p className="text-sm">
                  {formatMessage({ id: 'missing.colonies' })}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ColonySwitcher.displayName = displayName;

export default ColonySwitcher;
