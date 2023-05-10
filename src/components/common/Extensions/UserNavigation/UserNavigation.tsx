import React, { FC } from 'react';
import { useAppContext, useColonyContext, useUserReputation } from '~hooks';
import Button from '~shared/Extensions/Button/Button';
import UserAvatar from '~shared/Extensions/UserAvatar/UserAvatar';
import MemberReputation from './MemberReputation/MemberReputation';
import Icon from '~shared/Icon/Icon';
import Token from './Token/Token';

export const displayName = 'common.Extensions.UserNavigation';

const UserNavigation: FC = () => {
  const { colony } = useColonyContext();
  const { wallet, user } = useAppContext();

  const isWalletConnected = !!wallet?.address;
  const { colonyAddress, nativeToken } = colony || {};
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, wallet?.address);

  return isWalletConnected ? (
    <div className="flex items-center gap-1">
      {nativeToken && <Token nativeToken={nativeToken} />}
      <Button mode="tertiaryOutline" fullRounded>
        <div className="flex items-center gap-3">
          <UserAvatar user={user} userName={user?.name || ''} size="xxs" isLink={false} />
          <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />
        </div>
      </Button>
      <Button mode="tertiaryOutline" fullRounded>
        <Icon name="list" appearance={{ size: 'tiny' }} />
      </Button>
    </div>
  ) : (
    <>Wallet not connected</>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
