import { Plus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { REQUEST_ACCESS } from '~constants';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'frame.LandingPage.partials.BottomComponent';

interface BottomComponentProps {
  isWallet: boolean;
  canInteract: boolean;
  displayCreateButton: boolean;
  onConnectWallet: () => void;
  onCreateColony: () => void;
}

const MSG = defineMessages({
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: 'Connect wallet',
  },
  createColonyButton: {
    id: `${displayName}.createColonyButton`,
    defaultMessage: 'Create new Colony',
  },
  noAccessButton: {
    id: `${displayName}.noAccessButton`,
    defaultMessage: 'Request access',
  },
});

const BottomComponent = ({
  canInteract,
  displayCreateButton,
  isWallet,
  onConnectWallet,
  onCreateColony,
}: BottomComponentProps) => (
  <div className="w-full px-6 pb-6 md:hidden">
    {!isWallet ? (
      <Button isFullSize onClick={onConnectWallet}>
        {formatText(MSG.connectWalletButton)}
      </Button>
    ) : (
      <>
        {canInteract ? (
          <>
            {displayCreateButton && (
              <Button icon={Plus} isFullSize onClick={onCreateColony}>
                {formatText(MSG.createColonyButton)}
              </Button>
            )}
          </>
        ) : (
          <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
            <Button isFullSize>{formatText(MSG.noAccessButton)}</Button>
          </a>
        )}
      </>
    )}
  </div>
);

BottomComponent.displayName = displayName;

export default BottomComponent;
