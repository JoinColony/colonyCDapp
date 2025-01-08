import { Confetti, Password } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

import { REQUEST_ACCESS } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { LandingPageLayout } from '~frame/Extensions/layouts/LandingPageLayout.tsx';
import InfoBanner from '~frame/LandingPage/partials/InfoBanner/InfoBanner.tsx';
import { useGetPrivateBetaCodeInviteValidityQuery } from '~gql';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

const displayName = 'pages.CreateColonyPage';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Get started`,
  },
  info: {
    id: `${displayName}.info`,
    defaultMessage: `
      {noWallet, select,
      true {Tools to manage shared funds easily, openly, and securely.}
      other {Connect your wallet to sign in and check your access or return to your existing colonies.}
    }`,
  },
  connectWalletButton: {
    id: `${displayName}.connectWalletButton`,
    defaultMessage: `Connect wallet`,
  },
  joinColonyButton: {
    id: `${displayName}.joinColonyButton`,
    defaultMessage: `Join the colony`,
  },
  requestAccessButton: {
    id: `${displayName}.requestAccessButton`,
    defaultMessage: `Request access`,
  },
  infoBannerTitle: {
    id: `${displayName}.infoBannerTitle`,
    defaultMessage: `
      {needsToRequestAccess, select,
      true {You’ve been invited to create a colony!}
      other {Invalid colony invite code}
    }`,
  },
  infoBannerDescription: {
    id: `${displayName}.infoBannerDescription`,
    defaultMessage: `
      {needsToRequestAccess, select,
      true {Connect your wallet below to get started.}
      other {Your invite code is not valid. Please check the code or request access.}
    }`,
  },
});

const CreateColonyPage = () => {
  const { connectWallet, wallet } = useAppContext();

  const { inviteCode } = useParams<{ inviteCode: string }>();
  const { data } = useGetPrivateBetaCodeInviteValidityQuery({
    variables: { id: inviteCode || '' },
  });

  const valid = (data?.getPrivateBetaInviteCode?.shareableInvites || 0) > 0;

  return (
    <LandingPageLayout
      bottomComponent={
        <div className="w-full px-6 pb-6 md:hidden">
          {!wallet && (
            <Button isFullSize onClick={connectWallet}>
              {formatText(MSG.connectWalletButton)}
            </Button>
          )}
        </div>
      }
    >
      <div className="flex h-full items-center px-6 md:px-0">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="heading-2">
              {formatText(MSG.title, { noWallet: !wallet })}
            </h1>
            <p
              className={clsx(
                'pt-2 text-md font-normal text-gray-600 md:block',
                {
                  hidden: valid && !wallet,
                },
              )}
            >
              {formatText(MSG.info, {
                noWallet: !wallet && valid,
              })}
            </p>
            <div className="pt-9 md:pt-8">
              <InfoBanner
                icon={valid ? Confetti : Password}
                title={formatText(MSG.infoBannerTitle, {
                  needsToRequestAccess: valid,
                })}
                text={formatText(MSG.infoBannerDescription, {
                  needsToRequestAccess: valid,
                })}
                variant={valid ? 'success' : 'error'}
              />
            </div>
          </div>
          <div className="hidden w-full md:block">
            {!wallet ? (
              <Button isFullSize onClick={connectWallet}>
                {formatText(MSG.connectWalletButton)}
              </Button>
            ) : (
              <a href={REQUEST_ACCESS} target="_blank" rel="noreferrer">
                <Button isFullSize>
                  {formatText(MSG.requestAccessButton)}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
};

CreateColonyPage.displayName = displayName;

export default CreateColonyPage;
