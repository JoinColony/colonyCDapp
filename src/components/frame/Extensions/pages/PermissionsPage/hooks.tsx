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
import React, { useCallback, useMemo, useState } from 'react';

import { CoreAction } from '~actions';
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

export const useGetPermissionPageFilters = (isMultiSig = false) => {
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
          ...(!isMultiSig
            ? [
                {
                  label: formatText({ id: 'filter.option.mod' }),
                  value: UserRole.Mod,
                },
              ]
            : []),
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

export const useGetMembersForPermissions = (isMultiSig = false) => {
  const {
    availableExtensionsData,
    installedExtensionsData,
    loading: extensionLoading,
  } = useExtensionsData();
  const isMobile = useMobile();
  const { loading, filteredMembers: filteredMembersFromContext } =
    useMemberContext();

  const { colony } = useColonyContext();
  const selectedDomain = useGetSelectedDomainFilter();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();
  const { show } = useActionSidebarContext();

  const membersList = useMemo(
    () =>
      getMembersList(
        filteredMembersFromContext,
        selectedDomain?.nativeId,
        colony,
      ),
    [colony, filteredMembersFromContext, selectedDomain?.nativeId],
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
                    show({
                      [ACTION_TYPE_FIELD_NAME]: CoreAction.Payment,
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
                    show({
                      [ACTION_TYPE_FIELD_NAME]: CoreAction.SetUserRoles,
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
    [handleClipboardCopy, isCopied, isMobile, membersList, show],
  );

  const { filters, filterValue, searchValue } =
    useGetPermissionPageFilters(isMultiSig);
  const isFilterActive = Object.values(filterValue).some((value) => value);

  const filteredMembers = useMemo(() => {
    const filteredMembersList = Object.values(mappedMembers).filter(
      ({ member }) => {
        if (!isFilterActive) {
          return true;
        }

        const role = isMultiSig ? member.multiSigRole : member.role;

        if (role) {
          const memberRole = UserRole[role.name];
          const isPermissionChecked = Object.keys(filterValue).some(
            (key) => !Number.isNaN(Number(key)) && filterValue[key],
          );

          if (filterValue[memberRole] && memberRole === UserRole.Custom) {
            if (!isPermissionChecked) {
              return true;
            }
            return role.permissions.some(
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
  }, [mappedMembers, isFilterActive, isMultiSig, filterValue]);

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

  const searchedMembers = filteredMembers.filter(({ member }) => {
    const role = isMultiSig ? member.multiSigRole : member.role;
    return (
      member.user?.profile?.displayName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      role?.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  const searchedExtensions = filteredExtensions.filter(
    ({ extension }) =>
      extension.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      extension.role?.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const getItemsByRole = useCallback(
    (multiSig = false) => {
      const memberItems = searchedMembers.reduce((acc, memberCard) => {
        const role = multiSig
          ? memberCard.member.multiSigRole
          : memberCard.member.role;
        if (role) {
          const roleName = role.name.toLowerCase();
          if (!acc[roleName]) {
            acc[roleName] = [];
          }
          acc[roleName].push({ type: 'member', data: memberCard });
        }
        return acc;
      }, {});

      if (multiSig) {
        return {
          [UserRole.Mod]: [...(memberItems[UserRole.Mod] || [])],
          [UserRole.Payer]: [...(memberItems[UserRole.Payer] || [])],
          [UserRole.Admin]: [...(memberItems[UserRole.Admin] || [])],
          [UserRole.Owner]: [...(memberItems[UserRole.Owner] || [])],
          [UserRole.Custom]: [...(memberItems[UserRole.Custom] || [])],
        };
      }

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
    },
    [searchedExtensions, searchedMembers],
  );

  const itemsByRole: ItemsByRole = useMemo(
    () => getItemsByRole(),
    [getItemsByRole],
  );
  const itemsByMultiSigRole: ItemsByRole = useMemo(
    () => getItemsByRole(true),
    [getItemsByRole],
  );

  return {
    itemsByRole,
    itemsByMultiSigRole,
    filters,
    isLoading: loading || extensionLoading,
  };
};
