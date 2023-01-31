import React from 'react';
import {
  FormattedDateParts,
  FormattedMessage,
  defineMessages,
} from 'react-intl';
import Decimal from 'decimal.js';

import Numeral from '~shared/Numeral';
import Icon from '~shared/Icon';
import FriendlyName from '~shared/FriendlyName';
import Tag, { Appearance as TagAppearance } from '~shared/Tag';
import UserAvatar from '~shared/UserAvatar';

import { getMainClasses } from '~utils/css';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';

import { FormattedAction } from '~types';
import { useFormatRolesTitle, useAppContext, useColonyContext } from '~hooks';
import { MotionState, MOTION_TAG_MAP } from '~utils/colonyMotions';
import { findDomain } from '~utils/domains';
import { formatText } from '~utils/intl';

import styles from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const MSG = defineMessages({
  domain: {
    id: `${displayName}.domain`,
    defaultMessage: 'Team {domainId}',
  },
  titleCommentCount: {
    id: `${displayName}.titleCommentCount`,
    defaultMessage: `{formattedCommentCount} {commentCount, plural,
      one {comment}
      other {comments}
    }`,
  },
});

export enum ItemStatus {
  NeedAction = 'NeedAction',
  NeedAttention = 'NeedAttention',
  /*
   * Default status, does not do anything
   */
  Defused = 'Defused',
}

interface Props {
  item: FormattedAction;
  handleOnClick?: () => void;
}

const ActionsListItem = ({
  item: {
    actionType,
    initiator,
    recipient,
    amount,
    tokenSymbol,
    decimals,
    fromDomain: fromDomainId,
    toDomain: toDomainId,
    createdAt,
    commentCount = 0,
    roles,
    newVersion,
    status = ItemStatus.Defused,
    motionState,
    reputationChange,
  },
  handleOnClick,
}: Props) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  // const { isVotingExtensionEnabled } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  // const { data: historicColonyRoles } = useColonyHistoricRolesQuery({
  //   variables: {
  //     colonyAddress: colony.colonyAddress,
  //     blockNumber,
  //   },
  // });

  // const [fetchTokenInfo, { data: tokenData }] = useTokenInfoLazyQuery();

  // useEffect(() => {
  //   if (transactionTokenAddress) {
  //     fetchTokenInfo({ variables: { address: transactionTokenAddress } });
  //   }
  // }, [fetchTokenInfo, transactionTokenAddress]);

  // const isColonyAddress = recipientAddress === colony?.colonyAddress;
  // const fallbackRecipientProfile = recipient;

  const fromDomain = findDomain(fromDomainId, colony);
  const toDomain = findDomain(toDomainId, colony);

  // const updatedRoles = getUpdatedDecodedMotionRoles(
  //   fallbackRecipientProfile,
  //   parseInt(fromDomainId, 10),
  //   historicColonyRoles?.historicColonyRoles as unknown as ColonyRoles,
  //   roles || [],
  // );
  const { roleMessageDescriptorId, roleTitle } = useFormatRolesTitle(
    roles,
    // actionType === ColonyMotions.SetUserRolesMotion ? updatedRoles : roles,
    actionType,
  );

  // const totalNayStakeValue = BigNumber.from(totalNayStake || 0);
  // const isFullyNayStaked = totalNayStakeValue.gte(
  //   BigNumber.from(requiredStake || 0),
  // );

  const motionStyles =
    MOTION_TAG_MAP[
      motionState /* isVotingExtensionEnabled && */ ||
        (!actionType?.endsWith('Motion') && MotionState.Forced) ||
        MotionState.Invalid
    ];

  // const decimals =
  //   tokenData?.tokenInfo?.decimals || Number(colonyTokenDecimals);
  // const symbol = tokenData?.tokenInfo?.symbol || colonyTokenSymbol;
  const formattedReputationChange = getFormattedTokenValue(
    new Decimal(reputationChange || '0').abs().toString(),
    decimals,
  );

  // const isMotionFinished =
  //   motionState === MotionState.Passed ||
  //   motionState === MotionState.Failed ||
  //   motionState === MotionState.FailedNoFinalizable;

  const stopPropagation = (event) => event.stopPropagation();

  // const { feeInverse: networkFeeInverse } = useNetworkContracts();
  // const feePercentage = networkFeeInverse
  //   ? BigNumber.from(100).div(networkFeeInverse)
  //   : undefined;

  // // In case it is a Payment Motion or Action, calculate the payment the recipient gets, after network fees
  // const paymentReceivedFn = feePercentage
  //   ? (paymentAmount: BigNumberish) =>
  //       BigNumber.from(paymentAmount)
  //         .mul(BigNumber.from(100).sub(feePercentage))
  //         .div(100)
  //   : (x: any) => x;

  return (
    <li data-test="actionItem">
      <div
        /*
         * @NOTE This is non-interactive element to appease the DOM Nesting Validator
         *
         * We're using a lot of nested components here, which themselves render interactive
         * elements.
         * So if this were say... a button, it would try to render a button under a button
         * and the validator would just yell at us some more.
         *
         * The other way to solve this, would be to make this list a table, and have the
         * click handler on the table row.
         * That isn't a option for us since I couldn't make the text ellipsis
         * behave nicely (ie: work) while using our core <Table /> components
         */
        role="button"
        tabIndex={0}
        className={getMainClasses({}, styles, {
          noPointer: !handleOnClick,
          [ItemStatus[status]]: !!status,
        })}
        onClick={handleOnClick}
        onKeyPress={handleOnClick}
      >
        <div
          /*
           * Clicking on UserAvatar would redirect to Actions page and stop
           * interaction with popover.
           * stopPropagation prevents event being inherited by child
           */
          onClick={stopPropagation}
          onKeyPress={stopPropagation}
          role="button"
          tabIndex={0}
          className={styles.avatar}
        >
          {initiator && (
            <UserAvatar
              size="s"
              user={initiator}
              notSet={false}
              showInfo
              popperOptions={{
                showArrow: false,
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [-20, 10],
                    },
                  },
                ],
              }}
            />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            <span className={styles.title}>
              <FormattedMessage
                id={roleMessageDescriptorId || 'action.title'}
                values={{
                  actionType,
                  initiator: (
                    <span className={styles.titleDecoration}>
                      <FriendlyName user={user} autoShrinkAddress />
                    </span>
                  ),
                  /*
                   * @TODO Add user mention popover back in
                   */
                  recipient: (
                    <span className={styles.titleDecoration}>
                      <FriendlyName user={recipient} autoShrinkAddress />
                    </span>
                  ),
                  amount: (
                    <Numeral
                      value={
                        amount
                        // actionType === ColonyActions.Payment ||
                        // actionType === ColonyMotions.PaymentMotion
                        //   ? paymentReceivedFn(amount)
                        //   : amount
                      }
                      decimals={getTokenDecimalsWithFallback(decimals)}
                    />
                  ),
                  tokenSymbol,
                  decimals: getTokenDecimalsWithFallback(decimals),
                  fromDomain: fromDomain?.name || '',
                  toDomain: toDomain?.name || '',
                  roles: roleTitle,
                  newVersion: newVersion || '0',
                  reputationChange: formattedReputationChange,
                  reputationChangeNumeral: (
                    <Numeral value={formattedReputationChange} />
                  ),
                }}
              />
            </span>
            {motionState /* || isVotingExtensionEnabled */ && (
              <div className={styles.motionTagWrapper}>
                <Tag
                  text={motionStyles.name}
                  appearance={{
                    theme: motionStyles.theme as TagAppearance['theme'],
                    colorSchema:
                      motionStyles.colorSchema as TagAppearance['colorSchema'],
                  }}
                />
              </div>
            )}
          </div>
          <div className={styles.meta}>
            <FormattedDateParts value={createdAt} month="short" day="numeric">
              {(parts) => (
                <>
                  <span className={styles.day}>{parts[2].value}</span>
                  <span>{parts[0].value}</span>
                </>
              )}
            </FormattedDateParts>
            {fromDomain && (
              <span className={styles.domain}>
                {fromDomain.name ? (
                  fromDomain.name
                ) : (
                  <FormattedMessage
                    {...MSG.domain}
                    values={{ domainId: fromDomain.id }}
                  />
                )}
              </span>
            )}
            {!!commentCount && (
              <span className={styles.commentCount}>
                <Icon
                  appearance={{ size: 'extraTiny' }}
                  className={styles.commentCountIcon}
                  name="comment"
                  title={formatText(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: commentCount.toString(),
                  })}
                />
                <Numeral
                  value={commentCount}
                  title={formatText(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: commentCount.toString(),
                  })}
                />
              </span>
            )}
          </div>
        </div>
        {/* {motionId && !isMotionFinished && (
          <div className={styles.countdownTimerContainer}>
            <CountDownTimer
              state={motionState as MotionState}
              motionId={Number(motionId)}
              isFullyNayStaked={isFullyNayStaked}
            />
          </div>
        )} */}
      </div>
    </li>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;
