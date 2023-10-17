import React, { FC } from 'react';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

import CardWithStatusText from '~v5/shared/CardWithStatusText';
import ProgressBar from '~v5/shared/ProgressBar';
import { ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';
import MemberSignatureList from '~v5/common/MemberSignatureList';
import { membersList } from './consts';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.ExitRecoveryStep';

const ExitRecoveryStep: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <CardWithStatusText
        statusTextSectionProps={{
          status: 'info',
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
                <MemberSignatureList
                  items={membersList}
                  title={formatText({ id: 'common.memberSignature.title' })}
                />
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
      <CardWithStatusText
        statusTextSectionProps={{
          status: 'info',
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
              <NotificationBanner
                status="error"
                title={formatText({
                  id: 'motion.exitRecovery.storageSlots.warning',
                })}
                isAlt
              />
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
