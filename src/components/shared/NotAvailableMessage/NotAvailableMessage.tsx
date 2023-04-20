import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

interface Props {
  notAvailableDataName: string;
}

const displayName = 'NotAvailableMessage';

const MSG = defineMessages({
  notAvailable: {
    id: `${displayName}.notAvailable`,
    defaultMessage: '{notAvailableDataName} data is not available or could not be loaded.',
  },
});

const NotAvailableMessage = ({ notAvailableDataName }: Props) => (
  <FormattedMessage {...MSG.notAvailable} values={{ notAvailableDataName }} />
);

NotAvailableMessage.displayName = displayName;

export default NotAvailableMessage;
