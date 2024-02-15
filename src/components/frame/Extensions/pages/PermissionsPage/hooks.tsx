import {
  Pencil,
  PuzzlePiece,
  HandCoins,
  ArrowSquareOut,
  CopySimple,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { ACTION } from '~constants/actions.ts';
import { UserRole, getRole } from '~constants/permissions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { useMemberContext } from '~context/MemberContext.tsx';
import { type MembersTabContentListItem } from '~frame/v5/pages/MembersPage/partials/MembersTabContent/types.ts';
import { getMembersList } from '~frame/v5/pages/MembersPage/utils.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_EXTENSIONS_ROUTE } from '~routes';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import Link from '~v5/shared/Link/index.ts';

import { type GroupedByPermissionMembersProps } from './partials/types.ts';

export const useGetMembersForPermissions = () => {
  const {
    availableExtensionsData,
    installedExtensionsData,
    loading: extensionLoading,
  } = useExtensionsData();
  const isMobile = useMobile();
  const { pagedMembers, loading } = useMemberContext();
  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const membersList = useMemo<MembersTabContentListItem[]>(
    () => getMembersList(pagedMembers, selectedDomain?.nativeId, colony),
    [colony, pagedMembers, selectedDomain],
  );
  const allExtensions: AnyExtensionData[] = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  const mappedExtensions = useMemo(
    () =>
      allExtensions.map((extension) => ({
        key: extension.extensionId,
        role: getRole(extension.neededColonyPermissions),
        isExtension: true,
        userAvatarProps: {
          userName: formatText(extension.name),
          isVerified: false,
        },
        meatBallMenuProps: {
          contentWrapperClassName: clsx('sm:min-w-[17.375rem]', {
            '!left-6 right-6': isMobile,
          }),
          dropdownPlacementProps: {
            withAutoTopPlacement: true,
            top: 12,
          },
          items: [
            {
              key: '1',
              icon: PuzzlePiece,
              label: formatText({ id: 'permissionsPage.viewExtension' }),
              renderItemWrapper: (props, children) => (
                <Link
                  to={`/${colony.name}/${COLONY_EXTENSIONS_ROUTE}/${extension.extensionId}`}
                  {...props}
                  className={clsx(props.className, 'md:hover:!text-inherit')}
                >
                  {children}
                </Link>
              ),
            },
            // @TODO: Uncomment when not installed extension address will be known
            // {
            //   key: '2',
            //   icon: <Pencil size={16} />,
            //   label: formatText({ id: 'permissionsPage.managePermissions' }),
            //   onClick: () => {
            //     toggleActionSidebarOn({
            //       [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
            //       member: extension.address,
            //     });
            //   },
            // },
          ],
        },
      })),
    [allExtensions, colony.name, isMobile],
  );

  const defaultOrganizedObject = useMemo(() => {
    const organizedObject = {} as GroupedByPermissionMembersProps;

    Object.values(UserRole).forEach((role) => {
      organizedObject[role] = [];
    });

    return organizedObject;
  }, []);

  const individualMembers = useMemo(() => {
    const updatedOrganizedObject = { ...defaultOrganizedObject };

    mappedExtensions.forEach((extension) => {
      const roleName = UserRole[extension.role.name];

      if (roleName) {
        updatedOrganizedObject[roleName] = [
          ...updatedOrganizedObject[roleName],
          extension,
        ];
      }
    });

    membersList.forEach((member) => {
      if (member.role) {
        const roleName = UserRole[member.role.name];
        const { walletAddress } = member.userAvatarProps;

        if (roleName) {
          const updatedMember = {
            ...member,
            key: walletAddress,
            meatBallMenuProps: {
              contentWrapperClassName: clsx('sm:min-w-[17.375rem]', {
                '!left-6 right-6': isMobile,
              }),
              dropdownPlacementProps: {
                withAutoTopPlacement: true,
                top: 12,
              },
              items: [
                // @BETA: Disabled for now
                // {
                //   key: '1',
                //   icon: 'pencil',
                //   label: formatText({ id: 'membersPage.memberNav.manageMember' }),
                //   onClick: () => {
                //     setUser(userAvatarProps.user);
                //     setIsMemberModalOpen(true);
                //   },
                // },
                {
                  key: '2',
                  icon: HandCoins,
                  label: formatText({
                    id: 'membersPage.memberNav.makePayment',
                  }),
                  onClick: () =>
                    toggleActionSidebarOn({
                      [ACTION_TYPE_FIELD_NAME]: ACTION.SIMPLE_PAYMENT,
                      recipient: walletAddress,
                    }),
                },
                {
                  key: '5',
                  icon: Pencil,
                  label: formatText({
                    id: 'permissionsPage.managePermissions',
                  }),
                  onClick: () => {
                    toggleActionSidebarOn({
                      [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
                      member: walletAddress,
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

          updatedOrganizedObject[roleName] = [
            ...updatedOrganizedObject[roleName],
            updatedMember,
          ];
        }
      }
    });

    return updatedOrganizedObject;
  }, [
    defaultOrganizedObject,
    handleClipboardCopy,
    isCopied,
    isMobile,
    mappedExtensions,
    membersList,
    toggleActionSidebarOn,
  ]);

  return {
    individualMembers,
    isLoading: loading || extensionLoading,
  };
};
