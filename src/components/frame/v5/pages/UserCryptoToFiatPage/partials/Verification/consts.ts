import { WarningCircle, type Icon } from '@phosphor-icons/react';
import { type MessageDescriptor, defineMessages } from 'react-intl';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.Verification';

export enum STATUS {
  NOT_STARTED = 'not_started',
  INCOMPLETE = 'incomplete',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// @TODO add keys translation file
export const STATUS_MSGS = defineMessages({
  // update these keys to match the actual status
  [STATUS.NOT_STARTED]: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Not started',
  },
  [STATUS.INCOMPLETE]: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Incomplete',
  },
  [STATUS.UNDER_REVIEW]: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Under Review',
  },
  [STATUS.APPROVED]: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Approved',
  },
  [STATUS.REJECTED]: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Rejected',
  },
});

// Add more status pills here
export const getStatusPillScheme = (
  status?: string | null,
): {
  icon?: Icon;
  iconClassName?: string;
  bgClassName: string;
  textClassName: string;
} => {
  switch (status) {
    case STATUS.APPROVED: {
      return {
        bgClassName: 'bg-teams-green-100',
        textClassName: 'text-xs text-teams-green-400',
      };
    }
    case STATUS.INCOMPLETE: {
      return {
        bgClassName: 'bg-warning-100',
        textClassName: 'text-xs text-warning-400',
      };
    }
    case STATUS.UNDER_REVIEW: {
      return {
        bgClassName: 'bg-gray-100',
        textClassName: 'text-xs text-gray-500',
      };
    }
    default: {
      return {
        icon: WarningCircle,
        iconClassName: 'text-teams-red-400',
        bgClassName: 'bg-teams-red-50',
        textClassName: 'text-xs text-teams-red-400',
      };
    }
  }
};

export const getCTAProps = (
  status?: string | null,
): { ctaTitle?: MessageDescriptor; ctaDisabled?: boolean } => {
  switch (status) {
    case STATUS.REJECTED: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Re-submit application',
        },
      };
    }
    case STATUS.APPROVED: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Completed',
        },
        ctaDisabled: true,
      };
    }
    case STATUS.INCOMPLETE: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Complete application',
        },
      };
    }
    case STATUS.UNDER_REVIEW: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Pending',
        },
        ctaDisabled: true,
      };
    }
    default: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Start KYC',
        },
      };
    }
  }
};
