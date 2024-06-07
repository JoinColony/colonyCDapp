import { ColonyRole } from '@colony/colony-js';
import {
  Pencil,
  LockKey,
  PuzzlePiece,
  HandCoins,
  ArrowSquareOut,
  CopySimple,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

import { Action } from '~constants/actions.ts';
import { DEFAULT_NETWORK_INFO } from '~constants/index.ts';
import { UserRole, getRole } from '~constants/permissions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type MemberCardItem } from '~frame/v5/pages/MembersPage/types.ts';
import { getMembersList } from '~frame/v5/pages/MembersPage/utils.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useExtensionsData from '~hooks/useExtensionsData.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { COLONY_EXTENSIONS_ROUTE } from '~routes/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { getBlockExplorerLink } from '~utils/external/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Link from '~v5/shared/Link/index.ts';

import {
  type RolePermissionFilters,
  type PermissionsPageFilterProps,
  type PermissionsPageFilters,
} from './partials/types.ts';
import { type ExtensionCardItem, type ItemsByRole } from './types.ts';

export const defaultPermissionsPageFilterValue:
  | PermissionsPageFilters
  | RolePermissionFilters = {
  admin: false,
  custom: false,
  mod: false,
  owner: false,
  payer: false,
  '0': false,
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
  '6': false,
  '7': false,
};

export const useGetPermissionPageFilters = () => {
  const isMobile = useMobile();
  const [searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<
    PermissionsPageFilters | RolePermissionFilters
  >(defaultPermissionsPageFilterValue);

  const filters: PermissionsPageFilterProps = {
    onChange: setFilterValue,
    onSearch: setSearchValue,
    searchValue,
    filterValue,
    items: [
      {
        name: 'permissions',
        label: formatText({ id: 'permissionsPage.filter.permissions' }),
        icon: LockKey,
        title: formatText({
          id: isMobile
            ? 'permissionsPage.filter.permissions'
            : 'permissionsPage.filter.filterBy',
        }),
        items: [
          {
            label: formatText({ id: 'filter.option.mod' }),
            value: UserRole.Mod,
          },
          {
            label: formatText({ id: 'filter.option.payer' }),
            value: UserRole.Payer,
          },
          {
            label: formatText({ id: 'filter.option.admin' }),
            value: UserRole.Admin,
          },
          {
            label: formatText({ id: 'filter.option.owner' }),
            value: UserRole.Owner,
          },
          {
            label: formatText({ id: 'filter.option.custom' }),
            value: UserRole.Custom,
            items: [
              {
                value: ColonyRole.Root,
                label: formatText({ id: 'filter.option.rootPermissions' }),
              },
              {
                value: ColonyRole.Administration,
                label: formatText({ id: 'filter.option.administration' }),
              },
              {
                value: ColonyRole.Arbitration,
                label: formatText({ id: 'filter.option.arbitration' }),
              },
              {
                value: ColonyRole.Architecture,
                label: formatText({ id: 'filter.option.architecture' }),
              },
              {
                value: ColonyRole.Funding,
                label: formatText({ id: 'filter.option.funding' }),
              },
              {
                value: ColonyRole.Recovery,
                label: formatText({ id: 'filter.option.recovery' }),
              },
            ],
          },
        ],
      },
    ],
  };

  return { filters, searchValue, filterValue };
};

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

  const membersList = useMemo(
    () => getMembersList(pagedMembers, selectedDomain?.nativeId, colony),
    [colony, pagedMembers, selectedDomain],
  );

  const allExtensions: AnyExtensionData[] = useMemo(
    () => [...availableExtensionsData, ...installedExtensionsData],
    [availableExtensionsData, installedExtensionsData],
  );

  const mappedExtensions = useMemo<Record<string, ExtensionCardItem>>(
    () =>
      allExtensions.reduce(
        (extensionMap, extension) => ({
          ...extensionMap,
          [extension.extensionId]: {
            extension: {
              role: getRole(extension.neededColonyPermissions),
              name: formatText(extension.name),
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
                      className={clsx(
                        props.className,
                        'md:hover:!text-inherit',
                      )}
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
                //       [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
                //       member: extension.address,
                //     });
                //   },
                // },
              ],
            },
          },
        }),
        {},
      ),
    [allExtensions, colony.name, isMobile],
  );

  const mappedMembers = useMemo<Record<string, MemberCardItem>>(
    () =>
      membersList.reduce(
        (memberMap, member) => ({
          ...memberMap,
          [member.walletAddress]: {
            member,
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
                      [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
                      recipient: member.walletAddress,
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
                      [ACTION_TYPE_FIELD_NAME]: Action.ManagePermissions,
                      member: member.walletAddress,
                    });
                  },
                },
                ...(member.walletAddress
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
                              addressOrHash: member.walletAddress,
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
                              onClick={() =>
                                handleClipboardCopy(member.walletAddress)
                              }
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
          },
        }),
        {},
      ),
    [
      handleClipboardCopy,
      isCopied,
      isMobile,
      membersList,
      toggleActionSidebarOn,
    ],
  );

  const { filters, filterValue, searchValue } = useGetPermissionPageFilters();
  const isFilterActive = Object.values(filterValue).some((value) => value);

  const filteredMembers = useMemo(() => {
    const filteredMembersList = Object.values(mappedMembers).filter(
      ({ member }) => {
        if (!isFilterActive) {
          return true;
        }

        if (member.role) {
          const memberRole = UserRole[member.role.name];
          const isPermissionChecked = Object.keys(filterValue).some(
            (key) => !Number.isNaN(Number(key)) && filterValue[key],
          );

          if (filterValue[memberRole] && memberRole === UserRole.Custom) {
            if (!isPermissionChecked) {
              return true;
            }
            return member.role.permissions.some(
              (permission) => filterValue[permission],
            );
          }

          if (filterValue[memberRole]) {
            return true;
          }
        }
        return false;
      },
    );

    return filteredMembersList;
  }, [mappedMembers, isFilterActive, filterValue]);

  const filteredExtensions = useMemo(() => {
    const filteredExtensionsList = Object.values(mappedExtensions).filter(
      ({ extension }) => {
        if (!isFilterActive) {
          return true;
        }

        if (extension.role) {
          const memberRole = extension.role.role;
          const isPermissionChecked = Object.keys(filterValue).some(
            (key) => !Number.isNaN(Number(key)) && filterValue[key],
          );

          if (filterValue[memberRole] && memberRole === UserRole.Custom) {
            if (!isPermissionChecked) {
              return true;
            }
            return extension.role.permissions.some(
              (permission) => filterValue[permission],
            );
          }

          if (filterValue[memberRole]) {
            return true;
          }
        }
        return false;
      },
    );

    return filteredExtensionsList;
  }, [filterValue, mappedExtensions, isFilterActive]);

  const searchedMembers = filteredMembers.filter(
    ({ member }) =>
      member.user?.profile?.displayName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      member.role?.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const searchedExtensions = filteredExtensions.filter(
    ({ extension }) =>
      extension.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      extension.role?.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const itemsByRole: ItemsByRole = useMemo(() => {
    const memberItems = searchedMembers.reduce((acc, memberCard) => {
      if (memberCard.member.role) {
        const roleName = memberCard.member.role.name.toLowerCase();

        if (!acc[roleName]) {
          acc[roleName] = [];
        }
        acc[roleName].push({ type: 'member', data: memberCard });
      }
      return acc;
    }, {});

    const extensionItems = searchedExtensions.reduce((acc, extensionCard) => {
      if (extensionCard.extension.role) {
        const roleName = extensionCard.extension.role.name.toLowerCase();
        if (!acc[roleName]) {
          acc[roleName] = [];
        }
        acc[roleName].push({ type: 'extension', data: extensionCard });
      }
      return acc;
    }, {});

    return {
      [UserRole.Mod]: [
        ...(memberItems[UserRole.Mod] || []),
        ...(extensionItems[UserRole.Mod] || []),
      ],
      [UserRole.Payer]: [
        ...(memberItems[UserRole.Payer] || []),
        ...(extensionItems[UserRole.Payer] || []),
      ],
      [UserRole.Admin]: [
        ...(memberItems[UserRole.Admin] || []),
        ...(extensionItems[UserRole.Admin] || []),
      ],
      [UserRole.Owner]: [
        ...(memberItems[UserRole.Owner] || []),
        ...(extensionItems[UserRole.Owner] || []),
      ],
      [UserRole.Custom]: [
        ...(memberItems[UserRole.Custom] || []),
        ...(extensionItems[UserRole.Custom] || []),
      ],
    };
  }, [searchedExtensions, searchedMembers]);

  return {
    itemsByRole,
    filters,
    isLoading: loading || extensionLoading,
  };
};
