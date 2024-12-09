import { WarningCircle } from '@phosphor-icons/react';
import { defineMessages, type MessageDescriptor } from 'react-intl';

import { KycStatus } from '~gql';
import { formatText } from '~utils/intl.ts';
import { type CryptoToFiatBadgeProps } from '~v5/common/Pills/CryptoToFiatBadge.tsx/types.ts';

export const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.Verification';

export const getBadgeProps = (
  status?: string | null,
): CryptoToFiatBadgeProps => {
  const defaultBadgeProps: CryptoToFiatBadgeProps = {
    text: formatText({
      id: `${displayName}.pillCopy`,
      defaultMessage: 'Not started',
    }),
    icon: WarningCircle,
    theme: 'red',
  };

  switch (status) {
    case KycStatus.Incomplete: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Incomplete',
        }),
        theme: 'orange',
      };
    }
    case KycStatus.Pending: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Pending',
        }),
        theme: 'light-orange',
      };
    }
    case KycStatus.UnderReview: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Under review',
        }),
        theme: 'gray',
      };
    }
    case KycStatus.Approved: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Approved',
        }),
        theme: 'green',
      };
    }
    case KycStatus.Rejected: {
      return {
        text: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Rejected',
        }),
        icon: WarningCircle,
        theme: 'red',
      };
    }
    case KycStatus.NotStarted:
    default: {
      return defaultBadgeProps;
    }
  }
};

export const getCTAProps = (
  status?: string | null,
): {
  ctaTitle?: MessageDescriptor;
  ctaDisabled?: boolean;
} => {
  const defaultCTAProps = {
    ctaTitle: {
      id: `${displayName}.headingTitle`,
      defaultMessage: 'Start KYC',
    },
  };

  if (!status) {
    return {
      ...defaultCTAProps,
      ctaDisabled: true,
    };
  }

  switch (status) {
    case KycStatus.Rejected: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Re-submit application',
        },
      };
    }
    case KycStatus.Approved: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Completed',
        },
        ctaDisabled: true,
      };
    }
    case KycStatus.Incomplete: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Complete application',
        },
      };
    }
    case KycStatus.Pending:
    case KycStatus.UnderReview: {
      return {
        ctaTitle: {
          id: `${displayName}.headingTitle`,
          defaultMessage: 'Pending',
        },
        ctaDisabled: true,
      };
    }
    default: {
      return defaultCTAProps;
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
      'Regulatory compliance requires users to fiat off-ramp must complete KYC/AML checks. It only takes a couple of minutes (up to 1 business day if a manual check is required).',
  },
  bodyCtaTitle: {
    id: `${displayName}.bodyCtaTitle`,
    defaultMessage: 'Start KYC',
  },
});
