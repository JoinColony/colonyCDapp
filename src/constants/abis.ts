//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Colony
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const colonyAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Annotation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ArbitraryReputationUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ArbitraryTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'users',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'ColonyBootstrapped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'payoutRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fromPot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'toPot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyFundsMovedBetweenFundingPots',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'colonyNetwork',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyInitialised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ColonyMetadata',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ColonyMetadataDelta',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardInverse',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyRewardInverseSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'role', internalType: 'uint8', type: 'uint8', indexed: true },
      { name: 'setTo', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ColonyRoleSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'oldVersion',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVersion',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DomainAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'DomainDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'payoutRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DomainFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'DomainMetadata',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'claimDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureClaimDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'globalClaimDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureGlobalClaimDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ExpenditureMetadataSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'payoutModifier',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ExpenditurePayoutModifierSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditurePayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExpenditureRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'storageSlot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'mask', internalType: 'bool[]', type: 'bool[]', indexed: false },
      {
        name: 'keys',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ExpenditureStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExpenditureTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fundingPotId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FundingPotAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'localSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LocalSkillAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'localSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'LocalSkillDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetAuthority',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'relayerAddress',
        internalType: 'address payable',
        type: 'address',
        indexed: false,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'MetaTransactionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'PaymentFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentPayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PaymentRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fundingPotId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'slot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenPayout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_chainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProxyColonyFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'destinationChainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'salt',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ProxyColonyRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'rewardRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutCycleEnded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutCycleStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'specificationHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'TaskBriefSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reviewerAddresses',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'TaskChangedViaSignatures',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deliverableHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'TaskDeliverableSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'dueDate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskDueDateSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskPayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'TaskRoleUserSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      { name: 'rating', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'TaskWorkRatingRevealed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensMinted',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'DEPRECATED_taskWorkRatings',
    outputs: [
      { name: 'count', internalType: 'uint256', type: 'uint256' },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_extensionId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_resolver', internalType: 'address', type: 'address' },
    ],
    name: 'addExtensionToNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'addLocalSkill',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_version', internalType: 'uint256', type: 'uint256' },
      { name: '_resolver', internalType: 'address', type: 'address' },
    ],
    name: 'addNetworkColonyVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_txHash', internalType: 'bytes32', type: 'bytes32' },
      { name: '_metadata', internalType: 'string', type: 'string' },
    ],
    name: 'annotateTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_approvee', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approveStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract DSAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_users', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'int256[]', type: 'int256[]' },
    ],
    name: 'bootstrapColony',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'burnTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_slot', internalType: 'uint256', type: 'uint256' }],
    name: 'checkNotAdditionalProtectedVariable',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: '_destinationChainId', internalType: 'uint256', type: 'uint256' },
      { name: '_salt', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'createProxyColony',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deobligateStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_extensionId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_deprecated', internalType: 'bool', type: 'bool' },
    ],
    name: 'deprecateExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_localSkillId', internalType: 'uint256', type: 'uint256' },
      { name: '_deprecated', internalType: 'bool', type: 'bool' },
    ],
    name: 'deprecateLocalSkill',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'domains',
    outputs: [
      { name: 'skillId', internalType: 'uint256', type: 'uint256' },
      { name: 'fundingPotId', internalType: 'uint256', type: 'uint256' },
      { name: 'deprecated', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_metadata', internalType: 'string', type: 'string' }],
    name: 'editColony',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_metadataDelta', internalType: 'string', type: 'string' },
    ],
    name: 'editColonyByDelta',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' },
    ],
    name: 'emitDomainReputationPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' },
    ],
    name: 'emitDomainReputationReward',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' },
    ],
    name: 'emitSkillReputationPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' },
    ],
    name: 'emitSkillReputationReward',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'executeMetaTransaction',
    outputs: [{ name: 'returnData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finishUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_obligator', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getApproval',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getColonyNetwork',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_localSkillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getLocalSkill',
    outputs: [
      {
        name: 'localSkill',
        internalType: 'struct ColonyDataTypes.LocalSkill',
        type: 'tuple',
        components: [
          { name: 'exists', internalType: 'bool', type: 'bool' },
          { name: 'deprecated', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getMetatransactionNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_obligator', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getObligation',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'getPayment',
    outputs: [
      {
        name: '',
        internalType: 'struct ColonyDataTypes.Payment',
        type: 'tuple',
        components: [
          {
            name: 'recipient',
            internalType: 'address payable',
            type: 'address',
          },
          { name: 'finalized', internalType: 'bool', type: 'bool' },
          { name: 'fundingPotId', internalType: 'uint256', type: 'uint256' },
          { name: 'domainId', internalType: 'uint256', type: 'uint256' },
          { name: 'skills', internalType: 'uint256[]', type: 'uint256[]' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPaymentCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRootLocalSkill',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTask',
    outputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      {
        name: '',
        internalType: 'enum ColonyDataTypes.TaskStatus',
        type: 'uint8',
      },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTaskChangeNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTaskCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_role', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'getTaskRole',
    outputs: [
      {
        name: 'role',
        internalType: 'struct ColonyDataTypes.Role',
        type: 'tuple',
        components: [
          { name: 'user', internalType: 'address payable', type: 'address' },
          { name: 'rateFail', internalType: 'bool', type: 'bool' },
          {
            name: 'rating',
            internalType: 'enum ColonyDataTypes.TaskRatings',
            type: 'uint8',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_role', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'getTaskWorkRatingSecret',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'getTaskWorkRatingSecretsInfo',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_spender', internalType: 'address', type: 'address' },
    ],
    name: 'getTokenApproval',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'getTotalTokenApproval',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'miningChainId', internalType: 'uint256', type: 'uint256' },
      { name: 'newHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'newNLeaves', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialiseReputationMining',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_extensionId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_version', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'installExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_wad', internalType: 'uint256', type: 'uint256' }],
    name: 'mintTokens',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_guy', internalType: 'address', type: 'address' },
      { name: '_wad', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mintTokensFor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'obligateStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'colonyName', internalType: 'string', type: 'string' },
      { name: 'orbitdb', internalType: 'string', type: 'string' },
    ],
    name: 'registerColonyLabel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'authority_',
        internalType: 'contract DSAuthority',
        type: 'address',
      },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_bridgeAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setColonyBridgeAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_feeInverse', internalType: 'uint256', type: 'uint256' }],
    name: 'setNetworkFeeInverse',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPayoutWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'setReputationMiningCycleReward',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_obligator', internalType: 'address', type: 'address' },
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_beneficiary', internalType: 'address', type: 'address' },
    ],
    name: 'transferStake',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_extensionId', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'uninstallExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'unlockToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'orbitdb', internalType: 'string', type: 'string' }],
    name: 'updateColonyOrbitDB',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_newVersion', internalType: 'uint256', type: 'uint256' }],
    name: 'upgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_extensionId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_newVersion', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'upgradeExtension',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: 'childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'childDomainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateDomainInheritance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes', type: 'bytes' },
      { name: 'value', internalType: 'bytes', type: 'bytes' },
      { name: 'branchMask', internalType: 'uint256', type: 'uint256' },
      { name: 'siblings', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'verifyReputationProof',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [
      { name: 'colonyVersion', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
] as const

export const colonyAddress =
  '0x777760996135F0791E2e1a74aFAA060711197778' as const

export const colonyConfig = { address: colonyAddress, abi: colonyAbi } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ColonyFunding
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const colonyFundingAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'txHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Annotation',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ArbitraryReputationUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'target',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'data', internalType: 'bytes', type: 'bytes', indexed: false },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ArbitraryTransaction',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'users',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'amounts',
        internalType: 'int256[]',
        type: 'int256[]',
        indexed: false,
      },
    ],
    name: 'ColonyBootstrapped',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'payoutRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fromPot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'toPot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyFundsMovedBetweenFundingPots',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'colonyNetwork',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyInitialised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ColonyMetadata',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ColonyMetadataDelta',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardInverse',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyRewardInverseSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'role', internalType: 'uint8', type: 'uint8', indexed: true },
      { name: 'setTo', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ColonyRoleSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'oldVersion',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVersion',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ColonyUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DomainAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'DomainDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'payoutRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DomainFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'DomainMetadata',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureCancelled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'claimDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureClaimDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'globalClaimDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditureGlobalClaimDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureLocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'metadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ExpenditureMetadataSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'payoutModifier',
        internalType: 'int256',
        type: 'int256',
        indexed: false,
      },
    ],
    name: 'ExpenditurePayoutModifierSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExpenditurePayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExpenditureRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'slot', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ExpenditureSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'storageSlot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      { name: 'mask', internalType: 'bool[]', type: 'bool[]', indexed: false },
      {
        name: 'keys',
        internalType: 'bytes32[]',
        type: 'bytes32[]',
        indexed: false,
      },
      {
        name: 'value',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ExpenditureStateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'expenditureId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExpenditureTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'fundingPotId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'FundingPotAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'localSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'LocalSkillAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'localSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'LocalSkillDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetAuthority',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'PaymentFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentPayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PaymentRecipientSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'paymentId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PaymentSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fundingPotId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'slot',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenPayout',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_chainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: '_amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProxyColonyFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'destinationChainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'salt',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ProxyColonyRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'fee', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'rewardRemainder',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutCycleEnded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rewardPayoutId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'RewardPayoutCycleStarted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'specificationHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'TaskBriefSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'reviewerAddresses',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'TaskChangedViaSignatures',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'deliverableHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'TaskDeliverableSubmitted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'dueDate',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskDueDateSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TaskPayoutSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'TaskRoleUserSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'TaskSkillSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'taskId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'role',
        internalType: 'enum ColonyDataTypes.TaskRole',
        type: 'uint8',
        indexed: false,
      },
      { name: 'rating', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'TaskWorkRatingRevealed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenUnlocked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensBurned',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TokensMinted',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'DEPRECATED_taskWorkRatings',
    outputs: [
      { name: 'count', internalType: 'uint256', type: 'uint256' },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract DSAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'claimColonyFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'claimColonyFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimDomainFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'claimExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'claimExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'domains',
    outputs: [
      { name: 'skillId', internalType: 'uint256', type: 'uint256' },
      { name: 'fundingPotId', internalType: 'uint256', type: 'uint256' },
      { name: 'deprecated', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_add', internalType: 'bool', type: 'bool' },
    ],
    name: 'editAllowedDomainReputationReceipt',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_txdata', internalType: 'bytes', type: 'bytes' },
      { name: '_value', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'exchangeTokensViaLiFi',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_domainId', internalType: 'uint256', type: 'uint256' }],
    name: 'getAllowedDomainReputationReceipt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_fundingPotId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getDomainFromFundingPot',
    outputs: [{ name: 'domainId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getExpenditureSlotPayout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getExpenditureSlotPayout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_potId', internalType: 'uint256', type: 'uint256' }],
    name: 'getFundingPot',
    outputs: [
      {
        name: 'associatedType',
        internalType: 'enum ColonyDataTypes.FundingPotAssociatedType',
        type: 'uint8',
      },
      { name: 'associatedTypeId', internalType: 'uint256', type: 'uint256' },
      { name: 'payoutsWeCannotMake', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_potId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getFundingPotBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_potId', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getFundingPotBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFundingPotCount',
    outputs: [{ name: 'count', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_potId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getFundingPotPayout',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'getNonRewardPotsTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'getNonRewardPotsTotal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRewardInverse',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_fromChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_toChildSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_fromPot', internalType: 'uint256', type: 'uint256' },
      { name: '_toPot', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'moveFundsBetweenPots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_fromChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_toChildSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_fromPot', internalType: 'uint256', type: 'uint256' },
      { name: '_toPot', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'moveFundsBetweenPots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      {
        name: '_fromChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      { name: '_toChildSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_fromPot', internalType: 'uint256', type: 'uint256' },
      { name: '_toPot', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
    ],
    name: 'moveFundsBetweenPots',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'recordClaimedFundsFromBridge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'authority_',
        internalType: 'contract DSAuthority',
        type: 'address',
      },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slot', internalType: 'uint256', type: 'uint256' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setExpenditurePayout',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '_slots', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'setExpenditurePayouts',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: 'childSkillIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'childDomainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateDomainInheritance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

export const colonyFundingAddress =
  '0x777760996135f0791E2e1a74aFAa060711197779' as const

export const colonyFundingConfig = {
  address: colonyFundingAddress,
  abi: colonyFundingAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ColonyNetwork
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const colonyNetworkAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'auction',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'quantity',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'AuctionCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'bridgeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'BridgeSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'colonyId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'colonyAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'label',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ColonyLabelRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'resolver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyNetworkInitialised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'resolver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ColonyVersionAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'extensionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExtensionAddedToNetwork',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'extensionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'ExtensionDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'extensionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExtensionInstalled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'extensionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ExtensionUninstalled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'extensionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'version',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ExtensionUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetAuthority',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'metaColony',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'rootSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'MetaColonyCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'relayerAddress',
        internalType: 'address payable',
        type: 'address',
        indexed: false,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'MetaTransactionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'miningCycleResolver',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'MiningCycleResolverSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeInverse',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NetworkFeeInverseSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'destinationChainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'salt',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'ProxyColonyRequested',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'ens', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'rootNode',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'RegistrarInitialised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'miner',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokensLost',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationMinerPenalised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'nLeaves',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationMiningCycleComplete',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inactiveReputationMiningCycle',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ReputationMiningInitialised',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationMiningRewardSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newHash',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'newNLeaves',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'stakers',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'reward',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationRootHashSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'count',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationUpdateSentToBridge',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'colony',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'count',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ReputationUpdateStored',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'skillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'parentSkillId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SkillAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAuthorityAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenAuthorityDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenDeployed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenLocking',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenLockingAddressSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'status', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'TokenWhitelisted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'label',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'UserLabelRegistered',
  },
  {
    type: 'function',
    inputs: [
      { name: '_version', internalType: 'uint256', type: 'uint256' },
      { name: '_resolver', internalType: 'address', type: 'address' },
    ],
    name: 'addColonyVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract DSAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'bridgeMessage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'bridgeMessageToNetwork',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_slot', internalType: 'uint256', type: 'uint256' }],
    name: 'checkNotAdditionalProtectedVariable',
    outputs: [],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'executeMetaTransaction',
    outputs: [{ name: 'returnData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_id', internalType: 'uint256', type: 'uint256' }],
    name: 'getColony',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getColonyCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_version', internalType: 'uint256', type: 'uint256' }],
    name: 'getColonyVersionResolver',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentColonyVersion',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFeeInverse',
    outputs: [
      { name: '_feeInverse', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMetaColony',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getMetatransactionNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMiningChainId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'getPayoutWhitelist',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReputationMiningSkillId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReputationRootHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReputationRootHashNLeaves',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getReputationRootHashNNodes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_skillId', internalType: 'uint256', type: 'uint256' }],
    name: 'getSkill',
    outputs: [
      {
        name: 'skill',
        internalType: 'struct CommonDataTypes.Skill',
        type: 'tuple',
        components: [
          { name: 'nParents', internalType: 'uint128', type: 'uint128' },
          { name: 'nChildren', internalType: 'uint128', type: 'uint128' },
          { name: 'parents', internalType: 'uint256[]', type: 'uint256[]' },
          { name: 'children', internalType: 'uint256[]', type: 'uint256[]' },
          {
            name: 'DEPRECATED_globalSkill',
            internalType: 'bool',
            type: 'bool',
          },
          { name: 'DEPRECATED_deprecated', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getSkillCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTokenLocking',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_resolver', internalType: 'address', type: 'address' },
      { name: '_version', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'initialise',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_colony', internalType: 'address', type: 'address' }],
    name: 'isColony',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'authority_',
        internalType: 'contract DSAuthority',
        type: 'address',
      },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_feeInverse', internalType: 'uint256', type: 'uint256' }],
    name: 'setFeeInverse',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_status', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPayoutWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenLocking', internalType: 'address', type: 'address' },
    ],
    name: 'setTokenLocking',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

export const colonyNetworkAddress =
  '0x777760996135F0791E2e1a74aFAa060711197777' as const

export const colonyNetworkConfig = {
  address: colonyNetworkAddress,
  abi: colonyNetworkAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OneTxPayment
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const oneTxPaymentAbi = [
  { type: 'event', anonymous: false, inputs: [], name: 'ExtensionInitialised' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetAuthority',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'relayerAddress',
        internalType: 'address payable',
        type: 'address',
        indexed: false,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'MetaTransactionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'agent',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'fundamentalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'nPayouts',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'OneTxPaymentMade',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract DSAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_deprecated', internalType: 'bool', type: 'bool' }],
    name: 'deprecate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'executeMetaTransaction',
    outputs: [{ name: 'returnData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'finishUpgrade',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_sig', internalType: 'bytes4', type: 'bytes4' }],
    name: 'getCapabilityRoles',
    outputs: [{ name: '_roles', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getColony',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDeprecated',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getMetatransactionNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'identifier',
    outputs: [
      { name: '_identifier', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '_colony', internalType: 'address', type: 'address' }],
    name: 'install',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_callerPermissionDomainId',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_callerChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_workers',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_chainIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_callerPermissionDomainId',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_callerChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_workers',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_callerPermissionDomainId',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_callerChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_workers',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makePaymentFundedFromDomain',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_permissionDomainId', internalType: 'uint256', type: 'uint256' },
      { name: '_childSkillIndex', internalType: 'uint256', type: 'uint256' },
      {
        name: '_callerPermissionDomainId',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_callerChildSkillIndex',
        internalType: 'uint256',
        type: 'uint256',
      },
      {
        name: '_workers',
        internalType: 'address payable[]',
        type: 'address[]',
      },
      { name: '_chainIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_tokens', internalType: 'address[]', type: 'address[]' },
      { name: '_amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
      { name: '_skillId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'makePaymentFundedFromDomain',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'authority_',
        internalType: 'contract DSAuthority',
        type: 'address',
      },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'uninstall',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '_version', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

export const oneTxPaymentAddress =
  '0x777760996135f0791e2E1A74AFaA060711197782' as const

export const oneTxPaymentConfig = {
  address: oneTxPaymentAddress,
  abi: oneTxPaymentAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ProxyColony
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const proxyColonyAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'domainId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'balance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DomainFundsClaimed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'authority',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetAuthority',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'LogSetOwner',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'relayerAddress',
        internalType: 'address payable',
        type: 'address',
        indexed: false,
      },
      { name: 'payload', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'MetaTransactionExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferMade',
  },
  {
    type: 'function',
    inputs: [],
    name: 'authority',
    outputs: [
      { name: '', internalType: 'contract DSAuthority', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'claimColonyFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_domainId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'claimDomainFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'executeMetaTransaction',
    outputs: [{ name: 'returnData', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: '_user', internalType: 'address', type: 'address' }],
    name: 'getMetatransactionNonce',
    outputs: [{ name: 'nonce', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_target', internalType: 'address', type: 'address' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'makeArbitraryTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'authority_',
        internalType: 'contract DSAuthority',
        type: 'address',
      },
    ],
    name: 'setAuthority',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFromBridge',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_user', internalType: 'address', type: 'address' },
      { name: '_nonce', internalType: 'uint256', type: 'uint256' },
      { name: '_chainId', internalType: 'uint256', type: 'uint256' },
      { name: '_payload', internalType: 'bytes', type: 'bytes' },
      { name: '_sigR', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigS', internalType: 'bytes32', type: 'bytes32' },
      { name: '_sigV', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

export const proxyColonyAddress =
  '0x777760996135F0791E2E1a74AFaA060711197781' as const

export const proxyColonyConfig = {
  address: proxyColonyAddress,
  abi: proxyColonyAbi,
} as const
