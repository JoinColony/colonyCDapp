import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Navigate } from 'react-router-dom';

import QRCode from '~shared/QRCode';
import { WizardOuterProps } from '~shared/Wizard/types';
import CopyableAddress from '~shared/CopyableAddress';

import { HistoryNavigation } from '~frame/RouteLayouts';
import { FormValues } from '~common/CreateColonyWizard/CreateColonyWizard';
import { LANDING_PAGE_ROUTE } from '~routes/index';
import { useAppContext, useCanInteractWithNetwork } from '~hooks';

import styles from './WizardTemplateColony.css';

const displayName = 'frame.WizardTemplateColony';

const MSG = defineMessages({
  wallet: {
    id: `${displayName}.wallet`,
    defaultMessage: 'Hello ',
  },
});

type Props = Pick<
  WizardOuterProps<FormValues>,
  'children' | 'previousStep' | 'hideQR'
>;

const WizardTemplateColony = ({
  children,
  previousStep,
  hideQR = false,
}: Props) => {
  const { wallet } = useAppContext();
  const walletAddress = wallet?.address || '';

  const customHandler = useCallback(() => previousStep(), [previousStep]);
  const canInteractWithNetwork = useCanInteractWithNetwork();

  if (!canInteractWithNetwork) {
    return <Navigate to={LANDING_PAGE_ROUTE} replace />;
  }

  return (
    <main className={styles.layoutMain}>
      <header className={styles.header}>
        <HistoryNavigation customHandler={customHandler} backText=" " />
        {wallet && (
          <div className={styles.headerWallet}>
            <div className={styles.wallet}>
              <div className={styles.address}>
                <span className={styles.hello}>
                  <FormattedMessage {...MSG.wallet} />
                </span>
                <span className={styles.copy}>
                  <CopyableAddress>{walletAddress}</CopyableAddress>
                </span>
              </div>
            </div>
            {!hideQR && <QRCode address={walletAddress} width={60} />}
          </div>
        )}
      </header>
      <article className={styles.content}>{children}</article>
    </main>
  );
};

WizardTemplateColony.displayName = displayName;

export default WizardTemplateColony;
