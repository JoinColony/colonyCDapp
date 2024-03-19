import React, { type FC } from 'react';

import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import MemberSignature from '~v5/common/MemberSignature/MemberSignature.tsx';
import { Avatar2 } from '~v5/shared/Avatar/Avatar.tsx';
import Button from '~v5/shared/Button/index.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import { membersList } from './consts.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.ExitRecoveryStep';

const ExitRecoveryStep: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <MenuWithStatusText
        statusTextSectionProps={{
          status: StatusTypes.Info,
          children: formatText(
            { id: 'motion.exitRecovery.statusText' },
            { signatures: 2 },
          ),
          textClassName: 'text-4',
          iconAlignment: 'top',
          content: (
            <ProgressBar
              progress={0}
              additionalText={formatText(
                {
                  id: 'motion.exitRecovery.additionalText',
                },
                { signatures: 2 },
              )}
              max={2}
              className="ml-1"
            />
          ),
        }}
        sections={[
          {
            key: '1',
            content: (
              <ActionForm
                actionType={ActionTypes.ACTION_RECOVERY_EXIT}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-1 mb-2">
                    {formatText({ id: 'common.memberSignature.title' })}
                  </h3>
                  {membersList?.length ? (
                    <ul>
                      {membersList.map(
                        ({ hasSigned, userName, address, key }) => (
                          <li key={key} className="mb-3 last:mb-0">
                            <MemberSignature hasSigned={hasSigned}>
                              <Avatar2
                                alt={`${userName} avatar}`}
                                size={20}
                                address={address}
                              />
                            </MemberSignature>
                          </li>
                        ),
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      {formatText({
                        id: 'common.memberSignatureList.empty',
                      })}
                    </p>
                  )}
                </div>
                <Button
                  mode="primarySolid"
                  isFullSize
                  type="submit"
                  text={formatText({ id: 'motion.exitRecovery.submit' })}
                />
              </ActionForm>
            ),
          },
        ]}
      />
      <MenuWithStatusText
        statusTextSectionProps={{
          status: StatusTypes.Info,
          children: formatText({
            id: 'motion.exitRecovery.storageSlots.statusText',
          }),
          textClassName: 'text-4',
          iconAlignment: 'top',
        }}
        sections={[
          {
            key: '1',
            className: 'px-0 py-0',
            content: (
              <NotificationBanner status="error">
                {formatText({
                  id: 'motion.exitRecovery.storageSlots.warning',
                })}
              </NotificationBanner>
            ),
          },
          {
            key: '2',
            content: (
              <ActionForm
                actionType={ActionTypes.ACTION_RECOVERY_SET_SLOT}
                className="flex flex-col gap-6"
              >
                <div>
                  <h4 className="text-1">
                    {formatText({
                      id: 'motion.exitRecovery.storageSlots.form.title',
                    })}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatText({
                      id: 'motion.exitRecovery.storageSlots.form.description',
                    })}
                  </p>
                </div>
                <FormInputBase
                  name="oldStorageSlot"
                  prefix={
                    <span className="text-md">
                      {formatText({
                        id: 'motion.exitRecovery.storageSlots.form.oldStorage',
                      })}
                    </span>
                  }
                />
                <FormInputBase
                  name="oldStorageSlot"
                  prefix={
                    <span className="text-md">
                      {formatText({
                        id: 'motion.exitRecovery.storageSlots.form.oldStorage',
                      })}
                    </span>
                  }
                />
                <Button
                  mode="primarySolid"
                  isFullSize
                  type="submit"
                  text={formatText({
                    id: 'motion.exitRecovery.storageSlots.submit',
                  })}
                />
              </ActionForm>
            ),
          },
        ]}
      />
    </div>
  );
};

ExitRecoveryStep.displayName = displayName;

export default ExitRecoveryStep;
