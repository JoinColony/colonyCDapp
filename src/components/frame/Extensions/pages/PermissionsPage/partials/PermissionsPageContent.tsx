import { Pencil, ShieldStar } from '@phosphor-icons/react';
import React, { type PropsWithChildren, type FC } from 'react';

import { ACTION } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';
import PermissionsModal from '~v5/common/ActionSidebar/partials/forms/ManagePermissionsForm/partials/PermissionsModal/PermissionsModal.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import MeatBallMenu from '~v5/shared/MeatBallMenu/MeatBallMenu.tsx';

const displayName =
  'frame.Extensions.pages.PermissionsPage.partials.PermissionsPageContent';

const PermissionsPageContent: FC<PropsWithChildren> = ({ children }) => {
  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();
  const [
    isPermissionsModalOpen,
    {
      toggleOff: togglePermissionsModalOff,
      toggleOn: togglePermissionsModalOn,
    },
  ] = useToggle();

  return (
    <div>
      <div className="sm:flex sm:items-center justify-between sm:flex-row flex-col">
        <div className="flex items-center gap-2 sm:mb-0 mb-2.5">
          <h4 className="heading-4">
            {formatText({ id: 'permissionsPage.permissionTypes' })}
          </h4>
          <MeatBallMenu
            withVerticalIcon
            contentWrapperClassName="w-full max-w-[calc(100%-2.25rem)] sm:max-w-auto sm:w-auto sm:min-w-[17.375rem]"
            items={[
              {
                key: '1',
                icon: ShieldStar,
                label: formatText({
                  id: 'permissionsPage.viewPermissionTypes',
                }),
                onClick: togglePermissionsModalOn,
              },
              // {
              //   key: '2',
              //   icon: <Eye size={16} />,
              //   label: formatText({
              //     id: 'permissionsPage.viewPermissionActions',
              //   }),
              //   renderItemWrapper: (props, children) => (
              //     // @TODO: This should also apply manage permission filter
              //     <Link
              //       to={`/${colony.name}/${COLONY_ACTIVITY_ROUTE}`}
              //       {...props}
              //       className={clsx(props.className, 'md:hover:!text-inherit')}
              //     >
              //       {children}
              //     </Link>
              //   ),
              // },
              {
                key: '3',
                icon: Pencil,
                label: formatText({
                  id: 'permissionsPage.managePermissions',
                }),
                onClick: () => {
                  toggleActionSidebarOn({
                    [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
                  });
                },
              },
            ]}
          />
          <PermissionsModal
            onClose={togglePermissionsModalOff}
            isOpen={isPermissionsModalOpen}
          />
        </div>
        <Button
          mode="primarySolid"
          size="medium"
          isFullSize={false}
          onClick={() => {
            toggleActionSidebarOn({
              [ACTION_TYPE_FIELD_NAME]: ACTION.MANAGE_PERMISSIONS,
            });
          }}
        >
          {formatText({ id: 'permissionsPage.managePermissions' })}
        </Button>
      </div>
      {children}
    </div>
  );
};

PermissionsPageContent.displayName = displayName;

export default PermissionsPageContent;
