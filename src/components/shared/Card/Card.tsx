import { X } from '@phosphor-icons/react';
import React, { type ReactNode, useState, useCallback } from 'react';

import { formatText } from '~utils/intl.ts';

import styles from './Card.module.css';

interface Props {
  /** Card child content to render */
  children: ReactNode;

  /** Optional additional class name for further styling */
  className?: string;

  /** Whether or not the card should be dismissable. If `true`, will add close icon in top right corner. */
  isDismissible?: boolean;

  /** Callback function called on card dismiss. (Only if `isDismissible` is set to `true`) */
  onCardDismissed?: () => void;
}

const displayName = 'Card';

const Card = ({
  children,
  className,
  isDismissible = false,
  onCardDismissed: callback,
  ...rest
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleClose = useCallback(() => {
    if (!isDismissible) return;
    setIsOpen(false);
    if (typeof callback === 'function') {
      callback();
    }
  }, [callback, isDismissible]);

  if (!isOpen) return null;

  const mainClass = styles.main;
  const classNames = className ? `${mainClass} ${className}` : mainClass;
  return (
    <li className={classNames} {...rest}>
      {isDismissible && (
        <button
          className={styles.closeButton}
          onClick={handleClose}
          title={formatText({ id: 'button.close' })}
          type="button"
        >
          <X size={20} />
        </button>
      )}
      {children}
    </li>
  );
};

Card.displayName = displayName;

export default Card;
