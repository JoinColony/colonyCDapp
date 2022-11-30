import React from 'react';
import { defineMessages } from 'react-intl';

// import Button from '~shared/Button';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import MaskedAddress from '~shared/MaskedAddress';
import MemberReputation from '~shared/MemberReputation';
import {
  useAppContext,
  useColonyContext,
  // useCanInteractWithNetwork,
} from '~hooks';
import { SimpleMessageValues } from '~types/index';
// import { UserTokenBalanceData } from '~types/tokens';

// import UserTokenActivationDisplay from '../UserTokenActivationButton/UserTokenActivationDisplay';
// import { TokenActivationPopover } from '../TokenActivation';
import ItemContainer from './ItemContainer';

// import styles from './AvatarDropdownPopoverMobile.css';

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
  // tokenBalanceData: UserTokenBalanceData;
}

const AvatarDropdownPopoverMobile = ({
  spinnerMsg,
}: // tokenBalanceData,
Props) => {
  // const {
  //   nativeToken,
  //   activeBalance,
  //   inactiveBalance,
  //   totalBalance,
  //   lockedBalance,
  //   isPendingBalanceZero,
  // } = tokenBalanceData;

  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  const colonyAddress = colony?.colonyAddress;
  // const canInteractWithNetwork = useCanInteractWithNetwork();

  return (
    <DropdownMenu>
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ItemContainer message={MSG.address} spinnerMsg={spinnerMsg}>
            {wallet?.address && <MaskedAddress address={wallet.address} />}
          </ItemContainer>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <ItemContainer message={MSG.balance}>
            {canInteractWithNetwork && nativeToken && (
              <UserTokenActivationDisplay
                {...{ nativeToken, inactiveBalance, totalBalance }}
              />
            )}
          </ItemContainer>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <ItemContainer message={MSG.reputation} spinnerMsg={spinnerMsg}>
            {colonyAddress && <MemberReputation showIconTitle={false} />}
          </ItemContainer>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <div className={styles.buttonContainer}>
            {nativeToken && (
              <TokenActivationPopover
                activeTokens={activeBalance}
                inactiveTokens={inactiveBalance}
                totalTokens={totalBalance}
                lockedTokens={lockedBalance}
                token={nativeToken}
                {...{ colony, walletAddress, isPendingBalanceZero }}
              >
                {({ toggle, ref }) => (
                  <Button
                    appearance={{ theme: 'primary', size: 'medium' }}
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
        </DropdownMenuItem> */}
      </DropdownMenuSection>
    </DropdownMenu>
  );
};

AvatarDropdownPopoverMobile.displayName = displayName;

export default AvatarDropdownPopoverMobile;
