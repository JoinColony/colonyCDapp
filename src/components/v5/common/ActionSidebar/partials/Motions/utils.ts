import { MotionState } from '@colony/colony-js';
import { formatRelative } from 'date-fns';
import { defineMessages } from 'react-intl';

import { type ColonyMotion } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'v5.common.ActionSidebar.partials.Motions';

const MSG = defineMessages({
  stakingStarted: {
    id: `${displayName}.stakingStarted`,
    defaultMessage: 'Staking period started. {timestamp}',
  },
  stakingFullyOpposed: {
    id: `${displayName}.stakingFullyOpposed`,
    defaultMessage:
      'Action is fully opposed. As long it is not also fully supported, it will fail. {timestamp}',
  },
  stakingFullySupported: {
    id: `${displayName}.stakingFullySupported`,
    defaultMessage:
      'Action is fully supported. As long it is not also fully opposed, it will pass and can be finalized. {timestamp}',
  },
  stakingFullyOpposedOutcome: {
    id: `${displayName}.stakingFullyOpposedOutcome`,
    defaultMessage: 'Staking period ended fully opposed. {timestamp}',
  },
  stakingFullySupportedOutcome: {
    id: `${displayName}.stakingFullySupportedOutcome`,
    defaultMessage: 'Staking period ended fully supported. {timestamp}',
  },
  stakingNoSidesOutcome: {
    id: `${displayName}.stakingNoSidesOutcome`,
    defaultMessage: 'Staking period ended not fully supported.',
  },
  stakingBothSidesOutcome: {
    id: `${displayName}.stakingBothSidesOutcome`,
    defaultMessage:
      'Staking period ended fully supported and fully opposed, and went to a vote. {timestamp}',
  },
  votingNotStarted: {
    id: `${displayName}.votingNotStarted`,
    defaultMessage:
      'Voting will start if action is fully supported and fully opposed.',
  },
  votingEnded: {
    id: `${displayName}.votingEnded`,
    defaultMessage:
      'Voting period ended with {votersCount} voters. {timestamp}',
  },
  votingStarted: {
    id: `${displayName}.votingStarted`,
    defaultMessage: 'Voting period started. {timestamp}',
  },
  revealNotStarted: {
    id: `${displayName}.revealNotStarted`,
    defaultMessage:
      'Votes are hidden, so you need to reveal your vote during the Reveal stage for it to be counted and to be eligible for rewards.',
  },
  revealStarted: {
    id: `${displayName}.revealStarted`,
    defaultMessage: 'Reveal period started. {timestamp}',
  },
  revealEnded: {
    id: `${displayName}.revealEnded`,
    defaultMessage:
      'Reveal period ended with {revealedVoteCount} vote reveals. {timestamp}',
  },
  outcomeNotStarted: {
    id: `${displayName}.outcomeNotStarted`,
    defaultMessage: 'The outcome of this proposed action.',
  },
  outcomeYaySideWon: {
    id: `${displayName}.outcomeYaySideWon`,
    defaultMessage: 'Action was fully supported. {timestamp}',
  },
  outcomeNaySideWon: {
    id: `${displayName}.outcomeNaySideWon`,
    defaultMessage: 'Action failed to get enough support. {timestamp}',
  },
  outcomeYaySideWonWithVotes: {
    id: `${displayName}.outcomeYaySideWonWithVotes`,
    defaultMessage:
      'Action went to a vote and the outcome was in support. {timestamp}',
  },
  outcomeNaySideWonWithVotes: {
    id: `${displayName}.outcomeNaySideWonWithVotes`,
    defaultMessage:
      'Action went to a vote and the outcome was in opposition. {timestamp}',
  },
});

export const getStakingStepTooltipText = (
  motionState: MotionState | undefined,
  motionData: ColonyMotion | undefined | null,
) => {
  const {
    motionStakes,
    createdAt: motionCreatedAt,
    motionStateHistory,
  } = motionData || {};
  const { percentage } = motionStakes || {};
  const { naySideFullyStakedAt, yaySideFullyStakedAt } =
    motionStateHistory || {};
  const { nay, yay } = percentage || {};

  const formatttedMotionCreatedAt = motionCreatedAt
    ? formatRelative(new Date(motionCreatedAt), new Date())
    : '';
  const formattedNaySideFullyStakedAt = naySideFullyStakedAt
    ? formatRelative(new Date(naySideFullyStakedAt), new Date())
    : '';
  const formattedYaySideFullyStakedAt = yaySideFullyStakedAt
    ? formatRelative(new Date(yaySideFullyStakedAt), new Date())
    : '';

  const objectingStakesPercentageValue = Number(nay) || 0;
  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullyOpposed = objectingStakesPercentageValue === 100;
  const isFullySupported = supportingStakesPercentageValue === 100;

  const isFullyStaked = isFullyOpposed && isFullySupported;

  if (motionState === MotionState.Staking) {
    if (!(isFullyOpposed || isFullyStaked)) {
      return formatText(MSG.stakingStarted, {
        timestamp: formatttedMotionCreatedAt,
      });
    }

    if (isFullyOpposed) {
      return formatText(MSG.stakingFullyOpposed, {
        timestamp: formattedNaySideFullyStakedAt,
      });
    }

    if (isFullySupported) {
      return formatText(MSG.stakingFullySupported, {
        timestamp: formattedYaySideFullyStakedAt,
      });
    }
  }

  if (isFullyStaked) {
    return formatText(MSG.stakingBothSidesOutcome, {
      timestamp:
        Number(naySideFullyStakedAt) > Number(yaySideFullyStakedAt)
          ? formattedNaySideFullyStakedAt
          : formattedYaySideFullyStakedAt,
    });
  }

  if (isFullyOpposed) {
    return formatText(MSG.stakingFullyOpposedOutcome, {
      timestamp: formattedNaySideFullyStakedAt,
    });
  }

  if (isFullySupported) {
    return formatText(MSG.stakingFullySupportedOutcome, {
      timestamp: formattedYaySideFullyStakedAt,
    });
  }

  return formatText(MSG.stakingNoSidesOutcome);
};

export const getVotingStepTooltipText = (
  motionState: MotionState | undefined = MotionState.Null,
  motionData: ColonyMotion | undefined | null,
) => {
  const { motionStateHistory, voterRecord } = motionData || {};
  const { naySideFullyStakedAt, yaySideFullyStakedAt, allVotesSubmittedAt } =
    motionStateHistory || {};

  const formattedNaySideFullyStakedAt = naySideFullyStakedAt
    ? formatRelative(new Date(naySideFullyStakedAt), new Date())
    : '';
  const formattedYaySideFullyStakedAt = yaySideFullyStakedAt
    ? formatRelative(new Date(yaySideFullyStakedAt), new Date())
    : '';
  const formattedAllVotesSubmittedAt = allVotesSubmittedAt
    ? formatRelative(new Date(allVotesSubmittedAt), new Date())
    : '';

  if (motionState < MotionState.Submit) {
    return formatText(MSG.votingNotStarted);
  }

  if (motionState === MotionState.Submit) {
    return formatText(MSG.votingStarted, {
      timestamp:
        Number(naySideFullyStakedAt) > Number(yaySideFullyStakedAt)
          ? formattedNaySideFullyStakedAt
          : formattedYaySideFullyStakedAt,
    });
  }

  return formatText(MSG.votingEnded, {
    timestamp: formattedAllVotesSubmittedAt,
    votersCount: voterRecord?.length || 0,
  });
};

export const getRevealStepTooltipText = (
  motionState: MotionState | undefined = MotionState.Null,
  motionData: ColonyMotion | undefined | null,
) => {
  const { motionStateHistory, revealedVotes } = motionData || {};
  const { allVotesSubmittedAt, allVotesRevealedAt } = motionStateHistory || {};
  const yayRevealedVotes = Number(revealedVotes?.raw.yay) || 0;
  const nayRevealedVotes = Number(revealedVotes?.raw.nay) || 0;

  const formattedAllVotesSubmittedAt = allVotesSubmittedAt
    ? formatRelative(new Date(allVotesSubmittedAt), new Date())
    : '';
  const formattedAllVotesRevealedAt = allVotesRevealedAt
    ? formatRelative(new Date(allVotesRevealedAt), new Date())
    : '';

  if (motionState < MotionState.Reveal) {
    return formatText(MSG.revealNotStarted);
  }

  if (motionState === MotionState.Reveal) {
    return formatText(MSG.revealStarted, {
      timestamp: formattedAllVotesSubmittedAt,
    });
  }

  return formatText(MSG.revealEnded, {
    timestamp: formattedAllVotesRevealedAt,
    revealedVoteCount: yayRevealedVotes + nayRevealedVotes || 0,
  });
};

export const getOutcomeStepTooltipText = (
  motionState: MotionState | undefined = MotionState.Null,
  motionData: ColonyMotion | undefined | null,
) => {
  const { motionStateHistory, revealedVotes, motionStakes } = motionData || {};
  const { allVotesSubmittedAt, allVotesRevealedAt, yaySideFullyStakedAt } =
    motionStateHistory || {};
  const { percentage } = motionStakes || {};
  const { yay } = percentage || {};
  const yayRevealedRep = Number(revealedVotes?.raw.yay) || 0;
  const nayRevealedRep = Number(revealedVotes?.raw.nay) || 0;

  const supportingStakesPercentageValue = Number(yay) || 0;

  const isFullySupported = supportingStakesPercentageValue === 100;

  const formattedAllVotesSubmittedAt = allVotesSubmittedAt
    ? formatRelative(new Date(allVotesSubmittedAt), new Date())
    : '';
  const formattedAllVotesRevealedAt = allVotesRevealedAt
    ? formatRelative(new Date(allVotesRevealedAt), new Date())
    : '';

  if (motionState < MotionState.Closed) {
    return formatText(MSG.outcomeNotStarted);
  }

  if (
    motionState === MotionState.Finalizable ||
    motionState === MotionState.Finalized
  ) {
    if (isFullySupported && !yayRevealedRep && !nayRevealedRep) {
      const formattedYaySideFullyStakedAt = yaySideFullyStakedAt
        ? formatRelative(new Date(yaySideFullyStakedAt), new Date())
        : '';

      return formatText(MSG.outcomeYaySideWon, {
        timestamp: formattedYaySideFullyStakedAt,
      });
    }

    if (yayRevealedRep > nayRevealedRep) {
      return formatText(MSG.outcomeYaySideWonWithVotes, {
        timestamp: formattedAllVotesRevealedAt,
      });
    }

    return formatText(MSG.outcomeNaySideWonWithVotes, {
      timestamp: formattedAllVotesRevealedAt,
    });
  }

  return formatText(MSG.outcomeNaySideWon, {
    timestamp: formattedAllVotesSubmittedAt,
  });
};
