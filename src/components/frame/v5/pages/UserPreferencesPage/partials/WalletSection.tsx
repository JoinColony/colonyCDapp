import { Cardholder, CopySimple } from '@phosphor-icons/react';
import React from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';
import Button from '~v5/shared/Button/Button.tsx';

const displayName = 'v5.pages.UserPreferencesPage.partials.WalletSection';

const WalletSection = () => {
  const { user } = useAppContext();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  return (
    <SettingsRow.Container>
      <SettingsRow.Title>
        {formatText({
          id: 'wallet.information',
        })}
      </SettingsRow.Title>
      <div className="flex w-full flex-col items-center justify-between rounded-lg bg-gray-50 p-3 md:flex-row">
        <div className="mb-3 flex w-full items-center md:mb-0 md:w-auto">
          <Cardholder size={18} className="mr-2 flex-shrink-0" />
          <span className="block w-[calc(100%-18px-8px)] truncate text-md">
            {user?.walletAddress}
          </span>
        </div>
        <Button
          mode={isCopied ? 'completed' : 'septenary'}
          icon={isCopied ? undefined : CopySimple}
          onClick={() => handleClipboardCopy(user?.walletAddress || '')}
          text={formatText({
            id: isCopied ? 'copy.addressCopied' : 'copy.address',
          })}
          className="w-full md:w-auto"
        />
      </div>
    </SettingsRow.Container>
  );
};
WalletSection.displayName = displayName;
export default WalletSection;
