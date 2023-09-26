import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { getTokenManagementDialogPayload } from '~common/Dialogs/TokenManagementDialog/helpers';
import { notNull } from '~utils/arrays';

const validationSchema = yup
  .object()
  .shape({
    createdIn: yup.number().defined(),
    decisionMethod: yup.string().defined(),
    annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    selectedTokenAddresses: yup
      .array()
      .of(
        yup.object().shape({
          token: yup.string().required(),
        }),
      )
      .unique('unique', (value) => value?.token)
      .defined(),
  })
  .defined();

export const useManageTokens = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const navigate = useNavigate();

  const colonyTokens = useMemo(
    () => colony?.tokens?.items.filter(notNull) || [],
    [colony?.tokens?.items],
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: ActionTypes.ACTION_EDIT_COLONY,
    defaultValues: useMemo(
      () => ({
        decisionMethod: '',
        annotation: '',
        createdIn: Id.RootDomain.toString(),
        selectedTokenAddresses: colonyTokens.map((token) => ({
          token: token?.token.tokenAddress,
        })),
      }),
      [colonyTokens],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.annotation,
            selectedTokenAddresses: payload.selectedTokenAddresses.map(
              ({ token }) => token,
            ),
            forceAction: false,
          };
          if (colony) {
            return getTokenManagementDialogPayload(colony, values);
          }
          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, user, navigate],
    ),
  });
};
