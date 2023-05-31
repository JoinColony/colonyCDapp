import React, { ComponentType, ReactNode } from 'react';
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import Icon from '~shared/Extensions/Icon';
import NavLink from '~shared/Extensions/NavLink';
import { SimpleMessageValues } from '~types/index';
import styles from './HistoryNavigation.css';

const displayName = 'pages.NavigationWrapper.HistoryNavigation';

const MSG = defineMessages({
  backHistoryLink: {
    id: `pages.NavigationWrapper.HistoryNavigation.backHistoryLink`,
    defaultMessage: 'Go back',
  },
});

interface Props {
  /*
   * If set, the the back link will redirect back to a specific route
   */
  backRoute?: string;

  /*
   * If set, it will change the default back link text
   */
  backText?: string | MessageDescriptor | ComponentType<Record<string, unknown>>;

  /*
   * Works in conjuction with the above to provide message descriptor selector values
   */
  backTextValues?: SimpleMessageValues;

  /*
   * If you would like to stay at the same route but handle the navigation manually
   * a custom handler can be used i.e. switching to another wizard step
   */
  customHandler?: () => boolean;

  /*
   * If set, overwrite the default main className
   */
  className?: string;
}

const HistoryNavigation = ({ backRoute, backText, backTextValues, className, customHandler }: Props) => {
  const { formatMessage } = useIntl();

  const navigate = useNavigate();
  let linkText: string | ReactNode;
  switch (typeof backText) {
    case 'string': {
      linkText = backText;
      break;
    }
    case 'function': {
      const BackText = backText;
      linkText = <BackText />;
      break;
    }
    case 'object': {
      linkText = formatMessage(backText, backTextValues);
      break;
    }
    default: {
      linkText = formatMessage(MSG.backHistoryLink);
    }
  }
  const iconText = formatMessage(MSG.backHistoryLink);
  return (
    <div className={className || styles.main} data-test="backButton">
      {backRoute ? (
        <NavLink to={backRoute} className={styles.back}>
          <Icon name="circle-back" title={iconText} appearance={{ size: 'medium' }} />
          {linkText}
        </NavLink>
      ) : (
        <button
          className={styles.back}
          type="button"
          onClick={() => (customHandler && customHandler() ? undefined : navigate(-1))}
        >
          <Icon name="circle-back" title={iconText} appearance={{ size: 'medium' }} />
          {linkText}
        </button>
      )}
    </div>
  );
};

HistoryNavigation.displayName = displayName;

export default HistoryNavigation;
