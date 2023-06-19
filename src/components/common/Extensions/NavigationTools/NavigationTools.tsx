import React, { FC } from 'react';
import { useIntl } from 'react-intl';

import Button from '~shared/Extensions/Button';
import Icon from '~shared/Icon';
import UserAvatar from '~shared/Extensions/UserAvatar';
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
      <Button mode="tertiaryOutline" isFullRounded>
        <div className="flex items-center gap-3">
          <UserAvatar userName={userName} size="xxs" user={user} />
          <MemberReputation
            userReputation={userReputation}
            totalReputation={totalReputation}
            hideOnMobile={false}
          />
        </div>
      </Button>
      <Button mode="tertiaryOutline" isFullRounded>
        <Icon name="list" appearance={{ size: 'extraTiny' }} />
        {buttonLabel && (
          <span className="text-sm font-medium ml-1.5">{buttonLabelText}</span>
        )}
      </Button>
    </>
  );
};

NavigationTools.displayName = displayName;

export default NavigationTools;
