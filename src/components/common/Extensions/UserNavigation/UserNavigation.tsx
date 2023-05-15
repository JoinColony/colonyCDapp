import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
import Button from '~shared/Extensions/Button';
import UserAvatar from '~shared/Extensions/UserAvatar';
import MemberReputation from './partials/MemberReputation';
import Icon from '~shared/Icon';
import Token from './partials/Token';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();
  const { formatMessage } = useIntl();

  const isWalletConnected = !!wallet?.address;
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, wallet?.address);

  return (
    <div className="flex items-center gap-1">
      {isWalletConnected ? (
        <>
          {nativeToken && <Token nativeToken={nativeToken} />}
          <Button mode="tertiaryOutline" isFullRounded>
            <div className="flex items-center gap-3">
              <UserAvatar user={user} userName={user?.name || ''} size="xxs" isLink={false} />
              <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
            </div>
          </Button>
        </>
      ) : (
        <Button mode="tertiaryOutline" isFullRounded>
          <Icon name="cardholder" appearance={{ size: 'tiny' }} />
          <p className="text-sm font-inter font-medium ml-1">{formatMessage({ id: 'Connect wallet' })}</p>
        </Button>
      )}
      <Button mode="tertiaryOutline" isFullRounded>
        <Icon name="list" appearance={{ size: 'tiny' }} />
      </Button>
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
