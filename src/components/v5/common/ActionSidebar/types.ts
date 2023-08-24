import { MessageDescriptor } from 'react-intl';
import { Actions } from '~constants/actions';

export type PopularActionsProps = {
  setSelectedAction: React.Dispatch<React.SetStateAction<Actions | null>>;
};

export type ActionButtonsProps = {
  isActionDisabled?: boolean;
  toggleCancelModal: () => void;
};

export type ErrorBannerProps = {
  title: MessageDescriptor | string;
  actionText?: MessageDescriptor | string;
};
