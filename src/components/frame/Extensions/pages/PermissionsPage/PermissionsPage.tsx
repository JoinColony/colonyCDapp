import React, { useState, type FC, useEffect } from 'react';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';

import {
  useSetPageBreadcrumbs,
  useSetPageHeadingTitle,
} from '~context/PageHeadingContext/PageHeadingContext.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { useCreateTeamBreadcrumbs } from '~hooks/useTeamsBreadcrumbs.ts';
import {
  COLONY_MULTISIG_ROUTE,
  COLONY_PERMISSIONS_ROUTE,
} from '~routes/index.ts';
import Tabs from '~shared/Extensions/Tabs/index.ts';
import { formatText } from '~utils/intl.ts';

import { useGetMembersForPermissions } from './hooks.tsx';
import { PermissionType } from './types.ts';

const displayName = 'frame.Extensions.pages.PermissionsPage';

const PermissionsPage: FC = () => {
  const navigate = useNavigate();
  const { isMultiSigEnabled } = useEnabledExtensions();
  const { pathname } = useLocation();
  const resolvedPermissionsPath = useResolvedPath(COLONY_PERMISSIONS_ROUTE);
  const resolvedMultisigPath = useResolvedPath(COLONY_MULTISIG_ROUTE);
  const [activeTab, setActiveTab] = useState(PermissionType.Individual);
  const teamsBreadcrumbs = useCreateTeamBreadcrumbs();
  const { itemsByRole, itemsByMultiSigRole, isLoading } =
    useGetMembersForPermissions();
  const individualMembersCount = Object.values(itemsByRole).reduce(
    (acc, members) => acc + members.length,
    0,
  );
  const individualMembersWithMultiSigCount = Object.values(
    itemsByMultiSigRole,
  ).reduce((acc, members) => acc + members.length, 0);

  useEffect(() => {
    if (pathname === resolvedPermissionsPath.pathname) {
      setActiveTab(PermissionType.Individual);
    } else if (pathname === resolvedMultisigPath.pathname) {
      setActiveTab(PermissionType.MultiSig);
    }
  }, [
    pathname,
    resolvedPermissionsPath.pathname,
    resolvedMultisigPath.pathname,
  ]);

  useSetPageBreadcrumbs(teamsBreadcrumbs);
  useSetPageHeadingTitle(formatText({ id: 'permissionsPage.title' }));

  return (
    <Tabs
      activeTab={activeTab}
      className="pt-6"
      onTabClick={(_, id) =>
        navigate(
          id === PermissionType.Individual
            ? COLONY_PERMISSIONS_ROUTE
            : COLONY_MULTISIG_ROUTE,
        )
      }
      items={[
        {
          id: PermissionType.Individual,
          title: formatText({ id: 'permissionsPage.individual' }),
          content: <Outlet />,
          notificationNumber: isLoading ? undefined : individualMembersCount,
        },
        ...(isMultiSigEnabled
          ? [
              {
                id: PermissionType.MultiSig,
                title: formatText({ id: 'permissionsPage.multisig' }),
                content: <Outlet />,
                notificationNumber: isLoading
                  ? undefined
                  : individualMembersWithMultiSigCount,
              },
            ]
          : []),
      ]}
    />
  );
};

PermissionsPage.displayName = displayName;

export default PermissionsPage;
