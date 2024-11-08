import { type ReactNode } from 'react';

import { type NotificationType } from '~gql';

export interface BaseNotificationMessageProps {
  actionMetadataDescription: ReactNode;
  actionTitle: string;
  loading: boolean;
  notificationType?: NotificationType;
}
