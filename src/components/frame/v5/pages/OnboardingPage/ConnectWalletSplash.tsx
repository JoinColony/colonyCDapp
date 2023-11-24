import React from 'react';
import { defineMessages } from 'react-intl';

import { HeaderRow } from '~common/Onboarding/wizardSteps/shared';
import { MainLayout, MainSidebar } from '~frame/Extensions/layouts';
import Icon from '~shared/Icon';
import { useAppContext } from '~hooks';
import { formatText } from '~utils/intl';
import Button from '~v5/shared/Button';

const displayName = 'frame.v5.OnboardingPage.ConnectWalletSplash';

const MSG = defineMessages({
  privateBeta: {
    id: `${displayName}.privateBeta`,
    defaultMessage:
      "The Colony app is in private beta, allowing invited members and Colony's to test out the new features before launch.",
  },
  invite: {
    id: `${displayName}.invite`,
    defaultMessage:
      'You have been invited to create a Colony for the private beta',
  },
  invalidInvite: {
    id: `${displayName}.invalidInvite`,
    defaultMessage: 'Sorry, your invite code is not valid. Please check again',
  },
  required: {
    id: `${displayName}.required`,
    defaultMessage: 'A connected wallet is required to create a Colony.',
  },
});

interface Props {
  validInvite: boolean;
}

const ConnectWalletSplash = ({ validInvite }: Props) => {
  const { connectWallet } = useAppContext();

  return (
    <MainLayout sidebar={<MainSidebar />}>
      <article className="mx-auto max-w-lg">
        <HeaderRow
          heading={{ id: 'colonyWelcome' }}
          description={MSG.privateBeta}
        />
        <div className="flex gap-2 items-center px-6 py-3 bg-success-100 border border-success-200 mb-6 rounded-lg">
          <Icon
            name="hand-waving"
            appearance={{ size: 'small' }}
            className="text-success-400"
          />
          <span className="text-md font-normal text-gray-900">
            {validInvite
              ? formatText(MSG.invite)
              : formatText(MSG.invalidInvite)}
          </span>
        </div>
        <div className="px-6 py-4 border border-gray-900 rounded flex flex-col gap-1.5">
          <Icon name="plugs" appearance={{ size: 'mediumSmall' }} />
          <div className="flex items-center place-content-between">
            <div className="flex flex-col gap-1">
              <span className="text-md font-medium text-gray-900">
                {formatText({ id: 'connectWallet' })}
              </span>
              <span className="text-sm font-normal text-gray-600">
                {formatText(MSG.required)}
              </span>
            </div>
            <Button
              mode="quinary"
              iconName="cardholder"
              size="small"
              onClick={connectWallet}
            >
              {formatText({ id: 'connectWallet' })}
            </Button>
          </div>
        </div>
      </article>
    </MainLayout>
  );
};

ConnectWalletSplash.displayName = displayName;

export default ConnectWalletSplash;
