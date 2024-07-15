import { WarningCircle } from '@phosphor-icons/react';
import { type MessageDescriptor, defineMessages } from 'react-intl';

import { formatText } from '~utils/intl.ts';

import { statusPillThemes } from '../../constants.ts';
import { type StatusPillScheme } from '../../types.ts';

import { KycStatus } from './types.ts';

export const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.Verification';

export const getStatusPillScheme = (
  status?: string | null,
): StatusPillScheme => {
  switch (status) {
    case KycStatus.NOT_STARTED: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Not started',
        }),
        icon: WarningCircle,
        ...statusPillThemes.red,
      };
    }
    case KycStatus.INCOMPLETE: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Incomplete',
        }),
        ...statusPillThemes.orange,
      };
    }
    case KycStatus.AWAITING_UBO: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Awaiting UBO',
        }),
        ...statusPillThemes.gray,
      };
    }
    case KycStatus.MANUAL_REVIEW: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Manual review',
        }),
        ...statusPillThemes.gray,
      };
    }
    case KycStatus.UNDER_REVIEW: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Under review',
        }),
        ...statusPillThemes.gray,
      };
    }
    case KycStatus.APPROVED: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Approved',
        }),
        ...statusPillThemes.green,
      };
    }
    case KycStatus.REJECTED: {
      return {
        copy: formatText({
          id: `${displayName}.pillCopy`,
          defaultMessage: 'Rejected',
        }),
        icon: WarningCircle,
        ...statusPillThemes.red,
      };
    }
    default: {
      return {
        copy: '',
        bgClassName: 'bg-teams-red-50',
        textClassName: 'text-gray-400',
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
