import { ArrowSquareOut, CopySimple, HandCoins } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { CoreAction } from '~actions';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
// @BETA: Disabled for now
// import { useMemberModalContext } from '~context/MemberModalContext';
import {
  type MemberCardItem,
  type MemberItem,
} from '~frame/v5/pages/MembersPage/types.ts';
import { useMobile } from '~hooks';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Link from '~v5/shared/Link/index.ts';

export const useMembersTabContentItems = (
  items: MemberItem[],
): MemberCardItem[] => {
  // @BETA: Disabled for now
  // const { setIsMemberModalOpen, setUser } = useMemberModalContext();
  const isMobile = useMobile();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const { show } = useActionSidebarContext();

  return useMemo(
    () =>
      items.map((item) => {
        const { walletAddress } = item;

        return {
          member: item,
          meatBallMenuProps: {
            contentWrapperClassName: clsx('sm:min-w-[17.375rem]', {
              '!left-6 right-6': isMobile,
            }),
            items: [
              // @BETA: Disabled for now
              // {
              //   key: '1',
              //   icon: Pencil,
              //   label: formatText({ id: 'membersPage.memberNav.manageMember' }),
              //   onClick: () => {
              //     setUser(userAvatarProps.user);
              //     setIsMemberModalOpen(true);
              //   },
              // },
              {
                key: '2',
                icon: HandCoins,
                label: formatText({ id: 'membersPage.memberNav.makePayment' }),
                onClick: () => {
                  show({
                    [ACTION_TYPE_FIELD_NAME]: CoreAction.Payment,
                    recipient: walletAddress,
                  });
                },
              },
              ...(walletAddress
                ? [
                    {
                      key: '3',
                      icon: ArrowSquareOut,
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
                          className={clsx(
                            props.className,
                            'md:hover:!text-inherit',
                          )}
                        >
                          {children}
                        </Link>
                      ),
                    },
                    {
                      key: '4',
                      icon: CopySimple,
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
                          isFullWidthContent
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
      isMobile,
      // @BETA: Disabled for now
      // setIsMemberModalOpen,
      // setUser,
      show,
    ],
  );
};
