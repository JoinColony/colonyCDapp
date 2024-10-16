import { Id } from '@colony/colony-js';
import { useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type InferType, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { DecisionMethod } from '~gql';
import useUserReputation from '~hooks/useUserReputation.ts';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import {
  ACTION_BASE_VALIDATION_SCHEMA,
  DECISION_METHOD_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import {
  getManageReputationPayload,
  moreThanZeroAmountValidation,
  reputationAmountChangeValidation,
} from './utils.ts';

export const useValidationSchema = () => {
  const { trigger } = useFormContext();
  const {
    team: domainId,
    member: selectedUser,
    amount,
    modification: selectedModification,
  } = useWatch<{
    team: number;
    member: string;
    amount: string;
    modification: string;
  }>();
  const { colony } = useColonyContext();
  const { colonyAddress } = colony;

  const { userReputation, loading } = useUserReputation({
    colonyAddress,
    walletAddress: selectedUser,
    domainId,
  });

  useEffect(() => {
    if (
      userReputation &&
      amount !== '' &&
      amount !== undefined &&
      !loading &&
      selectedModification
    ) {
      trigger('amount');
    }
  }, [amount, loading, selectedModification, trigger, userReputation]);

  return useMemo(
    () =>
      object()
        .shape({
          member: string().required(),
          amount: string()
            .required()
            .test(
              'more-than-zero',
              formatText({ id: 'errors.amount' }),
              (value) => moreThanZeroAmountValidation(value, colony),
            )
            .test(
              'can-smite-reputation',
              formatText({ id: 'errors.reputation.smite.notEnoughPoints' }) ||
                '',
              (value, context) => {
                if (!selectedUser) {
                  return true;
                }

                return reputationAmountChangeValidation({
                  value,
                  context,
                  userReputation,
                  colony,
                });
              },
            ),
          modification: string().required(),
          team: number().required(),
          decisionMethod: string().defined(),
          createdIn: number().required(),
          description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
        })
        .defined()
        .concat(ACTION_BASE_VALIDATION_SCHEMA),
    [colony, selectedUser, userReputation],
  );
};

export type ManageReputationFormValues = InferType<
  ReturnType<typeof useValidationSchema>
>;

export const useManageReputation = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const validationSchema = useValidationSchema();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const nativeTokenDecimals = getTokenDecimalsWithFallback(
    colony?.nativeToken?.decimals,
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MANAGE_REPUTATION
        : ActionTypes.MOTION_MANAGE_REPUTATION,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain,
        motionDomainId: Id.RootDomain,
        amount: '',
      }),
      [],
    ),
    transform: useMemo(
      () =>
        mapPayload((values: ManageReputationFormValues) =>
          getManageReputationPayload(colony, nativeTokenDecimals, values),
        ),
      [colony, nativeTokenDecimals],
    ),
  });
};
