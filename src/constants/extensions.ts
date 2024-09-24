import { ColonyRole, Extension } from '@colony/colony-js';
import { defineMessages } from 'react-intl';
import { number } from 'yup';

import ExtensionAdvancedPaymentsIcon from '~icons/ExtensionAdvancedPaymentsIcon.tsx';
import ExtensionLazyConsensusIcon from '~icons/ExtensionLazyConsensusIcon.tsx';
import ExtensionMultiSigIcon from '~icons/ExtensionMultiSigIcon.tsx';
import ExtensionOneTransactionPaymentIcon from '~icons/ExtensionOneTransactionPaymentIcon.tsx';
import ExtensionStagedPaymentsIcon from '~icons/ExtensionStagedPaymentsIcon.tsx';
import multiSigHero from '~images/assets/extensions/multi-sig-hero.png';
import multiSigInterface from '~images/assets/extensions/multi-sig-interface.png';
import oneTransactionHero from '~images/assets/extensions/one-transaction-hero.png';
import oneTransactionInterface from '~images/assets/extensions/one-transaction-interface.png';
import reputationHero from '~images/assets/extensions/reputation-hero.png';
import reputationInterface from '~images/assets/extensions/reputation-interface.png';
import stagedHero from '~images/assets/extensions/staged-hero.png';
import stagedInterface from '~images/assets/extensions/staged-interface.png';
import stakedHero from '~images/assets/extensions/staked-hero.png';
import stakedInterface from '~images/assets/extensions/staked-interface.png';
import {
  type ExtensionConfig,
  ExtensionParamType,
  type ExtensionInitParam,
} from '~types/extensions.ts';
import {
  convertFractionToWei,
  convertPeriodToSeconds,
} from '~utils/extensions.ts';
import { toFinite } from '~utils/lodash.ts';

export enum ExtensionCategory {
  Payments = 'Payments',
  DecisionMethods = 'Decision Methods',
  Expenditures = 'Expenditures',
}

const multiSigName = 'extensions.MultiSig';
const oneTransactionPaymentName = 'extensions.OneTxPayment';
const votingReputationName = 'extensions.VotingReputation';
const stakedExpenditureName = 'extensions.StakedExpenditure';
const stagedExpenditureName = 'extensions.StagedExpenditure';
const streamingPaymentsName = 'extensions.StreamingPayments';

const validationMessages = {
  requiredError: {
    id: 'extensions.param.validation.requiredError',
    defaultMessage: 'Please enter a value.',
  },
  lessThan50Error: {
    id: 'extensions.param.validation.lessThan50Error',
    defaultMessage: 'Please enter a percentage less than or equal to 50%.',
  },
  lessThan100Error: {
    id: 'extensions.param.validation.lessThan100Error',
    defaultMessage: 'Please enter a percentage less than or equal to 100%.',
  },
  lessThan1YearError: {
    id: 'extensions.param.validation.lessThan50Error',
    defaultMessage: 'Please enter hours less than or equal to 1 year.',
  },
  positiveError: {
    id: 'extensions.param.validation.positiveError',
    defaultMessage: 'Please enter a positive number',
  },
  greaterThan0Error: {
    id: 'extensions.param.validation.greaterThan0Error',
    defaultMessage: 'Percentage must be greater than 0',
  },
};

const multiSigMessages = {
  multiSigName: {
    id: `${multiSigName}.name`,
    defaultMessage: 'Multi-sig Permissions',
  },
  multiSigDescriptionShort: {
    id: `${multiSigName}.description`,
    defaultMessage:
      'Enables the multi-signer permissions system for the Colony.',
  },
  multiSigDescriptionLong: {
    id: `${oneTransactionPaymentName}.descriptionLong`,
    defaultMessage: `<p>The Multi-Sig Permissions system leverages the existing “Core” Permissions system on Colony. With the additional security requirement of needing multiple permission holders to sign before an action can be taken.</p><p>This means that as long as at least two people hold the same permission in a team, then individuals are not able to skip governance and solely control that team or the Colony as a whole. So, doing actions such as transferring funds, making payments, changing reputation, creating teams, unlocking the token, etc. cannot be done without collective input from other permission holders.</p><p>This makes for more flexible options for distribution of authority and a more secure and decentralized Colony and permission system, while maintaining efficiency.</p><h4>How the extension works</h4><ul><li>A Colony member creates an action such as, “Pay Alice 100 xDAI”, selecting the “Multi-Sig” as the Governance option.</li><li>An approval process begins, where users with the required permissions need to approve the action by signing.</li><li>A minimum required number of permission holders need to sign to reach consensus, this can be fixed or relative based on how this extension is configured.</li><li>Once consensus has been achieved, approval concludes and the action is able to be finalized.</li></ul><h4>Useful for:</h4><ul><li>Taking quick actions in a Colony in a secure way.</li><li>Teams that need to be more decentralized, and autonomous without compromising security.</li><li>Teams that require more flexible ways of distributing authority.</li><li>Complimenting the Reputation governance extension to allow quicker actions without individuals having control with “Core” Permissions.</li></ul>`,
  },
};

const oneTransactionPaymentMessages = {
  oneTxPaymentName: {
    id: `${oneTransactionPaymentName}.name`,
    defaultMessage: 'One Transaction Payment',
  },
  oneTxPaymentDescriptionShort: {
    id: `${oneTransactionPaymentName}.description`,
    defaultMessage:
      'Make quick and simple payments to members or any address on the same network.',
  },
  oneTxPaymentDescriptionLong: {
    id: `${oneTransactionPaymentName}.descriptionLong`,
    defaultMessage: `<p>The One Transaction Payment Extension allows payments to a single account at a time with one type of token.</p><p>Note: This extension is installed and enabled by default and can not be removed.</p><h4>How the extension works</h4><ul><li>A DAO creates a payment Action (or Motion, if enabled) to make a payment to a selected recipient, e.g. “Pay Alice 100 xDAI”.</li><li>You can pay any member or address any availble funds from the Colony.</li><li>You are also able to select the specific team funds will be paid from.</li></ul><h4>Useful for:</h4><ul><li>Paying contributors to the DAO.</li><li>Paying for services, or transferring funds externally.</li></ul>`,
  },
};

export const votingReputationMessages = {
  votingReputationName: {
    id: `${votingReputationName}.name`,
    defaultMessage: 'Reputation Weighted (Lazy Consensus method)',
  },
  votingReputationDescriptionShort: {
    id: `${votingReputationName}.description`,
    defaultMessage: `Enable efficient and decentralized decision making for your colony. Allowing members to propose actions to be taken.`,
  },
  votingReputationDescriptionLong: {
    id: `${votingReputationName}.descriptionLong`,
    // @TODO: implement markdown parsing on ExtensionDetailsPage instead of inlining HTML
    defaultMessage: `<p>Provides a democratic, permissionless decision-making tool for your Colony. This extension enables any member to propose actions, which can only pass with total support and no total opposition.</p><p>To support a proposed action, members need to stake their tokens - essentially placing them at risk in favor of the decision. If the required stake, as defined by the Colony, is met and no one opposes by staking against it, the action can proceed safely through a mechanism known as "Lazy Consensus."</p><p>A security delay or "Staking Phase Duration," determined during the extension installation, provides a window of opportunity for DAO members to support or oppose the proposed action. This feature can be used for any Action type, from managing funds and teams to making payments.</p><h4>How the extension works</h4><ul><li>A member proposes an Action, for example, "Pay Alice 100 xDAI," using the Reputation Decision method.</li><li>A staking period commences, during which the DAOs native token can be used to back the Action.</li><li>If the Action garners adequate staking without opposition, it passes and can be finalized on the blockchain.</li><li>Opposition, however, triggers the voting process, where reputation is used to determine voting weight.</li><li>The voting outcome will decide which side wins and whether the action can proceed safely or not.</li><li>Depending on how they voted and the outcome, voters may be rewarded or docked a portion of their staked tokens.</li><li>Additionally an extra security window can be defined for actions being proposed in teams where the outcome can be opposed further and escalated to higher teams for additional input.</li></ul><h4>Useful for:</h4><ul><li>Facilitating decisions and actions within a DAO in a permissionless, decentralized manner, while maintaining efficiency and minimizing collective decision-making efforts.</li><li>Encouraging further decentralization in the DAO, which fosters more democratic and inclusive governance.</li></ul>`,
  },
  votingReputationTotalStakeFractionTitle: {
    id: `${votingReputationName}.param.totalStakeFraction.title`,
    defaultMessage: 'Required Stake',
  },
  votingReputationTotalStakeFractionDescription: {
    id: `${votingReputationName}.param.totalStakeFraction.description`,
    defaultMessage: `What percentage of the team's reputation, in token terms, should need to stake on each side of a motion?\n\n<span>e.g. if a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.</span>`,
  },
  votingReputationVoterRewardFractionTitle: {
    id: `${votingReputationName}.param.voterRewardFraction.title`,
    defaultMessage: 'Voter Reward',
  },
  votingReputationVoterRewardFractionDescription: {
    id: `${votingReputationName}.param.voterRewardFraction.description`,
    defaultMessage: `In a dispute, what percentage of the losing side's stake should be awarded to the voters?\n\n<span>e.g. If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.</span>`,
  },
  votingReputationUserMinStakeFractionTitle: {
    id: `${votingReputationName}.param.userMinStakeFraction.title`,
    defaultMessage: 'Minimum Stake',
  },
  votingReputationUserMinStakeFractionDescription: {
    id: `${votingReputationName}.param.userMinStakeFraction.description`,
    defaultMessage: `What is the minimum percentage of the total stake that each staker should have to provide?\n\n<span>e.g. 10% means anybody who wishes to stake must provide at least 10% of the Required Stake.</span>`,
  },
  votingReputationMaxVoteFractionTitle: {
    id: `${votingReputationName}.param.votingReputationMaxVoteFractionTitle.title`,
    defaultMessage: 'End Vote Threshold',
  },
  votingReputationMaxVoteFractionDescription: {
    id: `${votingReputationName}.param.maxVoteFraction.description`,
    defaultMessage: `At what threshold of reputation having voted should the voting period to end?\n\n<span>e.g. If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.</span>`,
  },
  votingReputationStakePeriodTitle: {
    id: `${votingReputationName}.param.stakePeriod.title`,
    defaultMessage: 'Staking Phase Duration',
  },
  votingReputationStakePeriodDescription: {
    id: `${votingReputationName}.param.stakePeriod.description`,
    defaultMessage: `How long do you want to allow each side of a motion to get staked?\n\n<span>e.g. If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.</span>`,
  },
  votingReputationSubmitPeriodTitle: {
    id: `${votingReputationName}.param.submitPeriod.title`,
    defaultMessage: 'Voting Phase Duration',
  },
  votingReputationSubmitPeriodDescription: {
    id: `${votingReputationName}.param.submitPeriod.description`,
    defaultMessage: `How long do you want to give members to cast their votes?\n\n<span>e.g. if the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.</span>`,
  },
  votingReputationRevealPeriodTitle: {
    id: `${votingReputationName}.param.revealPeriod.title`,
    defaultMessage: 'Reveal Phase Duration',
  },
  votingReputationRevealPeriodDescription: {
    id: `${votingReputationName}.param.revealPeriod.description`,
    defaultMessage: `How long do you want to give members to reveal their votes?\n\n<span>e.g. Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.</span>`,
  },
  votingReputationEscalationPeriodTitle: {
    id: `${votingReputationName}.param.escalationPeriod.title`,
    defaultMessage: 'Escalation Phase Duration',
  },
  votingReputationEscalationPeriodDescription: {
    id: `${votingReputationName}.param.escalationPeriod.description`,
    defaultMessage: `How long do you wish to allow for members to escalate a dispute to a higher team?\n\n<span>e.g. If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.</span>`,
  },
  votingReputationRequiredError: {
    id: `${votingReputationName}.param.validation.requiredError`,
    defaultMessage: 'Please enter a value.',
  },
  votingReputationLessThan50Error: {
    id: `${votingReputationName}.param.validation.lessThan50Error`,
    defaultMessage: 'Please enter a percentage less than or equal to 50%.',
  },
  votingReputationLessThan100Error: {
    id: `${votingReputationName}.param.validation.lessThan100Error`,
    defaultMessage: 'Please enter a percentage less than or equal to 100%.',
  },
  votingReputationLessThan1YearError: {
    id: `${votingReputationName}.param.validation.lessThan50Error`,
    defaultMessage: 'Please enter hours less than or equal to 1 year.',
  },
  votingReputationPositiveError: {
    id: `${votingReputationName}.param.validation.positiveError`,
    defaultMessage: 'Please enter a positive number',
  },
  votingReputationPermissionArchitecture: {
    id: `${votingReputationName}.param.permission.architecture`,
    defaultMessage: 'Architecture',
  },
  votingReputationPermissionArchitectureDescription: {
    id: `${votingReputationName}.param.permission.architectureDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionArbitration: {
    id: `${votingReputationName}.param.permission.arbitration`,
    defaultMessage: 'Arbitration',
  },
  votingReputationPermissionArbitrationDescription: {
    id: `${votingReputationName}.param.permission.arbitrationDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionRecovery: {
    id: `${votingReputationName}.param.permission.recovery`,
    defaultMessage: 'Recovery',
  },
  votingReputationPermissionRecoveryDescription: {
    id: `${votingReputationName}.param.permission.recoveryDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionFunding: {
    id: `${votingReputationName}.param.permission.funding`,
    defaultMessage: 'Funding',
  },
  votingReputationPermissionFundingDescription: {
    id: `${votingReputationName}.param.permission.fundingDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
};

const stakedExpenditureMessages = {
  stakedExpenditureName: {
    id: `${stakedExpenditureName}.name`,
    defaultMessage: 'Staking Advanced Payments',
  },
  stakedExpenditureDescriptionShort: {
    id: `${stakedExpenditureName}.description`,
    defaultMessage:
      'Allow the creation of Advanced payments by staking tokens. Adding more flexibility and autonomy to manage funds in a secure way.',
  },
  stakedExpenditureDescriptionLong: {
    id: `${stakedExpenditureName}.descriptionLong`,
    defaultMessage: `<p>Allows contributors to create advanced payment types by staking their own tokens, meaning they don’t require “Payer” permissions or above. Funding the payment however, will still require either “Payer” permissions or another supported decision method.</p><p>This feature adds more flexibility to manage funds and resources in an efficient, open, and trustless way.</p><h4>Payment types supported:</h4><p><b>Payment Builder</b>\nProvides a highly flexible way to construct a complicated payment involving multiple recipients receiving a number of different tokens at different times.</p><p><b>Split Payments</b>\nDivide an amount of funds between a set of recipients equally, unequally or based on proportion of selected recipients reputation.</p><p><b>Staged Payments</b>\nA payment broken down into separate milestones which may be released separately. Useful for example to make partial payments upon delivery of agreed project milestones.</p><h4>How the extension works</h4><ul><li>Users can select a supported payment type based on the required structure of the payment</li><li>Provide details of the payment, such as, team to pay funds from, recipients, amounts, tokens, delays, etc.</li><li>Decision Method: Choose the <b>"Staking"</b> decision method to create the payment process.</li><li>To create the payment, users will need to stake some of their own funds. Acting as a safeguard against frivolous or spam payments.</li><li>The rest of the payment process will be the same as usual for these payment types.</li><li>If the payment is approved, the creator will receive their full stake back on first payment.</li><li>However, if it is determined that the payment goes against the organization, it can be canceled, and the user canceling can decide to release or punish the creator’s stake. If punished, the creator will lose their original stake amount and equivalent reputation.</li></ul><h4>Useful for:</h4><ul><li>Increasing autonomy in your team without compromising security.</li><li>Providing a way for members of your team to make payment requests.</li></ul>`,
  },
  stakedExpenditureStakeFractionTitle: {
    id: `${stakedExpenditureName}.param.stakeFraction.title`,
    defaultMessage: 'Required Stake',
  },
  stakedExpenditureStakeFractionDescription: {
    id: `${stakedExpenditureName}.param.stakeFraction.description`,
    defaultMessage: `What percentage of the team's reputation, in token terms, should need to stake to create an expenditure?\n\n<span>e.g. if a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to create an expenditure.</span>`,
  },
};

const stagedExpenditureMessages = {
  stagedExpenditureName: {
    id: `${stagedExpenditureName}.name`,
    defaultMessage: 'Staged Payments',
  },
  stagedExpenditureDescriptionShort: {
    id: `${stagedExpenditureName}.description`,
    defaultMessage:
      'A flexible milestone based payment option, allowing a payment to be broken down into separate milestones which may be released separately.',
  },
  stagedExpenditureDescriptionLong: {
    id: `${stagedExpenditureName}.descriptionLong`,
    defaultMessage: `<p>The Staged Payments extension enhances the payment options for your team by introducing a flexible, milestone-based payment option. This feature allows payments to be segmented into distinct milestones, each of which can be released independently upon hitting or achieving those milestones.</p><p>This method not only ensures better management of project funds and accountability but also provides increased security and confidence for both contributors and payment creators.</p><p>Suitable for various scenarios such as project-based payments, periodic salary disbursements, budgeting, and target-based payments, making it a valuable addition to any team’s financial management toolkit.</p><h4>How the extension works</h4><ul><li>User creates a “Staged payment” action.</li><li>User can add the various stages of the payments as “Milestones” with a description and token amount for each milestone.</li><li>Getting approval and funding the payment is the same as other Advanced payment actions where you go through a Review and Funding step. The difference is in the Release step.</li><li>Each of the individual milestones in the payment can be released separately at any time, with the intention that they are released only when those milestones have been achieved.</li><li>If some of the milestone are not delivered, that payment can be canceled and those undelivered milestones will remain unpaid.</li></ul><h4>Useful for:</h4><ul><li>Making payments upon delivery of agreed project milestones.</li><li>Creating periodic payments, where pre-approved funds can be released as agreed.</li><li>Target based payments, where funds can be paid when a target has been achieved.</li></ul>`,
  },
  votingReputationPermissionArchitecture: {
    id: `${votingReputationName}.param.permission.architecture`,
    defaultMessage: 'Architecture',
  },
  votingReputationPermissionArchitectureDescription: {
    id: `${votingReputationName}.param.permission.architectureDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionArbitration: {
    id: `${votingReputationName}.param.permission.arbitration`,
    defaultMessage: 'Arbitration',
  },
  votingReputationPermissionArbitrationDescription: {
    id: `${votingReputationName}.param.permission.arbitrationDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionRecovery: {
    id: `${votingReputationName}.param.permission.recovery`,
    defaultMessage: 'Recovery',
  },
  votingReputationPermissionRecoveryDescription: {
    id: `${votingReputationName}.param.permission.recoveryDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
  votingReputationPermissionFunding: {
    id: `${votingReputationName}.param.permission.funding`,
    defaultMessage: 'Funding',
  },
  votingReputationPermissionFundingDescription: {
    id: `${votingReputationName}.param.permission.fundingDescription`,
    defaultMessage:
      'This permission allows users to create new domains, and manage permissions within those domains.',
  },
};

const streamingPaymentsMessage = {
  streamingPaymentsName: {
    id: `${streamingPaymentsName}.name`,
    defaultMessage: 'Streaming Payments',
  },
  streamingPaymentsDescriptionShort: {
    id: `${streamingPaymentsName}.description`,
    defaultMessage: 'Streaming Payments extension.',
  },
  streamingPaymentsDescriptionLong: {
    id: `${streamingPaymentsName}.descriptionLong`,
    defaultMessage: `<p>Enables continuous token streaming to recipients, with streamed tokens able to be claimed at any time. Perfect for emulating salaries to contributors, paying for subscription services, and more.</p><h4>Features include:</h4><b>Flexible streaming</b><p>Stream any amount of tokens and select your preferred period to set the ideal rate.</p><b>No Locking of Funds</b><p>Initiate streams without the hassle of locking up funds upfront.</p><b>Instant Claims</b><p>Recipients can claim their tokens anytime, ensuring flexibility and accessibility.</p><b>Customizable Conditions</b><p>Define start dates and end conditions according to your needs, whether it's indefinitely, a specific date, or when a total amount is streamed.</p><h4>How the extension works</h4><ul><li>Select a recipient for the streaming payment.</li><li>Specify start date and end condition, which can be a indefinite, at a certain date, or a total amount.</li><li>Specify the amount, period and token. For example '2,000 CLNY per month'.</li><li>The process of starting the stream will depend on the decision method used.</li><li>On approval, the stream will start and the recipient will be able to claim their earned funds at any time.</li></ul><h4>Userful for:</h4><ul><li>Emulating a salary to members of the organisation.</li><li>Payment for subscription services.</li><li>Providing income security to members.</li></ul>`,
  },
};

const MSG = defineMessages({
  ...validationMessages,
  ...oneTransactionPaymentMessages,
  ...votingReputationMessages,
  ...stakedExpenditureMessages,
  ...stagedExpenditureMessages,
  ...streamingPaymentsMessage,
  ...multiSigMessages,
});

const stakedExpenditureParams: ExtensionInitParam[] = [
  {
    paramName: 'stakeFraction',
    validation: number()
      .transform((value) => toFinite(value))
      .positive(() => MSG.greaterThan0Error)
      .required(() => MSG.requiredError)
      .max(50, () => MSG.lessThan50Error),
    defaultValue: 1,
    title: MSG.stakedExpenditureStakeFractionTitle,
    description: MSG.stakedExpenditureStakeFractionDescription,
    type: ExtensionParamType.Input,
    complementaryLabel: 'percent',
    formattingOptions: {
      numeralPositiveOnly: true,
    },
    transformValue: convertFractionToWei,
  },
];

export const supportedExtensionsConfig: ExtensionConfig[] = [
  {
    extensionId: Extension.OneTxPayment,
    category: ExtensionCategory.Payments,
    name: MSG.oneTxPaymentName,
    descriptionShort: MSG.oneTxPaymentDescriptionShort,
    descriptionLong: MSG.oneTxPaymentDescriptionLong,
    icon: ExtensionOneTransactionPaymentIcon,
    neededColonyPermissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ],
    imageURLs: [oneTransactionHero, oneTransactionInterface],
    uninstallable: false,
    createdAt: 1557698400000,
  },
  {
    extensionId: Extension.VotingReputation,
    category: ExtensionCategory.DecisionMethods,
    name: MSG.votingReputationName,
    descriptionShort: MSG.votingReputationDescriptionShort,
    descriptionLong: MSG.votingReputationDescriptionLong,
    icon: ExtensionLazyConsensusIcon,
    imageURLs: [reputationHero, reputationInterface],
    neededColonyPermissions: [
      ColonyRole.Root,
      ColonyRole.Administration,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
      ColonyRole.Funding,
    ],
    initializationParams: [
      {
        paramName: 'totalStakeFraction',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(50, () => MSG.lessThan50Error),
        defaultValue: 1,
        title: MSG.votingReputationTotalStakeFractionTitle,
        description: MSG.votingReputationTotalStakeFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertFractionToWei,
      },
      {
        paramName: 'voterRewardFraction',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(50, () => MSG.lessThan50Error),
        defaultValue: 20,
        title: MSG.votingReputationVoterRewardFractionTitle,
        description: MSG.votingReputationVoterRewardFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertFractionToWei,
      },
      {
        paramName: 'userMinStakeFraction',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(100, () => MSG.lessThan100Error),
        defaultValue: 1,
        title: MSG.votingReputationUserMinStakeFractionTitle,
        description: MSG.votingReputationUserMinStakeFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertFractionToWei,
      },
      {
        paramName: 'maxVoteFraction',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(100, () => MSG.lessThan100Error),
        defaultValue: 70,
        title: MSG.votingReputationMaxVoteFractionTitle,
        description: MSG.votingReputationMaxVoteFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertFractionToWei,
      },
      {
        paramName: 'stakePeriod',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(8760, () => MSG.lessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationStakePeriodTitle,
        description: MSG.votingReputationStakePeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertPeriodToSeconds,
      },
      {
        paramName: 'submitPeriod',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(8760, () => MSG.lessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationSubmitPeriodTitle,
        description: MSG.votingReputationSubmitPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertPeriodToSeconds,
      },
      {
        paramName: 'revealPeriod',
        validation: number()
          .transform((value) => toFinite(value))
          .positive(() => MSG.positiveError)
          .required(() => MSG.requiredError)
          .max(8760, () => MSG.lessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationRevealPeriodTitle,
        description: MSG.votingReputationRevealPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertPeriodToSeconds,
      },
      {
        paramName: 'escalationPeriod',
        /*
         * @TODO Re-enable once Motion escalation is implemented
         * Currently we just disable it from showing up in the UI and setting it to 0
         * But at some point this needs to be user configurable
         */
        // validation: number()
        //   .transform((value) => toFinite(value))
        //   .positive(() => MSG.positiveError)
        //   .required(() => MSG.requiredError)
        //   .max(8760, () => MSG.lessThan1YearError),
        validation: number(),
        defaultValue: 0, // 3 days in hours
        title: MSG.votingReputationEscalationPeriodTitle,
        description: MSG.votingReputationEscalationPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
        formattingOptions: {
          numeralPositiveOnly: true,
        },
        transformValue: convertPeriodToSeconds,
      },
    ],
    uninstallable: true,
    createdAt: 1603915271852,
  },
  {
    icon: ExtensionAdvancedPaymentsIcon,
    imageURLs: [stakedHero, stakedInterface],
    category: ExtensionCategory.Expenditures,
    extensionId: Extension.StakedExpenditure,
    name: MSG.stakedExpenditureName,
    descriptionShort: MSG.stakedExpenditureDescriptionShort,
    descriptionLong: MSG.stakedExpenditureDescriptionLong,
    neededColonyPermissions: [
      ColonyRole.Administration,
      ColonyRole.Funding,
      ColonyRole.Arbitration,
    ],
    uninstallable: true,
    createdAt: 1692048380000,
    initializationParams: stakedExpenditureParams,
    configurableParams: stakedExpenditureParams,
    autoEnableAfterInstall: true,
  },
  {
    icon: ExtensionStagedPaymentsIcon,
    imageURLs: [stagedHero, stagedInterface],
    category: ExtensionCategory.Payments,
    extensionId: Extension.StagedExpenditure,
    name: MSG.stagedExpenditureName,
    descriptionShort: MSG.stagedExpenditureDescriptionShort,
    descriptionLong: MSG.stagedExpenditureDescriptionLong,
    neededColonyPermissions: [ColonyRole.Root],
    uninstallable: true,
    createdAt: 1692048380000,
  },
  // {
  //   icon: ExtensionAdvancedPaymentsIcon,
  //   imageURLs: [streamingHero, streamingInterface],
  //   category: ExtensionCategory.Expenditures,
  //   extensionId: Extension.StreamingPayments,
  //   name: MSG.streamingPaymentsName,
  //   descriptionShort: MSG.streamingPaymentsDescriptionShort,
  //   descriptionLong: MSG.streamingPaymentsDescriptionLong,
  //   neededColonyPermissions: [ColonyRole.Administration, ColonyRole.Funding],
  //   uninstallable: true,
  //   createdAt: 1692048380000,
  // },
  {
    icon: ExtensionMultiSigIcon,
    imageURLs: [multiSigHero, multiSigInterface],
    category: ExtensionCategory.DecisionMethods,
    extensionId: Extension.MultisigPermissions,
    name: MSG.multiSigName,
    descriptionShort: MSG.multiSigDescriptionShort,
    descriptionLong: MSG.multiSigDescriptionLong,
    neededColonyPermissions: [
      ColonyRole.Root,
      ColonyRole.Administration,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
      ColonyRole.Funding,
    ],
    uninstallable: true,
    createdAt: 1713173071843,
    configurableParams: [],
    autoEnableAfterInstall: true,
  },
];
