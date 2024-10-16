import { ShieldStar } from '@phosphor-icons/react';
import chunk from 'lodash/chunk';
import React, { type FC, Fragment } from 'react';

import { useMobile } from '~hooks/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { PERMISSIONS_MODAL_CONTENT } from './consts.ts';
import { type PermissionsModalProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.PermissionsModal';

const PermissionsModal: FC<PermissionsModalProps> = (props) => {
  const [showMore, { toggle: toggleShowMore }] = useToggle();
  const isMobile = useMobile();

  return (
    <Modal
      {...props}
      isFullOnMobile
      icon={ShieldStar}
      confirmMessage={isMobile ? 'Close' : undefined}
      buttonMode="primarySolid"
    >
      <p className="font-semibold text-gray-900">
        {formatText({
          id: 'actionSidebar.managePermissions.permissionsModal.heading',
        })}
      </p>
      <div className="mt-1 text-sm text-gray-600">
        {showMore ? (
          <>
            <p>
              {formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description1',
              })}
            </p>
            <p className="mt-4">
              {formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description2',
              })}
            </p>
          </>
        ) : (
          formatText({
            id: 'actionSidebar.managePermissions.permissionsModal.descriptionCollapsed',
          })
        )}{' '}
        <button
          type="button"
          className="inline cursor-pointer text-gray-900 underline transition-colors sm:hover:text-blue-400"
          onClick={toggleShowMore}
        >
          {showMore
            ? formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description.collapse',
              })
            : formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description.expand',
              })}
        </button>
      </div>
      {PERMISSIONS_MODAL_CONTENT.map(
        ({ title, heading, actions, key }, index) => {
          const isLast = index === PERMISSIONS_MODAL_CONTENT.length - 1;
          const actionsGroups = chunk(actions, Math.ceil(actions.length / 2));

          return (
            <Fragment key={key}>
              <p className="mt-6 text-md font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-600">{heading}</p>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
                {actionsGroups.map((actionsGroup) => (
                  <ul
                    className="flex-1 list-disc pl-6"
                    key={JSON.stringify(actionsGroup)}
                  >
                    {actionsGroup.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                ))}
              </div>
              {!isLast && <hr className="my-6" />}
            </Fragment>
          );
        },
      )}
    </Modal>
  );
};

PermissionsModal.displayName = displayName;

export default PermissionsModal;
