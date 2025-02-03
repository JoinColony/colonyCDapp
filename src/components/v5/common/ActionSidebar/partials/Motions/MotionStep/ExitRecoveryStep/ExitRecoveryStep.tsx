import React, { type FC } from 'react';

import { ActionTypes } from '~redux/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import MemberSignature from '~v5/common/MemberSignature/MemberSignature.tsx';
import Button from '~v5/shared/Button/index.ts';
import ContributorTypeBorder from '~v5/shared/ContributorTypeWrapper/ContributorTypeBorder.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';
import ProgressBar from '~v5/shared/ProgressBar/index.ts';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';
import StatusText from '~v5/shared/StatusText/StatusText.tsx';
import { UserAvatar } from '~v5/shared/UserAvatar/UserAvatar.tsx';

import { membersList } from './consts.ts';

const displayName =
  'v5.common.ActionSidebar.partials.motions.MotionSimplePayment.steps.ExitRecoveryStep';

const ExitRecoveryStep: FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <MenuWithStatusText
        statusText={
          <StatusText status={StatusTypes.Info} iconAlignment="top">
            <>
              <p className="text-4">
                {formatText(
                  { id: 'motion.exitRecovery.statusText' },
                  { signatures: 2 },
                )}
              </p>
              <ProgressBar
                progress={0}
                progressLabel={formatText(
                  {
                    id: 'motion.exitRecovery.additionalText',
                  },
                  { signatures: 2 },
                )}
                max={2}
                className="mt-2"
              />
            </>
          </StatusText>
        }
        sections={[
          {
            key: '1',
            content: (
              <ActionForm
                actionType={ActionTypes.ACTION_RECOVERY_EXIT}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="mb-2 text-1">
                    {formatText({ id: 'common.memberSignature.title' })}
                  </h3>
                  {membersList?.length ? (
                    <ul>
                      {membersList.map(
                        ({
                          hasSigned,
                          userName,
                          address,
                          contributorType,
                          key,
                        }) => (
                          <li key={key} className="mb-3 last:mb-0">
                            <MemberSignature hasSigned={hasSigned}>
                              <ContributorTypeBorder
                                contributorType={contributorType}
                              >
                                <UserAvatar
                                  size={20}
                                  userAddress={address}
                                  userName={userName}
                                />
                              </ContributorTypeBorder>
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
        statusText={
          <StatusText
            status={StatusTypes.Info}
            textClassName="text-4 text-gray-900"
            iconAlignment="top"
          >
            {formatText({
              id: 'motion.exitRecovery.storageSlots.statusText',
            })}
          </StatusText>
        }
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
