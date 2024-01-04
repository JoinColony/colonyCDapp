import { formatDistanceToNow } from 'date-fns';
import React, { FC, useState } from 'react';

import { useGetColonyAction } from '~common/ColonyActions';
import PermissionRow from '~frame/v5/pages/VerifiedPage/partials/PermissionRow';
import { formatText } from '~utils/intl';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText';
import Stepper from '~v5/shared/Stepper';
import UserAvatarPopover from '~v5/shared/UserAvatarPopover';

import { CustomStep, Steps } from '../../Motions/types';
import { PermissionSidebarProps } from '../types';

const PermissionSidebar: FC<PermissionSidebarProps> = ({ transactionId }) => {
  const { action } = useGetColonyAction(transactionId);
  const [activeStepKey, setActiveStepKey] = useState<Steps>(
    CustomStep.Finalize,
  );

  const { createdAt, initiatorUser, initiatorAddress } = action || {};

  return (
    <Stepper<Steps>
      activeStepKey={activeStepKey}
      setActiveStepKey={setActiveStepKey}
      items={[
        {
          key: CustomStep.Finalize,
          content: (
            <MenuWithStatusText
              statusTextSectionProps={{
                status: 'info',
                children: formatText({
                  id: 'action.executed.permissions.description',
                }),
                iconAlignment: 'top',
                textClassName: 'text-4',
              }}
              sections={[
                {
                  key: '1',
                  content: (
                    <>
                      <h4 className="text-1">
                        {formatText({
                          id: 'action.executed.permissions.overview',
                        })}
                      </h4>
                      {initiatorUser && (
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-sm text-gray-600">
                            {formatText({
                              id: 'action.executed.permissions.member',
                            })}
                          </span>
                          <UserAvatarPopover
                            walletAddress={initiatorAddress || ''}
                            user={initiatorUser}
                          />
                        </div>
                      )}
                      {initiatorAddress && (
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <span className="text-sm text-gray-600">
                            {formatText({
                              id: 'action.executed.permissions.permission',
                            })}
                          </span>
                          <PermissionRow
                            contributorAddress={initiatorAddress}
                          />
                        </div>
                      )}
                    </>
                  ),
                },
              ]}
            />
          ),
          heading: {
            label: formatText({ id: 'motion.finalize.label' }) || '',
            tooltipProps: {
              tooltipContent: (
                <>
                  <p className="text-3">
                    {formatText({ id: 'action.executed.permissions' })}
                  </p>
                  {createdAt && (
                    <span className="italic text-xs">
                      {formatDistanceToNow(new Date(createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </>
              ),
              placement: 'right',
            },
          },
        },
      ]}
    />
  );
};

export default PermissionSidebar;
