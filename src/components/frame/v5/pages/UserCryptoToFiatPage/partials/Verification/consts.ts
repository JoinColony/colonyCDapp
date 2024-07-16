import { WarningCircle } from '@phosphor-icons/react';
import { type MessageDescriptor, defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import { type CryptoToFiatBadgeProps } from '~v5/common/Pills/CryptoToFiatBadge.tsx/types.ts';

import { KycStatus } from './types.ts';

export const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.Verification';

export const getBadgeProps = (
  status?: string | null,
): CryptoToFiatBadgeProps => {
  switch (status) {
    case KycStatus.NOT_STARTED: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Not started',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }
    case KycStatus.INCOMPLETE: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Incomplete',
        }),
        theme: 'orange',
      };
    }
    case KycStatus.AWAITING_UBO: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Awaiting UBO',
        }),
        theme: 'gray',
      };
    }
    case KycStatus.MANUAL_REVIEW: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Manual review',
        }),
        theme: 'gray',
      };
    }
    case KycStatus.UNDER_REVIEW: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Under review',
        }),
        theme: 'gray',
      };
    }
    case KycStatus.APPROVED: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Approved',
        }),
        theme: 'green',
      };
    }
    case KycStatus.REJECTED: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Rejected',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }
    default: {
      return {
        text: '',
        theme: 'gray',
      };
    }
  }
};

export const getCTAProps = (
  status?: string | null,
): {
  ctaTitle?: MessageDescriptor;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
} => {
  if (!status) {
    return { ctaDisabled: true, ctaLoading: true };
  }

  switch (status) {
    case KycStatus.REJECTED: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Re-submit application',
        },
      };
    }
    case KycStatus.APPROVED: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Completed',
        },
        ctaDisabled: true,
      };
    }
    case KycStatus.INCOMPLETE: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Complete application',
        },
      };
    }
    case KycStatus.UNDER_REVIEW: {
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

export const MSG = defineMessages({
  headingTitle: {
    id: `${displayName}.headingTitle`,
    defaultMessage: 'Verification',
  },
  headingAccessory: {
    id: `${displayName}.headingAccessory`,
    defaultMessage: 'Required',
  },
  bodyTitle: {
    id: `${displayName}.bodyTitle`,
    defaultMessage: 'Know Your Customer/Anti Money Laundering (KYC/AML) checks',
  },
  bodyDescription: {
    id: `${displayName}.bodyDescription`,
    defaultMessage:
      'Regulatory compliance requires users to fiat off-ramp must complete KYC/AML checks. It only takes a couple of minutes.',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});
