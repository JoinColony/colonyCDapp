import React, { useEffect, type FC } from 'react';
import { useIntl } from 'react-intl';

import { CloseButton } from '~v5/shared/Button/index.ts';
import ModalBase from '~v5/shared/Modal/ModalBase.tsx';

interface KYCModalProps {
  url: string;
  isOpened: boolean;
  onClose: () => void;
}

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.KYCModal';

export const KYCModal: FC<KYCModalProps> = ({ url, isOpened, onClose }) => {
  const { formatMessage } = useIntl();

  useEffect(() => {
    const handler = (ev: MessageEvent<{ type: string; message: string }>) => {
      // eslint-disable-next-line no-console
      console.log(ev.data);
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <ModalBase
      isFullOnMobile={false}
      isOpen={isOpened}
      onRequestClose={onClose}
      isTopSectionWithBackground
    >
      <CloseButton
        aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
        title={formatMessage({ id: 'button.cancel' })}
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      />
      <div className="px-6 py-12">
        <iframe title="Getting started" src={url} />
      </div>
    </ModalBase>
  );
};

KYCModal.displayName = displayName;
