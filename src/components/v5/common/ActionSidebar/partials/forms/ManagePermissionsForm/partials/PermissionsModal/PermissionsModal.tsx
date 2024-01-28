import chunk from 'lodash/chunk';
import React, { type FC, Fragment } from 'react';

import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { PERMISSIONS_MODAL_CONTENT } from './consts.ts';
import { type PermissionsModalProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar.partials.PermissionsModal';

const PermissionsModal: FC<PermissionsModalProps> = (props) => {
  const [showMore, { toggle: toggleShowMore }] = useToggle();

  return (
    <Modal {...props} isFullOnMobile icon="shield">
      <p className="font-semibold text-gray-900">
        {formatText({
          id: 'actionSidebar.managePermissions.permissionsModal.heading',
        })}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        {showMore ? (
          <>
            <p>
              {formatText({
                id: 'actionSidebar.managePermissions.permissionsModal.description1',
              })}
            </p>
            <p className="mt-6">
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
          className=" inline text-blue-400 cursor-pointer"
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
      </p>
      {PERMISSIONS_MODAL_CONTENT.map(
        ({ title, heading, actions, key }, index) => {
          const isLast = index === PERMISSIONS_MODAL_CONTENT.length - 1;
          const actionsGroups = chunk(actions, Math.ceil(actions.length / 2));

          return (
            <Fragment key={key}>
              <p className="mt-6 text-md font-medium text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-600">{heading}</p>
              <div className="flex gap-4 text-sm text-gray-600 mt-2">
                {actionsGroups.map((actionsGroup) => (
                  <ul
                    className="list-disc pl-6 flex-1"
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
