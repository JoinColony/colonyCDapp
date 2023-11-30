import React, { useMemo } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { ACTION } from '~constants/actions';
import { useActionSidebarContext, useMemberModalContext } from '~context';
import { useCopyToClipboard } from '~hooks/useCopyToClipboard';
import Tooltip from '~shared/Extensions/Tooltip';
import { getBlockExplorerLink } from '~utils/external';
import { formatText } from '~utils/intl';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import Link from '~v5/shared/Link';

import { MembersTabContentListItem } from './types';

export const useMembersTabContentItems = (
  items: MembersTabContentListItem[],
) => {
  const { setIsMemberModalOpen, setUser } = useMemberModalContext();

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  return useMemo(
    () =>
      items.map(({ userAvatarProps, ...item }) => {
        const { user } = userAvatarProps;
        const { walletAddress } = user || {};

        return {
          ...item,
          userAvatarProps,
          meatBallMenuProps: {
            contentWrapperClassName: 'sm:min-w-[17.375rem]',
            items: [
              {
                key: '1',
                icon: 'pencil',
                label: formatText({ id: 'membersPage.memberNav.manageMember' }),
                onClick: () => {
                  setUser(userAvatarProps.user);
                  setIsMemberModalOpen(true);
                },
              },
              {
                key: '2',
                icon: 'hand-coins',
                label: formatText({ id: 'membersPage.memberNav.makePayment' }),
                onClick: () =>
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
                    recipient: walletAddress,
                  }),
              },
              ...(walletAddress
                ? [
                    {
                      key: '3',
                      icon: 'arrow-square-out',
                      label: formatText(
                        { id: 'membersPage.memberNav.viewOn' },
                        {
                          networkName: DEFAULT_NETWORK_INFO.blockExplorerName,
                        },
                      ),
                      renderItemWrapper: (props, children) => (
                        <Link
                          to={getBlockExplorerLink({
                            linkType: 'address',
                            addressOrHash: walletAddress,
                          })}
                          {...props}
                        >
                          {children}
                        </Link>
                      ),
                    },
                    {
                      key: '4',
                      icon: 'copy-simple',
                      label: formatText({
                        id: 'membersPage.memberNav.copyWalletAddress',
                      }),
                      onClick: () => false,
                      className: 'border-t border-t-gray-200 mt-3 pt-3',
                      renderItemWrapper: (props, children) => (
                        <Tooltip
                          tooltipContent={
                            formatText({
                              id: 'copy.addressCopied',
                            }) || ''
                          }
                          isOpen={isCopied}
                          isSuccess
                        >
                          <button
                            type="button"
                            {...props}
                            onClick={() => handleClipboardCopy(walletAddress)}
                          >
                            {children}
                          </button>
                        </Tooltip>
                      ),
                    },
                  ]
                : []),
            ],
          },
        };
      }),
    [
      handleClipboardCopy,
      isCopied,
      items,
      setIsMemberModalOpen,
      setUser,
      toggleActionSidebarOn,
    ],
  );
};
