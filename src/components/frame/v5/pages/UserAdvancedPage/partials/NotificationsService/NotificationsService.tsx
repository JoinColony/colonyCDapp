import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import Switch from '~v5/common/Fields/Switch/Switch.tsx';

import { ServiceItem } from '../ServiceItem/ServiceItem.tsx';

const MSG = defineMessages({
  title: {
    id: 'UserAdvancedPage.partials.NotificationsService.title',
    defaultMessage: 'Notifications',
  },
  description: {
    id: 'UserAdvancedPage.partials.NotificationsService.description',
    defaultMessage:
      'Enables in-app and external notifications for activity in colonies you’ve joined.',
  },
});

export const NotificationsService = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleNotificationSettingChange = () => {
    setIsEnabled((state) => !state);
  };

  return (
    <ServiceItem
      title={MSG.title}
      description={MSG.description}
      ctaComponent={
        <Switch
          checked={isEnabled}
          onChange={handleNotificationSettingChange}
        />
      }
    />
  );
};
