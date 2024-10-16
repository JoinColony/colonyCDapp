import { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { CoreAction, CoreActionGroup, getName } from '~actions';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

const MSG = defineMessages({
  titlePayments: {
    id: 'actions.group.payments',
    defaultMessage: 'Payments',
  },
  titleDecisions: {
    id: 'actions.group.decisions',
    defaultMessage: 'Agreements',
  },
  titleFunds: {
    id: 'actions.group.funds',
    defaultMessage: 'Funds',
  },
  titleTeams: {
    id: 'actions.group.teams',
    defaultMessage: 'Teams',
  },
  titleAdmin: {
    id: 'actions.group.admin',
    defaultMessage: 'Admin',
  },
});

const useActionsList = () => {
  const { colony } = useColonyContext();
  return useMemo((): SearchSelectOptionProps[] => {
    const actionsListOptions: SearchSelectOptionProps[] = [
      {
        key: '1',
        title: MSG.titlePayments,
        isAccordion: true,
        options: [
          {
            label: getName(CoreAction.Payment),
            value: CoreAction.Payment,
          },
          {
            label: getName(CoreAction.EditDomain),
            value: CoreAction.EditDomain,
          },
          {
            label: getName(CoreAction.CreateExpenditure),
            value: CoreAction.CreateExpenditure,
          },
          // @BETA: Disabled for now (all of the following in this key)
          // {
          //   label: { id: 'actions.batchPayment' },
          //   value: Action.BatchPayment,
          // },
          // {
          //   label: { id: 'actions.splitPayment' },
          //   value: Action.SplitPayment,
          // },
          // {
          //   label: { id: 'actions.stagedPayment' },
          //   value: Action.StagedPayment,
          // },
          // {
          //   label: { id: 'actions.streamingPayment' },
          //   value: Action.StreamingPayment,
          // },
        ],
      },
      {
        key: '2',
        isAccordion: true,
        title: MSG.titleDecisions,
        options: [
          {
            label: getName(CoreAction.CreateDecisionMotion),
            value: CoreAction.CreateDecisionMotion,
          },
        ],
      },
      {
        key: '3',
        isAccordion: true,
        title: MSG.titleFunds,
        options: [
          {
            label: getName(CoreAction.MoveFunds),
            value: CoreAction.MoveFunds,
          },
          {
            label: getName(CoreAction.MintTokens),
            value: CoreAction.MintTokens,
            isDisabled: !colony?.status?.nativeToken?.mintable,
          },
          {
            label: getName(CoreAction.UnlockToken),
            value: CoreAction.UnlockToken,
            isDisabled: !colony?.status?.nativeToken?.unlockable,
          },
          {
            label: getName(CoreAction.ManageTokens),
            value: CoreAction.ManageTokens,
          },
        ],
      },
      {
        key: '4',
        isAccordion: true,
        title: MSG.titleTeams,
        options: [
          {
            label: getName(CoreAction.CreateDomain),
            value: CoreAction.CreateDomain,
          },
          {
            label: getName(CoreAction.EditDomain),
            value: CoreAction.EditDomain,
          },
        ],
      },
      {
        key: '5',
        isAccordion: true,
        title: MSG.titleAdmin,
        options: [
          {
            label: getName(CoreActionGroup.ManageReputation),
            value: CoreActionGroup.ManageReputation,
          },
          {
            label: getName(CoreAction.SetUserRoles),
            value: CoreAction.SetUserRoles,
          },
          {
            label: getName(CoreAction.ColonyEdit),
            value: CoreAction.ColonyEdit,
          },
          {
            label: getName(CoreAction.VersionUpgrade),
            value: CoreAction.VersionUpgrade,
          },
          {
            label: getName(CoreActionGroup.ManageVerifiedMembers),
            value: CoreActionGroup.ManageVerifiedMembers,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: Action.EnterRecoveryMode,
          // },
        ],
      },
    ];
    return actionsListOptions;
  }, [colony]);
};

export default useActionsList;
