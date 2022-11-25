import React from 'react';
import { defineMessages } from 'react-intl';

// import Button from '~shared/Button';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~shared/DropdownMenu';
import MaskedAddress from '~shared/MaskedAddress';
import MemberReputation from '~shared/MemberReputation';
import { useAppContext, useColonyContext } from '~hooks';
import { SimpleMessageValues } from '~types/index';
// import { UserTokenBalanceData } from '~types/tokens';

// import UserTokenActivationDisplay from '../UserTokenActivationButton/UserTokenActivationDisplay';
// import { TokenActivationPopover } from '../TokenActivation';
import ItemContainer from './ItemContainer';
// import { AppState } from './AvatarDropdown';

// import styles from './AvatarDropdownPopoverMobile.css';

const MSG = defineMessages({
  manageTokens: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.manageTokens',
    defaultMessage: 'Manage Tokens',
  },
  address: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.address',
    defaultMessage: 'Address',
  },
  balance: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.balance',
    defaultMessage: 'Balance',
  },
  reputation: {
    id: 'users.AvatarDropdown.AvatarDropdownPopoverMobile.reputation',
    defaultMessage: 'Reputation',
  },
});

interface Props {
  spinnerMsg: SimpleMessageValues;
  // tokenBalanceData: UserTokenBalanceData;
  // appState: AppState;
}

const displayName = 'users.AvatarDropdown.AvatarDropdownPopoverMobile';

const AvatarDropdownPopoverMobile = ({
  spinnerMsg,
}: // tokenBalanceData,
// appState,
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

  return (
    <DropdownMenu>
      <DropdownMenuSection separator>
        <DropdownMenuItem>
          <ItemContainer
            message={MSG.address}
            spinnerMsg={spinnerMsg}
            // appState={appState}
          >
            {wallet?.address && <MaskedAddress address={wallet.address} />}
          </ItemContainer>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
          <ItemContainer message={MSG.balance}>
            {userCanNavigate && nativeToken && (
              <UserTokenActivationDisplay
                {...{ nativeToken, inactiveBalance, totalBalance }}
              />
            )}
          </ItemContainer>
        </DropdownMenuItem> */}
        <DropdownMenuItem>
          <ItemContainer
            message={MSG.reputation}
            spinnerMsg={spinnerMsg}
            // appState={appState}
          >
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
