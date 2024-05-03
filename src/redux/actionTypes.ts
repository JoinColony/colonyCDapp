export enum ActionTypes {
  /*
   * Colony Related (create, recovery, etc)
   */
  CLAIM_TOKEN = 'CLAIM_TOKEN',
  CLAIM_TOKEN_ERROR = 'CLAIM_TOKEN_ERROR',
  CLAIM_TOKEN_SUCCESS = 'CLAIM_TOKEN_SUCCESS',
  CREATE = 'CREATE',
  CREATE_CANCEL = 'CREATE_CANCEL',
  CREATE_ERROR = 'CREATE_ERROR',
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  RECOVERY_MODE_ENTER = 'RECOVERY_MODE_ENTER',
  RECOVERY_MODE_ENTER_ERROR = 'RECOVERY_MODE_ENTER_ERROR',
  RECOVERY_MODE_ENTER_SUCCESS = 'RECOVERY_MODE_ENTER_SUCCESS',
  /*
   * Extensions
   */
  EXTENSION_ENABLE = 'EXTENSION_ENABLE',
  EXTENSION_ENABLE_ERROR = 'EXTENSION_ENABLE_ERROR',
  EXTENSION_ENABLE_SUCCESS = 'EXTENSION_ENABLE_SUCCESS',
  EXTENSION_INSTALL = 'EXTENSION_INSTALL',
  EXTENSION_INSTALL_ERROR = 'EXTENSION_INSTALL_ERROR',
  EXTENSION_INSTALL_SUCCESS = 'EXTENSION_INSTALL_SUCCESS',
  EXTENSION_DEPRECATE = 'EXTENSION_DEPRECATE',
  EXTENSION_DEPRECATE_ERROR = 'EXTENSION_DEPRECATE_ERROR',
  EXTENSION_DEPRECATE_SUCCESS = 'EXTENSION_DEPRECATE_SUCCESS',
  EXTENSION_UNINSTALL = 'EXTENSION_UNINSTALL',
  EXTENSION_UNINSTALL_ERROR = 'EXTENSION_UNINSTALL_ERROR',
  EXTENSION_UNINSTALL_SUCCESS = 'EXTENSION_UNINSTALL_SUCCESS',
  EXTENSION_UPGRADE = 'EXTENSION_UPGRADE',
  EXTENSION_UPGRADE_ERROR = 'EXTENSION_UPGRADE_ERROR',
  EXTENSION_UPGRADE_SUCCESS = 'EXTENSION_UPGRADE_SUCCESS',
  /*
   * Actions
   */
  ACTION_DOMAIN_CREATE = 'ACTION_DOMAIN_CREATE',
  ACTION_DOMAIN_CREATE_ERROR = 'ACTION_DOMAIN_CREATE_ERROR',
  ACTION_DOMAIN_CREATE_SUCCESS = 'ACTION_DOMAIN_CREATE_SUCCESS',
  ACTION_DOMAIN_EDIT = 'ACTION_DOMAIN_EDIT',
  ACTION_DOMAIN_EDIT_ERROR = 'ACTION_DOMAIN_EDIT_ERROR',
  ACTION_DOMAIN_EDIT_SUCCESS = 'ACTION_DOMAIN_EDIT_SUCCESS',
  ACTION_EXPENDITURE_PAYMENT = 'ACTION_EXPENDITURE_PAYMENT',
  ACTION_EXPENDITURE_PAYMENT_ERROR = 'ACTION_EXPENDITURE_PAYMENT_ERROR',
  ACTION_EXPENDITURE_PAYMENT_SUCCESS = 'ACTION_EXPENDITURE_PAYMENT_SUCCESS',
  ACTION_EDIT_COLONY = 'ACTION_EDIT_COLONY',
  ACTION_EDIT_COLONY_ERROR = 'ACTION_EDIT_COLONY_ERROR',
  ACTION_EDIT_COLONY_SUCCESS = 'ACTION_EDIT_COLONY_SUCCESS',
  ACTION_INITIATE_SAFE_TRANSACTION = 'ACTION_INITIATE_SAFE_TRANSACTION',
  ACTION_INITIATE_SAFE_TRANSACTION_ERROR = 'ACTION_INITIATE_SAFE_TRANSACTION_ERROR',
  ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS = 'ACTION_INITIATE_SAFE_TRANSACTION_SUCCESS',
  ACTION_MANAGE_EXISTING_SAFES = 'ACTION_MANAGE_EXISTING_SAFES',
  ACTION_MANAGE_EXISTING_SAFES_ERROR = 'ACTION_MANAGE_EXISTING_SAFES_ERROR',
  ACTION_MANAGE_EXISTING_SAFES_SUCCESS = 'ACTION_MANAGE_EXISTING_SAFES_SUCCESS',
  ACTION_MANAGE_TOKENS = 'ACTION_MANAGE_TOKENS',
  ACTION_MANAGE_TOKENS_ERROR = 'ACTION_MANAGE_TOKENS_ERROR',
  ACTION_MANAGE_TOKENS_SUCCESS = 'ACTION_MANAGE_TOKENS_SUCCESS',
  ACTION_MINT_TOKENS = 'ACTION_MINT_TOKENS',
  ACTION_MINT_TOKENS_ERROR = 'ACTION_MINT_TOKENS_ERROR',
  ACTION_MINT_TOKENS_SUCCESS = 'ACTION_MINT_TOKENS_SUCCESS',
  ACTION_MOVE_FUNDS = 'ACTION_MOVE_FUNDS',
  ACTION_MOVE_FUNDS_ERROR = 'ACTION_MOVE_FUNDS_ERROR',
  ACTION_MOVE_FUNDS_SUCCESS = 'ACTION_MOVE_FUNDS_SUCCESS',
  ACTION_RECOVERY = 'ACTION_RECOVERY',
  ACTION_RECOVERY_ERROR = 'ACTION_RECOVERY_ERROR',
  ACTION_RECOVERY_SUCCESS = 'ACTION_RECOVERY_SUCCESS',
  ACTION_RECOVERY_SET_SLOT = 'ACTION_RECOVERY_SET_SLOT',
  ACTION_RECOVERY_SET_SLOT_ERROR = 'ACTION_RECOVERY_SET_SLOT_ERROR',
  ACTION_RECOVERY_SET_SLOT_SUCCESS = 'ACTION_RECOVERY_SET_SLOT_SUCCESS',
  ACTION_RECOVERY_APPROVE = 'ACTION_RECOVERY_APPROVE',
  ACTION_RECOVERY_APPROVE_ERROR = 'ACTION_RECOVERY_APPROVE_ERROR',
  ACTION_RECOVERY_APPROVE_SUCCESS = 'ACTION_RECOVERY_APPROVE_SUCCESS',
  ACTION_RECOVERY_EXIT = 'ACTION_RECOVERY_EXIT',
  ACTION_RECOVERY_EXIT_ERROR = 'ACTION_RECOVERY_EXIT_ERROR',
  ACTION_RECOVERY_EXIT_SUCCESS = 'ACTION_RECOVERY_EXIT_SUCCESS',
  ACTION_MANAGE_REPUTATION = 'ACTION_MANAGE_REPUTATION',
  ACTION_MANAGE_REPUTATION_ERROR = 'ACTION_MANAGE_REPUTATION_ERROR',
  ACTION_MANAGE_REPUTATION_SUCCESS = 'ACTION_MANAGE_REPUTATION_SUCCESS',
  ACTION_VERSION_UPGRADE = 'ACTION_VERSION_UPGRADE',
  ACTION_VERSION_UPGRADE_ERROR = 'ACTION_VERSION_UPGRADE_ERROR',
  ACTION_VERSION_UPGRADE_SUCCESS = 'ACTION_VERSION_UPGRADE_SUCCESS',
  ACTION_USER_ROLES_SET = 'ACTION_USER_ROLES_SET',
  ACTION_USER_ROLES_SET_ERROR = 'ACTION_USER_ROLES_SET_ERROR',
  ACTION_USER_ROLES_SET_SUCCESS = 'ACTION_USER_ROLES_SET_SUCCESS',
  ACTION_UNLOCK_TOKEN = 'ACTION_UNLOCK_TOKEN',
  ACTION_UNLOCK_TOKEN_ERROR = 'ACTION_UNLOCK_TOKEN_ERROR',
  ACTION_UNLOCK_TOKEN_SUCCESS = 'ACTION_UNLOCK_TOKEN_SUCCESS',
  ACTION_ADD_VERIFIED_MEMBERS = 'ACTION_ADD_VERIFIED_MEMBERS',
  ACTION_ADD_VERIFIED_MEMBERS_SUCCESS = 'ACTION_ADD_VERIFIED_MEMBERS_SUCCESS',
  ACTION_ADD_VERIFIED_MEMBERS_ERROR = 'ACTION_ADD_VERIFIED_MEMBERS_ERROR',
  ACTION_REMOVE_VERIFIED_MEMBERS = 'ACTION_REMOVE_VERIFIED_MEMBERS',
  ACTION_REMOVE_VERIFIED_MEMBERS_SUCCESS = 'ACTION_REMOVE_VERIFIED_MEMBERS_SUCCESS',
  ACTION_REMOVE_VERIFIED_MEMBERS_ERROR = 'ACTION_REMOVE_VERIFIED_MEMBERS_ERROR',

  /*
   * Motions
   */
  MOTION_STAKE = 'MOTION_STAKE',
  MOTION_STAKE_ERROR = 'MOTION_STAKE_ERROR',
  MOTION_STAKE_SUCCESS = 'MOTION_STAKE_SUCCESS',
  MOTION_VOTE = 'MOTION_VOTE',
  MOTION_VOTE_ERROR = 'MOTION_VOTE_ERROR',
  MOTION_VOTE_SUCCESS = 'MOTION_VOTE_SUCCESS',
  MOTION_REVEAL_VOTE = 'MOTION_REVEAL_VOTE',
  MOTION_REVEAL_VOTE_ERROR = 'MOTION_REVEAL_VOTE_ERROR',
  MOTION_REVEAL_VOTE_SUCCESS = 'MOTION_REVEAL_VOTE_SUCCESS',
  MOTION_FINALIZE = 'MOTION_FINALIZE',
  MOTION_FINALIZE_ERROR = 'MOTION_FINALIZE_ERROR',
  MOTION_FINALIZE_SUCCESS = 'MOTION_FINALIZE_SUCCESS',
  MOTION_CLAIM = 'MOTION_CLAIM',
  MOTION_CLAIM_ERROR = 'MOTION_CLAIM_ERROR',
  MOTION_CLAIM_SUCCESS = 'MOTION_CLAIM_SUCCESS',
  MOTION_CLAIM_ALL = 'MOTION_CLAIM_ALL',
  MOTION_CLAIM_ALL_ERROR = 'MOTION_CLAIM_ALL_ERROR',
  MOTION_CLAIM_ALL_SUCCESS = 'MOTION_CLAIM_ALL_SUCCESS',
  MOTION_DOMAIN_CREATE_EDIT = 'MOTION_DOMAIN_CREATE_EDIT',
  MOTION_DOMAIN_CREATE_EDIT_ERROR = 'MOTION_DOMAIN_CREATE_EDIT_ERROR',
  MOTION_DOMAIN_CREATE_EDIT_SUCCESS = 'MOTION_DOMAIN_CREATE_EDIT_SUCCESS',
  MOTION_EDIT_COLONY = 'MOTION_EDIT_COLONY',
  MOTION_EDIT_COLONY_ERROR = 'MOTION_EDIT_COLONY_ERROR',
  MOTION_EDIT_COLONY_SUCCESS = 'MOTION_EDIT_COLONY_SUCCESS',
  MOTION_EXPENDITURE_PAYMENT = 'MOTION_EXPENDITURE_PAYMENT',
  MOTION_EXPENDITURE_PAYMENT_ERROR = 'MOTION_EXPENDITURE_PAYMENT_ERROR',
  MOTION_EXPENDITURE_PAYMENT_SUCCESS = 'MOTION_EXPENDITURE_PAYMENT_SUCCESS',
  MOTION_EXPENDITURE_FUND = 'MOTION_EXPENDITURE_FUND',
  MOTION_EXPENDITURE_FUND_ERROR = 'MOTION_EXPENDITURE_FUND_ERROR',
  MOTION_EXPENDITURE_FUND_SUCCESS = 'MOTION_EXPENDITURE_FUND_SUCCESS',
  MOTION_EXPENDITURE_CANCEL = 'MOTION_EXPENDITURE_CANCEL',
  MOTION_EXPENDITURE_CANCEL_ERROR = 'MOTION_EXPENDITURE_CANCEL_ERROR',
  MOTION_EXPENDITURE_CANCEL_SUCCESS = 'MOTION_EXPENDITURE_CANCEL_SUCCESS',
  MOTION_STAKED_EXPENDITURE_CANCEL = 'MOTION_STAKED_EXPENDITURE_CANCEL',
  MOTION_STAKED_EXPENDITURE_CANCEL_ERROR = 'MOTION_STAKED_EXPENDITURE_CANCEL_ERROR',
  MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS = 'MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS',
  MOTION_RELEASE_EXPENDITURE_STAGES = 'MOTION_RELEASE_EXPENDITURE_STAGES',
  MOTION_RELEASE_EXPENDITURE_STAGES_ERROR = 'MOTION_RELEASE_EXPENDITURE_STAGES_ERROR',
  MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS = 'MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS',
  MOTION_EDIT_LOCKED_EXPENDITURE = 'MOTION_EDIT_LOCKED_EXPENDITURE',
  MOTION_EDIT_LOCKED_EXPENDITURE_ERROR = 'MOTION_EDIT_LOCKED_EXPENDITURE_ERROR',
  MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS = 'MOTION_EDIT_LOCKED_EXPENDITURE_SUCCESS',
  MOTION_EXPENDITURE_FINALIZE = 'MOTION_EXPENDITURE_FINALIZE',
  MOTION_EXPENDITURE_FINALIZE_ERROR = 'MOTION_EXPENDITURE_FINALIZE_ERROR',
  MOTION_EXPENDITURE_FINALIZE_SUCCESS = 'MOTION_EXPENDITURE_FINALIZE_SUCCESS',
  MOTION_MOVE_FUNDS = 'MOTION_MOVE_FUNDS',
  MOTION_MOVE_FUNDS_ERROR = 'MOTION_MOVE_FUNDS_ERROR',
  MOTION_MOVE_FUNDS_SUCCESS = 'MOTION_MOVE_FUNDS_SUCCESS',
  MOTION_USER_ROLES_SET = 'MOTION_USER_ROLES_SET',
  MOTION_USER_ROLES_SET_ERROR = 'MOTION_USER_ROLES_SET_ERROR',
  MOTION_USER_ROLES_SET_SUCCESS = 'MOTION_USER_ROLES_SET_SUCCESS',
  ROOT_MOTION = 'ROOT_MOTION',
  ROOT_MOTION_ERROR = 'ROOT_MOTION_ERROR',
  ROOT_MOTION_SUCCESS = 'ROOT_MOTION_SUCCESS',
  MOTION_ESCALATE = 'MOTION_ESCALATE',
  MOTION_ESCALATE_ERROR = 'MOTION_ESCALATE_ERROR',
  MOTION_ESCALATE_SUCCESS = 'MOTION_ESCALATE_SUCCESS',
  MOTION_MANAGE_REPUTATION = 'MOTION_MANAGE_REPUTATION',
  MOTION_MANAGE_REPUTATION_ERROR = 'MOTION_MANAGE_REPUTATION_ERROR',
  MOTION_MANAGE_REPUTATION_SUCCESS = 'MOTION_MANAGE_REPUTATION_SUCCESS',
  MOTION_CREATE_DECISION = 'MOTION_CREATE_DECISION',
  MOTION_CREATE_DECISION_ERROR = 'MOTION_CREATE_DECISION_ERROR',
  MOTION_CREATE_DECISION_SUCCESS = 'MOTION_CREATE_DECISION_SUCCESS',
  MOTION_INITIATE_SAFE_TRANSACTION = 'MOTION_INITIATE_SAFE_TRANSACTION',
  MOTION_INITIATE_SAFE_TRANSACTION_ERROR = 'MOTION_INITIATE_SAFE_TRANSACTION_ERROR',
  MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS = 'MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS',
  MOTION_ADD_VERIFIED_MEMBERS = 'MOTION_ADD_VERIFIED_MEMBERS',
  MOTION_ADD_VERIFIED_MEMBERS_SUCCESS = 'MOTION_ADD_VERIFIED_MEMBERS_SUCCESS',
  MOTION_ADD_VERIFIED_MEMBERS_ERROR = 'MOTION_ADD_VERIFIED_MEMBERS_ERROR',
  MOTION_REMOVE_VERIFIED_MEMBERS = 'MOTION_REMOVE_VERIFIED_MEMBERS',
  MOTION_REMOVE_VERIFIED_MEMBERS_SUCCESS = 'MOTION_REMOVE_VERIFIED_MEMBERS_SUCCESS',
  MOTION_REMOVE_VERIFIED_MEMBERS_ERROR = 'MOTION_REMOVE_VERIFIED_MEMBERS_ERROR',
  MOTION_MANAGE_TOKENS = 'MOTION_MANAGE_TOKENS',
  MOTION_MANAGE_TOKENS_SUCCESS = 'MOTION_MANAGE_TOKENS_SUCCESS',
  MOTION_MANAGE_TOKENS_ERROR = 'MOTION_MANAGE_TOKENS_ERROR',
  /*
   * Decision Draft
   */
  DECISION_DRAFT_CREATED = 'DECISION_DRAFT_CREATED',
  DECISION_DRAFT_REMOVED = 'DECISION_DRAFT_REMOVED',
  /*
   * Transactions
   */
  GAS_PRICES_UPDATE = 'GAS_PRICES_UPDATE',
  MESSAGE_CANCEL = 'MESSAGE_CANCEL',
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_ERROR = 'MESSAGE_ERROR',
  MESSAGE_SIGN = 'MESSAGE_SIGN',
  MESSAGE_SIGNED = 'MESSAGE_SIGNED',
  TRANSACTION_ADD_IDENTIFIER = 'TRANSACTION_ADD_IDENTIFIER',
  TRANSACTION_ADD_PARAMS = 'TRANSACTION_ADD_PARAMS',
  TRANSACTION_CANCEL = 'TRANSACTION_CANCEL',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  TRANSACTION_ESTIMATE_GAS = 'TRANSACTION_ESTIMATE_GAS',
  TRANSACTION_GAS_UPDATE = 'TRANSACTION_GAS_UPDATE',
  TRANSACTION_OPTIONS_UPDATE = 'TRANSACTION_OPTIONS_UPDATE',
  TRANSACTION_HASH_RECEIVED = 'TRANSACTION_HASH_RECEIVED',
  TRANSACTION_LOAD_RELATED = 'TRANSACTION_LOAD_RELATED',
  TRANSACTION_READY = 'TRANSACTION_READY',
  TRANSACTION_PENDING = 'TRANSACTION_PENDING',
  TRANSACTION_RECEIPT_RECEIVED = 'TRANSACTION_RECEIPT_RECEIVED',
  TRANSACTION_SEND = 'TRANSACTION_SEND',
  TRANSACTION_SENT = 'TRANSACTION_SENT',
  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  TRANSACTION_SAVED_TO_DB = 'TRANSACTION_SAVED_TO_DB',
  /*
   * Wallet
   */
  WALLET_OPEN = 'WALLET_OPEN',
  WALLET_OPEN_ERROR = 'WALLET_OPEN_ERROR',
  WALLET_OPEN_SUCCESS = 'WALLET_OPEN_SUCCESS',
  /*
   * User Land (mostly settings related)
   */
  USER_AVATAR_REMOVE = 'USER_AVATAR_REMOVE',
  USER_AVATAR_REMOVE_ERROR = 'USER_AVATAR_REMOVE_ERRROR',
  USER_AVATAR_REMOVE_SUCCESS = 'USER_AVATAR_REMOVE_SUCCESS',
  USER_AVATAR_UPLOAD = 'USER_AVATAR_UPLOAD',
  USER_AVATAR_UPLOAD_ERROR = 'USER_AVATAR_UPLOAD_ERRROR',
  USER_AVATAR_UPLOAD_SUCCESS = 'USER_AVATAR_UPLOAD_SUCCESS',
  USER_CONNECTED = 'USER_CONNECTED',
  USER_CONTEXT_SETUP_SUCCESS = 'USER_CONTEXT_SETUP_SUCCESS',
  USER_DEPOSIT_TOKEN = 'USER_DEPOSIT_TOKEN',
  USER_DEPOSIT_TOKEN_ERROR = 'USER_DEPOSIT_TOKEN_ERROR',
  USER_DEPOSIT_TOKEN_SUCCESS = 'USER_DEPOSIT_TOKEN_SUCCESS',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_ERROR = 'USER_LOGOUT_ERROR',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USER_CRYPTO_TO_FIAT_TRANSFER = 'USER_CRYPTO_TO_FIAT_TRANSFER',
  USER_CRYPTO_TO_FIAT_TRANSFER_SUCCESS = 'USER_CRYPTO_TO_FIAT_TRANSFER_SUCCESS',
  USER_CRYPTO_TO_FIAT_TRANSFER_ERROR = 'USER_CRYPTO_TO_FIAT_TRANSFER_ERROR',
  USER_WITHDRAW_TOKEN = 'USER_WITHDRAW_TOKEN',
  USER_WITHDRAW_TOKEN_ERROR = 'USER_WITHDRAW_TOKEN_ERROR',
  USER_WITHDRAW_TOKEN_SUCCESS = 'USER_WITHDRAW_TOKEN_SUCCESS',
  USERNAME_CREATE = 'USERNAME_CREATE',
  USERNAME_CREATE_ERROR = 'USERNAME_CREATE_ERROR',
  USERNAME_CREATE_SUCCESS = 'USERNAME_CREATE_SUCCESS',
  /*
   * Metacolony vesting and claiming
   */
  META_CLAIM_ALLOCATION = 'META_CLAIM_ALLOCATION',
  META_CLAIM_ALLOCATION_ERROR = 'META_CLAIM_ALLOCATION_ERROR',
  META_CLAIM_ALLOCATION_SUCCESS = 'META_CLAIM_ALLOCATION_SUCCESS',
  META_UNWRAP_TOKEN = 'META_UNWRAP_TOKEN',
  META_UNWRAP_TOKEN_ERROR = 'META_UNWRAP_TOKEN_ERROR',
  META_UNWRAP_TOKEN_SUCCESS = 'META_UNWRAP_TOKEN_SUCCESS',
  /*
   * IPFS
   */
  IPFS_DATA_UPLOAD = 'IPFS_DATA_UPLOAD',
  IPFS_DATA_UPLOAD_SUCCESS = 'IPFS_DATA_UPLOAD_SUCCESS',
  IPFS_DATA_UPLOAD_ERROR = 'IPFS_DATA_UPLOAD_ERROR',
  /*
   * Expenditures
   */
  EXPENDITURE_CREATE = 'EXPENDITURE_CREATE',
  EXPENDITURE_CREATE_SUCCESS = 'EXPENDITURE_CREATE_SUCCESS',
  EXPENDITURE_CREATE_ERROR = 'EXPENDITURE_CREATE_ERROR',
  EXPENDITURE_LOCK = 'EXPENDITURE_LOCK',
  EXPENDITURE_LOCK_SUCCESS = 'EXPENDITURE_LOCK_SUCCESS',
  EXPENDITURE_LOCK_ERROR = 'EXPENDITURE_LOCK_ERROR',
  EXPENDITURE_FINALIZE = 'EXPENDITURE_FINALIZE',
  EXPENDITURE_FINALIZE_SUCCESS = 'EXPENDITURE_FINALIZE_SUCCESS',
  EXPENDITURE_FINALIZE_ERROR = 'EXPENDITURE_FINALIZE_ERROR',
  EXPENDITURE_FUND = 'EXPENDITURE_FUND',
  EXPENDITURE_FUND_SUCCESS = 'EXPENDITURE_FUND_SUCCESS',
  EXPENDITURE_FUND_ERROR = 'EXPENDITURE_FUND_ERROR',
  EXPENDITURE_EDIT = 'EXPENDITURE_EDIT',
  EXPENDITURE_EDIT_SUCCESS = 'EXPENDITURE_EDIT_SUCCESS',
  EXPENDITURE_EDIT_ERROR = 'EXPENDITURE_EDIT_ERROR',
  EXPENDITURE_CANCEL = 'EXPENDITURE_CANCEL',
  EXPENDITURE_CANCEL_SUCCESS = 'EXPENDITURE_CANCEL_SUCCESS',
  EXPENDITURE_CANCEL_ERROR = 'EXPENDITURE_CANCEL_ERROR',
  EXPENDITURE_CLAIM = 'EXPENDITURE_CLAIM',
  EXPENDITURE_CLAIM_SUCCESS = 'EXPENDITURE_CLAIM_SUCCESS',
  EXPENDITURE_CLAIM_ERROR = 'EXPENDITURE_CLAIM_ERROR',
  STAKED_EXPENDITURE_CREATE = 'STAKED_EXPENDITURE_CREATE',
  STAKED_EXPENDITURE_CREATE_SUCCESS = 'STAKED_EXPENDITURE_CREATE_SUCCESS',
  STAKED_EXPENDITURE_CREATE_ERROR = 'STAKED_EXPENDITURE_CREATE_ERROR',
  STAKED_EXPENDITURE_CANCEL = 'STAKED_EXPENDITURE_CANCEL',
  STAKED_EXPENDITURE_CANCEL_SUCCESS = 'STAKED_EXPENDITURE_CANCEL_SUCCESS',
  STAKED_EXPENDITURE_CANCEL_ERROR = 'STAKED_EXPENDITURE_CANCEL_ERROR',
  RECLAIM_EXPENDITURE_STAKE = 'RECLAIM_EXPENDITURE_STAKE',
  RECLAIM_EXPENDITURE_STAKE_SUCCESS = 'RECLAIM_EXPENDITURE_STAKE_SUCCESS',
  RECLAIM_EXPENDITURE_STAKE_ERROR = 'RECLAIM_EXPENDITURE_STAKE_ERROR',
  RELEASE_EXPENDITURE_STAGES = 'RELEASE_EXPENDITURE_STAGES',
  RELEASE_EXPENDITURE_STAGES_SUCCESS = 'RELEASE_EXPENDITURE_STAGES_SUCCESS',
  RELEASE_EXPENDITURE_STAGES_ERROR = 'RELEASE_EXPENDITURE_STAGES_ERROR',
  STREAMING_PAYMENT_CREATE = 'STREAMING_PAYMENT_CREATE',
  STREAMING_PAYMENT_CREATE_SUCCESS = 'STREAMING_PAYMENT_CREATE_SUCCESS',
  STREAMING_PAYMENT_CREATE_ERROR = 'STREAMING_PAYMENT_CREATE_ERROR',
  SET_STAKE_FRACTION = 'SET_STAKE_FRACTION',
  SET_STAKE_FRACTION_SUCCESS = 'SET_STAKE_FRACTION_SUCCESS',
  SET_STAKE_FRACTION_ERROR = 'SET_STAKE_FRACTION_ERROR',
  STREAMING_PAYMENT_CANCEL = 'STREAMING_PAYMENT_CANCEL',
  STREAMING_PAYMENT_CANCEL_SUCCESS = 'STREAMING_PAYMENT_CANCEL_SUCCESS',
  STREAMING_PAYMENT_CANCEL_ERROR = 'STREAMING_PAYMENT_CANCEL_ERROR',
}
