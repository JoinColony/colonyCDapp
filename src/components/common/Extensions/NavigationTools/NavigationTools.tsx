import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~v5/shared/Button';
import UserAvatar from '~v5/shared/UserAvatar';
import { NavigationToolsProps } from './types';
import Token from '~common/Extensions/UserNavigation/partials/Token';
import MemberReputation from '~common/Extensions/UserNavigation/partials/MemberReputation';

const displayName = 'common.Extensions.NavigationTools';

const NavigationTools: FC<NavigationToolsProps> = ({
  nativeToken,
  totalReputation,
  userName,
  userReputation,
  user,
  buttonLabel,
}) => {
  const { formatMessage } = useIntl();

  const buttonLabelText =
    typeof buttonLabel === 'string'
      ? buttonLabel
      : buttonLabel && formatMessage(buttonLabel);

  return (
    <>
      {nativeToken && <Token nativeToken={nativeToken} />}
      <Button mode="tertiary" isFullRounded>
        <div className="flex items-center gap-3">
          <UserAvatar userName={userName} size="xxs" user={user} />
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
            hideOnMobile={false}
          />
        </div>
      </Button>
      <Button
        mode="tertiary"
        isFullRounded
        iconName="list"
        iconSize="extraTiny"
      >
        {buttonLabelText ? (
          <span className="text-gray-700 text-3">{buttonLabelText}</span>
        ) : (
          <span className="text-gray-700 text-3">
            {formatMessage({ id: 'helpAndAccount' })}
          </span>
        )}
      </Button>
    </>
  );
};

NavigationTools.displayName = displayName;

export default NavigationTools;
