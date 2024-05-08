import React, { type FC } from 'react';

import useEnabledExtensions from '~hooks/useEnabledExtensions.tsx';
import { formatText } from '~utils/intl.ts';
import MotionStateBadge from '~v5/common/Pills/MotionStateBadge/MotionStateBadge.tsx';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import { type ExtensionStatusBoxProps } from './types.ts';

const ExtensionStatusBox: FC<ExtensionStatusBoxProps> = ({ motionState }) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText({
          id: 'action.executed.uninstalledExtension.description',
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
                  id: 'action.executed.uninstalledExtension.extensionStatus',
                })}
              </h4>
              {/* @todo: modify this code to add other extensions status if needed */}
              {!isVotingReputationEnabled && (
                <div className="mt-2 flex w-full items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    {formatText({
                      id: 'action.executed.uninstalledExtension.reputationWeighted',
                    })}
                  </p>
                  <MotionStateBadge state={motionState} pillSize="small" />
                </div>
              )}
            </>
          ),
        },
      ]}
    />
  );
};

export default ExtensionStatusBox;
