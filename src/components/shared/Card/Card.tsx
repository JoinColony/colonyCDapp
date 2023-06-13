import React, { ReactNode, useState, useCallback } from 'react';

import Icon from '~shared/Icon';
import styles from './Card.css';

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
          type="button"
        >
          <Icon
            appearance={{ size: 'normal' }}
            name="close"
            title={{ id: 'button.close' }}
          />
        </button>
      )}
      {children}
    </li>
  );
};

Card.displayName = displayName;

export default Card;
