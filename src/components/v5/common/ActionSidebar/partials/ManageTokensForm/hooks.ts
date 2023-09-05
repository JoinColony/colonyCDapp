import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { isAddress } from 'ethers/lib/utils';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionHook } from '../ActionForm/hooks';
import { getTokenManagementDialogPayload } from '~common/Dialogs/TokenManagementDialog/helpers';
import { notNull } from '~utils/arrays';
import { createAddress } from '~utils/web3';

export const useManageTokens = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();
  const colonyTokens = colony?.tokens?.items.filter(notNull) || [];

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        mintAmount: payload.amount,
        motionDomainId: payload.createdIn,
        decisionMethod: payload.decisionMethod,
        annotation: payload.annotation,
      };
      if (colony) {
        return getTokenManagementDialogPayload(colony, values);
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.bool().defined(),
      tokenAddress: yup
        .string()
        .notRequired()
        .test(
          'is-address',
          () => 'Invalid address',
          (value) => !value || isAddress(value),
        )
        .test(
          'is-duplicate',
          () => 'Token duplicated',
          (value) => {
            // skip this test if value is not valid.
            if (!value || !isAddress(value)) {
              return true;
            }

            return !colony?.tokens?.items
              .filter(notNull)
              .some(
                ({ token: { tokenAddress } }) =>
                  createAddress(tokenAddress) === createAddress(value),
              );
          },
        ),
      selectedTokenAddresses: yup
        .array()
        .of(yup.string().address().defined())
        .notRequired(),
      createdIn: yup.string().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      createdIn: '',
      annotation: '',
      decisionMethod: 'reputation',
      tokenAddress: '',
      selectedTokenAddresses: colonyTokens.map(
        (token) => token?.token.tokenAddress,
      ),
    },
    actionType: ActionTypes.ACTION_MINT_TOKENS,
  });
};
