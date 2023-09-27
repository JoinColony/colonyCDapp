import React from 'react';
import classnames from 'classnames';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import Icon from '~shared/Icon';
import Tag from '~shared/Tag';
import { TRANSACTION_STATUS } from '~hooks';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../SafeTransactionDetail.css';

interface TitleProps {
  index: number | null;
  title: MessageDescriptor;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionStatus: string;
}

export const Title = ({
  index,
  title,
  isOpen,
  setIsOpen,
  transactionStatus,
}: TitleProps) => (
  <div className={classnames(widgetStyles.item, styles.title)}>
    <div className={widgetStyles.label}>
      {index && `${index}. `}
      <FormattedMessage {...title} />
      {transactionStatus && (
        <div className={styles.transactionTag}>
          <Tag
            text={transactionStatus}
            appearance={{
              theme:
                transactionStatus === TRANSACTION_STATUS.ACTION_NEEDED
                  ? 'golden'
                  : 'primary',
              colorSchema: 'fullColor',
            }}
          />
        </div>
      )}
    </div>
    <div className={widgetStyles.value}>
      <Icon
        name={isOpen ? 'caret-up' : 'caret-down'}
        appearance={{ size: 'extraTiny' }}
        onClick={() => setIsOpen((val) => !val)}
      />
    </div>
  </div>
);
