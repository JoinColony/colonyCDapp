import React from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';

import { useColonyContext } from '~hooks';
import { Tooltip } from '~shared/Popover';
import { SpinnerLoader } from '~shared/Preloaders';
import { Message } from '~types';

import Button from './Button';

import styles from './DialogButton.css';

const displayName = 'DialogButton';

const MSG = defineMessages({
  walletNotConnectedWarning: {
    id: `${displayName}.walletNotConnectedWarning`,
    defaultMessage: `To interact with a Colony you must have your wallet connected, have a user profile registered, and be on the same network as the specific colony.`,
  },
});

interface DialogButtonProps {
  dataTest?: string;
  disabled?: boolean;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loading: boolean;
  text: Message;
  tooltipText?: MessageDescriptor;
}

type TooltipContentProps = Pick<DialogButtonProps, 'tooltipText'>;

const TooltipContent = ({ tooltipText }: TooltipContentProps) => (
  <span className={styles.tooltipWrapper}>
    <FormattedMessage {...tooltipText} />
  </span>
);

const DialogButton = ({
  dataTest,
  disabled = false,
  loading,
  handleClick,
  text,
  tooltipText = MSG.walletNotConnectedWarning,
}: DialogButtonProps) => {
  const canInteractWithColony = useColonyContext();

  return (
    <>
      {loading ? (
        <SpinnerLoader appearance={{ size: 'medium' }} />
      ) : (
        <Tooltip
          trigger={!canInteractWithColony ? 'hover' : null}
          content={<TooltipContent tooltipText={tooltipText} />}
        >
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={text}
            onClick={handleClick}
            disabled={!canInteractWithColony || disabled}
            data-test={dataTest}
          />
        </Tooltip>
      )}
    </>
  );
};

DialogButton.displayName = displayName;

export default DialogButton;
