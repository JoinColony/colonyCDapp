import * as yup from 'yup';
import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
// import { findDomainByNativeId } from '~utils/domains';
import { getInitialPayoutFieldValue } from '~common/Expenditures/ExpenditureForm';

const validationSchema = yup
  .object()
  .shape({
    from: yup.number().required(),
    decisionMethod: yup.string().defined(),
    createdIn: yup.number().defined(),
    annotation: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
    payouts: yup
      .array()
      .of(
        yup.object().shape({
          recipientAddress: yup.string().required(),
          amount: yup.string().address().required(),
          tokenAddress: yup.string().address().required(),
        }),
      )
      .required(),
  })
  .defined();

export const useBatchPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const navigate = useNavigate();
  const { isStakedExpenditureEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();

  const isStakingRequired = isStakedExpenditureEnabled;

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: isStakingRequired
      ? ActionTypes.STAKED_EXPENDITURE_CREATE
      : ActionTypes.EXPENDITURE_CREATE,
    defaultValues: useMemo(
      () => ({
        from: Id.RootDomain.toString(),
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value, // what should be here?
        annotation: '',
        payouts: colony
          ? [getInitialPayoutFieldValue(colony.nativeToken.tokenAddress)]
          : [], // what should be here?
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload(() => {
          // const values = {
          //   fundFromDomainId: payload.from,
          //   decisionMethod: payload.decisionMethod,
          //   createInDomainId: payload.createdIn,
          //   annotation: payload.annotation,
          //   colony,
          //   createdInDomain: colony && findDomainByNativeId(payload.createdIn, colony),
          //   payouts: payload.payouts,
          // };

          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
  });
};
