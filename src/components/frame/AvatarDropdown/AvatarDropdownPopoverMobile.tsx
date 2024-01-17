import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import UserTokenActivationDisplay from '~frame/UserTokenActivationButton/UserTokenActivationDisplay';
import {
  useAppContext,
  useUserReputation,
  useCanInteractWithNetwork,
} from '~hooks';
import Button from '~shared/Button';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import MaskedAddress from '~shared/MaskedAddress';
import MemberReputation from '~shared/MemberReputation';
import { Colony, SimpleMessageValues, UserTokenBalanceData } from '~types';

import { TokenActivationPopover } from '../TokenActivation';

import ItemContainer from './ItemContainer';

import styles from './AvatarDropdownPopoverMobile.css';

const displayName = 'frame.AvatarDropdown.AvatarDropdownPopoverMobile';

const MSG = defineMessages({
  manageTokens: {
    id: `${displayName}.manageTokens`,
    defaultMessage: 'Manage Tokens',
  },
  address: {
    id: `${displayName}.address`,
    defaultMessage: 'Address',
  },
  balance: {
    id: `${displayName}.balance`,
    defaultMessage: 'Balance',
  },
  reputation: {
    id: `${displayName}.reputation`,
    defaultMessage: 'Reputation',
  },
});

interface Props {
  spinnerMsg: SimpleMessageValues;
  tokenBalanceData?: UserTokenBalanceData;
  colony?: Colony;
}

const AvatarDropdownPopoverMobile = ({
  colony,
  spinnerMsg,
  tokenBalanceData,
}: Props) => {
  const { wallet } = useAppContext();
  const canInteractWithNetwork = useCanInteractWithNetwork();

  const { colonyAddress = '', nativeToken } = colony || {};

  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  return (
    <DropdownMenu>
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ItemContainer message={MSG.address} spinnerMsg={spinnerMsg}>
            {wallet?.address && <MaskedAddress address={wallet.address} />}
          </ItemContainer>
        </DropdownMenuItem>
        {canInteractWithNetwork && nativeToken && tokenBalanceData && (
          <DropdownMenuItem>
            <ItemContainer message={MSG.balance} spinnerMsg={spinnerMsg}>
              <UserTokenActivationDisplay
                nativeToken={nativeToken}
                tokenBalanceData={tokenBalanceData}
              />
            </ItemContainer>
          </DropdownMenuItem>
        )}
        {colonyAddress && (
          <DropdownMenuItem>
            <ItemContainer message={MSG.reputation} spinnerMsg={spinnerMsg}>
              <MemberReputation
                userReputation={userReputation}
                totalReputation={totalReputation}
                showIconTitle={false}
              />
            </ItemContainer>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <div className={styles.buttonContainer}>
            {nativeToken && tokenBalanceData && (
              <TokenActivationPopover tokenBalanceData={tokenBalanceData}>
                {({ toggle, ref }) => (
                  <Button
                    appearance={{
                      theme: 'primary',
                      size: 'medium',
                    }}
                    onClick={toggle}
                    innerRef={ref}
                    data-test="manageTokensButton"
                  >
                    <FormattedMessage {...MSG.manageTokens} />
                  </Button>
                )}
              </TokenActivationPopover>
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

AvatarDropdownPopoverMobile.displayName = displayName;

export default AvatarDropdownPopoverMobile;
